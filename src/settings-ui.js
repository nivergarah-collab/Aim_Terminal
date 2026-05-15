// La definición de temáticas vive en settings.js (mapaTemáticas), única fuente de verdad.

// ── Helpers de toggle ─────────────────────────────────────────

function setToggleStyle(track, dot, checked) {
  track.className = `block ${checked ? 'bg-primary-container' : 'bg-surface-container-highest border border-outline-variant'} w-10 h-6 rounded-full`;
  dot.className   = `dot absolute left-1 top-1 ${checked ? 'bg-surface-container-lowest translate-x-4' : 'bg-on-surface-variant'} w-4 h-4 rounded-full transition transform`;
}

function _syncCardVisual(card, checked) {
  const body = card.querySelector('[data-role="body"]');
  const list = card.querySelector('[data-role="list"]');
  if (body) body.classList.toggle('opacity-60', !checked);
  if (list) {
    list.classList.toggle('text-on-surface', checked);
    list.classList.toggle('text-on-surface-variant', !checked);
  }
}

// ── Tabs ──────────────────────────────────────────────────────

function showTab(tab) {
  document.getElementById('panel-usuario').classList.toggle('hidden', tab !== 'usuario');
  document.getElementById('panel-tematicas').classList.toggle('hidden', tab !== 'tematicas');
  document.querySelectorAll('.settings-tab').forEach(btn => {
    btn.classList.remove('bg-surface-container-high', 'text-primary-container', 'shadow-[inset_2px_0_0_0_#2ecc71]');
    btn.classList.add('text-on-surface-variant');
  });
  const active = document.getElementById('tab-' + tab);
  active.classList.remove('text-on-surface-variant');
  active.classList.add('bg-surface-container-high', 'text-primary-container', 'shadow-[inset_2px_0_0_0_#2ecc71]');
}

// ── Toast de conteo ───────────────────────────────────────────

let _toastTimer = null;

function countAvailableExercises() {
  const lista = (typeof listaEjercicios !== 'undefined' ? listaEjercicios : [])
    .filter(ej => !ej.esLeccion);

  if (AppSettings.getFiltroRestrictivo()) {
    const selected = AppSettings.getSelectedComandos();
    if (selected === null) return lista.length;
    return lista.filter(ej =>
      ej.comandosUtiles?.length && ej.comandosUtiles.every(c => selected.has(c))
    ).length;
  }

  const activeTemas = AppSettings.getActiveTematicas();
  if (activeTemas === null) return lista.length;
  return lista.filter(ej =>
    !ej.tematicas?.length || ej.tematicas.some(t => activeTemas.has(t))
  ).length;
}

function showExerciseCountToast() {
  const toast   = document.getElementById('exercise-toast');
  const countEl = document.getElementById('exercise-toast-count');
  if (!toast || !countEl) return;

  const n = countAvailableExercises();
  countEl.textContent = n === 1 ? '1 ejercicio' : `${n} ejercicios`;

  toast.classList.remove('-translate-y-4', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    toast.classList.add('-translate-y-4', 'opacity-0', 'pointer-events-none');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 2500);
}

// ── Persistencia ──────────────────────────────────────────────

function saveAll() {
  const cmdState = {};
  document.querySelectorAll('.cmd-check').forEach(cb => { cmdState[cb.dataset.cmd] = cb.checked; });
  AppSettings.setComandos(cmdState);
  showExerciseCountToast();
}

// ── Construcción de cards ─────────────────────────────────────

function _buildTematicaCard(tema, cfg, saved) {
  const allChecked  = cfg.comandos.every(c => saved[c] !== false);
  const listMultiCol = cfg.wide || cfg.multiCol;

  const card = document.createElement('div');
  card.className = 'bg-surface border border-outline-variant rounded-xl overflow-hidden flex flex-col'
    + (cfg.highlight ? ' shadow-[0_0_15px_rgba(46,204,113,0.05)] relative' : '')
    + (cfg.wide      ? ' xl:col-span-2' : '');

  card.innerHTML = `
    ${cfg.highlight ? '<div class="absolute top-0 left-0 w-full h-1 bg-primary-container"></div>' : ''}
    <div class="p-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
      <div class="flex items-center gap-sm">
        <span class="material-symbols-outlined ${cfg.iconColor}">${cfg.icon}</span>
        <h3 class="font-headline-md text-on-surface text-lg">${tema}</h3>
      </div>
      <label class="flex items-center cursor-pointer" data-tema="${tema}">
        <div class="relative">
          <input type="checkbox" class="sr-only tema-check" data-tema="${tema}" ${allChecked ? 'checked' : ''} />
          <div class="block ${allChecked ? 'bg-primary-container' : 'bg-surface-container-highest border border-outline-variant'} w-10 h-6 rounded-full" data-role="track"></div>
          <div class="dot absolute left-1 top-1 ${allChecked ? 'bg-surface-container-lowest translate-x-4' : 'bg-on-surface-variant'} w-4 h-4 rounded-full transition transform" data-role="dot"></div>
        </div>
      </label>
    </div>
    <div class="p-md bg-surface flex-1 ${allChecked ? '' : 'opacity-60'}" data-role="body">
      <ul class="space-y-sm font-code-block text-code-block ${allChecked ? 'text-on-surface' : 'text-on-surface-variant'} ${listMultiCol ? 'grid grid-cols-2 sm:grid-cols-4 gap-x-md space-y-0 gap-y-sm' : ''}" data-role="list">
        ${cfg.comandos.map(cmd => {
          const checked = saved[cmd] !== false;
          return `<li class="flex items-center gap-sm">
            <input type="checkbox" class="form-checkbox bg-surface-container border-outline-variant text-primary-container rounded-sm focus:ring-primary-container focus:ring-offset-surface cmd-check" data-cmd="${cmd}" data-tema="${tema}" ${checked ? 'checked' : ''} />
            <span>${cmd}</span>
          </li>`;
        }).join('')}
      </ul>
    </div>`;

  return card;
}

