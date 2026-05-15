// ============================================================
// Terminal — instancias globales, estado, executor, historial
// ============================================================

// ── Instancias globales ──────────────────────────────────────
const vfs    = new VirtualFS();
const vusers = new VirtualUsers();

// ── Estado del terminal ──────────────────────────────────────
function defaultDisks() {
  return [
    { name: 'nvme0n1',     size: '8G',  type: 'disk', parent: null,        formatted: null,   mountpoint: null },
    { name: 'nvme0n1p1',   size: '8G',  type: 'part', parent: 'nvme0n1',   formatted: 'xfs',  mountpoint: '/' },
    { name: 'nvme0n1p127', size: '1M',  type: 'part', parent: 'nvme0n1',   formatted: null,   mountpoint: null },
    { name: 'nvme0n1p128', size: '10M', type: 'part', parent: 'nvme0n1',   formatted: 'vfat', mountpoint: '/boot/efi' },
  ];
}

let termState = {
  cwd:      vusers.currentHome(),
  lastExit: 0,
  services: {},
  packages: {},
  crontab:  [],
  disks:    defaultDisks(),
  firewall: { running: false, services: [], ports: [] },
};

let envVars = {};

// ── Historial ────────────────────────────────────────────────
let commandHistory = [];
let historyIndex   = -1;

// ── Prompt ────────────────────────────────────────────────────
function buildPrompt() {
  const user = vusers.currentUser();
  const home = vusers.currentHome();
  const rel  = termState.cwd === home              ? '~'
             : termState.cwd.startsWith(home + '/') ? '~' + termState.cwd.slice(home.length)
             : termState.cwd;
  const sym  = user.username === 'root' ? '#' : '$';
  return `${user.username}@ip-172-31-15-124:${rel}${sym}`;
}

function updatePromptLabel() {
  const el = document.getElementById('prompt-label');
  if (el) el.textContent = buildPrompt() + ' ';
}

// ── Despachador principal ────────────────────────────────────
function executeCommand(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: true, lines: [] };

  const segments = splitPipes(trimmed);
  let piped  = null;
  let result = { ok: true, lines: [] };

  for (const seg of segments) {
    const u      = vusers.currentUser();
    const home   = vusers.currentHome();
    const groups = vusers.currentGroups();
    result = _execSegment(seg, termState.cwd, u, home, groups, piped);
    piped  = result.lines ? result.lines.join('\n') : null;
  }

  termState.lastExit = result.ok ? 0 : 1;
  return result;
}

function _execSegment(seg, cwd, u, home, groups, stdin) {
  const allTok = tokenize(seg);
  const { cleanTokens, redirect } = parseRedirect(allTok);
  if (!cleanTokens.length) return { ok: true, lines: [] };

  // Strip leading VAR=value env-var prefixes (e.g. EDITOR=nano crontab -e)
  let start = 0;
  while (start < cleanTokens.length && /^[A-Z_][A-Z0-9_]*=/.test(cleanTokens[start])) start++;
  const effective = cleanTokens.slice(start);
  if (!effective.length) return { ok: true, lines: [] };

  const cmd  = effective[0];
  const rest = effective.slice(1).flatMap(t => expandGlob(t, cwd, home));
  const { flags, args } = parseFlags(rest);
  const getNode = p => vfs._getNode(vfs.resolve(p, cwd, home));

  const handler = COMMANDS[cmd];
  let result;

  if (handler) {
    result = handler({ cmd, args, flags, rest, cwd, u, home, groups, stdin, redirect, getNode });
  } else {
    const lines = [`bash: ${cmd}: command not found`];
    const suggestion = suggestCommand(cmd);
    if (suggestion) lines.push(`¿Quisiste decir: ${suggestion}?`);
    result = { ok: false, lines };
  }

  // Redirección de salida (echo gestiona la suya internamente)
  if (redirect && cmd !== 'echo' && result.ok && result.lines?.length) {
    vfs.writeFile(redirect.file, result.lines.join('\n') + '\n', redirect.op === '>>', cwd, home, u.username, groups);
    result.lines = [];
  }

  return result;
}

// ── Undo / Redo — snapshot del estado ────────────────────────
function snapshotState() {
  return JSON.stringify({
    root:     vfs.root,
    users:    vusers.users,
    groups:   vusers.groups,
    current:  vusers.current,
    cwd:      termState.cwd,
    services: termState.services,
    packages: termState.packages,
    crontab:  termState.crontab,
    disks:    termState.disks,
    firewall: termState.firewall,
  });
}

function _rebuildNode(plain) {
  const node = new VirtualNode({
    name: plain.name, type: plain.type,
    owner: plain.owner, group: plain.group,
    perms: plain.perms, content: plain.content,
    mtime: plain.mtime,
  });
  node.size       = plain.size;
  node.linkTarget = plain.linkTarget;
  if (plain.type === 'dir') {
    for (const [k, child] of Object.entries(plain.children || {}))
      node.children[k] = _rebuildNode(child);
  }
  return node;
}

function restoreState(snap) {
  const d            = JSON.parse(snap);
  vfs.root           = _rebuildNode(d.root);
  vusers.users       = d.users;
  vusers.groups      = d.groups;
  vusers.current     = d.current;
  termState.cwd      = d.cwd;
  termState.services = d.services || {};
  termState.packages = d.packages || {};
  termState.crontab  = d.crontab  || [];
  termState.disks    = d.disks    || defaultDisks();
  termState.firewall = d.firewall || { running: false, services: [], ports: [] };
}
