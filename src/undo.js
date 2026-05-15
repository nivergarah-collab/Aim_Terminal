// ============================================================
// UNDO / REDO — Snapshots completos con índice de paso
// ============================================================

const MAX_UNDO  = 50;
let undoStack   = [];
let redoStack   = [];

function _fullSnapshot() {
  const parsed = JSON.parse(snapshotState());
  parsed._stepIndex = currentStepIndex;
  return JSON.stringify(parsed);
}

function _fullRestore(snap) {
  const parsed   = JSON.parse(snap);
  const stepIdx  = parsed._stepIndex ?? currentStepIndex;
  delete parsed._stepIndex;
  restoreState(JSON.stringify(parsed));
  currentStepIndex = stepIdx;
  updateStepDisplay();
  const badge = document.getElementById('step-complete');
  if (badge) {
    const done = currentExercise && currentStepIndex >= currentExercise.pasos.length;
    badge.classList.toggle('hidden', !done);
  }
  updateCurrentStepHint();
}

function _wireUndoRedo() {
  const _applyUndoRedo = (label) => {
    renderTerminalInitial();
    const out = document.getElementById('terminal-output');
    if (out) appendLine(out, 'suggest', label);
    updatePromptLabel();
    syncUndoButtons();
  };

  document.getElementById('btn-undo')?.addEventListener('click', () => {
    if (!undoStack.length) return;
    redoStack.push(_fullSnapshot());
    _fullRestore(undoStack.pop());
    _applyUndoRedo('← undo: sistema restaurado al estado anterior');
  });

  document.getElementById('btn-redo')?.addEventListener('click', () => {
    if (!redoStack.length) return;
    undoStack.push(_fullSnapshot());
    _fullRestore(redoStack.pop());
    _applyUndoRedo('→ redo: sistema restaurado al estado siguiente');
  });

  syncUndoButtons();
}
