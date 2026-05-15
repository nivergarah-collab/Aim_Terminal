const ejerciciosAdmin = [
  // ──────────────────────────────────────────────
  // BLOQUE 3: Administración de usuarios y grupos (8)
  // ──────────────────────────────────────────────
  {
    id: 19,
    premisa: 'Se incorpora una nueva desarrolladora al equipo. Crea la cuenta "ana" y asígnala al grupo de desarrollo "devs".',
    tematicas: ['Administración de usuarios y grupos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [],
      grupos: [{ name: 'devs' }],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear usuario ana', comandoSugerido: 'useradd ana' },
      { descripcion: 'Crear contraseña para ana', comandoSugerido: 'passwd ana' },
      { descripcion: 'Agregar ana al grupo devs', comandoSugerido: 'usermod -aG devs ana' },
      { descripcion: 'Verificar los grupos de ana', comandoSugerido: 'id ana' }
    ],
    pistas: [
      'useradd crea un nuevo usuario.',
      'passwd usuario establece la contraseña.',
      'usermod -aG grupo usuario agrega al grupo sin quitar los existentes.'
    ],
    comandosUtiles: ['useradd', 'passwd', 'usermod', 'id']
  },

  {
    id: 20,
    premisa: 'Un empleado ha dejado la empresa. Elimina su cuenta y limpia su directorio de trabajo.',
    tematicas: ['Administración de usuarios y grupos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/exuser', owner: 'exuser', group: 'exuser', perms: '755' }
        ],
        files: [
          { path: '/home/exuser/trabajo.txt', owner: 'exuser', group: 'exuser', perms: '644', content: 'datos\n' }
        ]
      },
      usuarios: [
        { username: 'exuser', grupos: ['exuser'], shell: '/bin/bash', group: 'exuser' }
      ],
      grupos: [{ name: 'exuser' }],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Verificar que exuser existe', comandoSugerido: 'id exuser' },
      { descripcion: 'Eliminar el usuario exuser', comandoSugerido: 'userdel exuser' },
      { descripcion: 'Verificar que el usuario fue eliminado', comandoSugerido: 'id exuser' }
    ],
    pistas: [
      'userdel elimina un usuario del sistema.',
      'userdel -r también elimina el directorio home.',
      'id usuario muestra info del usuario (o error si no existe).'
    ],
    comandosUtiles: ['userdel', 'id']
  },

  {
    id: 21,
    premisa: 'Crea el grupo "sysops" para el equipo de operaciones y añade los usuarios existentes "carlos" y "maria".',
    tematicas: ['Administración de usuarios y grupos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [
        { username: 'carlos', grupos: ['carlos'], shell: '/bin/bash', group: 'carlos' },
        { username: 'maria', grupos: ['maria'], shell: '/bin/bash', group: 'maria' }
      ],
      grupos: [{ name: 'carlos' }, { name: 'maria' }],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear el grupo sysops', comandoSugerido: 'groupadd sysops' },
      { descripcion: 'Añadir carlos al grupo sysops', comandoSugerido: 'usermod -aG sysops carlos' },
      { descripcion: 'Añadir maria al grupo sysops', comandoSugerido: 'usermod -aG sysops maria' },
      { descripcion: 'Verificar grupos de carlos', comandoSugerido: 'id carlos' }
    ],
    pistas: [
      'groupadd crea un grupo nuevo.',
      'usermod -aG grupo usuario añade al grupo.',
      'id usuario muestra los grupos del usuario.'
    ],
    comandosUtiles: ['groupadd', 'usermod', 'id']
  },

  {
    id: 22,
    premisa: 'Comprueba la identidad actual y los grupos a los que pertenece el usuario activo.',
    tematicas: ['Administración de usuarios y grupos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver el usuario actual', comandoSugerido: 'whoami' },
      { descripcion: 'Ver UID, GID y grupos del usuario actual', comandoSugerido: 'id' },
      { descripcion: 'Ver quién está conectado en el sistema', comandoSugerido: 'who' }
    ],
    pistas: [
      'whoami muestra solo el nombre de usuario.',
      'id muestra UID, GID primario y todos los grupos.',
      'who lista los usuarios con sesión activa.'
    ],
    comandosUtiles: ['whoami', 'id', 'who', 'w']
  },

  {
    id: 23,
    premisa: 'Modifica el shell y el directorio home de un usuario según los nuevos estándares del equipo.',
    tematicas: ['Administración de usuarios y grupos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/developer', owner: 'developer', group: 'developer', perms: '755' }
        ],
        files: []
      },
      usuarios: [
        { username: 'developer', grupos: ['developer'], shell: '/bin/sh', group: 'developer' }
      ],
      grupos: [{ name: 'developer' }],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver información actual de developer', comandoSugerido: 'id developer' },
      { descripcion: 'Cambiar el shell de developer a /bin/bash', comandoSugerido: 'usermod -s /bin/bash developer' },
      { descripcion: 'Verificar el cambio', comandoSugerido: 'id developer' }
    ],
    pistas: [
      'usermod modifica atributos de una cuenta de usuario.',
      '-s especifica el shell de login.',
      '-d especifica el directorio home.'
    ],
    comandosUtiles: ['usermod', 'id']
  },

  {
    id: 24,
    premisa: 'Elimina un grupo que ya no se usa en el sistema.',
    tematicas: ['Administración de usuarios y grupos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [],
      grupos: [{ name: 'oldteam' }, { name: 'newteam' }],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear usuario temporal en oldteam para verificar', comandoSugerido: 'groupadd testcheck' },
      { descripcion: 'Eliminar el grupo oldteam', comandoSugerido: 'groupdel oldteam' },
      { descripcion: 'Verificar que oldteam no existe creando otro grupo', comandoSugerido: 'groupadd oldteam' }
    ],
    pistas: [
      'groupdel nombre elimina el grupo.',
      'No puedes eliminar un grupo si es el grupo primario de algún usuario.',
      'Verifica que no quedan usuarios dependientes antes.'
    ],
    comandosUtiles: ['groupdel', 'groupadd']
  },

  {
    id: 25,
    premisa: 'Necesitas cambiar temporalmente al usuario "admin" para realizar tareas administrativas.',
    tematicas: ['Administración de usuarios y grupos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [
        { username: 'admin', grupos: ['admin', 'sudo'], shell: '/bin/bash', group: 'admin' }
      ],
      grupos: [{ name: 'admin' }, { name: 'sudo' }],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver usuario actual', comandoSugerido: 'whoami' },
      { descripcion: 'Cambiar al usuario admin', comandoSugerido: 'su admin' },
      { descripcion: 'Verificar el usuario activo ahora', comandoSugerido: 'whoami' }
    ],
    pistas: [
      'su usuario cambia al usuario indicado.',
      'su - usuario carga también el entorno del usuario destino.',
      'whoami confirma el usuario activo.'
    ],
    comandosUtiles: ['su', 'whoami', 'id']
  },

  {
    id: 26,
    premisa: 'Configura la cuenta de servicio "svcapp" para una aplicación con acceso restringido. Asígnala al grupo "appgroup" y transfiere la propiedad del directorio de la app.',
    tematicas: ['Administración de usuarios y grupos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/app', owner: 'user-ec2', group: 'user-ec2', perms: '755' }
        ],
        files: []
      },
      usuarios: [],
      grupos: [{ name: 'appgroup' }],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear usuario svcapp', comandoSugerido: 'useradd svcapp' },
      { descripcion: 'Añadir svcapp al grupo appgroup', comandoSugerido: 'usermod -aG appgroup svcapp' },
      { descripcion: 'Cambiar propietario de app/ a svcapp', comandoSugerido: 'chown svcapp app' },
      { descripcion: 'Verificar configuración de svcapp', comandoSugerido: 'id svcapp' }
    ],
    pistas: [
      'useradd crea la cuenta de servicio.',
      'usermod -aG añade al grupo sin quitar otros.',
      'chown cambia el propietario del directorio.'
    ],
    comandosUtiles: ['useradd', 'usermod', 'chown', 'id']
  }
];
