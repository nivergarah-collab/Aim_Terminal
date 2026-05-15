// ============================================================
// Terminal — handlers de comandos + tabla de despacho
// ============================================================

// ── Sugerencias Levenshtein ───────────────────────────────────
const KNOWN_COMMANDS = ['ls','cd','pwd','mkdir','rm','cp','mv','touch','ln','cat','echo',
  'clear','whoami','id','groups','uptime','uname','ps','df','du','free','history','man',
  'chmod','chown','chgrp','useradd','userdel','groupadd','groupdel','usermod','passwd',
  'su','sudo','find','grep','head','tail','wc','sort','uniq','cut','sed','awk',
  'tar','gzip','gunzip','zcat','ping','ifconfig','ip','netstat','curl','wget',
  'who','w','kill','env','export','tee','xargs','watch',
  'yum','systemctl','crontab','nano',
  'lsblk','mkfs','mount','umount','fdisk','mountpoint',
  'killall','firewall-cmd'];

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function suggestCommand(cmd) {
  let best = null, bestDist = Infinity;
  for (const known of KNOWN_COMMANDS) {
    const d = levenshtein(cmd, known);
    if (d < bestDist) { bestDist = d; best = known; }
  }
  return bestDist <= 2 ? best : null;
}

// ── Handlers ──────────────────────────────────────────────────

function cmdPwd({ cwd }) {
  return { ok: true, lines: [cwd] };
}

function cmdLs({ args, flags, cwd, home, u, groups }) {
  const opts = { l: flags.has('l'), a: flags.has('a') };
  if (!args.length) return vfs.ls(null, opts, cwd, home, u.username, groups);
  const lines = []; let ok = true;
  for (const p of args) {
    const r = vfs.ls(p, opts, cwd, home, u.username, groups);
    if (!r.ok) { lines.push(r.msg); ok = false; }
    else if (args.length > 1) lines.push(`${p}:`, ...r.lines, '');
    else lines.push(...r.lines);
  }
  return { ok, lines };
}

function cmdCd({ args, cwd, home, u, groups }) {
  const r = vfs.cd(args[0], cwd, home, u.username, groups);
  if (r.ok) { termState.cwd = r.newCwd; return { ok: true, lines: [], newCwd: r.newCwd }; }
  return { ok: false, lines: [r.msg] };
}

function cmdCat({ args, flags, stdin, cwd, home, u, groups }) {
  if (!args.length && stdin !== null) return { ok: true, lines: stdin.split('\n') };
  if (!args.length) return { ok: true, lines: [] };
  const lines = []; let ok = true;
  for (const p of args) {
    const r = vfs.cat(p, cwd, home, u.username, groups);
    if (!r.ok) { lines.push(r.msg); ok = false; }
    else {
      const content = flags.has('n')
        ? r.content.split('\n').map((l, i) => `${String(i + 1).padStart(6)}  ${l}`)
        : r.content.split('\n');
      lines.push(...content);
    }
  }
  return { ok, lines };
}

function cmdEcho({ args, redirect, cwd, home, u, groups }) {
  const text = expandVars(args.join(' '));
  if (redirect) {
    const r = vfs.writeFile(redirect.file, text + '\n', redirect.op === '>>', cwd, home, u.username, groups);
    return r.ok ? { ok: true, lines: [] } : { ok: false, lines: [r.msg] };
  }
  return { ok: true, lines: [text] };
}

function cmdClear() {
  return { ok: true, lines: [], clear: true };
}

function cmdWhoami() {
  return { ok: true, lines: [vusers.whoami()] };
}

function cmdId({ args }) {
  const r = vusers.id(args[0] || null);
  return r.ok ? { ok: true, lines: [r.line] } : { ok: false, lines: [r.msg] };
}

function cmdGroups({ args, u }) {
  const target = args[0] || u.username;
  const g = vusers.groupsOf(target);
  return g.length
    ? { ok: true,  lines: [`${target} : ${g.join(' ')}`] }
    : { ok: false, lines: [`groups: '${target}': no such user`] };
}

function cmdUptime() {
  return { ok: true, lines: [' 10:42:15 up  1:23,  1 user,  load average: 0.01, 0.03, 0.00'] };
}

function cmdUname({ flags }) {
  if (flags.has('a')) return { ok: true, lines: ['Linux ip-172-31-15-124 5.15.0-1031-aws #35-Ubuntu SMP Fri Feb 10 02:07:25 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux'] };
  if (flags.has('m')) return { ok: true, lines: ['x86_64'] };
  if (flags.has('r')) return { ok: true, lines: ['5.15.0-1031-aws'] };
  if (flags.has('n')) return { ok: true, lines: ['ip-172-31-15-124'] };
  return { ok: true, lines: ['Linux'] };
}

function cmdPs({ flags, args, u }) {
  const allP = flags.has('a') || flags.has('e') || args.some(a => a.startsWith('a'));
  return { ok: true, lines: allP ? [
    'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND',
    'root         1  0.0  0.1  22552  4096 ?        Ss   10:00   0:00 /sbin/init',
    'root       234  0.0  0.0  14864  2048 ?        Ss   10:00   0:00 sshd',
    `${u.username.padEnd(10)} 1001  0.0  0.1  18540  3072 pts/0    Ss   10:01   0:00 bash`,
    `${u.username.padEnd(10)} 1042  0.0  0.0  36848  1536 pts/0    R+   10:42   0:00 ps`,
  ] : [
    '  PID TTY          TIME CMD',
    ' 1001 pts/0    00:00:00 bash',
    ' 1042 pts/0    00:00:00 ps',
  ]};
}

function cmdDf() {
  return { ok: true, lines: [
    'Filesystem     1K-blocks    Used Available Use% Mounted on',
    '/dev/xvda1      20970988 3145728  17825260  16% /',
    'tmpfs             512000       0    512000   0% /dev/shm',
    'tmpfs               5120       0      5120   0% /run/lock',
  ]};
}

function cmdDu({ args, flags, getNode }) {
  const sz    = flags.has('h') ? '4.0K' : '4';
  const paths = args.length ? args : ['.'];
  const lines = []; let ok = true;
  for (const p of paths) {
    if (getNode(p)) lines.push(`${sz}\t${p}`);
    else { lines.push(`du: cannot access '${p}': No such file or directory`); ok = false; }
  }
  return { ok, lines };
}

function cmdFree() {
  return { ok: true, lines: [
    '              total        used        free      shared  buff/cache   available',
    'Mem:        1024000      256000      512000        4096      256000      768000',
    'Swap:        204800           0      204800',
  ]};
}

function cmdHistory() {
  const hist = [...commandHistory].reverse();
  return { ok: true, lines: hist.length
    ? hist.map((c, i) => `  ${String(i + 1).padStart(3)}  ${c}`)
    : ['(sin historial)'] };
}

