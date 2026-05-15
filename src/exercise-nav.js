// ── Navegación de ejercicios ──────────────────────────────────
function getFilteredExercises() {
  const lista = (typeof listaEjercicios !== 'undefined' ? listaEjercicios : [])
    .filter(ej => !ej.esLeccion);

  if (AppSettings.getFiltroRestrictivo()) {
    const selected = AppSettings.getSelectedComandos();
    if (selected === null) return lista;
    return lista.filter(ej =>
      ej.comandosUtiles?.length && ej.comandosUtiles.every(c => selected.has(c))
    );
  }

  const activeTemas = AppSettings.getActiveTematicas();
  if (activeTemas === null) return lista;
  return lista.filter(ej =>
    !ej.tematicas?.length || ej.tematicas.some(t => activeTemas.has(t))
  );
}

function _showNoExercisesFound() {
  const premisa = document.getElementById('premisa-text');
  if (premisa) premisa.textContent = 'No se han encontrado ejercicios.';
  const counter = document.getElementById('exercise-counter');
  if (counter) counter.textContent = '#—';
}

function navigateToExercise(idx) {
  const lista = getFilteredExercises();
  if (!lista.length) { _showNoExercisesFound(); return; }
  currentExerciseIndex = Math.max(0, Math.min(idx, lista.length - 1));
  loadExercise(lista[currentExerciseIndex]);
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
  if (counter) counter.textContent = `#${lista[currentExerciseIndex]?.id ?? currentExerciseIndex + 1}`;
  document.getElementById('terminal-input')?.focus();
}

// ── Solución automática ───────────────────────────────────────
function applySolution() {
  if (!currentExercise) return;
  const termOut = document.getElementById('terminal-output');
  if (!termOut) return;

  currentExercise.pasos.forEach(paso => {
    const cmd = paso.comandoSugerido;
    appendLine(termOut, 'prompt', buildPrompt(), cmd);
    const result = executeCommand(cmd);
    if (result.clear) {
      termOut.innerHTML = '';
      termOut.appendChild(_createCurrentLine());
    } else {
      for (const ln of (result.lines || []))
        appendLine(termOut, result.ok ? 'output' : classifyError(ln), ln);
    }
    if (result.newUser) updateUserDisplay();
    updatePromptLabel();
  });

  currentStepIndex = currentExercise.pasos.length;
  updateStepDisplay();
  const badge = document.getElementById('step-complete');
  if (badge) badge.classList.remove('hidden');
  updateCurrentStepHint();

  // El usuario no puede deshacer antes de la solución
  undoStack = [];
  redoStack = [];
  syncUndoButtons();
  termOut.scrollTop = termOut.scrollHeight;
}
