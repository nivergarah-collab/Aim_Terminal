// ============================================================
// NANO — Editor de texto modal con atajos Ctrl+O/X/K/U/W/C/G
// ============================================================

let _nanoPath      = '';
let _nanoReadOnly  = false;
let _nanoModified  = false;
let _nanoSavedCmd  = '';
let _nanoCutBuffer = '';
let _nanoSnapBefore = null;

function openNanoEditor({ path, content, isNew, readOnly }) {
  _nanoPath      = path;
  _nanoReadOnly  = readOnly;
  _nanoModified  = false;
  _nanoCutBuffer = '';
  _nanoSnapBefore = _fullSnapshot();

  const overlay   = document.getElementById('nano-overlay');
  const textarea  = document.getElementById('nano-textarea');
  const filenameEl = document.getElementById('nano-filename');
  const modifiedEl = document.getElementById('nano-modified');
  const statusEl  = document.getElementById('nano-status');

  const shortName = path.split('/').pop();
  filenameEl.textContent = shortName + (isNew ? ' [Nuevo]' : '');
  modifiedEl.textContent = '';
  statusEl.textContent   = '';
  textarea.value         = content;
  textarea.readOnly      = readOnly;

  overlay.classList.remove('hidden');
  textarea.focus();
  textarea.setSelectionRange(0, 0);

  const termInput = document.getElementById('terminal-input');
  if (termInput) termInput.disabled = true;
}

function _nanoSave() {
  if (_nanoReadOnly) return false;
  const textarea = document.getElementById('nano-textarea');
  const content  = textarea.value;
  const lines    = content === '' ? 0 : content.split('\n').length;
  vfs.writeFile(_nanoPath, content, false, termState.cwd, vusers.currentHome(), vusers.currentUser().username, vusers.currentGroups());
  _nanoModified = false;
  document.getElementById('nano-modified').textContent = '';
  _showNanoStatus(`Escrito ${lines} línea${lines !== 1 ? 's' : ''}.`);
  return true;
}

function _showNanoStatus(msg) {
  const el = document.getElementById('nano-status');
  el.textContent = msg;
  setTimeout(() => { if (el.textContent === msg) el.textContent = ''; }, 2500);
}

function _closeNano(saved) {
  const overlay   = document.getElementById('nano-overlay');
  const termInput = document.getElementById('terminal-input');
  const termOut   = document.getElementById('terminal-output');

  overlay.classList.add('hidden');
  if (termInput) { termInput.disabled = false; termInput.focus(); }

  if (saved) {
    const snapAfter = _fullSnapshot();
    if (_nanoSnapBefore && snapAfter !== _nanoSnapBefore) {
      undoStack.push(_nanoSnapBefore);
      if (undoStack.length > MAX_UNDO) undoStack.shift();
      redoStack = [];
      syncUndoButtons();
    }
    checkStepProgress(_nanoSavedCmd);
  }

  updatePromptLabel();
}

function _nanoPromptWriteOut() {
  const textarea  = document.getElementById('nano-textarea');
  const statusEl  = document.getElementById('nano-status');
  const shortName = _nanoPath.split('/').pop();
  let   nameBuf   = shortName;

  const render = () => {
    statusEl.textContent = `File Name to Write: ${nameBuf}`;
  };
  render();

  const handler = ev => {
    if ((ev.ctrlKey && ev.key.toLowerCase() === 'c') || ev.key === 'Escape') {
      ev.preventDefault();
      textarea.removeEventListener('keydown', handler);
      statusEl.textContent = '';
      textarea.focus();
      return;
    }
    if (ev.key === 'Enter') {
      ev.preventDefault();
      textarea.removeEventListener('keydown', handler);
      if (nameBuf.trim()) {
        if (nameBuf !== shortName) {
          const dir = _nanoPath.slice(0, _nanoPath.lastIndexOf('/') + 1);
          _nanoPath = dir + nameBuf.trim();
          document.getElementById('nano-filename').textContent = nameBuf.trim();
        }
        _nanoSave();
      } else {
        statusEl.textContent = '';
      }
      textarea.focus();
      return;
    }
    if (ev.key === 'Backspace') {
      ev.preventDefault();
      nameBuf = nameBuf.slice(0, -1);
      render();
      return;
    }
    if (ev.key.length === 1 && !ev.ctrlKey && !ev.metaKey) {
      ev.preventDefault();
      nameBuf += ev.key;
      render();
    }
  };

  textarea.addEventListener('keydown', handler);
}