function cmdMan({ args }) {
  if (!args[0]) return { ok: false, lines: ['¿Qué manual quieres? (man <comando>)'] };
  const info = TOOL_COMMANDS.find(t => t.cmd === args[0]);
  return info
    ? { ok: true, lines: ['NOMBRE', `    ${info.cmd} — ${info.desc}`, '', 'PARÁMETROS',
                           ...info.params.map(p => `    ${p}`)] }
    : { ok: false, lines: [`No hay entrada de manual para '${args[0]}'`] };
}

function cmdTouch({ args, cwd, home, u }) {
  if (!args.length) return { ok: false, lines: ['touch: falta operando'] };
  const errs = [];
  for (const p of args) { const r = vfs.touch(p, cwd, home, u.username, u.username); if (!r.ok) errs.push(r.msg); }
  return { ok: !errs.length, lines: errs };
}

function cmdMkdir({ args, flags, cwd, home, u }) {
  if (!args.length) return { ok: false, lines: ['mkdir: falta operando'] };
  const errs = [];
  for (const p of args) {
    const r = vfs.mkdir(p, { p: flags.has('p') }, cwd, home, u.username, u.username);
    if (!r.ok) errs.push(r.msg);
  }
  return { ok: !errs.length, lines: errs };
}

function cmdRm({ args, flags, cwd, home, u, groups }) {
  if (!args.length) return { ok: false, lines: ['rm: falta operando'] };
  const opts        = { r: flags.has('r') || flags.has('R'), f: flags.has('f') };
  const interactive = flags.has('i');
  const lines = [];
  const errs  = [];
  for (const p of args) {
    if (interactive) lines.push(`rm: ¿eliminar '${p}'? s`);
    const r = vfs.rm(p, opts, cwd, home, u.username, groups);
    if (!r.ok && !opts.f) errs.push(r.msg);
  }
  return { ok: true, lines: [...lines, ...errs] };
}

function cmdCp({ args, flags, cwd, home, u, groups }) {
  if (args.length < 2) return { ok: false, lines: ['cp: falta destino'] };
  const opts    = { r: flags.has('r') || flags.has('R'), a: flags.has('a') };
  const verbose = flags.has('v');
  const dst     = args[args.length - 1];
  const lines   = [];
  const errs    = [];
  for (const src of args.slice(0, -1)) {
    const r = vfs.cp(src, dst, opts, cwd, home, u.username, groups);
    if (!r.ok) errs.push(r.msg);
    else if (verbose) lines.push(`'${src}' -> '${dst}'`);
  }
  return errs.length ? { ok: false, lines: errs } : { ok: true, lines };
}

function cmdMv({ args, flags, cwd, home, u, groups }) {
  if (args.length < 2) return { ok: false, lines: ['mv: falta destino'] };
  const noClobber = flags.has('n');
  const dst  = args[args.length - 1];
  const errs = [];
  for (const src of args.slice(0, -1)) {
    if (noClobber) {
      const absDst  = vfs.resolve(dst, cwd, home);
      const dstNode = vfs._getNode(absDst);
      if (dstNode) {
        const srcBase = src.split('/').pop();
        const final   = dstNode.type === 'dir' ? absDst + '/' + srcBase : absDst;
        if (vfs._getNode(final)) continue; // skip: would overwrite
      }
    }
    const r = vfs.mv(src, dst, cwd, home, u.username, groups);
    if (!r.ok) errs.push(r.msg);
  }
  return { ok: !errs.length, lines: errs };
}

function cmdLn({ args, flags, cwd, home, u }) {
  if (args.length < 2) return { ok: false, lines: ['ln: falta destino de enlace'] };
  const r = vfs.ln(args[0], args[1], flags.has('s'), cwd, home, u.username, u.username);
  return r.ok ? { ok: true, lines: [] } : { ok: false, lines: [r.msg] };
}

function cmdChmod({ args, flags, cwd, home, u }) {
  if (args.length < 2) return { ok: false, lines: ['chmod: falta operando'] };
  const mode  = args[0];
  const recur = flags.has('R');
  const errs  = [];
  const applyChmod = absPath => {
    const node = vfs._getNode(absPath);
    if (!node) { errs.push(`chmod: cannot access '${absPath}': No such file or directory`); return; }
    if (u.username !== 'root' && node.owner !== u.username)
      { errs.push(`chmod: changing permissions of '${absPath}': Operation not permitted`); return; }
    vfs.chmod(absPath, mode, '/', '/');
    if (recur && node.type === 'dir') {
      const pfx = absPath === '/' ? '' : absPath;
      for (const k of Object.keys(node.children)) applyChmod(`${pfx}/${k}`);
    }
  };
  for (const p of args.slice(1)) applyChmod(vfs.resolve(p, cwd, home));
  return { ok: !errs.length, lines: errs };
}

function cmdChown({ args, flags, cwd, home, u }) {
  if (u.username !== 'root' && !vusers.isSudo(u.username))
    return { ok: false, lines: [`chown: changing ownership of '${args[1]||''}': Operation not permitted`] };
  if (args.length < 2) return { ok: false, lines: ['chown: falta operando'] };
  const spec = args[0];
  let newOwner = null, newGroup = null;
  if (spec.includes(':')) { [newOwner, newGroup] = spec.split(':').map(s => s || null); }
  else                    { newOwner = spec; }
  const errs = [];
  for (const p of args.slice(1)) {
    const r = vfs.chown(p, newOwner, newGroup, { R: flags.has('R') }, cwd, home);
    if (!r.ok) errs.push(r.msg);
  }
  return { ok: !errs.length, lines: errs };
}

function cmdChgrp({ args, flags, cwd, home, u }) {
  if (u.username !== 'root' && !vusers.isSudo(u.username))
    return { ok: false, lines: [`chgrp: changing group of '${args[1]||''}': Operation not permitted`] };
  if (args.length < 2) return { ok: false, lines: ['chgrp: falta operando'] };
  const errs = [];
  for (const p of args.slice(1)) {
    const r = vfs.chown(p, null, args[0], { R: flags.has('R') }, cwd, home);
    if (!r.ok) errs.push(r.msg);
  }
  return { ok: !errs.length, lines: errs };
}

function cmdUseradd({ rest, cwd, home, u }) {
  if (!vusers.isSudo(u.username)) return { ok: false, lines: ['useradd: Permission denied'] };
  const { flags: f, args: a } = parseAdminArgs(rest, new Set(['s', 'g', 'G', 'd', 'u', 'c']));
  if (!a.length) return { ok: false, lines: ['useradd: falta nombre de usuario'] };
  const opts = { m: !f.M, s: f.s || '/bin/bash', g: f.g || null, G: f.G ? f.G.split(',') : [] };
  const r = vusers.useradd(a[0], opts);
  if (!r.ok) return { ok: false, lines: [r.msg] };
  if (opts.m) vfs._mkdir(r.home, a[0], r.primaryGroup, 'rwxr-xr-x');
  return { ok: true, lines: [] };
}

