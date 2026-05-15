const ejerciciosPermisos = [
  // ──────────────────────────────────────────────
  // BLOQUE 2: Permisos (8)
  // ──────────────────────────────────────────────
  {
    id: 11,
    premisa: 'Debes asegurar un script de despliegue para que sólo el propietario pueda ejecutarlo.',
    tematicas: ['Permisos'],
    estadoInicial: {
      fs: {
        dirs: [],
        files: [
          { path: '/home/user-ec2/deploy.sh', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '#!/bin/bash\necho deploy\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver permisos actuales de deploy.sh', comandoSugerido: 'ls -l deploy.sh' },
      { descripcion: 'Dar permiso de ejecución solo al propietario', comandoSugerido: 'chmod 700 deploy.sh' },
      { descripcion: 'Verificar los nuevos permisos', comandoSugerido: 'ls -l deploy.sh' }
    ],
    pistas: [
      'ls -l muestra los permisos del archivo.',
      'chmod 700 da rwx solo al propietario.',
      'El valor 7 = lectura(4) + escritura(2) + ejecución(1).'
    ],
    comandosUtiles: ['chmod', 'ls']
  },

  {
    id: 12,
    premisa: 'Un directorio web debe ser legible por todos pero modificable solo por el propietario.',
    tematicas: ['Permisos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/www', owner: 'user-ec2', group: 'www-data', perms: '777' }
        ],
        files: [
          { path: '/home/user-ec2/www/index.html', owner: 'user-ec2', group: 'www-data', perms: '777', content: '<h1>Web</h1>\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver permisos actuales', comandoSugerido: 'ls -l' },
      { descripcion: 'Dar permisos 755 al directorio www', comandoSugerido: 'chmod 755 www' },
      { descripcion: 'Dar permisos 644 a index.html', comandoSugerido: 'chmod 644 www/index.html' },
      { descripcion: 'Verificar cambios', comandoSugerido: 'ls -l www' }
    ],
    pistas: [
      '755 = propietario rwx, grupo y otros rx.',
      '644 = propietario rw, grupo y otros r.',
      'chmod número archivo cambia permisos.'
    ],
    comandosUtiles: ['chmod', 'ls']
  },

  {
    id: 13,
    premisa: 'Cambia el propietario de un directorio de datos al usuario de la aplicación.',
    tematicas: ['Permisos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/datos', owner: 'user-ec2', group: 'user-ec2', perms: '755' }
        ],
        files: [
          { path: '/home/user-ec2/datos/db.sqlite', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'SQLITE\n' }
        ]
      },
      usuarios: [
        { username: 'appuser', grupos: ['appuser'], shell: '/bin/bash', group: 'appuser' }
      ],
      grupos: [{ name: 'appuser' }],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver propietario actual de datos/', comandoSugerido: 'ls -l' },
      { descripcion: 'Cambiar propietario de datos/ a appuser', comandoSugerido: 'chown appuser datos' },
      { descripcion: 'Cambiar propietario de db.sqlite a appuser', comandoSugerido: 'chown appuser datos/db.sqlite' },
      { descripcion: 'Verificar los cambios', comandoSugerido: 'ls -l datos' }
    ],
    pistas: [
      'chown usuario archivo cambia el propietario.',
      'chown -R aplica el cambio recursivamente.',
      'Necesitas permisos para cambiar propietarios.'
    ],
    comandosUtiles: ['chown', 'ls', 'id']
  },

  {
    id: 14,
    premisa: 'Configura el grupo propietario de archivos compartidos del equipo de operaciones.',
    tematicas: ['Permisos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/ops', owner: 'user-ec2', group: 'user-ec2', perms: '755' }
        ],
        files: [
          { path: '/home/user-ec2/ops/runbook.md', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '# Runbook\n' },
          { path: '/home/user-ec2/ops/checklist.md', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '# Checklist\n' }
        ]
      },
      usuarios: [], grupos: [{ name: 'ops' }],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver grupo actual de ops/', comandoSugerido: 'ls -l' },
      { descripcion: 'Cambiar grupo de ops/ a ops', comandoSugerido: 'chgrp ops ops' },
      { descripcion: 'Cambiar grupo de runbook.md a ops', comandoSugerido: 'chgrp ops ops/runbook.md' },
      { descripcion: 'Cambiar grupo de checklist.md a ops', comandoSugerido: 'chgrp ops ops/checklist.md' },
      { descripcion: 'Verificar cambios', comandoSugerido: 'ls -l ops' }
    ],
    pistas: [
      'chgrp grupo archivo cambia el grupo propietario.',
      'chgrp -R aplica el cambio recursivamente.',
      'ls -l muestra usuario y grupo de cada archivo.'
    ],
    comandosUtiles: ['chgrp', 'ls']
  },

  {
    id: 15,
    premisa: 'Aplica permisos restrictivos usando notación simbólica para archivos sensibles de configuración.',
    tematicas: ['Permisos'],
    estadoInicial: {
      fs: {
        dirs: [],
        files: [
          { path: '/home/user-ec2/secreto.conf', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'password=hunter2\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver permisos de secreto.conf', comandoSugerido: 'ls -l secreto.conf' },
      { descripcion: 'Quitar lectura a grupo y otros', comandoSugerido: 'chmod go-r secreto.conf' },
      { descripcion: 'Verificar que solo el propietario puede leer', comandoSugerido: 'ls -l secreto.conf' }
    ],
    pistas: [
      'chmod go-r quita el bit de lectura a grupo y otros.',
      'g=grupo, o=otros, u=usuario propietario.',
      '+añade, -quita, =establece permisos.'
    ],
    comandosUtiles: ['chmod', 'ls']
  },

  {
    id: 16,
    premisa: 'Un directorio compartido debe permitir a todos escribir pero no borrar archivos ajenos (sticky bit).',
    tematicas: ['Permisos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/compartido', owner: 'user-ec2', group: 'user-ec2', perms: '755' }
        ],
        files: []
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver permisos de compartido/', comandoSugerido: 'ls -l' },
      { descripcion: 'Dar permiso de escritura a todos', comandoSugerido: 'chmod 777 compartido' },
      { descripcion: 'Activar sticky bit', comandoSugerido: 'chmod +t compartido' },
      { descripcion: 'Verificar permisos resultantes', comandoSugerido: 'ls -l' }
    ],
    pistas: [
      'chmod 777 da todos los permisos a todos.',
      'chmod +t activa el sticky bit (aparece como t en permisos).',
      'El sticky bit evita borrar archivos de otros usuarios.'
    ],
    comandosUtiles: ['chmod', 'ls']
  },

  {
    id: 17,
    premisa: 'Cambia el propietario y grupo del directorio sitio/ de forma recursiva. El nuevo propietario debe ser user01 y el nuevo grupo group01.',
    tematicas: ['Permisos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/sitio', owner: 'user-ec2', group: 'user-ec2', perms: '755' },
          { path: '/home/user-ec2/sitio/css', owner: 'user-ec2', group: 'user-ec2', perms: '755' }
        ],
        files: [
          { path: '/home/user-ec2/sitio/index.html', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '' },
          { path: '/home/user-ec2/sitio/css/style.css', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '' }
        ]
      },
      usuarios: [
        { username: 'user01', grupos: ['user01', 'group01'], shell: '/bin/bash', group: 'user01' }
      ],
      grupos: [{ name: 'user01' }, { name: 'group01' }],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver propietarios actuales', comandoSugerido: 'ls -l sitio' },
      { descripcion: 'Cambiar propietario (user01) y grupo (group01) de sitio/ recursivamente', comandoSugerido: 'chown -R user01:group01 sitio' },
      { descripcion: 'Verificar cambios en sitio/', comandoSugerido: 'ls -l sitio' },
      { descripcion: 'Verificar cambios en sitio/css/', comandoSugerido: 'ls -l sitio/css' }
    ],
    pistas: [
      'chown -R aplica el cambio recursivamente a todo el árbol.',
      'La sintaxis es: chown -R user01:group01 sitio',
      'ls -l muestra el propietario y grupo de cada archivo.'
    ],
    comandosUtiles: ['chown', 'ls']
  },

  {
    id: 18,
    premisa: 'Necesitas aplicar permisos de ejecución a un conjunto de scripts de mantenimiento.',
    tematicas: ['Permisos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/scripts', owner: 'user-ec2', group: 'user-ec2', perms: '755' }
        ],
        files: [
          { path: '/home/user-ec2/scripts/backup.sh', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '#!/bin/bash\n' },
          { path: '/home/user-ec2/scripts/cleanup.sh', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '#!/bin/bash\n' },
          { path: '/home/user-ec2/scripts/monitor.sh', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '#!/bin/bash\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver permisos actuales', comandoSugerido: 'ls -l scripts' },
      { descripcion: 'Dar ejecución a backup.sh', comandoSugerido: 'chmod +x scripts/backup.sh' },
      { descripcion: 'Dar ejecución a cleanup.sh', comandoSugerido: 'chmod +x scripts/cleanup.sh' },
      { descripcion: 'Dar ejecución a monitor.sh', comandoSugerido: 'chmod +x scripts/monitor.sh' },
      { descripcion: 'Verificar los nuevos permisos', comandoSugerido: 'ls -l scripts' }
    ],
    pistas: [
      'chmod +x añade el permiso de ejecución.',
      'ls -l muestra los permisos de los archivos.',
      'Los scripts necesitan permiso de ejecución para correr.'
    ],
    comandosUtiles: ['chmod', 'ls']
  }
];
