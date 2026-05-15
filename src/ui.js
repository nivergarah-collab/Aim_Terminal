// ============================================================
// UI — render e interacciones
// Terminal Aim Trainer
// ============================================================

// ── Ejercicio dummy (fallback si loadExercise se llama sin argumento) ──
const EJERCICIO_DUMMY = {
  id: 0,
  premisa: 'Eres el responsable de crear la estructura de directorios para un nuevo proyecto. Crea una carpeta llamada proyecto con subcarpetas src y docs. Dentro de src crea main.c y dentro de docs un archivo leeme.txt con el texto "Bienvenido al proyecto".',
  tematicas: ['Navegación y archivos básicos'],
  estadoInicial: {
    fs: { dirs: [], files: [] },
    usuarios: [],
    grupos: [],
    usuarioActual: 'user-ec2',
    directorioActual: '/home/user-ec2'
  },
  pasos: [
    { descripcion: 'Crear carpeta proyecto',       comandoSugerido: 'mkdir proyecto' },
    { descripcion: 'Crear carpeta src dentro',     comandoSugerido: 'mkdir proyecto/src' },
    { descripcion: 'Crear carpeta docs dentro',    comandoSugerido: 'mkdir proyecto/docs' },
    { descripcion: 'Crear archivo main.c',         comandoSugerido: 'touch proyecto/src/main.c' },
    { descripcion: 'Crear leeme.txt con contenido',comandoSugerido: 'echo "Bienvenido al proyecto" > proyecto/docs/leeme.txt' },
  ],
  pistas: [
    'Usa mkdir para crear directorios.',
    'touch crea archivos vacíos.',
    'echo "texto" > archivo escribe en un archivo.',
  ],
  comandosUtiles: ['mkdir', 'touch', 'echo', 'ls', 'cd']
};

// ── Clasificador de errores ───────────────────────────────────
function classifyError(msg) {
  if (/^¿Quisiste decir:/i.test(msg))
    return 'suggest';
  if (/permission denied|operation not permitted|authentication failure|sudoers|not allowed/i.test(msg))
    return 'error-b';
  if (/no such file|command not found|does not exist|cannot open|cannot access/i.test(msg))
    return 'error-c';
  return 'error-a';
}

// ── Estado UI ─────────────────────────────────────────────────
let hintVisible  = false;
let activeToolCmd = null;

let currentExercise      = null;
let currentStepIndex     = 0;
let currentExerciseIndex = 0;

// (undoStack/redoStack/MAX_UNDO viven en src/undo.js; estado nano en src/nano.js)

// ── DOM ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderTools();
  wireUI();
  _wireNano();
  const urlEjId = new URLSearchParams(window.location.search).get('ej');
  if (urlEjId !== null) {
    const todosList = typeof listaEjercicios !== 'undefined' ? listaEjercicios : [];
    const ejDirecto = todosList.find(e => String(e.id) === urlEjId);
    if (ejDirecto) {
      loadExercise(ejDirecto);
      undoStack = []; redoStack = [];
      envVars   = {};
      const out = document.getElementById('terminal-output');
      if (out) out.innerHTML = '';
      renderTerminalInitial();
      updateUserDisplay();
      updateStepDisplay();
      updateCurrentStepHint();
      updatePromptLabel();
      syncUndoButtons();
      const counter = document.getElementById('exercise-counter');
      if (counter) counter.textContent = `#${ejDirecto.id}`;
      document.getElementById('terminal-input')?.focus();
    } else {
      navigateToExercise(0);
    }
  } else {
    const lista = getFilteredExercises();
    navigateToExercise(lista.length ? Math.floor(Math.random() * lista.length) : 0);
  }
});

function updateUserDisplay() {
  const username = vusers.currentUser()?.username || 'usuario';
  const el = (id) => document.getElementById(id);
  if (el('header-username'))   el('header-username').textContent   = username;
  if (el('dropdown-username')) el('dropdown-username').textContent = username;
  if (el('sidebar-username'))  el('sidebar-username').textContent  = username.toUpperCase();
}