function cmdUserdel({ args, flags, u }) {
  if (!vusers.isSudo(u.username)) return { ok: false, lines: ['userdel: Permission denied'] };
  if (!args.length) return { ok: false, lines: ['userdel: falta nombre de usuario'] };
  const r = vusers.userdel(args[0], flags.has('r'));
  if (!r.ok) return { ok: false, lines: [r.msg] };
  if (r.removeHome) vfs.rm(`/home/${args[0]}`, { r: true, f: true }, '/', '/', 'root', ['root']);
  return { ok: true, lines: [] };
}

function cmdGroupadd({ args, u }) {
  if (!vusers.isSudo(u.username)) return { ok: false, lines: ['groupadd: Permission denied'] };
  if (!args.length) return { ok: false, lines: ['groupadd: falta nombre de grupo'] };
  const r = vusers.groupadd(args[0]);
  return r.ok ? { ok: true, lines: [] } : { ok: false, lines: [r.msg] };
}

function cmdGroupdel({ args, u }) {
  if (!vusers.isSudo(u.username)) return { ok: false, lines: ['groupdel: Permission denied'] };
  if (!args.length) return { ok: false, lines: ['groupdel: falta nombre de grupo'] };
  const r = vusers.groupdel(args[0]);
  return r.ok ? { ok: true, lines: [] } : { ok: false, lines: [r.msg] };
}

function cmdUsermod({ rest, u }) {
  if (!vusers.isSudo(u.username)) return { ok: false, lines: ['usermod: Permission denied'] };
  const { flags: f, args: a } = parseAdminArgs(rest, new Set(['G', 's', 'd', 'l', 'g', 'u', 'c']));
  if (!a.length) return { ok: false, lines: ['usermod: falta nombre de usuario'] };
  const opts = {};
  if (f.a && f.G) opts.aG = f.G.split(',');
  if (f.g)        opts.g  = f.g;
  if (f.s)        opts.s  = f.s;
  if (f.d)        opts.d  = f.d;
  const r = vusers.usermod(a[0], opts);
  return r.ok ? { ok: true, lines: [] } : { ok: false, lines: [r.msg] };
}

function cmdPasswd({ args, u }) {
  const target = args[0] || u.username;
  if (target !== u.username && !vusers.isSudo(u.username))
    return { ok: false, lines: [`passwd: You may not view or modify password information for ${target}.`] };
  const r = vusers.passwd(target, '');
  return r.ok
    ? { ok: true,  lines: ['passwd: password updated successfully'] }
    : { ok: false, lines: [r.msg] };
}

function cmdSu({ rest, args }) {
  const withEnv = rest[0] === '-' || rest[0] === '-l';
  const target  = withEnv ? (rest[1] || 'root') : (args[0] || 'root');
  const r = vusers.su(target, '');
  if (!r.ok) return { ok: false, lines: [r.msg] };
  if (withEnv) termState.cwd = r.home;
  return { ok: true, lines: [], newUser: target };
}

function cmdSudo({ rest, cwd, u, home, groups, stdin }) {
  if (!vusers.isSudo(u.username)) {
    return { ok: false, lines: [
      `[sudo] password for ${u.username}:`,
      `${u.username} is not in the sudoers file. This incident will be reported.`,
    ]};
  }
  if (!rest.length) return { ok: false, lines: ['usage: sudo command'] };
  if (rest[0] === '-i') {
    const r = vusers.su('root', '');
    if (r.ok) termState.cwd = r.home;
    return { ok: true, lines: [], newUser: 'root' };
  }
  let runAs   = vusers.getUser('root');
  let cmdRest = rest;
  if (rest[0] === '-u' && rest.length > 2) {
    const asUser = vusers.getUser(rest[1]);
    if (!asUser) return { ok: false, lines: [`sudo: unknown user: ${rest[1]}`] };
    runAs   = asUser;
    cmdRest = rest.slice(2);
  }
  return _execSegment(cmdRest.join(' '), cwd, runAs, runAs.home, vusers.groupsOf(runAs.username), stdin);
}

function cmdFind({ rest, cwd, home }) {
  let startPath = '.', namePattern = null, typeFilter = null, iname = false, maxDepth = Infinity;
  for (let k = 0; k < rest.length; k++) {
    switch (rest[k]) {
      case '-name':     namePattern = rest[++k]; break;
      case '-iname':    namePattern = rest[++k]; iname = true; break;
      case '-type':     typeFilter  = rest[++k]; break;
      case '-maxdepth': maxDepth    = parseInt(rest[++k]); break;
      default: if (rest[k] && !rest[k].startsWith('-')) startPath = rest[k];
    }
  }
  const absStart  = vfs.resolve(startPath, cwd, home);
  const startNode = vfs._getNode(absStart);
  if (!startNode) return { ok: false, lines: [`find: '${startPath}': No such file or directory`] };
  const nameRe = namePattern ? new RegExp(
    '^' + namePattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$',
    iname ? 'i' : '') : null;
  const matchFind = (name, node) =>
    (!nameRe     || nameRe.test(name)) &&
    (!typeFilter || (typeFilter === 'f' && node.type === 'file') ||
                    (typeFilter === 'd' && node.type === 'dir')  ||
                    (typeFilter === 'l' && node.type === 'symlink'));
  const found = [startPath];
  const walkFind = (node, pathStr, depth) => {
    if (depth > maxDepth) return;
    for (const [k, child] of Object.entries(node.children || {})) {
      const cp = pathStr === '/' ? `/${k}` : `${pathStr}/${k}`;
      if (matchFind(k, child)) found.push(cp);
      if (child.type === 'dir') walkFind(child, cp, depth + 1);
    }
  };
  walkFind(startNode, startPath, 1);
  return { ok: true, lines: found };
}

function cmdGrep({ args, flags, stdin, getNode }) {
  if (!args.length) return { ok: false, lines: ['grep: falta patrón'] };
  const pat = args[0], filePaths = args.slice(1);
  const iFlag = flags.has('i'), nFlag = flags.has('n'), vFlag = flags.has('v');
  const lFlag = flags.has('l'), cFlag = flags.has('c'), rFlag = flags.has('r') || flags.has('R');
  const re    = new RegExp(pat, iFlag ? 'i' : '');
  const out = [], errs = [];
  let anyMatch = false;
  const search = (content, label) => {
    const ls = content.split('\n');
    let cnt = 0;
    ls.forEach((line, i) => {
      if (re.test(line) !== vFlag) {
        anyMatch = true; cnt++;
        if (!lFlag && !cFlag) out.push(`${label ? label + ':' : ''}${nFlag ? (i + 1) + ':' : ''}${line}`);
      }
    });
    if (lFlag && cnt > 0) out.push(label || '(stdin)');
    if (cFlag) out.push(label ? `${label}:${cnt}` : String(cnt));
  };
  const walk = (node, pathStr) => {
    if (node.type === 'dir') {
      if (!rFlag) { errs.push(`grep: ${pathStr}: Is a directory`); return; }
      for (const [k, child] of Object.entries(node.children || {}))
        walk(child, pathStr === '/' ? `/${k}` : `${pathStr}/${k}`);
    } else { search(node.content, filePaths.length > 1 || rFlag ? pathStr : null); }
  };
  if (!filePaths.length && stdin !== null)  { search(stdin, null); }
  else if (!filePaths.length)               { return { ok: false, lines: ['grep: falta archivo o tubería'] }; }
  else { for (const p of filePaths) { const n = getNode(p); n ? walk(n, p) : errs.push(`grep: ${p}: No such file or directory`); } }
  return { ok: anyMatch, lines: [...out, ...errs] };
}

