const ejerciciosCompresion = [
  // ──────────────────────────────────────────────
  // BLOQUE 5: Compresión y archivos (6)
  // ──────────────────────────────────────────────
  {
    id: 35,
    premisa: 'Empaqueta y comprime el directorio de un proyecto para enviarlo a otro servidor.',
    tematicas: ['Compresión y archivos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/proyecto', owner: 'user-ec2', group: 'user-ec2', perms: '755' },
          { path: '/home/user-ec2/proyecto/src', owner: 'user-ec2', group: 'user-ec2', perms: '755' }
        ],
        files: [
          { path: '/home/user-ec2/proyecto/README.md', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '# Proyecto\n' },
          { path: '/home/user-ec2/proyecto/src/main.py', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'print("hello")\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver contenido de proyecto/', comandoSugerido: 'ls proyecto' },
      { descripcion: 'Crear archivo tar comprimido con gzip', comandoSugerido: 'tar -czf proyecto.tar.gz proyecto' },
      { descripcion: 'Ver el archivo creado', comandoSugerido: 'ls -lh' },
      { descripcion: 'Listar contenido del tar sin extraer', comandoSugerido: 'tar -tzf proyecto.tar.gz' }
    ],
    pistas: [
      'tar -czf archivo.tar.gz directorio crea un tar comprimido con gzip.',
      'c=crear, z=gzip, f=nombre del archivo.',
      'tar -tzf lista el contenido sin extraer.'
    ],
    comandosUtiles: ['tar', 'ls']
  },

  {
    id: 36,
    premisa: 'Extrae un paquete de software descargado para instalarlo.',
    tematicas: ['Compresión y archivos'],
    estadoInicial: {
      fs: {
        dirs: [],
        files: [
          { path: '/home/user-ec2/app.tar.gz', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Listar archivos disponibles', comandoSugerido: 'ls' },
      { descripcion: 'Extraer app.tar.gz en el directorio actual', comandoSugerido: 'tar -xzf app.tar.gz' },
      { descripcion: 'Ver los archivos después de extraer', comandoSugerido: 'ls' }
    ],
    pistas: [
      'tar -xzf extrae un archivo tar comprimido con gzip.',
      'x=extraer, z=gzip, f=nombre del archivo.',
      'tar -xzf archivo -C destino extrae en otro directorio.'
    ],
    comandosUtiles: ['tar', 'ls']
  },

  {
    id: 37,
    premisa: 'Comprime archivos de log individuales para ahorrar espacio en disco.',
    tematicas: ['Compresión y archivos'],
    estadoInicial: {
      fs: {
        dirs: [],
        files: [
          { path: '/home/user-ec2/server.log', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'muchos logs aqui\n' },
          { path: '/home/user-ec2/access.log', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'accesos del dia\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver archivos antes de comprimir', comandoSugerido: 'ls -l' },
      { descripcion: 'Comprimir server.log con gzip', comandoSugerido: 'gzip server.log' },
      { descripcion: 'Comprimir access.log con gzip', comandoSugerido: 'gzip access.log' },
      { descripcion: 'Ver archivos después de comprimir', comandoSugerido: 'ls -l' }
    ],
    pistas: [
      'gzip archivo comprime el archivo y lo reemplaza por archivo.gz.',
      'El archivo original se elimina tras comprimir.',
      'gzip -k mantiene el archivo original.'
    ],
    comandosUtiles: ['gzip', 'ls']
  },

  {
    id: 38,
    premisa: 'Descomprime un archivo de configuración para editarlo.',
    tematicas: ['Compresión y archivos'],
    estadoInicial: {
      fs: {
        dirs: [],
        files: [
          { path: '/home/user-ec2/nginx.conf.gz', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver archivos disponibles', comandoSugerido: 'ls' },
      { descripcion: 'Descomprimir nginx.conf.gz', comandoSugerido: 'gunzip nginx.conf.gz' },
      { descripcion: 'Verificar que se creó nginx.conf', comandoSugerido: 'ls' }
    ],
    pistas: [
      'gunzip archivo.gz descomprime el archivo.',
      'El archivo .gz se elimina y queda el original.',
      'gzip -d también descomprime.'
    ],
    comandosUtiles: ['gunzip', 'gzip', 'ls']
  },

  {
    id: 39,
    premisa: 'Crea un archivo tar de solo lectura (snapshot) del directorio de base de datos.',
    tematicas: ['Compresión y archivos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/dbdata', owner: 'user-ec2', group: 'user-ec2', perms: '755' }
        ],
        files: [
          { path: '/home/user-ec2/dbdata/users.db', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'SQLITE3\n' },
          { path: '/home/user-ec2/dbdata/sessions.db', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'SQLITE3\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Listar el directorio dbdata/', comandoSugerido: 'ls dbdata' },
      { descripcion: 'Crear snapshot comprimido', comandoSugerido: 'tar -czf dbdata-snapshot.tar.gz dbdata' },
      { descripcion: 'Verificar el snapshot creado', comandoSugerido: 'ls -lh' },
      { descripcion: 'Listar contenido del snapshot', comandoSugerido: 'tar -tzf dbdata-snapshot.tar.gz' }
    ],
    pistas: [
      'tar -czf crea un archivo tar comprimido con gzip.',
      'tar -tzf lista el contenido sin extraer.',
      'ls -lh muestra tamaños en formato legible.'
    ],
    comandosUtiles: ['tar', 'ls']
  },

  {
    id: 40,
    premisa: 'Empaqueta varios archivos de configuración en un tar sin compresión para auditaría.',
    tematicas: ['Compresión y archivos'],
    estadoInicial: {
      fs: {
        dirs: [],
        files: [
          { path: '/home/user-ec2/ssh.conf', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'Port 22\n' },
          { path: '/home/user-ec2/firewall.conf', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'ACCEPT all\n' },
          { path: '/home/user-ec2/cron.conf', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '*/5 * * * * backup\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver los archivos de configuración', comandoSugerido: 'ls' },
      { descripcion: 'Empaquetar sin compresión', comandoSugerido: 'tar -cf configs.tar ssh.conf firewall.conf cron.conf' },
      { descripcion: 'Verificar el tar creado', comandoSugerido: 'ls -l configs.tar' },
      { descripcion: 'Listar contenido del tar', comandoSugerido: 'tar -tf configs.tar' }
    ],
    pistas: [
      'tar -cf nombre.tar archivos... crea sin comprimir.',
      'Sin z no hay compresión gzip.',
      'tar -tf lista el contenido del archivo.'
    ],
    comandosUtiles: ['tar', 'ls']
  }
];
