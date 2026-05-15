// Computes the expected {cwd, home} at the moment step[stepIdx] should run,
// by simulating every cd/su in preceding steps using the exercise's path data.
function _getExpectedContext(stepIdx) {
  const initial = currentExercise?.estadoInicial || {};
  let user = initial.usuarioActual || 'user-ec2';
  let cwd  = initial.directorioActual || '/home/' + user;
  let home = vusers.getUser(user)?.home || '/home/' + user;

  for (let i = 0; i < stepIdx; i++) {
    const raw  = (currentExercise.pasos[i]?.comandoSugerido || '').trim().split(/\s+/);
    let j = 0;
    if (raw[j] === 'sudo') j++;
    const verb = raw[j];
    const args = raw.slice(j + 1);

    if (verb === 'cd') {
      const target = args.find(a => !a.startsWith('-')) || '~';
      cwd = vfs.resolve(target, cwd, home);
    } else if (verb === 'su') {
      const withEnv = args[0] === '-' || args[0] === '-l';
      const target  = withEnv ? (args[1] || 'root') : (args.find(a => !a.startsWith('-')) || 'root');
      const u = vusers.getUser(target);
      if (u) {
        home = u.home || '/home/' + target;
        if (withEnv) cwd = home;
        user = target;
      }
    }
  }
  return { cwd, home };
}

// Normalize an observational command to "verb /abs/path1 /abs/path2 ..."
// Flags are excluded — for observational matching we care about WHAT, not HOW.
// Commands in _OBS_IMPLICIT_DIR treat missing path argument as current directory.
const _OBS_IMPLICIT_DIR = new Set(['ls', 'du', 'find']);

function _normObs(cmdStr, resolveFn) {
  const tokens = cmdStr.trim().replace(/\s+/g, ' ').split(' ').filter(Boolean);
  let i = 0;
  if (tokens[i] === 'sudo') i++;
  const verb = tokens[i++];
  const paths = tokens.slice(i)
    .filter(t => !t.startsWith('-'))
    .map(t => {
      let p = t.replace(/\/+$/, ''); // strip trailing slashes
      // Glob pattern → use parent directory (backup/*.bak → backup)
      if (p.includes('*') || p.includes('?')) {
        const lastSlash = p.lastIndexOf('/');
        p = lastSlash > 0 ? p.slice(0, lastSlash) : '.';
      }
      return resolveFn(p);
    });
  if (!paths.length && _OBS_IMPLICIT_DIR.has(verb))
    paths.push(resolveFn('.'));
  return verb + (paths.length ? ' ' + paths.join(' ') : '');
}

// Returns true if the expected outcome of paso has already been achieved.
const _OBSERVATIONAL_VERBS = new Set([
  'ls','pwd','cat','grep','find','ps','tail','head','wc','sort','uniq','cut',
  'history','who','w','uname','uptime','df','du','free','env','export',
  'id','whoami','groups','watch'
]);

function _isObservational(paso) {
  const tokens = paso.comandoSugerido.trim().replace(/\s+/g,' ').split(' ');
  let i = 0;
  if (tokens[i] === 'sudo') i++;
  const verb = tokens[i];
  if (_OBSERVATIONAL_VERBS.has(verb)) return true;
  if (verb === 'systemctl') {
    const sub = tokens.slice(i + 1).find(t => !t.startsWith('-') && !/^[A-Z_]/.test(t));
    return sub === 'status';
  }
  if (verb === 'crontab') return tokens.includes('-l');
  return false;
}