function cmdHeadTail({ cmd, args, flags, stdin, getNode }) {
  let n = 10;
  const htFiles = [];
  for (const a of args) {
    if (flags.has('n') && /^\d+$/.test(a)) n = parseInt(a);
    else if (/^-\d+$/.test(a))             n = Math.abs(parseInt(a));
    else htFiles.push(a);
  }
  const htOut = [];
  const htProcess = (content, label) => {
    if (htFiles.length > 1 && label) htOut.push(`==> ${label} <==`);
    const ls = content.split('\n');
    htOut.push(...(cmd === 'head' ? ls.slice(0, n) : ls.slice(-n)));
  };
  if (!htFiles.length && stdin !== null) { htProcess(stdin, null); }
  else if (!htFiles.length) { return { ok: false, lines: [`${cmd}: falta archivo`] }; }
  else {
    for (const p of htFiles) {
      const node = getNode(p);
      if (!node || node.type === 'dir') htOut.push(`${cmd}: error reading '${p}'`);
      else htProcess(node.content, p);
    }
  }
  return { ok: true, lines: htOut };
}

function cmdWc({ args, flags, stdin, getNode }) {
  const lFlag = flags.has('l'), wFlag = flags.has('w'), cFlag = flags.has('c') || flags.has('m');
  const all   = !lFlag && !wFlag && !cFlag;
  const fmt   = (l, w, c, lbl) => {
    const parts = [];
    if (all || lFlag) parts.push(String(l).padStart(7));
    if (all || wFlag) parts.push(String(w).padStart(7));
    if (all || cFlag) parts.push(String(c).padStart(7));
    if (lbl) parts.push(lbl);
    return parts.join(' ');
  };
  const count = s => { 
    const t = s.trim(); 
    return { 
      l: (s.match(/\\n/g) || []).length, 
      w: t ? t.split(/\\s+/).length : 0, 
      c: s.length 
    }; 
  };
  const lines = [];
  let tl = 0, tw = 0, tc = 0;
  if (!args.length && stdin !== null) {
    const { l, w, c } = count(stdin); lines.push(fmt(l, w, c, null));
  } else if (!args.length) { return { ok: false, lines: ['wc: falta archivo'] }; }
  else {
    for (const p of args) {
      const node = getNode(p);
      if (!node || node.type === 'dir') { lines.push(`wc: ${p}: Is a directory or not found`); continue; }
      const { l, w, c } = count(node.content);
      tl += l; tw += w; tc += c; lines.push(fmt(l, w, c, p));
    }
    if (args.length > 1) lines.push(fmt(tl, tw, tc, 'total'));
  }
  return { ok: true, lines };
}

function cmdSort({ args, flags, stdin, getNode }) {
  const rFlag = flags.has('r'), uFlag = flags.has('u'), nFlag = flags.has('n');
  let content = null;
  if (!args.length && stdin !== null) { content = stdin; }
  else if (!args.length) { return { ok: false, lines: ['sort: falta archivo'] }; }
  else {
    const parts = [];
    for (const p of args) {
      const node = getNode(p);
      if (!node) return { ok: false, lines: [`sort: cannot read: ${p}: No such file or directory`] };
      parts.push(node.content);
    }
    content = parts.join('\n');
  }
  let sorted = content.split('\n');
  sorted.sort(nFlag ? (a, b) => parseFloat(a) - parseFloat(b) : (a, b) => a.localeCompare(b));
  if (rFlag) sorted.reverse();
  if (uFlag) sorted = [...new Set(sorted)];
  return { ok: true, lines: sorted };
}

function cmdUniq({ args, flags, stdin, getNode }) {
  const node    = args.length ? getNode(args[0]) : null;
  const content = args.length ? (node ? node.content : null) : stdin;
  if (content === null) return { ok: false, lines: [args.length ? `uniq: ${args[0]}: No such file or directory` : 'uniq: falta archivo o tubería'] };
  const cFlag = flags.has('c'), dFlag = flags.has('d'), uFlag = flags.has('u');
  const input = content.split('\n'), output = [];
  let i = 0;
  while (i < input.length) {
    let cnt = 1;
    while (i + cnt < input.length && input[i + cnt] === input[i]) cnt++;
    const dup = cnt > 1;
    if ((!dFlag && !uFlag) || (dFlag && dup) || (uFlag && !dup))
      output.push(cFlag ? `${String(cnt).padStart(4)} ${input[i]}` : input[i]);
    i += cnt;
  }
  return { ok: true, lines: output };
}

function cmdCut({ rest, cwd, home, stdin }) {
  const { flags: cutF, args: cutA } = parseAdminArgs(rest, new Set(['d', 'f', 'b', 'c']));
  const delim = cutF.d !== undefined ? (cutF.d === '\\t' ? '\t' : cutF.d) : '\t';
  if (!cutF.f) return { ok: false, lines: ['cut: debes especificar campos con -f'] };
  const fields = cutF.f.split(',').flatMap(s => {
    if (s.includes('-')) { const [lo, hi] = s.split('-').map(Number); return Array.from({ length: hi - lo + 1 }, (_, j) => lo + j); }
    return [parseInt(s)];
  });
  const cutLine = line => fields.map(n => line.split(delim)[n - 1] ?? '').join(delim);
  let content;
  if (!cutA.length && stdin !== null) { content = stdin; }
  else if (!cutA.length)              { return { ok: false, lines: ['cut: falta archivo o tubería'] }; }
  else {
    const node = vfs._getNode(vfs.resolve(cutA[0], cwd, home));
    if (!node) return { ok: false, lines: [`cut: ${cutA[0]}: No such file or directory`] };
    content = node.content;
  }
  return { ok: true, lines: content.split('\n').map(cutLine) };
}

