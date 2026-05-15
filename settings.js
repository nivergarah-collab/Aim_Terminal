// ============================================================
// SETTINGS — Persistencia en localStorage
// ============================================================

const STORAGE_KEY_TEMATICAS  = 'tat_tematicas';
const STORAGE_KEY_COMANDOS   = 'tat_comandos';
const STORAGE_KEY_EJERCICIO  = 'tat_ejercicio_actual';
const STORAGE_KEY_FILTRO     = 'tat_filtro_restrictivo';

const mapaTemáticas = {
  'Navegación y archivos básicos': {
    icon: 'folder_open', iconColor: 'text-secondary',
    comandos: ['ls', 'cd', 'pwd', 'mkdir', 'rm', 'cp', 'mv', 'touch', 'ln']
  },
  'Permisos': {
    icon: 'admin_panel_settings', iconColor: 'text-primary-container', highlight: true,
    comandos: ['chmod', 'chown', 'chgrp', 'umask']
  },
  'Administración de usuarios y grupos': {
    icon: 'group', iconColor: 'text-secondary',
    comandos: ['useradd', 'userdel', 'usermod', 'groupadd', 'groupdel', 'passwd', 'su', 'sudo', 'who', 'w']
  },
  'Manipulación avanzada de archivos': {
    icon: 'description', iconColor: 'text-secondary',
    comandos: ['find', 'grep', 'sed', 'awk', 'head', 'tail', 'wc', 'sort', 'uniq', 'cut', 'cat', 'echo']
  },
  'Compresión y archivos': {
    icon: 'folder_zip', iconColor: 'text-secondary',
    comandos: ['tar', 'gzip', 'gunzip', 'zip', 'unzip']
  },
  'Información del sistema y procesos': {
    icon: 'memory', iconColor: 'text-secondary',
    comandos: ['ps', 'top', 'kill', 'killall', 'df', 'du', 'free', 'uptime', 'uname', 'history', 'watch']
  },
  'Variables de entorno y redirección': {
    icon: 'code', iconColor: 'text-secondary',
    comandos: ['export', 'env', 'tee', 'xargs']
  },
  'Redes básicas': {
    icon: 'lan', iconColor: 'text-secondary', wide: true,
    comandos: ['ping', 'ifconfig', 'netstat', 'curl', 'wget', 'ssh', 'firewall-cmd']
  },
  'Servicios y automatización': {
    icon: 'schedule', iconColor: 'text-secondary', multiCol: true,
    comandos: ['systemctl', 'start', 'stop', 'restart', 'enable', 'disable', 'status', 'watch', 'yum', 'crontab']
  },
  'Gestión de discos y almacenamiento': {
    icon: 'storage', iconColor: 'text-secondary',
    comandos: ['lsblk', 'mount', 'umount', 'mkfs', 'fdisk', 'mountpoint']
  }
};

const AppSettings = {
  getTematicas() {
    const raw = localStorage.getItem(STORAGE_KEY_TEMATICAS);
    return raw ? JSON.parse(raw) : {};
  },
  setTematicas(data) {
    localStorage.setItem(STORAGE_KEY_TEMATICAS, JSON.stringify(data));
  },
  getComandos() {
    const raw = localStorage.getItem(STORAGE_KEY_COMANDOS);
    return raw ? JSON.parse(raw) : {};
  },
  setComandos(data) {
    localStorage.setItem(STORAGE_KEY_COMANDOS, JSON.stringify(data));
  },
  guardarEjercicioActual(estado) {
    localStorage.setItem(STORAGE_KEY_EJERCICIO, JSON.stringify(estado));
  },
  recuperarEjercicioActual() {
    const raw = localStorage.getItem(STORAGE_KEY_EJERCICIO);
    return raw ? JSON.parse(raw) : null;
  },
  limpiarEjercicioGuardado() {
    localStorage.removeItem(STORAGE_KEY_EJERCICIO);
  },
  getFiltroRestrictivo() {
    return localStorage.getItem(STORAGE_KEY_FILTRO) === 'true';
  },
  setFiltroRestrictivo(val) {
    localStorage.setItem(STORAGE_KEY_FILTRO, val ? 'true' : 'false');
  },
  // Devuelve Set con los comandos habilitados, o null si no hay preferencias guardadas.
  getSelectedComandos() {
    const saved = this.getComandos();
    if (!Object.keys(saved).length) return null;
    return new Set(Object.entries(saved).filter(([, v]) => v !== false).map(([k]) => k));
  },
  // Devuelve Set con las temáticas activas, o null si no hay preferencias guardadas (→ mostrar todo).
  getActiveTematicas() {
    const saved = this.getComandos();
    if (!Object.keys(saved).length) return null;
    return new Set(
      Object.entries(mapaTemáticas)
        .filter(([, cfg]) => cfg.comandos.some(c => saved[c] !== false))
        .map(([tema]) => tema)
    );
  }
};