function renderTools() {
  const bar     = document.getElementById('tools-bar');
  if (!bar) return;
  const saved   = AppSettings.getComandos();
  const hasPrefs = Object.keys(saved).length > 0;
  bar.innerHTML = '';
  TOOL_COMMANDS.forEach(({ cmd }) => {
    // Ocultar si el usuario desactivó el comando en settings
    if (hasPrefs && saved[cmd] === false) return;
    const btn = document.createElement('button');
    btn.textContent = cmd;
    btn.dataset.cmd = cmd;
    btn.className = 'tool-btn px-sm py-xs bg-surface border border-outline-variant rounded text-on-surface font-code-block text-code-block text-xs hover:border-primary-container hover:text-primary-container transition-colors';
    btn.addEventListener('click', () => handleToolClick(cmd));
    bar.appendChild(btn);
  });
}

function renderTerminalInitial() {
  const out = document.getElementById('terminal-output');
  if (!out) return;
  out.innerHTML = '';
  const prompt = buildPrompt();
  appendLine(out, 'prompt', prompt, 'pwd');
  for (const ln of executeCommand('pwd').lines) appendLine(out, 'output', ln);
  appendLine(out, 'prompt', prompt, 'ls');
  const rLs = executeCommand('ls');
  for (const ln of rLs.lines) appendLine(out, rLs.ok ? 'output' : classifyError(ln), ln);
  out.appendChild(_createCurrentLine());
}

function appendLine(container, type, ...parts) {
  const div  = document.createElement('div');
  const text = parts[0] || '';
  div.dataset.logtype = type;
  if (type === 'prompt') {
    div.className = 'mb-sm';
    div.innerHTML = `<span class="text-primary-container">${escHtml(parts[0])} </span><span class="text-on-surface">${escHtml(parts[1] || '')}</span>`;
  } else if (type === 'output') {
    div.className = 'mb-md text-on-surface whitespace-pre font-code-block text-code-block';
    div.textContent = text;
  } else if (type === 'error-a') {
    div.className = 'mb-sm text-tertiary-container font-code-block text-code-block';
    div.textContent = text;
  } else if (type === 'error-b') {
    div.className = 'mb-sm text-error font-code-block text-code-block';
    div.textContent = text;
  } else if (type === 'error-c') {
    div.className = 'mb-sm text-secondary font-code-block text-code-block';
    div.textContent = text;
  } else if (type === 'suggest') {
    div.className = 'mb-sm text-primary-container font-code-block text-code-block opacity-70';
    div.textContent = text;
  } else {
    div.className = 'mb-sm text-error font-code-block text-code-block';
    div.textContent = text;
  }
  _insertBeforeCurrent(container, div);
  container.scrollTop = container.scrollHeight;
}

function _insertBeforeCurrent(container, node) {
  const cl = container.querySelector('#terminal-current-line');
  if (cl) container.insertBefore(node, cl);
  else    container.appendChild(node);
}

// ── Log de sesión ─────────────────────────────────────────────
function generateLog() {
  const termOut = document.getElementById('terminal-output');
  if (!termOut) return '';

  const premisaEl = document.getElementById('premisa-text');
  const premisa   = premisaEl?.textContent.trim() || '';
  const now       = new Date();
  const fecha     = now.toLocaleDateString('es-ES', { year:'numeric', month:'2-digit', day:'2-digit' });
  const hora      = now.toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' });

  const sessionLines = [];
  for (const div of termOut.children) {
    if (div.dataset.logtype === 'prompt') {
      const spans = div.querySelectorAll('span');
      sessionLines.push((spans[0]?.textContent || '') + (spans[1]?.textContent || ''));
    } else {
      sessionLines.push(div.textContent || '');
    }
  }

  return [
    '# Terminal Aim Trainer — Log de sesión',
    '',
    `**Fecha:** ${fecha} ${hora}`,
    premisa ? `**Ejercicio:** ${premisa}` : '',
    '',
    '---',
    '',
    '```',
    ...sessionLines,
    '```',
    '',
    '---',
    '*Generado por Terminal Aim Trainer*',
  ].join('\n');
}