function cmdSed({ args, flags, stdin, cwd, home, u, groups }) {
  const inPlace = flags.has('i'), printOnly = flags.has('n');
  const expr    = args[0];
  if (!expr) return { ok: false, lines: ['sed: falta expresión'] };
  const sedFiles = args.slice(1);
  const node     = sedFiles.length ? vfs._getNode(vfs.resolve(sedFiles[0], cwd, home)) : null;
  const content  = sedFiles.length ? (node ? node.content : null) : stdin;
  if (sedFiles.length && content === null) return { ok: false, lines: [`sed: ${sedFiles[0]}: No such file or directory`] };
  if (content === null) return { ok: false, lines: ['sed: falta archivo o tubería'] };
  let lines = content.split('\n');
  const sMatch = expr.match(/^s([/|#,!])(.*?)\1(.*?)\1([gi]*)$/);
  if (sMatch) {
    const [,, pat, rep, fl] = sMatch;
    const re = new RegExp(pat, (fl.includes('g') ? 'g' : '') + (fl.includes('i') ? 'i' : ''));
    lines = lines.map(l => l.replace(re, rep));
  } else {
    const dMatch = expr.match(/^(\d+)(?:,(\d+))?d$/);
    if (dMatch) {
      const lo = parseInt(dMatch[1]) - 1, hi = dMatch[2] ? parseInt(dMatch[2]) - 1 : parseInt(dMatch[1]) - 1;
      lines = lines.filter((_, i) => i < lo || i > hi);
    } else if (printOnly) {
      const pMatch = expr.match(/^(\d+)p$/);
      lines = pMatch ? [lines[parseInt(pMatch[1]) - 1] ?? ''] : [];
    }
  }
  if (inPlace && sedFiles.length) {
    vfs.writeFile(sedFiles[0], lines.join('\n'), false, cwd, home, u.username, groups);
    return { ok: true, lines: [] };
  }
  return { ok: true, lines };
}

function cmdAwk({ args, stdin, getNode }) {
  if (!args.length) return { ok: false, lines: ['awk: falta programa'] };
  const prog     = args[0];
  const fileNode = args[1] ? getNode(args[1]) : null;
  const content  = args[1] ? (fileNode ? fileNode.content : null) : stdin;
  if (args[1] && content === null) return { ok: false, lines: [`awk: ${args[1]}: No such file or directory`] };
  if (content === null) return { ok: false, lines: ['awk: falta archivo o tubería'] };
  const printExpr = (expr, fields, line, nr) => {
    if (/^print\s*$/.test(expr.trim())) return line;
    return expr.replace(/^print\s*/, '').split(',').map(t => {
      t = t.trim();
      if (t === '$0') return line;
      if (/^\$(\d+)$/.test(t)) return fields[parseInt(t.slice(1)) - 1] ?? '';
      if (t === 'NF') return String(fields.length);
      if (t === 'NR') return String(nr);
      return t.replace(/^["']|["']$/g, '');
    }).join(' ');
  };
  const blockMatch   = prog.match(/^\{(.+)\}$/);
  const patternMatch = prog.match(/^\/(.+?)\/\s*\{(.+)\}$/);
  const patternRe    = patternMatch ? new RegExp(patternMatch[1]) : null;
  const output = [];
  content.split('\n').forEach((line, nr) => {
    const fields = line.split(/\s+/).filter(Boolean);
    if (blockMatch)   { output.push(printExpr(blockMatch[1],   fields, line, nr + 1)); return; }
    if (patternMatch) { if (patternRe.test(line)) output.push(printExpr(patternMatch[2], fields, line, nr + 1)); return; }
    output.push(line);
  });
  return { ok: true, lines: output };
}

function cmdTar({ rest, cwd, home, u }) {
  const { flags: tF, args: tA } = parseAdminArgs(rest, new Set(['f', 'C']));
  const tArchive = tF.f;
  if (!tArchive) return { ok: false, lines: ['tar: debes especificar un archivo con -f'] };
  if (tF.c) {
    if (!tA.length) return { ok: false, lines: ['tar: falta archivo de origen'] };
    const absT = vfs.resolve(tArchive, cwd, home);
    const { node: tPar, name: tName } = vfs._getParent(absT);
    if (!tPar) return { ok: false, lines: [`tar: ${tArchive}: No such file or directory`] };
    tPar.children[tName] = new VirtualNode({ name: tName, type: 'file', owner: u.username, group: u.username, perms: 'rw-r--r--', content: `__tar__:${tA.join(',')}` });
    return { ok: true, lines: tF.v ? tA.slice() : [] };
  }
  if (tF.x) {
    const tNode = vfs._getNode(vfs.resolve(tArchive, cwd, home));
    if (!tNode) return { ok: false, lines: [`tar: ${tArchive}: Cannot open: No such file or directory`, 'tar: Error is not recoverable: exiting now'] };
    return { ok: true, lines: tF.v ? [tArchive] : [] };
  }
  if (tF.t) {
    const tNode = vfs._getNode(vfs.resolve(tArchive, cwd, home));
    if (!tNode) return { ok: false, lines: [`tar: ${tArchive}: Cannot open: No such file or directory`] };
    const meta = (tNode.content || '').replace('__tar__:', '');
    return { ok: true, lines: meta ? meta.split(',') : [tArchive] };
  }
  return { ok: false, lines: ['tar: debes especificar una acción (-c, -x, o -t)'] };
}

function cmdGzip({ args, cwd, home }) {
  if (!args.length) return { ok: false, lines: ['gzip: falta archivo'] };
  const errs = [];
  for (const p of args) {
    const abs  = vfs.resolve(p, cwd, home);
    const node = vfs._getNode(abs);
    if (!node) { errs.push(`gzip: ${p}: No such file or directory`); continue; }
    const { node: par, name } = vfs._getParent(abs);
    const nn = name + '.gz';
    par.children[nn] = new VirtualNode({ name: nn, type: 'file', owner: node.owner, group: node.group, perms: node.perms, content: `__gz__:${node.content}` });
    delete par.children[name];
  }
  return { ok: !errs.length, lines: errs };
}

function cmdGunzipZcat({ cmd, args, cwd, home }) {
  if (!args.length) return { ok: false, lines: [`${cmd}: falta archivo`] };
  const errs = [], out = [];
  for (const p of args) {
    const abs  = vfs.resolve(p, cwd, home);
    const node = vfs._getNode(abs);
    if (!node) { errs.push(`${cmd}: ${p}: No such file or directory`); continue; }
    const raw = (node.content || '').replace(/^__gz__:/, '');
    if (cmd === 'zcat') { out.push(raw); }
    else {
      const { node: par, name } = vfs._getParent(abs);
      const nn = name.endsWith('.gz') ? name.slice(0, -3) : name;
      par.children[nn] = new VirtualNode({ name: nn, type: 'file', owner: node.owner, group: node.group, perms: node.perms, content: raw });
      if (nn !== name) delete par.children[name];
    }
  }
  return { ok: !errs.length, lines: cmd === 'zcat' ? out : errs };
}

function cmdPing({ rest }) {
  const { flags: pF, args: pA } = parseAdminArgs(rest, new Set(['c', 'i', 'W', 's']));
  const pHost = pA[0];
  if (!pHost) return { ok: false, lines: ['ping: uso: ping [-c count] HOST'] };
  const pCount = parseInt(pF.c) || 4;
  const pIp    = `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
  const pLines = [`PING ${pHost} (${pIp}) 56(84) bytes of data.`];
  for (let j = 0; j < Math.min(pCount, 4); j++)
    pLines.push(`64 bytes from ${pIp}: icmp_seq=${j + 1} ttl=64 time=${(5 + Math.random() * 10).toFixed(3)} ms`);
  pLines.push(`--- ${pHost} ping statistics ---`);
  pLines.push(`${Math.min(pCount, 4)} packets transmitted, ${Math.min(pCount, 4)} received, 0% packet loss, time ${Math.min(pCount, 4) * 1000}ms`);
  return { ok: true, lines: pLines };
}

function cmdIfconfig() {
  return { ok: true, lines: [
    'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 9001',
    '        inet 172.31.15.124  netmask 255.255.240.0  broadcast 172.31.15.255',
    '        inet6 fe80::4e4:bff:fe80:5c3d  prefixlen 64  scopeid 0x20<link>',
    '        ether 06:e4:0b:80:5c:3d  txqueuelen 1000  (Ethernet)',
    '',
    'lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536',
    '        inet 127.0.0.1  netmask 255.0.0.0',
    '        loop  txqueuelen 1000  (Local Loopback)',
  ]};
}

function cmdNetstat() {
  return { ok: true, lines: [
    'Active Internet connections (only servers)',
    'Proto Recv-Q Send-Q Local Address     Foreign Address     State',
    'tcp        0      0 0.0.0.0:22        0.0.0.0:*           LISTEN',
    'tcp        0      0 127.0.0.1:3306    0.0.0.0:*           LISTEN',
    'tcp6       0      0 :::80             :::*                LISTEN',
  ]};
}

function cmdCurlWget({ cmd, args }) {
  const netUrl = args[0];
  if (!netUrl) return { ok: false, lines: [`${cmd}: no URL specified`] };
  return { ok: false, lines: [
    `${cmd}: (6) Could not resolve host: ${netUrl.replace(/^https?:\/\//, '').split('/')[0]}`,
    '(Simulación: las solicitudes de red no están disponibles en el entorno virtual)',
  ]};
}

function cmdWhoW() {
  const wu = vusers.currentUser();
  return { ok: true, lines: [`${wu.username}   pts/0    2024-01-01 10:00 (:0)`] };
}

function cmdKill({ args }) {
  if (!args.length) return { ok: false, lines: ['kill: uso: kill [-s sigspec | -n signum] pid ...'] };
  return { ok: true, lines: [] };
}

function cmdEnv() {
  const sysEnv = {
    HOME: vusers.currentHome(), USER: vusers.currentUser().username,
    PWD: termState.cwd, SHELL: vusers.currentUser().shell || '/bin/bash',
    HOSTNAME: 'ip-172-31-15-124', TERM: 'xterm-256color',
    LANG: 'es_ES.UTF-8', PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
    ...envVars
  };
  return { ok: true, lines: Object.entries(sysEnv).map(([k, v]) => `${k}=${v}`) };
}

function cmdExport({ args }) {
  if (!args.length) {
    return { ok: true, lines: Object.entries(envVars).map(([k, v]) => `declare -x ${k}="${v}"`) };
  }
  for (const a of args) {
    const eqIdx = a.indexOf('=');
    if (eqIdx >= 0) envVars[a.slice(0, eqIdx)] = expandVars(a.slice(eqIdx + 1));
  }
  return { ok: true, lines: [] };
}

function cmdTee({ args, flags, stdin, cwd, home, u, groups }) {
  const input = stdin ?? '';
  for (const f of args) vfs.writeFile(f, input, flags.has('a'), cwd, home, u.username, groups);
  return { ok: true, lines: input.split('\n') };
}

function cmdXargs({ args, stdin, cwd, u, home, groups }) {
  if (!args.length || stdin === null) return { ok: true, lines: [] };
  const items = stdin.split('\n').filter(Boolean);
  return _execSegment([...args, ...items].join(' '), cwd, u, home, groups, null);
}

function cmdWatch() {
  return { ok: true, lines: ['(watch: modo simulado — comando no se ejecuta en tiempo real)'] };
}

function cmdYum({ args, u }) {
  if (u.username !== 'root') return { ok: false, lines: ['yum: Se requiere privilegios de root. Usa sudo.'] };
  const sub = args[0];
  const pkg = args.slice(1).find(a => !a.startsWith('-'));
  if (sub === 'install') {
    if (!pkg) return { ok: false, lines: ['yum: indica el nombre del paquete'] };
    termState.packages[pkg] = true;
    return { ok: true, lines: [
      'Resolviendo dependencias...', '→ Transacción resuelta', 'Instalando:',
      ` ${pkg}`, 'Tamaño total: ~1.2 MB', '¿Está seguro? [s/N]: s',
      `Instalando: ${pkg}   [########] 100%`, `Instalado correctamente: ${pkg}`,
    ]};
  }
  if (sub === 'remove') {
    if (!pkg) return { ok: false, lines: ['yum: indica el nombre del paquete'] };
    delete termState.packages[pkg];
    return { ok: true, lines: [`Eliminado: ${pkg}`] };
  }
  if (sub === 'list') {
    if (args[1] === 'installed') {
      const list = Object.keys(termState.packages);
      return { ok: true, lines: list.length ? ['Paquetes instalados:', ...list.map(p => ` ${p}`)] : ['(ningún paquete adicional instalado)'] };
    }
    return { ok: true, lines: ['Use: yum list installed'] };
  }
  return { ok: false, lines: [`yum: subcomando desconocido: ${sub || '(vacío)'}`] };
}

function cmdSystemctl({ args, u }) {
  const sub     = args[0];
  const service = args[1];
  if (!service && sub !== 'list-units')
    return { ok: false, lines: ['systemctl: falta nombre del servicio'] };
  if (!termState.services[service])
    termState.services[service] = { running: false, enabled: false };
  const svc = termState.services[service];
  const needsRoot = ['start','stop','restart','enable','disable'];
  if (needsRoot.includes(sub) && u.username !== 'root')
    return { ok: false, lines: ['systemctl: Permission denied. Usa sudo.'] };
  switch (sub) {
    case 'start':
    case 'restart': svc.running = true;
      if (service === 'firewalld') termState.firewall.running = true;
      return { ok: true, lines: [] };
    case 'stop':    svc.running = false;
      if (service === 'firewalld') termState.firewall.running = false;
      return { ok: true, lines: [] };
    case 'enable':  svc.enabled = true;  return { ok: true, lines: [
      `Created symlink /etc/systemd/system/multi-user.target.wants/${service}.service.`
    ]};
    case 'disable': svc.enabled = false; return { ok: true, lines: [] };
    case 'status': {
      const active  = svc.running ? 'active (running)' : 'inactive (dead)';
      const enabled = svc.enabled ? 'enabled'           : 'disabled';
      return { ok: true, lines: [
        `● ${service}.service`,
        `   Loaded: loaded (/usr/lib/systemd/system/${service}.service; ${enabled})`,
        `   Active: ${active}`,
      ]};
    }
    default:
      return { ok: false, lines: [`systemctl: subcomando desconocido: ${sub}`] };
  }
}

function cmdCrontab({ args, flags, cwd, home, u, groups, stdin }) {
  if (flags.has('e')) {
    const defaultEntry = `* * * * * echo "Hola mundo" >> prueba.txt`;
    if (!termState.crontab.includes(defaultEntry)) termState.crontab.push(defaultEntry);
    vfs.writeFile('prueba.txt', 'Hola mundo\n', false, cwd, home, u.username, groups);
    return { ok: true, lines: [
      '(Simulación: editor crontab abierto)',
      `Entrada configurada: ${defaultEntry}`,
      'El archivo prueba.txt fue creado como si el cron ya hubiera ejecutado.',
    ]};
  }
  if (flags.has('l')) {
    return termState.crontab.length
      ? { ok: true, lines: [...termState.crontab] }
      : { ok: true, lines: [`no crontab for ${u.username}`] };
  }
  if (flags.has('r')) {
    termState.crontab = [];
    return { ok: true, lines: [] };
  }
  if (stdin !== null) {
    termState.crontab = stdin.split('\n').filter(Boolean);
    return { ok: true, lines: [] };
  }
  return { ok: false, lines: ['Use: crontab -e (editar), -l (listar), -r (eliminar)'] };
}

// ── nano ──────────────────────────────────────────────────────
function cmdNano({ args, flags, cwd, u, home, groups }) {
  const filePath = args[0];
  if (!filePath) return { ok: false, lines: ['nano: falta nombre de archivo'] };

  const absPath = vfs.resolve(filePath, cwd, home);
  const node    = vfs._getNode(absPath);
  const readOnly = flags.has('v');

  if (node) {
    if (node.type === 'dir')
      return { ok: false, lines: [`nano: ${filePath}: es un directorio`] };
    const canRead = vfs._checkPerm(node, u.username, groups, 'r');
    if (!canRead) return { ok: false, lines: [`nano: ${filePath}: Permiso denegado`] };
    if (!readOnly) {
      const canWrite = vfs._checkPerm(node, u.username, groups, 'w');
      if (!canWrite) return { ok: false, lines: [`nano: ${filePath}: Permiso denegado`] };
    }
    return { ok: true, lines: [], _nano: { path: absPath, content: node.content || '', isNew: false, readOnly } };
  }

  if (readOnly) return { ok: false, lines: [`nano: ${filePath}: No existe el fichero o el directorio`] };
  return { ok: true, lines: [], _nano: { path: absPath, content: '', isNew: true, readOnly: false } };
}

// ── Gestión de discos (lsblk, mount, umount, mkfs, fdisk, mountpoint) ──

function _diskByName(name) {
  return termState.disks.find(d => d.name === name);
}

function _diskByDevPath(p) {
  if (!p || !p.startsWith('/dev/')) return null;
  return _diskByName(p.slice(5));
}

function cmdLsblk({ flags }) {
  const lines = ['NAME           SIZE TYPE MOUNTPOINTS'];
  const disks = termState.disks;
  const orphans = disks.filter(d => d.type === 'disk');
  for (const d of orphans) {
    const parts = disks.filter(p => p.parent === d.name);
    const lastIdx = parts.length - 1;
    const mp = d.mountpoint || '';
    lines.push(`${d.name.padEnd(14)} ${String(d.size).padStart(4)} disk ${mp}`);
    parts.forEach((p, i) => {
      const branch = i === lastIdx ? '└─' : '├─';
      const mp2 = p.mountpoint || '';
      lines.push(`${branch}${p.name.padEnd(12)} ${String(p.size).padStart(4)} part ${mp2}`);
    });
  }
  // Discos sueltos sin parent que no son type 'disk' (raro, fallback)
  return { ok: true, lines };
}

function cmdMkfs({ args, flags, rest }) {
  // Soporta: mkfs -t ext4 /dev/xxx  ó  mkfs.ext4 /dev/xxx (no implementado segundo)
  let fsType = 'ext4';
  let devArg = null;
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '-t' && rest[i + 1]) { fsType = rest[i + 1]; i++; continue; }
    if (!devArg && rest[i].startsWith('/dev/')) devArg = rest[i];
  }
  if (!devArg) return { ok: false, lines: ['mkfs: falta dispositivo (uso: mkfs -t <tipo> /dev/<disco>)'] };
  const disk = _diskByDevPath(devArg);
  if (!disk) return { ok: false, lines: [`mkfs: ${devArg}: no existe el dispositivo`] };
  if (disk.mountpoint) return { ok: false, lines: [`mkfs: ${devArg} está montado en ${disk.mountpoint}; desmonta primero`] };
  disk.formatted = fsType;
  return { ok: true, lines: [
    `mke2fs 1.46.5 (30-Dec-2021)`,
    `Creating filesystem with ${fsType} on ${devArg}`,
    `Allocating group tables: done`,
    `Writing inode tables: done`,
    `Writing superblocks and filesystem accounting information: done`,
  ]};
}

function cmdMount({ args, rest, cwd, home }) {
  // Sin args: lista montajes
  if (!rest.length) {
    const lines = termState.disks
      .filter(d => d.mountpoint)
      .map(d => `/dev/${d.name} on ${d.mountpoint} type ${d.formatted || 'auto'} (rw)`);
    return { ok: true, lines };
  }
  if (rest.length < 2) return { ok: false, lines: ['mount: uso: mount /dev/<disco> /punto/de/montaje'] };
  const [devArg, mountArg] = rest.filter(t => !t.startsWith('-'));
  if (!devArg || !mountArg) return { ok: false, lines: ['mount: argumentos incompletos'] };
  const disk = _diskByDevPath(devArg);
  if (!disk) return { ok: false, lines: [`mount: ${devArg}: no existe el dispositivo`] };
  if (!disk.formatted) return { ok: false, lines: [`mount: ${devArg}: tipo de sistema de archivos no especificado o desconocido`] };
  if (disk.mountpoint) return { ok: false, lines: [`mount: ${devArg} ya está montado en ${disk.mountpoint}`] };
  const absMount = vfs.resolve(mountArg, cwd, home);
  const node = vfs._getNode(absMount);
  if (!node || node.type !== 'dir') return { ok: false, lines: [`mount: punto de montaje ${mountArg} no existe o no es un directorio`] };
  if (termState.disks.some(d => d.mountpoint === absMount)) return { ok: false, lines: [`mount: ${absMount} ya tiene un dispositivo montado`] };
  disk.mountpoint = absMount;
  return { ok: true, lines: [] };
}

function cmdUmount({ rest, cwd, home }) {
  if (!rest.length) return { ok: false, lines: ['umount: falta argumento (dispositivo o punto de montaje)'] };
  const arg = rest[0];
  let disk = null;
  if (arg.startsWith('/dev/')) {
    disk = _diskByDevPath(arg);
  } else {
    const abs = vfs.resolve(arg, cwd, home);
    disk = termState.disks.find(d => d.mountpoint === abs);
  }
  if (!disk) return { ok: false, lines: [`umount: ${arg}: no montado`] };
  disk.mountpoint = null;
  return { ok: true, lines: [] };
}

function cmdFdisk({ flags, rest }) {
  if (flags.has('l') || rest.includes('-l')) {
    const lines = [];
    const disks = termState.disks.filter(d => d.type === 'disk');
    for (const d of disks) {
      lines.push(`Disk /dev/${d.name}: ${d.size}, sectores`);
      lines.push(`Units: sectors of 1 * 512 = 512 bytes`);
      lines.push(`Sector size (logical/physical): 512 bytes / 512 bytes`);
      lines.push('');
      lines.push('Device           Type             Filesystem');
      const parts = termState.disks.filter(p => p.parent === d.name);
      for (const p of parts) {
        lines.push(`/dev/${p.name.padEnd(14)} ${p.size.padEnd(8)} ${p.formatted || '-'}`);
      }
      lines.push('');
    }
    return { ok: true, lines };
  }
  return { ok: false, lines: ['fdisk: modo interactivo no soportado en este simulador (usa fdisk -l)'] };
}

function cmdMountpoint({ rest, cwd, home }) {
  if (!rest.length) return { ok: false, lines: ['mountpoint: falta argumento'] };
  const abs = vfs.resolve(rest[0], cwd, home);
  const isMP = termState.disks.some(d => d.mountpoint === abs);
  return isMP
    ? { ok: true, lines: [`${rest[0]} es un punto de montaje`] }
    : { ok: false, lines: [`${rest[0]} no es un punto de montaje`] };
}

// ── Procesos por nombre ───────────────────────────────────────

const KILLABLE_PROCESSES = new Set([
  'bash', 'sshd', 'httpd', 'crond', 'nginx', 'mysqld', 'postgres', 'firewalld', 'systemd',
]);

function cmdKillall({ args, flags }) {
  if (!args.length) return { ok: false, lines: ['killall: uso: killall [opciones] <nombre_proceso>'] };
  const out = [];
  let ok = true;
  for (const name of args) {
    if (KILLABLE_PROCESSES.has(name)) {
      // Simulación: sin salida cuando tiene éxito (igual que el real)
    } else {
      out.push(`${name}: no se encontró ningún proceso`);
      ok = false;
    }
  }
  return { ok, lines: out };
}

// ── Firewall (firewall-cmd, simulación) ───────────────────────

function _fwParseKV(token, key) {
  const prefix = `--${key}=`;
  return token.startsWith(prefix) ? token.slice(prefix.length) : null;
}

function cmdFirewallCmd({ rest }) {
  const fw = termState.firewall;
  // --state
  if (rest.includes('--state')) {
    return fw.running
      ? { ok: true, lines: ['running'] }
      : { ok: false, lines: ['not running'] };
  }
  // --reload
  if (rest.includes('--reload')) {
    if (!fw.running) return { ok: false, lines: ['Error: firewalld no está activo'] };
    return { ok: true, lines: ['success'] };
  }
  // --list-all
  if (rest.includes('--list-all')) {
    return { ok: true, lines: [
      'public (active)',
      `  services: ${fw.services.join(' ') || '-'}`,
      `  ports: ${fw.ports.join(' ') || '-'}`,
    ]};
  }
  // --list-services / --list-ports
  if (rest.includes('--list-services')) return { ok: true, lines: [fw.services.join(' ')] };
  if (rest.includes('--list-ports'))    return { ok: true, lines: [fw.ports.join(' ')] };

  // Add / remove service / port
  for (const tok of rest) {
    const addSvc = _fwParseKV(tok, 'add-service');
    const rmSvc  = _fwParseKV(tok, 'remove-service');
    const addPt  = _fwParseKV(tok, 'add-port');
    const rmPt   = _fwParseKV(tok, 'remove-port');
    if (addSvc !== null) {
      if (!fw.services.includes(addSvc)) fw.services.push(addSvc);
      return { ok: true, lines: ['success'] };
    }
    if (rmSvc !== null) {
      const i = fw.services.indexOf(rmSvc);
      if (i >= 0) fw.services.splice(i, 1);
      return { ok: true, lines: ['success'] };
    }
    if (addPt !== null) {
      if (!fw.ports.includes(addPt)) fw.ports.push(addPt);
      return { ok: true, lines: ['success'] };
    }
    if (rmPt !== null) {
      const i = fw.ports.indexOf(rmPt);
      if (i >= 0) fw.ports.splice(i, 1);
      return { ok: true, lines: ['success'] };
    }
  }

  return { ok: false, lines: ['firewall-cmd: opción no soportada en el simulador (--add-service, --remove-service, --add-port, --remove-port, --list-all, --reload, --state)'] };
}

// ── Tabla de despacho ─────────────────────────────────────────
const COMMANDS = {
  pwd:      cmdPwd,
  ls:       cmdLs,
  cd:       cmdCd,
  cat:      cmdCat,
  echo:     cmdEcho,
  clear:    cmdClear,
  whoami:   cmdWhoami,
  id:       cmdId,
  groups:   cmdGroups,
  uptime:   cmdUptime,
  uname:    cmdUname,
  ps:       cmdPs,
  df:       cmdDf,
  du:       cmdDu,
  free:     cmdFree,
  history:  cmdHistory,
  man:      cmdMan,
  touch:    cmdTouch,
  mkdir:    cmdMkdir,
  rm:       cmdRm,
  cp:       cmdCp,
  mv:       cmdMv,
  ln:       cmdLn,
  chmod:    cmdChmod,
  chown:    cmdChown,
  chgrp:    cmdChgrp,
  useradd:  cmdUseradd,
  userdel:  cmdUserdel,
  groupadd: cmdGroupadd,
  groupdel: cmdGroupdel,
  usermod:  cmdUsermod,
  passwd:   cmdPasswd,
  su:       cmdSu,
  sudo:     cmdSudo,
  find:     cmdFind,
  grep:     cmdGrep,
  head:     cmdHeadTail,
  tail:     cmdHeadTail,
  wc:       cmdWc,
  sort:     cmdSort,
  uniq:     cmdUniq,
  cut:      cmdCut,
  sed:      cmdSed,
  awk:      cmdAwk,
  tar:      cmdTar,
  gzip:     cmdGzip,
  gunzip:   cmdGunzipZcat,
  zcat:     cmdGunzipZcat,
  ping:     cmdPing,
  ifconfig: cmdIfconfig,
  ip:       cmdIfconfig,
  netstat:  cmdNetstat,
  curl:     cmdCurlWget,
  wget:     cmdCurlWget,
  who:      cmdWhoW,
  w:        cmdWhoW,
  kill:     cmdKill,
  env:      cmdEnv,
  export:   cmdExport,
  tee:      cmdTee,
  xargs:    cmdXargs,
  watch:    cmdWatch,
  yum:      cmdYum,
  systemctl:cmdSystemctl,
  crontab:  cmdCrontab,
  nano:     cmdNano,
  lsblk:    cmdLsblk,
  mkfs:     cmdMkfs,
  mount:    cmdMount,
  umount:   cmdUmount,
  fdisk:    cmdFdisk,
  mountpoint: cmdMountpoint,
  killall:  cmdKillall,
  'firewall-cmd': cmdFirewallCmd,
};
