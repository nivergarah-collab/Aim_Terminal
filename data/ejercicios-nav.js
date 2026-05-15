const ejerciciosNav = [
  // ──────────────────────────────────────────────
  // BLOQUE 1: Navegación y archivos básicos (10)
  // ──────────────────────────────────────────────
  {
    id: 1,
    premisa: 'El equipo de desarrollo necesita una estructura básica de proyecto. Tu tarea:\n1. Crea el directorio "proyecto".\n2. Dentro de "proyecto", crea los subdirectorios "src" y "docs".\n3. Dentro de "proyecto", crea el archivo "README.md".\n4. Lista el contenido de "proyecto" para verificar la estructura.',
    tematicas: ['Navegación y archivos básicos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear directorio proyecto', comandoSugerido: 'mkdir proyecto' },
      { descripcion: 'Crear subdirectorio src', comandoSugerido: 'mkdir proyecto/src' },
      { descripcion: 'Crear subdirectorio docs', comandoSugerido: 'mkdir proyecto/docs' },
      { descripcion: 'Crear archivo README.md', comandoSugerido: 'touch proyecto/README.md' },
      { descripcion: 'Listar contenido de proyecto', comandoSugerido: 'ls proyecto' }
    ],
    pistas: [
      'mkdir crea un directorio.',
      'touch crea un archivo vacío.',
      'ls lista el contenido de un directorio.'
    ],
    comandosUtiles: ['mkdir', 'touch', 'ls', 'cd', 'pwd']
  },

  {
    id: 2,
    premisa: 'Necesitas copiar y mover archivos de configuración entre directorios del sistema.',
    tematicas: ['Navegación y archivos básicos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/configs', owner: 'user-ec2', group: 'user-ec2', perms: '755' },
          { path: '/home/user-ec2/backup', owner: 'user-ec2', group: 'user-ec2', perms: '755' }
        ],
        files: [
          { path: '/home/user-ec2/configs/app.conf', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'host=localhost\nport=8080\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver el contenido de configs/', comandoSugerido: 'ls configs' },
      { descripcion: 'Copiar app.conf al directorio backup', comandoSugerido: 'cp configs/app.conf backup/app.conf' },
      { descripcion: 'Renombrar la copia como app.conf.bak', comandoSugerido: 'mv backup/app.conf backup/app.conf.bak' },
      { descripcion: 'Verificar que backup/ contiene el archivo', comandoSugerido: 'ls backup' }
    ],
    pistas: [
      'cp origen destino copia un archivo.',
      'mv sirve tanto para mover como para renombrar.',
      'ls directorio lista el contenido de ese directorio.'
    ],
    comandosUtiles: ['cp', 'mv', 'ls', 'cat']
  },

  {
    id: 3,
    premisa: 'Debes eliminar archivos temporales y directorios innecesarios para liberar espacio.',
    tematicas: ['Navegación y archivos básicos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/tmp', owner: 'user-ec2', group: 'user-ec2', perms: '755' },
          { path: '/home/user-ec2/tmp/cache', owner: 'user-ec2', group: 'user-ec2', perms: '755' }
        ],
        files: [
          { path: '/home/user-ec2/tmp/log1.txt', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'old log\n' },
          { path: '/home/user-ec2/tmp/log2.txt', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'old log\n' },
          { path: '/home/user-ec2/tmp/cache/data.bin', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'binary\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Listar archivos en tmp/', comandoSugerido: 'ls tmp' },
      { descripcion: 'Eliminar log1.txt', comandoSugerido: 'rm tmp/log1.txt' },
      { descripcion: 'Eliminar log2.txt', comandoSugerido: 'rm tmp/log2.txt' },
      { descripcion: 'Eliminar directorio cache y su contenido', comandoSugerido: 'rm -r tmp/cache' },
      { descripcion: 'Verificar que tmp/ está vacío', comandoSugerido: 'ls tmp' }
    ],
    pistas: [
      'rm elimina archivos.',
      'rm -r elimina directorios y su contenido recursivamente.',
      'Verifica con ls antes y después.'
    ],
    comandosUtiles: ['rm', 'ls', 'pwd']
  },

  {
    id: 4,
    premisa: 'Organiza tu directorio home creando una estructura de trabajo con enlaces simbólicos.',
    tematicas: ['Navegación y archivos básicos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/proyectos', owner: 'user-ec2', group: 'user-ec2', perms: '755' },
          { path: '/home/user-ec2/proyectos/web', owner: 'user-ec2', group: 'user-ec2', perms: '755' }
        ],
        files: [
          { path: '/home/user-ec2/proyectos/web/index.html', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '<h1>Home</h1>\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver el directorio de trabajo actual', comandoSugerido: 'pwd' },
      { descripcion: 'Crear enlace simbólico "web" apuntando a proyectos/web', comandoSugerido: 'ln -s proyectos/web web' },
      { descripcion: 'Listar archivos mostrando el enlace', comandoSugerido: 'ls -l' },
      { descripcion: 'Leer index.html a través del enlace', comandoSugerido: 'cat web/index.html' }
    ],
    pistas: [
      'pwd muestra el directorio actual.',
      'ln -s destino nombre crea un enlace simbólico.',
      'ls -l muestra los detalles incluyendo hacia dónde apunta el enlace.'
    ],
    comandosUtiles: ['ln', 'ls', 'pwd', 'cat']
  },

  {
    id: 5,
    premisa: 'Debes navegar por una estructura de directorios anidada y localizar archivos de configuración.',
    tematicas: ['Navegación y archivos básicos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/srv', owner: 'user-ec2', group: 'user-ec2', perms: '755' },
          { path: '/home/user-ec2/srv/app', owner: 'user-ec2', group: 'user-ec2', perms: '755' },
          { path: '/home/user-ec2/srv/app/conf', owner: 'user-ec2', group: 'user-ec2', perms: '755' }
        ],
        files: [
          { path: '/home/user-ec2/srv/app/conf/server.conf', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'listen=0.0.0.0:443\nworkers=4\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Entrar al directorio srv', comandoSugerido: 'cd srv' },
      { descripcion: 'Entrar al directorio app', comandoSugerido: 'cd app' },
      { descripcion: 'Entrar al directorio conf', comandoSugerido: 'cd conf' },
      { descripcion: 'Ver ruta actual', comandoSugerido: 'pwd' },
      { descripcion: 'Leer server.conf', comandoSugerido: 'cat server.conf' }
    ],
    pistas: [
      'cd directorio cambia al directorio indicado.',
      'pwd muestra la ruta completa actual.',
      'cat archivo muestra el contenido del archivo.'
    ],
    comandosUtiles: ['cd', 'pwd', 'cat', 'ls']
  },

  {
    id: 6,
    premisa: 'Crea una copia de seguridad completa de la carpeta de configuración antes de una actualización.',
    tematicas: ['Navegación y archivos básicos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/conf', owner: 'user-ec2', group: 'user-ec2', perms: '755' }
        ],
        files: [
          { path: '/home/user-ec2/conf/nginx.conf', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'server { listen 80; }\n' },
          { path: '/home/user-ec2/conf/php.ini', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'memory_limit=128M\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Listar contenido de conf/', comandoSugerido: 'ls conf' },
      { descripcion: 'Copiar la carpeta conf como conf.bak', comandoSugerido: 'cp -r conf conf.bak' },
      { descripcion: 'Verificar que conf.bak existe', comandoSugerido: 'ls' },
      { descripcion: 'Listar contenido de conf.bak/', comandoSugerido: 'ls conf.bak' }
    ],
    pistas: [
      'cp -r copia directorios recursivamente.',
      'ls sin argumento lista el directorio actual.',
      'Compara el contenido de ambas carpetas para confirmar la copia.'
    ],
    comandosUtiles: ['cp', 'ls', 'pwd']
  },

  {
    id: 7,
    premisa: 'Reorganiza los archivos de log de un servidor moviéndolos a un directorio de archivo histórico.',
    tematicas: ['Navegación y archivos básicos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/logs', owner: 'user-ec2', group: 'user-ec2', perms: '755' },
          { path: '/home/user-ec2/archive', owner: 'user-ec2', group: 'user-ec2', perms: '755' }
        ],
        files: [
          { path: '/home/user-ec2/logs/access.log', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '192.168.1.1 GET /\n' },
          { path: '/home/user-ec2/logs/error.log', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '[ERROR] segfault\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Listar logs disponibles', comandoSugerido: 'ls logs' },
      { descripcion: 'Mover access.log a archive/', comandoSugerido: 'mv logs/access.log archive/access.log' },
      { descripcion: 'Mover error.log a archive/', comandoSugerido: 'mv logs/error.log archive/error.log' },
      { descripcion: 'Verificar que archive/ contiene los logs', comandoSugerido: 'ls archive' }
    ],
    pistas: [
      'mv mueve o renombra archivos.',
      'Para mover a otro directorio: mv origen directorio/archivo.',
      'Verifica el resultado con ls.'
    ],
    comandosUtiles: ['mv', 'ls', 'cd']
  },

  {
    id: 8,
    premisa: 'Debes explorar la estructura del sistema de archivos y confirmar rutas absolutas y relativas.',
    tematicas: ['Navegación y archivos básicos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/workspace', owner: 'user-ec2', group: 'user-ec2', perms: '755' },
          { path: '/home/user-ec2/workspace/src', owner: 'user-ec2', group: 'user-ec2', perms: '755' }
        ],
        files: [
          { path: '/home/user-ec2/workspace/src/main.py', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'print("hello")\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Mostrar directorio actual', comandoSugerido: 'pwd' },
      { descripcion: 'Listar workspace con detalle', comandoSugerido: 'ls -l workspace' },
      { descripcion: 'Entrar a workspace/src', comandoSugerido: 'cd workspace/src' },
      { descripcion: 'Mostrar ruta completa actual', comandoSugerido: 'pwd' },
      { descripcion: 'Volver al home', comandoSugerido: 'cd /home/user-ec2' }
    ],
    pistas: [
      'pwd muestra la ruta absoluta actual.',
      'ls -l muestra permisos, propietario y tamaño.',
      'cd /ruta/absoluta va a esa ruta directamente.'
    ],
    comandosUtiles: ['pwd', 'ls', 'cd']
  },

  {
    id: 9,
    premisa: 'Prepara el entorno de un nuevo desarrollador creando su estructura de directorios de trabajo.',
    tematicas: ['Navegación y archivos básicos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear directorio dev', comandoSugerido: 'mkdir dev' },
      { descripcion: 'Crear directorio dev/proyectos', comandoSugerido: 'mkdir dev/proyectos' },
      { descripcion: 'Crear directorio dev/scripts', comandoSugerido: 'mkdir dev/scripts' },
      { descripcion: 'Crear archivo dev/notas.txt', comandoSugerido: 'touch dev/notas.txt' },
      { descripcion: 'Ver la estructura creada', comandoSugerido: 'ls dev' }
    ],
    pistas: [
      'mkdir crea directorios.',
      'touch crea archivos vacíos.',
      'ls lista lo que hay en un directorio.'
    ],
    comandosUtiles: ['mkdir', 'touch', 'ls']
  },

  {
    id: 10,
    premisa: 'Debes verificar y documentar la ubicación de archivos críticos del sistema.',
    tematicas: ['Navegación y archivos básicos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/docs', owner: 'user-ec2', group: 'user-ec2', perms: '755' }
        ],
        files: [
          { path: '/home/user-ec2/docs/informe.txt', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'Informe del sistema\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Entrar al directorio docs', comandoSugerido: 'cd docs' },
      { descripcion: 'Ver ruta actual', comandoSugerido: 'pwd' },
      { descripcion: 'Leer el archivo informe.txt', comandoSugerido: 'cat informe.txt' },
      { descripcion: 'Crear copia informe.bak', comandoSugerido: 'cp informe.txt informe.bak' },
      { descripcion: 'Listar archivos en docs/', comandoSugerido: 'ls' }
    ],
    pistas: [
      'cd cambia de directorio.',
      'cat muestra el contenido del archivo.',
      'cp origen destino copia un archivo.'
    ],
    comandosUtiles: ['cd', 'pwd', 'cat', 'cp', 'ls']
  }
];