function _stepSatisfied(paso, stepIdx, typedCmd = '') {
  const raw    = paso.comandoSugerido.trim().replace(/\s+/g, ' ');
  const tokens = raw.split(' ');
  let i = 0;
  if (tokens[i] === 'sudo') i++;
  const verb = tokens[i];
  const rest  = tokens.slice(i + 1);

  // Extract the verb the user actually typed (skip sudo and env-var prefixes)
  const typedTokens = typedCmd.trim().split(/\s+/);
  const typedVerb = typedTokens.find(t => t !== 'sudo' && !/^[A-Z_][A-Z0-9_]*=/.test(t)) || '';

  // resolve: paths in paso's comandoSugerido, from the context the step was designed for
  // resolveTyped: paths the user actually typed, from their actual current cwd
  const { cwd, home } = _getExpectedContext(stepIdx);
  const resolve      = p => vfs.resolve(p, cwd, home);
  const nodeAt       = p => vfs._getNode(resolve(p));
  const resolveTyped = p => vfs.resolve(p, termState.cwd, vusers.currentHome());

  switch (verb) {
    case 'mkdir': {
      const path = rest.find(t => !t.startsWith('-'));
      return path ? nodeAt(path)?.type === 'dir' : false;
    }
    case 'touch': {
      const paths = rest.filter(t => !t.startsWith('-'));
      return paths.length ? paths.every(p => nodeAt(p) !== null) : false;
    }
    case 'rm': {
      const path = rest.find(t => !t.startsWith('-'));
      return path ? nodeAt(path) === null : true;
    }
    case 'cp': {
      const paths = rest.filter(t => !t.startsWith('-'));
      const src = paths[0];
      const dst = paths[paths.length - 1];
      if (!src || !dst) return false;
      const dstNode = vfs._getNode(resolve(dst));
      if (dstNode?.type === 'dir') {
        const base = src.split('/').pop();
        return vfs._getNode(resolve(dst.replace(/\/$/, '') + '/' + base)) !== null;
      }
      return dstNode !== null;
    }
    case 'mv': {
      // -n is demonstrative: the move is intentionally skipped — always satisfy
      if (rest.includes('-n')) return true;
      const paths = rest.filter(t => !t.startsWith('-'));
      const src   = paths[0];
      return src ? nodeAt(src) === null : false; // source must be gone
    }
    case 'echo': {
      if (typedVerb !== 'echo') return false;
      const redir = raw.match(/>{1,2}\s*(\S+)\s*$/);
      if (!redir) return true;
      return nodeAt(redir[1]) !== null;
    }
    case 'cd': {
      const target   = rest.find(t => !t.startsWith('-')) || '~';
      const expected = resolve(target);
      return termState.cwd === expected || termState.cwd.startsWith(expected + '/');
    }
    case 'chmod': {
      const args = rest.filter(t => !t.startsWith('-'));
      if (args.length < 2) return false;
      const modeSpec = args[0];
      const n = nodeAt(args[1]);
      if (!n) return false;
      // Symbolic: sticky bit checks
      if (/\+t/.test(modeSpec)) return n.perms[8] === 't' || n.perms[8] === 'T';
      if (/-t/.test(modeSpec))  return n.perms[8] !== 't' && n.perms[8] !== 'T';
      // 4-digit octal (e.g. 1777)
      if (/^\d{4}$/.test(modeSpec)) {
        const special = parseInt(modeSpec[0]);
        const oct = modeSpec.slice(1);
        const toRwx = n => {
          const d = parseInt(n);
          return (d & 4 ? 'r' : '-') + (d & 2 ? 'w' : '-') + (d & 1 ? 'x' : '-');
        };
        let expected = toRwx(oct[0]) + toRwx(oct[1]) + toRwx(oct[2]);
        if (special & 4) expected = expected.slice(0, 2) + (expected[2] === 'x' ? 's' : 'S') + expected.slice(3);
        if (special & 2) expected = expected.slice(0, 5) + (expected[5] === 'x' ? 's' : 'S') + expected.slice(6);
        if (special & 1) expected = expected.slice(0, 8) + (expected[8] === 'x' ? 't' : 'T');
        return n.perms === expected;
      }
      // Regular 1-3 digit octal
      const expectedRwx = vfs._octalToRwx ? vfs._octalToRwx(modeSpec) : null;
      return expectedRwx ? n.perms === expectedRwx : true;
    }
    case 'chown': {
      const args = rest.filter(t => !t.startsWith('-'));
      if (args.length < 2) return false;
      const [ownerSpec, ...pathParts] = args;
      const n = nodeAt(pathParts.join(' '));
      if (!n) return false;
      if (ownerSpec.includes(':')) {
        const [owner, group] = ownerSpec.split(':');
        return n.owner === owner && n.group === group;
      }
      return n.owner === ownerSpec;
    }
    case 'useradd': {
      const name = rest.find(t => !t.startsWith('-'));
      return name ? vusers.getUser(name) !== null : false;
    }
    case 'groupadd': {
      const name = rest.find(t => !t.startsWith('-'));
      return name ? vusers.getGroup(name) !== null : false;
    }
    case 'usermod': {
      const username = rest.filter(t => !t.startsWith('-')).pop();
      const u = vusers.getUser(username);
      if (!u) return false;
      const gIdx = rest.indexOf('-g');
      if (gIdx >= 0) {
        const g = vusers.getGroup(rest[gIdx + 1]);
        return g ? u.gid === g.gid : false;
      }
      const GIdx = rest.indexOf('-G');
      if (GIdx >= 0) {
        const g = vusers.getGroup(rest[GIdx + 1]);
        return g ? g.members.includes(username) : false;
      }
      return true;
    }
    case 'su': {
      const withEnv = rest[0] === '-' || rest[0] === '-l';
      const target  = withEnv ? (rest[1] || 'root') : (rest.find(t => !t.startsWith('-')) || 'root');
      return vusers.current === target;
    }
    case 'yum': {
      const sub = rest.find(t => !t.startsWith('-'));
      const pkg = rest.filter(t => !t.startsWith('-'))[1];
      if (sub === 'install' && pkg) return termState.packages?.[pkg] === true;
      return true;
    }
    case 'systemctl': {
      const sub     = rest.find(t => !t.startsWith('-')) || '';
      const service = rest.filter(t => !t.startsWith('-'))[1] || '';
      const svc     = termState.services?.[service];
      if (sub === 'start'  || sub === 'restart') return svc?.running === true;
      if (sub === 'stop')                        return svc?.running === false;
      if (sub === 'enable')                      return svc?.enabled === true;
      if (sub === 'disable')                     return svc?.enabled === false;
      if (sub === 'status') {
        const typedSub = typedTokens.find((t, idx) => idx > 0 && t !== 'sudo' && !t.startsWith('-') && !/^[A-Z_]/.test(t));
        return typedVerb === 'systemctl' && typedSub === 'status';
      }
      return typedVerb === 'systemctl';
    }
    case 'crontab': {
      const stepFlag  = raw.match(/-[elr]/)?.[0] || '';
      const typedFlag = typedCmd.match(/-[elr]/)?.[0] || '';
      return typedVerb === 'crontab' && typedFlag === stepFlag;
    }
    case 'tar': {
      const isCreate = rest.some(t => t.startsWith('-') && t.includes('c'));
      if (!isCreate) return typedVerb === 'tar';
      const fStand = rest.indexOf('-f');
      const archive = fStand >= 0
        ? rest[fStand + 1]
        : rest[rest.findIndex(t => t.startsWith('-') && t.includes('f')) + 1];
      return archive ? nodeAt(archive) !== null : false;
    }
    case 'gzip': {
      const src = rest.find(t => !t.startsWith('-'));
      return src ? nodeAt(src + '.gz') !== null : false;
    }
    case 'gunzip': {
      const src = rest.find(t => !t.startsWith('-'));
      if (!src) return false;
      return nodeAt(src.endsWith('.gz') ? src.slice(0, -3) : src) !== null;
    }
    case 'nano': {
      const target = rest.find(t => !t.startsWith('-'));
      return target ? nodeAt(target) !== null : false;
    }
    // Observational commands with path args (ls, cat, find, du):
    // Normalize both commands to "verb /abs/path" and compare — flags and relative
    // path syntax are irrelevant; only the resolved target matters.
    case 'ls': case 'cat': case 'find': case 'du': {
      return _normObs(raw, resolve) === _normObs(typedCmd, resolveTyped);
    }
    // Observational commands with no meaningful path arg — verb match is enough
    case 'pwd': case 'grep': case 'ps': case 'history': case 'who': case 'w':
    case 'uname': case 'uptime': case 'df': case 'free': case 'env':
    case 'export': case 'id': case 'whoami': case 'groups': case 'watch':
      return typedVerb === verb;
    default:
      return raw === paso.comandoSugerido.trim().replace(/\s+/g, ' ');
  }
}

