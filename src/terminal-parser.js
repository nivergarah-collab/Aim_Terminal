// ============================================================
// Terminal — parser de entrada
// ============================================================

function tokenize(str) {
  const tokens = [];
  let cur = '', inS = false, inD = false;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if      (c === "'" && !inD) { inS = !inS; }
    else if (c === '"' && !inS) { inD = !inD; }
    else if ((c === ' ' || c === '\t') && !inS && !inD) {
      if (cur) { tokens.push(cur); cur = ''; }
    } else { cur += c; }
  }
  if (cur) tokens.push(cur);
  return tokens;
}

function parseRedirect(tokens) {
  let redirect = null;
  const clean  = [];
  for (let i = 0; i < tokens.length; i++) {
    if ((tokens[i] === '>>' || tokens[i] === '>') && i + 1 < tokens.length) {
      redirect = { op: tokens[i], file: tokens[++i] };
    } else { clean.push(tokens[i]); }
  }
  return { cleanTokens: clean, redirect };
}

function parseFlags(tokens) {
  const flags = new Set();
  const args  = [];
  for (const t of tokens) {
    if (t.startsWith('-') && t.length > 1 && !t.startsWith('--') && !/^-\d/.test(t)) {
      for (const c of t.slice(1)) flags.add(c);
    } else { args.push(t); }
  }
  return { flags, args };
}

function parseAdminArgs(tokens, valueFlagChars) {
  const flags = {};
  const args  = [];
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (t === '--') { args.push(...tokens.slice(i + 1)); break; }
    if (t.startsWith('-') && t.length > 1) {
      const chars = t.slice(1);
      let j = 0;
      while (j < chars.length) {
        const c = chars[j];
        if (valueFlagChars.has(c)) {
          const inline = chars.slice(j + 1);
          flags[c] = inline || tokens[++i] || '';
          j = chars.length;
        } else { flags[c] = true; j++; }
      }
    } else { args.push(t); }
    i++;
  }
  return { flags, args };
}

function expandVars(str) {
  const user = vusers.currentUser();
  return str
    .replace(/\$HOME/g,     vusers.currentHome())
    .replace(/\$USER/g,     user.username)
    .replace(/\$PWD/g,      termState.cwd)
    .replace(/\$\?/g,       String(termState.lastExit))
    .replace(/\$HOSTNAME/g, 'ip-172-31-15-124')
    .replace(/\$SHELL/g,    user.shell || '/bin/bash')
    .replace(/\$([A-Z_][A-Z0-9_]*)/g, (_, name) => envVars[name] ?? `$${name}`);
}

// Expand a single glob token against the VFS. Returns an array of matching
// paths, or [token] unchanged if no matches (shell behavior: error on no match).
function expandGlob(token, cwd, home) {
  if (!token.includes('*') && !token.includes('?')) return [token];
  const lastSlash = token.lastIndexOf('/');
  const dirPart   = lastSlash >= 0 ? token.slice(0, lastSlash) || '/' : '.';
  const filePart  = lastSlash >= 0 ? token.slice(lastSlash + 1) : token;
  const absDir    = vfs.resolve(dirPart, cwd, home);
  const dirNode   = vfs._getNode(absDir);
  if (!dirNode || dirNode.type !== 'dir') return [token];
  const regex = new RegExp(
    '^' + filePart.replace(/\./g, '\\.').replace(/\*/g, '.*').replace(/\?/g, '.') + '$'
  );
  const prefix  = lastSlash >= 0 ? token.slice(0, lastSlash + 1) : '';
  const matches = Object.keys(dirNode.children)
    .filter(n => regex.test(n) && !n.startsWith('.'))
    .sort()
    .map(n => prefix + n);
  return matches.length ? matches : [token];
}

function splitPipes(raw) {
  const segs = [];
  let cur = '', inS = false, inD = false;
  for (const c of raw) {
    if      (c === "'" && !inD) inS = !inS;
    else if (c === '"' && !inS) inD = !inD;
    else if (c === '|' && !inS && !inD) { if (cur.trim()) segs.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) segs.push(cur.trim());
  return segs;
}