function _wireTematicaCard(card) {
  const temaInput = card.querySelector('.tema-check');
  const trackEl   = card.querySelector('[data-role="track"]');
  const dotEl     = card.querySelector('[data-role="dot"]');
  const cmdInputs = card.querySelectorAll('.cmd-check');

  temaInput.addEventListener('change', () => {
    const checked = temaInput.checked;
    cmdInputs.forEach(cb => { cb.checked = checked; });
    setToggleStyle(trackEl, dotEl, checked);
    _syncCardVisual(card, checked);
    saveAll();
    syncMarcarTodo();
  });

  cmdInputs.forEach(cb => {
    cb.addEventListener('change', () => {
      const allOn = Array.from(cmdInputs).every(c => c.checked);
      temaInput.checked = allOn;
      setToggleStyle(trackEl, dotEl, allOn);
      _syncCardVisual(card, allOn);
      saveAll();
      syncMarcarTodo();
    });
  });
}

function buildSettings() {
  const grid  = document.getElementById('tematicas-grid');
  const saved = AppSettings.getComandos();
  Object.entries(mapaTemáticas).forEach(([tema, cfg]) => {
    const card = _buildTematicaCard(tema, cfg, saved);
    _wireTematicaCard(card);
    grid.appendChild(card);
  });
}

// ── Marcar todo ───────────────────────────────────────────────

function syncMarcarTodo() {
  const marcarInput = document.getElementById('toggle-marcar-todo');
  const marcarTrack = document.getElementById('marcar-track');
  const marcarDot   = document.getElementById('marcar-dot');
  if (!marcarInput) return;
  const allOn = Array.from(document.querySelectorAll('.cmd-check')).every(c => c.checked);
  marcarInput.checked = allOn;
  setToggleStyle(marcarTrack, marcarDot, allOn);
}

// ── Wiring del DOM ────────────────────────────────────────────

function _wireTabNav() {
  document.getElementById('tab-usuario').addEventListener('click',   () => showTab('usuario'));
  document.getElementById('tab-tematicas').addEventListener('click', () => showTab('tematicas'));
}

function _wireMarcarTodo() {
  const marcarInput = document.getElementById('toggle-marcar-todo');
  const marcarTrack = document.getElementById('marcar-track');
  const marcarDot   = document.getElementById('marcar-dot');
  if (!marcarInput) return;

  syncMarcarTodo();
  marcarInput.addEventListener('change', () => {
    const checked = marcarInput.checked;
    setToggleStyle(marcarTrack, marcarDot, checked);
    document.querySelectorAll('.cmd-check').forEach(cb => { cb.checked = checked; });
    document.querySelectorAll('.tema-check').forEach(cb => {
      cb.checked = checked;
      const wrap = cb.closest('.relative');
      const card = cb.closest('.overflow-hidden');
      if (wrap) setToggleStyle(wrap.querySelector('[data-role="track"]'), wrap.querySelector('[data-role="dot"]'), checked);
      if (card) _syncCardVisual(card, checked);
    });
    saveAll();
  });
}

function _wireFiltroRestrictivo() {
  const filtroInput = document.getElementById('toggle-filtro-restrictivo');
  const filtroTrack = document.getElementById('filtro-track');
  const filtroDot   = document.getElementById('filtro-dot');
  if (!filtroInput) return;

  filtroInput.checked = AppSettings.getFiltroRestrictivo();
  setToggleStyle(filtroTrack, filtroDot, filtroInput.checked);
  filtroInput.addEventListener('change', () => {
    AppSettings.setFiltroRestrictivo(filtroInput.checked);
    setToggleStyle(filtroTrack, filtroDot, filtroInput.checked);
    showExerciseCountToast();
  });
}

function _wireSaveButton() {
  const btnSave = document.getElementById('btn-save-settings');
  btnSave.addEventListener('click', () => {
    saveAll();
    btnSave.textContent = '✓ GUARDADO';
    btnSave.classList.add('bg-primary', 'text-on-primary');
    setTimeout(() => {
      btnSave.innerHTML = '<span class="material-symbols-outlined text-sm">save</span> GUARDAR CONFIGURACIÓN';
      btnSave.classList.remove('bg-primary', 'text-on-primary');
    }, 1500);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  _wireTabNav();
  buildSettings();
  _wireMarcarTodo();
  _wireFiltroRestrictivo();
  _wireSaveButton();
});