function _wireNano() {
  const textarea  = document.getElementById('nano-textarea');
  const statusEl  = document.getElementById('nano-status');
  const modifiedEl = document.getElementById('nano-modified');
  if (!textarea) return;

  textarea.addEventListener('input', () => {
    if (!_nanoModified) {
      _nanoModified = true;
      modifiedEl.textContent = '[Modificado]';
    }
  });

  textarea.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 's') { e.preventDefault(); return; }

    if (!e.ctrlKey) return;
    e.preventDefault();

    switch (e.key.toLowerCase()) {
      case 'o': {
        if (_nanoReadOnly) { _showNanoStatus('Modo solo lectura — no se puede guardar.'); break; }
        _nanoPromptWriteOut();
        break;
      }
      case 'x': {
        if (_nanoModified) {
          statusEl.textContent = '¿Guardar buffer modificado? [S=Sí / N=No / C=Cancelar]';
          const handler = ev => {
            const k = ev.key.toLowerCase();
            if (k === 's') { _nanoSave(); textarea.removeEventListener('keydown', handler); _closeNano(true); }
            else if (k === 'n') { textarea.removeEventListener('keydown', handler); _closeNano(false); }
            else if (k === 'c') { textarea.removeEventListener('keydown', handler); statusEl.textContent = ''; }
            ev.preventDefault();
          };
          textarea.addEventListener('keydown', handler);
        } else {
          _closeNano(false);
        }
        break;
      }
      case 'k': {
        const start = textarea.selectionStart;
        const text  = textarea.value;
        const lineStart = text.lastIndexOf('\n', start - 1) + 1;
        const lineEnd   = text.indexOf('\n', start);
        const end = lineEnd === -1 ? text.length : lineEnd + 1;
        _nanoCutBuffer = text.slice(lineStart, end);
        textarea.value = text.slice(0, lineStart) + text.slice(end);
        textarea.setSelectionRange(lineStart, lineStart);
        if (!_nanoModified) { _nanoModified = true; modifiedEl.textContent = '[Modificado]'; }
        break;
      }
      case 'u': {
        if (!_nanoCutBuffer) break;
        const pos  = textarea.selectionStart;
        const text = textarea.value;
        textarea.value = text.slice(0, pos) + _nanoCutBuffer + text.slice(pos);
        textarea.setSelectionRange(pos + _nanoCutBuffer.length, pos + _nanoCutBuffer.length);
        if (!_nanoModified) { _nanoModified = true; modifiedEl.textContent = '[Modificado]'; }
        break;
      }
      case 'c': {
        const pos   = textarea.selectionStart;
        const text  = textarea.value;
        const lines = text.slice(0, pos).split('\n');
        const line  = lines.length;
        const col   = lines[lines.length - 1].length + 1;
        _showNanoStatus(`línea ${line}, col ${col}  (${pos} caracteres desde el inicio)`);
        break;
      }
      case 'w': {
        const query = prompt('Buscar:');
        if (!query) break;
        const idx = textarea.value.indexOf(query, textarea.selectionStart);
        if (idx !== -1) {
          textarea.setSelectionRange(idx, idx + query.length);
          textarea.focus();
          _showNanoStatus(`Encontrado: "${query}"`);
        } else {
          _showNanoStatus(`No encontrado: "${query}"`);
        }
        break;
      }
      case 'g': {
        _showNanoStatus('^O Guardar  ^X Salir  ^K Cortar  ^U Pegar  ^W Buscar  ^C Posición');
        break;
      }
    }
  });
}