function checkStepProgress(val, cmdOk = true) {
  if (!currentExercise) return;
  if (!cmdOk) return;
  const pasos = currentExercise.pasos;
  let advanced = false;
  if (currentStepIndex < pasos.length && _stepSatisfied(pasos[currentStepIndex], currentStepIndex, val)) {
    currentStepIndex++;
    advanced = true;
  }
  if (advanced) {
    updateStepDisplay();
    updateCurrentStepHint();
    if (currentStepIndex >= pasos.length) completeExercise();
  }
}

function completeExercise() {
  const termOut = document.getElementById('terminal-output');
  if (termOut) appendCompletionBanner(termOut);
  const badge = document.getElementById('step-complete');
  if (badge) badge.classList.remove('hidden');
}

function appendCompletionBanner(container) {
  const div = document.createElement('div');
  div.dataset.logtype = 'completion';
  div.className = 'my-md p-md border border-primary-container/40 bg-primary-container/10 rounded font-code-block text-code-block';
  div.innerHTML =
    '<div class="flex items-center gap-sm text-primary-container font-bold mb-xs">'
    + '<span class="material-symbols-outlined text-lg" style="font-variation-settings:\'FILL\' 1">check_circle</span>'
    + ' EJERCICIO COMPLETADO'
    + '</div>'
    + '<div class="text-on-surface-variant text-xs">Todos los pasos han sido ejecutados correctamente.</div>';
  _insertBeforeCurrent(container, div);
  container.scrollTop = container.scrollHeight;
}

// ── Sincronización botones undo/redo ─────────────────────────
function syncUndoButtons() {
  const setBtn = (id, enabled) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.disabled = !enabled;
    btn.classList.toggle('opacity-40',        !enabled);
    btn.classList.toggle('cursor-not-allowed', !enabled);
  };
  setBtn('btn-undo', undoStack.length > 0);
  setBtn('btn-redo', redoStack.length > 0);
}