function downloadLog() {
  const content = generateLog();
  const blob    = new Blob([content], { type: 'text/markdown' });
  const url     = URL.createObjectURL(blob);
  const a       = document.createElement('a');
  const now     = new Date();
  const stamp   = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
  a.href        = url;
  a.download    = `terminal-log-${stamp}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function _createCurrentLine() {
  const div = document.createElement('div');
  div.id = 'terminal-current-line';
  div.className = 'flex items-center gap-xs font-code-block text-code-block';
  div.innerHTML =
    `<span id="prompt-label" class="text-primary-container shrink-0 whitespace-nowrap">${escHtml(buildPrompt())} </span>` +
    `<span id="terminal-before" class="text-on-surface whitespace-pre"></span>` +
    `<span class="inline-block w-px h-4 bg-primary-container cursor-blink shrink-0"></span>` +
    `<span id="terminal-after" class="text-on-surface whitespace-pre"></span>`;
  return div;
}

function updateTypedDisplay() {
  const inputEl = document.getElementById('terminal-input');
  const before  = document.getElementById('terminal-before');
  const after   = document.getElementById('terminal-after');
  if (!before || !after || !inputEl) return;
  const pos = inputEl.selectionStart ?? inputEl.value.length;
  before.textContent = inputEl.value.slice(0, pos);
  after.textContent  = inputEl.value.slice(pos);
}

// ── Carga de ejercicio ────────────────────────────────────────
function loadExercise(ejercicio) {
  const ej = ejercicio || EJERCICIO_DUMMY;
  const ini = ej.estadoInicial || {};

  // Reiniciar filesystem, usuarios y estado del terminal
  vfs.initFromSpec(ini.fs || {});
  vusers.initFromSpec(ini);
  termState.cwd      = ini.directorioActual || vusers.currentHome();
  termState.lastExit = 0;
  termState.disks    = ini.discos ? JSON.parse(JSON.stringify(ini.discos)) : defaultDisks();
  termState.firewall = ini.firewall
    ? JSON.parse(JSON.stringify(ini.firewall))
    : { running: false, services: [], ports: [] };

  // Pistas
  hintVisible  = false;
  const hintBox = document.getElementById('hint-box');
  if (hintBox) hintBox.style.display = 'none';

  // Premisa
  const premisa = document.getElementById('premisa-text');
  if (premisa) premisa.textContent = ej.premisa || '';

  // Estado de progreso
  currentExercise  = ej;
  currentStepIndex = 0;
  const badge = document.getElementById('step-complete');
  if (badge) badge.classList.add('hidden');

  // Pasos
  const stepList = document.getElementById('step-list');
  if (stepList) {
    stepList.innerHTML = '';
    (ej.pasos || []).forEach((s, i) => {
      const item = document.createElement('div');
      item.className = 'step-item relative pl-8 group';
      item.innerHTML = `
        <div data-role="dot" class="absolute left-1.5 top-1.5 w-3 h-3 rounded-full ring-4 ring-surface ${i === 0 ? 'bg-primary-container' : 'bg-surface-container border-2 border-outline-variant'}"></div>
        <div data-role="card" class="p-sm ${i === 0 ? 'bg-surface-container border border-primary-container/30' : 'bg-background border border-outline-variant'} rounded text-on-surface relative">
          <p class="font-body-md text-sm">${i + 1}. ${escHtml(s.descripcion)}</p>
          <div class="step-tooltip absolute bottom-full left-0 mb-1 bg-surface-container-highest border border-outline-variant p-2 rounded shadow-lg opacity-0 invisible transition-all z-20 w-max">
            <code class="font-code-block text-code-block text-xs text-primary-container">${escHtml(s.comandoSugerido)}</code>
          </div>
        </div>`;
      stepList.appendChild(item);
    });
  }
}

// ── Progreso de pasos ─────────────────────────────────────────
function updateStepDisplay() {
  const stepList = document.getElementById('step-list');
  if (!stepList || !currentExercise) return;
  const pasos = currentExercise.pasos;
  stepList.querySelectorAll('.step-item').forEach((item, i) => {
    const dot  = item.querySelector('[data-role="dot"]');
    const card = item.querySelector('[data-role="card"]');
    if (!dot || !card) return;
    const done   = i < currentStepIndex;
    const active = i === currentStepIndex;
    dot.className = 'absolute left-1.5 top-1.5 w-3 h-3 rounded-full ring-4 ring-surface '
      + (done || active ? 'bg-primary-container' : 'bg-surface-container border-2 border-outline-variant');
    card.className = 'p-sm rounded text-on-surface relative '
      + (done   ? 'bg-surface-container border border-primary-container/20 opacity-50'
       : active ? 'bg-surface-container border border-primary-container/30'
                : 'bg-background border border-outline-variant');
  });
  // Apuntar param box al paso activo
  if (currentStepIndex < pasos.length) {
    const paso = pasos[currentStepIndex];
    updateParamBox(paso.comandoSugerido.split(' ')[0], paso.comandoSugerido);
  }
}

// ── Pistas contextuales ───────────────────────────────────────
function _stepHint(paso) {
  const cmd  = paso.comandoSugerido.split(' ')[0];
  const info = TOOL_COMMANDS.find(t => t.cmd === cmd);
  const desc = info ? info.desc + ' ' : '';
  return `${desc}Ej: ${paso.comandoSugerido}`;
}

function updateCurrentStepHint() {
  const hintBox = document.getElementById('hint-box');
  if (!hintBox) return;
  if (!currentExercise || currentStepIndex >= currentExercise.pasos.length) {
    hintBox.style.display = 'none';
    hintVisible = false;
    return;
  }
  hintBox.textContent = _stepHint(currentExercise.pasos[currentStepIndex]);
}

// ── Interacciones UI ──────────────────────────────────────────
function _wireHints() {
  // Pista
  const btnPista  = document.getElementById('btn-pista');
  const hintBox   = document.getElementById('hint-box');
  if (btnPista && hintBox) {
    btnPista.addEventListener('click', () => {
      hintVisible = !hintVisible;
      hintBox.style.display = hintVisible ? 'block' : 'none';
      if (hintVisible) updateCurrentStepHint();
    });
  }

  // Solución
  const btnSolucion      = document.getElementById('btn-solucion');
  const solucionConfirm  = document.getElementById('solucion-confirm');
  if (btnSolucion && solucionConfirm) {
    btnSolucion.addEventListener('click', e => {
      e.stopPropagation();
      solucionConfirm.classList.toggle('hidden');
    });
    document.getElementById('btn-solucion-si')?.addEventListener('click', () => {
      solucionConfirm.classList.add('hidden');
      applySolution();
    });
    document.getElementById('btn-solucion-no')?.addEventListener('click', () => {
      solucionConfirm.classList.add('hidden');
    });
    document.addEventListener('click', () => solucionConfirm.classList.add('hidden'));
  }

  // Usuario dropdown
  const btnUser  = document.getElementById('btn-user');
  const dropdown = document.getElementById('user-dropdown');
  if (btnUser && dropdown) {
    btnUser.addEventListener('click', e => {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', () => { dropdown.style.display = 'none'; });
  }
}

function _wireExerciseControls() {
  // Ejercicio aleatorio
  document.getElementById('btn-prev-exercise')?.addEventListener('click', () => {
    const lista = getFilteredExercises();
    if (!lista.length) return;
    navigateToExercise(Math.max(0, currentExerciseIndex - 1));
  });

  document.getElementById('btn-next-exercise')?.addEventListener('click', () => {
    const lista = getFilteredExercises();
    if (!lista.length) return;
    navigateToExercise(Math.min(lista.length - 1, currentExerciseIndex + 1));
  });

  document.getElementById('btn-shuffle-exercise')?.addEventListener('click', () => {
    const lista = getFilteredExercises();
    if (!lista.length) return;
    let next = currentExerciseIndex;
    while (next === currentExerciseIndex && lista.length > 1) next = Math.floor(Math.random() * lista.length);
    navigateToExercise(next);
  });

  // Reiniciar ejercicio actual
  document.getElementById('btn-reset-exercise')?.addEventListener('click', () => {
    navigateToExercise(currentExerciseIndex);
  });

  // Saltar a ejercicio por id
  const counterEl   = document.getElementById('exercise-counter');
  const jumpInput   = document.getElementById('exercise-jump-input');
  let _jumpNotifTimer = null;

  function showJumpNotif(msg) {
    let notif = document.getElementById('exercise-jump-notif');
    if (!notif) {
      notif = document.createElement('span');
      notif.id = 'exercise-jump-notif';
      notif.className = 'absolute -top-6 left-1/2 -translate-x-1/2 font-code-block text-xs px-sm py-xs bg-surface-container-high border border-outline-variant rounded text-on-surface-variant whitespace-nowrap opacity-0 transition-opacity duration-200';
      counterEl.parentElement.style.position = 'relative';
      counterEl.parentElement.appendChild(notif);
    }
    notif.textContent = msg;
    notif.classList.remove('opacity-0');
    clearTimeout(_jumpNotifTimer);
    _jumpNotifTimer = setTimeout(() => notif.classList.add('opacity-0'), 1800);
  }

  function activateJumpInput() {
    counterEl.classList.add('hidden');
    jumpInput.classList.remove('hidden');
    jumpInput.value = '';
    jumpInput.focus();
  }

  function deactivateJumpInput() {
    jumpInput.classList.add('hidden');
    counterEl.classList.remove('hidden');
  }

  counterEl?.addEventListener('click', activateJumpInput);

  jumpInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { deactivateJumpInput(); return; }
    if (e.key !== 'Enter') return;
    const id  = parseInt(jumpInput.value, 10);
    const lista = getFilteredExercises();
    const idx = lista.findIndex(ej => ej.id === id);
    deactivateJumpInput();
    if (idx === -1) { showJumpNotif('no disponible'); return; }
    navigateToExercise(idx);
  });

  jumpInput?.addEventListener('blur', deactivateJumpInput);

  // Descarga de log
  const btnPrint = document.getElementById('btn-print');
  if (btnPrint) btnPrint.addEventListener('click', downloadLog);
}

function _wireTerminalInput() {
  // Input de terminal
  const input = document.getElementById('terminal-input');
  if (input) {
    // Actualizar display y param box en tiempo real
    input.addEventListener('input', () => {
      updateTypedDisplay();
      const val = input.value.trim();
      if (!val) { updateStepDisplay(); return; }
      const tokens  = val.split(/\s+/).filter(Boolean);
      const lastCmd = [...tokens].reverse().find(t => TOOL_COMMANDS.some(tc => tc.cmd === t)) || tokens[0];
      updateParamBox(lastCmd, val);
    });

    // Enter + historial
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const val = input.value.trim();
        if (!val) return;
        const termOut    = document.getElementById('terminal-output');
        const promptText = buildPrompt();
        const snapBefore = _fullSnapshot();
        // Limpiar línea activa antes de congelar el comando
        input.value = '';
        updateTypedDisplay();
        appendLine(termOut, 'prompt', promptText, val);
        const result = executeCommand(val);
        if (result.clear) {
          termOut.innerHTML = '';
          termOut.appendChild(_createCurrentLine());
          updatePromptLabel();
        } else {
          for (const ln of (result.lines || []))
            appendLine(termOut, result.ok ? 'output' : classifyError(ln), ln);
        }
        checkStepProgress(val, result.ok);
        const snapAfter = _fullSnapshot();
        if (snapAfter !== snapBefore) {
          undoStack.push(snapBefore);
          if (undoStack.length > MAX_UNDO) undoStack.shift();
          redoStack = [];
          syncUndoButtons();
        }
        if (result.newUser) updateUserDisplay();
        if (result._nano) {
          _nanoSavedCmd = val;
          openNanoEditor(result._nano);
          commandHistory.unshift(val);
          historyIndex = -1;
          return;
        }
        commandHistory.unshift(val);
        historyIndex = -1;
        updatePromptLabel();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) historyIndex++;
        input.value = commandHistory[historyIndex] || '';
        input.setSelectionRange(input.value.length, input.value.length);
        updateTypedDisplay();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) historyIndex--;
        else { historyIndex = -1; input.value = ''; updateTypedDisplay(); return; }
        input.value = commandHistory[historyIndex] || '';
        input.setSelectionRange(input.value.length, input.value.length);
        updateTypedDisplay();
      }
    });

    // Actualiza el cursor visual al mover con flechas / Home / End
    input.addEventListener('keyup', e => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key))
        updateTypedDisplay();
    });

    // Foco al hacer clic en la terminal
    const termOut = document.getElementById('terminal-output');
    if (termOut) termOut.addEventListener('click', () => input.focus());
  }
}

function _wireToggles() {
  // Toggle herramientas
  const btnToggleTools = document.getElementById('btn-toggle-tools');
  const toolsBar       = document.getElementById('tools-bar');
  if (btnToggleTools && toolsBar) {
    let toolsVisible = true;
    btnToggleTools.addEventListener('click', () => {
      toolsVisible = !toolsVisible;
      toolsBar.style.display = toolsVisible ? '' : 'none';
      btnToggleTools.querySelector('.material-symbols-outlined').textContent =
        toolsVisible ? 'expand_less' : 'expand_more';
    });
  }

  // Toggle pasos
  const toggleSteps = document.getElementById('toggle-steps');
  const stepList    = document.getElementById('step-list');
  if (toggleSteps && stepList) {
    stepList.style.display = toggleSteps.checked ? 'flex' : 'none';
    toggleSteps.addEventListener('change', () => {
      stepList.style.display = toggleSteps.checked ? 'flex' : 'none';
    });
  }

  // Toggle parámetros
  const toggleParams = document.getElementById('toggle-params');
  const paramBox     = document.getElementById('param-box');
  if (toggleParams && paramBox) {
    toggleParams.addEventListener('change', () => {
      paramBox.style.display = toggleParams.checked ? 'block' : 'none';
    });
  }
}

function _wireBugReport() {
  const btnOpen = document.getElementById('btn-report-bug');
  const btnClose = document.getElementById('btn-close-bug');
  const btnCancel = document.getElementById('btn-cancel-bug');
  const btnSubmit = document.getElementById('btn-submit-bug');
  const modal = document.getElementById('bug-modal');

  if (!btnOpen || !modal) return;

  btnOpen.addEventListener('click', () => {
    modal.classList.remove('hidden');
    const ejIdInput = document.getElementById('bug-ej-id');
    if (ejIdInput && currentExercise) {
      ejIdInput.value = currentExercise.id;
    }
  });

  const hideModal = () => modal.classList.add('hidden');
  btnClose?.addEventListener('click', hideModal);
  btnCancel?.addEventListener('click', hideModal);

  btnSubmit?.addEventListener('click', async () => {
    const id = document.getElementById('bug-ej-id')?.value || 'N/A';
    const sev = document.getElementById('bug-severity')?.value || 'medium';
    const desc = document.getElementById('bug-desc')?.value || 'Sin descripción';
    const steps = document.getElementById('bug-steps')?.value || 'Sin pasos';

    const report = `### 🐛 Reporte de Bug
- **Ejercicio ID**: ${id}
- **Gravedad**: ${sev.toUpperCase()}
- **Descripción**: ${desc}
- **Pasos para reproducir**:
${steps.split('\\n').map(l => `- ${l}`).join('\\n')}

---
*Reportado desde el simulador LINUX_LAB*`;

    try {
      await navigator.clipboard.writeText(report);
      alert('Reporte copiado al portapapeles. Ahora serás redirigido a GitHub para pegar el contenido.');
      window.open('https://github.com/nivergarah-collab/Aim_Terminal/issues/new', '_blank');
      hideModal();
    } catch (err) {
      alert('No se pudo copiar el reporte. Por favor, copia el texto manualmente.');
    }
  });
}

function wireUI() {
  _wireHints();
  _wireUndoRedo();
  _wireExerciseControls();
  _wireTerminalInput();
  _wireToggles();
  _wireBugReport();
}

// ── Barra de herramientas ─────────────────────────────────────
function handleToolClick(cmd) {
  activeToolCmd = cmd;
  document.querySelectorAll('.tool-btn').forEach(b => {
    b.classList.toggle('border-primary-container', b.dataset.cmd === cmd);
    b.classList.toggle('text-primary-container',   b.dataset.cmd === cmd);
    b.classList.toggle('bg-primary-container/10',  b.dataset.cmd === cmd);
  });
  updateParamBox(cmd, cmd);
}

function updateParamBox(cmd, fullInput) {
  const content = document.getElementById('param-content');
  if (!content) return;
  if (document.getElementById('toggle-params') && !document.getElementById('toggle-params').checked) return;

  const info = TOOL_COMMANDS.find(t => t.cmd === cmd);
  if (info) {
    const optionsHtml = (info.options || []).map(o =>
      `<div class="contents">
        <div class="text-primary-container font-mono whitespace-nowrap">${escHtml(o.flag)}</div>
        <div class="text-on-surface-variant">${escHtml(o.desc)}</div>
      </div>`
    ).join('');

    const examplesHtml = (info.examples || []).map(e =>
      `<div class="mb-sm">
        <div class="text-primary-container font-mono">${escHtml(e.cmd)}</div>
        <div class="text-on-surface-variant text-xs pl-sm">${escHtml(e.desc)}</div>
      </div>`
    ).join('');

    content.innerHTML = `
      <div class="font-mono text-sm space-y-md">
        <div>
          <div class="text-secondary text-xs font-bold uppercase tracking-widest mb-xs">NAME</div>
          <div class="pl-sm text-on-surface"><span class="text-primary-container">${escHtml(info.cmd)}</span> — ${escHtml(info.desc)}</div>
        </div>
        ${info.synopsis ? `
        <div>
          <div class="text-secondary text-xs font-bold uppercase tracking-widest mb-xs">SYNOPSIS</div>
          <div class="pl-sm text-on-surface font-mono">${escHtml(info.synopsis)}</div>
        </div>` : ''}
        ${optionsHtml ? `
        <div>
          <div class="text-secondary text-xs font-bold uppercase tracking-widest mb-xs">OPTIONS</div>
          <div class="pl-sm grid grid-cols-[auto_1fr] gap-x-md gap-y-xs">${optionsHtml}</div>
        </div>` : ''}
        ${examplesHtml ? `
        <div>
          <div class="text-secondary text-xs font-bold uppercase tracking-widest mb-xs">EXAMPLES</div>
          <div class="pl-sm">${examplesHtml}</div>
        </div>` : ''}
      </div>`;
  } else if (fullInput) {
    content.innerHTML = `<div class="text-on-surface-variant text-sm">Comando: <span class="text-on-surface">${escHtml(fullInput)}</span></div>`;
  }
}

