const ejerciciosInfo = [
  // ──────────────────────────────────────────────
  // BLOQUE 6: Información del sistema y procesos (6)
  // ──────────────────────────────────────────────
  {
    id: 41,
    premisa: 'Investiga el estado de un servidor en producción para un informe de rendimiento.',
    tematicas: ['Información del sistema y procesos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver el kernel y versión del sistema', comandoSugerido: 'uname -a' },
      { descripcion: 'Ver el tiempo de actividad del sistema', comandoSugerido: 'uptime' },
      { descripcion: 'Ver el uso de memoria RAM', comandoSugerido: 'free -h' },
      { descripcion: 'Ver el espacio en disco', comandoSugerido: 'df -h' }
    ],
    pistas: [
      'uname -a muestra toda la información del kernel.',
      'free -h muestra RAM en formato humano.',
      'df -h muestra espacio en disco en formato legible.'
    ],
    comandosUtiles: ['uname', 'uptime', 'free', 'df']
  },

  {
    id: 42,
    premisa: 'Identifica procesos que consumen demasiados recursos en el sistema.',
    tematicas: ['Información del sistema y procesos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver todos los procesos del sistema', comandoSugerido: 'ps aux' },
      { descripcion: 'Ver los procesos del usuario actual', comandoSugerido: 'ps -u user-ec2' },
      { descripcion: 'Ver uso de disco por directorio home', comandoSugerido: 'du -sh /home/user-ec2' }
    ],
    pistas: [
      'ps aux muestra todos los procesos.',
      'ps -u usuario filtra por usuario.',
      'du -sh muestra uso de disco resumido.'
    ],
    comandosUtiles: ['ps', 'du', 'df', 'free']
  },

  {
    id: 43,
    premisa: 'Revisa el historial de comandos para auditar las acciones realizadas en el servidor.',
    tematicas: ['Información del sistema y procesos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver el historial de comandos', comandoSugerido: 'history' },
      { descripcion: 'Ver la versión del sistema operativo', comandoSugerido: 'uname -r' },
      { descripcion: 'Ver el tiempo encendido del sistema', comandoSugerido: 'uptime' }
    ],
    pistas: [
      'history muestra los comandos ejecutados anteriormente.',
      'uname -r muestra solo la versión del kernel.',
      'uptime muestra el tiempo desde el arranque.'
    ],
    comandosUtiles: ['history', 'uname', 'uptime']
  },

  {
    id: 44,
    premisa: 'Monitorea el espacio en disco y detecta directorios que usan más espacio.',
    tematicas: ['Información del sistema y procesos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/data', owner: 'user-ec2', group: 'user-ec2', perms: '755' },
          { path: '/home/user-ec2/logs', owner: 'user-ec2', group: 'user-ec2', perms: '755' }
        ],
        files: [
          { path: '/home/user-ec2/data/file1.dat', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'datos\n' },
          { path: '/home/user-ec2/logs/app.log', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'logs\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver uso de disco de todos los sistemas de archivos', comandoSugerido: 'df -h' },
      { descripcion: 'Ver tamaño de data/', comandoSugerido: 'du -sh data' },
      { descripcion: 'Ver tamaño de logs/', comandoSugerido: 'du -sh logs' },
      { descripcion: 'Ver tamaño de cada directorio', comandoSugerido: 'du -sh data logs' }
    ],
    pistas: [
      'df -h muestra espacio libre y usado por partición.',
      'du -sh directorio muestra tamaño resumido.',
      'du -sh * muestra tamaño de todo en el directorio actual.'
    ],
    comandosUtiles: ['df', 'du', 'ls']
  },

  {
    id: 45,
    premisa: 'Verifica la información de kernel y arquitectura antes de instalar software.',
    tematicas: ['Información del sistema y procesos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver información completa del sistema', comandoSugerido: 'uname -a' },
      { descripcion: 'Ver solo la arquitectura', comandoSugerido: 'uname -m' },
      { descripcion: 'Ver memoria disponible', comandoSugerido: 'free' },
      { descripcion: 'Ver procesos activos', comandoSugerido: 'ps' }
    ],
    pistas: [
      'uname -m muestra la arquitectura (x86_64, arm64, etc.).',
      'uname -a muestra todo: kernel, hostname, versión.',
      'free muestra estadísticas de memoria.'
    ],
    comandosUtiles: ['uname', 'free', 'ps', 'uptime']
  },

  {
    id: 46,
    premisa: 'Termina un proceso que está consumiendo demasiada CPU. Localiza el proceso con ps y usa kill con el PID 1234 para terminarlo.',
    tematicas: ['Información del sistema y procesos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver todos los procesos activos', comandoSugerido: 'ps aux' },
      { descripcion: 'Ver los procesos del usuario actual', comandoSugerido: 'ps -u user-ec2' },
      { descripcion: 'Enviar señal SIGTERM al proceso 1234', comandoSugerido: 'kill 1234' }
    ],
    pistas: [
      'ps aux muestra PID, CPU, MEM de todos los procesos.',
      'kill PID envía SIGTERM (terminación suave).',
      'kill -9 PID fuerza la terminación inmediata.'
    ],
    comandosUtiles: ['ps', 'kill']
  }
];
