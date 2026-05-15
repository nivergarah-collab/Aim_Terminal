const ejerciciosDiscos = [
  // ──────────────────────────────────────────────
  // BLOQUE 10: Gestión de discos y almacenamiento
  // ──────────────────────────────────────────────
  {
    id: 101,
    premisa: 'Necesitas inventariar los dispositivos de bloque conectados a la instancia para una auditoría. Lista todos los discos y particiones, e identifica los puntos de montaje activos.',
    tematicas: ['Gestión de discos y almacenamiento'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2',
      discos: [
        { name: 'nvme0n1',     size: '8G',  type: 'disk', parent: null,      formatted: null,   mountpoint: null },
        { name: 'nvme0n1p1',   size: '8G',  type: 'part', parent: 'nvme0n1', formatted: 'xfs',  mountpoint: '/' },
        { name: 'nvme0n1p128', size: '10M', type: 'part', parent: 'nvme0n1', formatted: 'vfat', mountpoint: '/boot/efi' },
        { name: 'nvme1n1',     size: '30G', type: 'disk', parent: null,      formatted: null,   mountpoint: null }
      ]
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Lista los dispositivos de bloque', comandoSugerido: 'lsblk' },
      { descripcion: 'Revisa el espacio disponible en los sistemas montados', comandoSugerido: 'df -h' }
    ],
    pistas: [
      'lsblk muestra discos y particiones aunque no estén montados.',
      'df -h sólo muestra los sistemas de archivos efectivamente montados.',
      'Comparar ambos te dice qué disco existe pero aún no se usa.'
    ],
    comandosUtiles: ['lsblk', 'df']
  },

  {
    id: 102,
    premisa: 'Acabas de conectar un volumen EBS de 30 GiB (nvme1n1) a la instancia. Prepáralo: formatéalo en ext4 y móntalo en /mnt/datos para que el equipo pueda guardar archivos allí.',
    tematicas: ['Gestión de discos y almacenamiento'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/mnt/datos', owner: 'root', group: 'root', perms: '755' }
        ],
        files: []
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2',
      discos: [
        { name: 'nvme0n1',     size: '8G',  type: 'disk', parent: null,      formatted: null,   mountpoint: null },
        { name: 'nvme0n1p1',   size: '8G',  type: 'part', parent: 'nvme0n1', formatted: 'xfs',  mountpoint: '/' },
        { name: 'nvme1n1',     size: '30G', type: 'disk', parent: null,      formatted: null,   mountpoint: null }
      ]
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Verifica que nvme1n1 está disponible y sin formato', comandoSugerido: 'lsblk' },
      { descripcion: 'Crea un sistema de archivos ext4 en el disco', comandoSugerido: 'sudo mkfs -t ext4 /dev/nvme1n1' },
      { descripcion: 'Monta el disco en /mnt/datos', comandoSugerido: 'sudo mount /dev/nvme1n1 /mnt/datos' },
      { descripcion: 'Confirma el montaje con df', comandoSugerido: 'df -h' }
    ],
    pistas: [
      'Antes de montar, todo disco nuevo necesita un sistema de archivos.',
      'mkfs -t <tipo> /dev/<disco> formatea con el sistema indicado.',
      'mount /dev/<disco> /punto/de/montaje deja el disco listo para usarse.'
    ],
    comandosUtiles: ['lsblk', 'mkfs', 'mount', 'df']
  },

  {
    id: 103,
    premisa: 'Necesitas desmontar el disco /mnt/datos para hacerle un snapshot seguro en AWS. Hazlo de forma limpia y verifica que el disco ya no aparece como montado.',
    tematicas: ['Gestión de discos y almacenamiento'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/mnt/datos', owner: 'root', group: 'root', perms: '755' }
        ],
        files: []
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2',
      discos: [
        { name: 'nvme0n1',     size: '8G',  type: 'disk', parent: null,      formatted: null,   mountpoint: null },
        { name: 'nvme0n1p1',   size: '8G',  type: 'part', parent: 'nvme0n1', formatted: 'xfs',  mountpoint: '/' },
        { name: 'nvme1n1',     size: '30G', type: 'disk', parent: null,      formatted: 'ext4', mountpoint: '/mnt/datos' }
      ]
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Confirma que /mnt/datos es un punto de montaje', comandoSugerido: 'mountpoint /mnt/datos' },
      { descripcion: 'Desmonta el disco', comandoSugerido: 'sudo umount /mnt/datos' },
      { descripcion: 'Verifica con lsblk que ya no tiene punto de montaje', comandoSugerido: 'lsblk' }
    ],
    pistas: [
      'mountpoint te dice si una ruta es un punto de montaje activo.',
      'umount acepta el dispositivo (/dev/nvme1n1) o el punto de montaje (/mnt/datos).',
      'Después de desmontar, lsblk seguirá listando el disco pero sin MOUNTPOINTS.'
    ],
    comandosUtiles: ['mountpoint', 'umount', 'lsblk']
  },

  {
    id: 104,
    premisa: 'Para una migración necesitas la tabla de particiones detallada de todos los discos. Lista las particiones con fdisk y compara con el árbol de bloques.',
    tematicas: ['Gestión de discos y almacenamiento'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2',
      discos: [
        { name: 'nvme0n1',     size: '8G',  type: 'disk', parent: null,      formatted: null,   mountpoint: null },
        { name: 'nvme0n1p1',   size: '8G',  type: 'part', parent: 'nvme0n1', formatted: 'xfs',  mountpoint: '/' },
        { name: 'nvme0n1p128', size: '10M', type: 'part', parent: 'nvme0n1', formatted: 'vfat', mountpoint: '/boot/efi' },
        { name: 'nvme1n1',     size: '50G', type: 'disk', parent: null,      formatted: 'ext4', mountpoint: null }
      ]
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Lista las particiones con fdisk', comandoSugerido: 'sudo fdisk -l' },
      { descripcion: 'Compara con la vista jerárquica de lsblk', comandoSugerido: 'lsblk' }
    ],
    pistas: [
      'fdisk -l requiere privilegios (sudo) por leer dispositivos.',
      'fdisk muestra tipo y tamaño de cada partición.',
      'lsblk muestra la misma información en árbol y con mountpoints.'
    ],
    comandosUtiles: ['fdisk', 'lsblk']
  },

  {
    id: 105,
    premisa: 'Antes de un script de respaldo, debes asegurar que /mnt/backup está realmente montado. Si no lo está, formatea y monta el disco nvme1n1 ahí.',
    tematicas: ['Gestión de discos y almacenamiento'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/mnt/backup', owner: 'root', group: 'root', perms: '755' }
        ],
        files: []
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2',
      discos: [
        { name: 'nvme0n1',     size: '8G',  type: 'disk', parent: null,      formatted: null,   mountpoint: null },
        { name: 'nvme0n1p1',   size: '8G',  type: 'part', parent: 'nvme0n1', formatted: 'xfs',  mountpoint: '/' },
        { name: 'nvme1n1',     size: '20G', type: 'disk', parent: null,      formatted: null,   mountpoint: null }
      ]
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Comprueba si /mnt/backup ya es punto de montaje', comandoSugerido: 'mountpoint /mnt/backup' },
      { descripcion: 'Formatea el disco extra como ext4', comandoSugerido: 'sudo mkfs -t ext4 /dev/nvme1n1' },
      { descripcion: 'Monta el disco en /mnt/backup', comandoSugerido: 'sudo mount /dev/nvme1n1 /mnt/backup' },
      { descripcion: 'Vuelve a verificar el punto de montaje', comandoSugerido: 'mountpoint /mnt/backup' }
    ],
    pistas: [
      'mountpoint sale con error si la ruta NO es un punto de montaje.',
      'mkfs antes de mount: el disco debe tener un sistema de archivos.',
      'Después de montar, mountpoint debería confirmar que la ruta sí lo es.'
    ],
    comandosUtiles: ['mountpoint', 'mkfs', 'mount']
  },

  {
    id: 106,
    premisa: 'Un proceso httpd está consumiendo todos los recursos y necesitas terminarlos por nombre. Después, configura el firewall para permitir SSH y HTTP de forma permanente.',
    tematicas: ['Información del sistema y procesos', 'Redes básicas'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Termina todos los procesos httpd', comandoSugerido: 'sudo killall httpd' },
      { descripcion: 'Inicia el servicio firewalld', comandoSugerido: 'sudo systemctl start firewalld' },
      { descripcion: 'Permite SSH de forma permanente', comandoSugerido: 'sudo firewall-cmd --add-service=ssh --permanent' },
      { descripcion: 'Permite el puerto 80/tcp', comandoSugerido: 'sudo firewall-cmd --add-port=80/tcp --permanent' },
      { descripcion: 'Aplica los cambios', comandoSugerido: 'sudo firewall-cmd --reload' },
      { descripcion: 'Confirma las reglas activas', comandoSugerido: 'firewall-cmd --list-all' }
    ],
    pistas: [
      'killall finaliza procesos por NOMBRE (no PID, como kill).',
      'firewalld debe estar corriendo antes de aplicar reglas.',
      '--permanent persiste, pero requiere --reload para que aplique.'
    ],
    comandosUtiles: ['killall', 'systemctl', 'firewall-cmd']
  },

  // ──────────────────────────────────────────────
  // LECCIÓN: Caso práctico de almacenamiento adicional con EBS
  // ──────────────────────────────────────────────
  {
    id: 107,
    esLeccion: true,
    premisa: 'Caso práctico: agregar almacenamiento adicional a una instancia EC2 con Amazon EBS.\n\nContexto: Acabas de conectar un volumen EBS de 30 GiB (nvme1n1) a la instancia desde la consola de AWS. Ahora debes prepararlo en Linux para que el equipo lo pueda usar.\n\nParte 1 — Reconocimiento del disco:\n  1. Lista los dispositivos de bloque para confirmar que nvme1n1 aparece como disco sin punto de montaje.\n  2. Compara con df -h para ver que aún no está montado en ningún lugar.\n\nParte 2 — Formatear el disco:\n  3. Crea un sistema de archivos ext4 sobre /dev/nvme1n1 con mkfs.\n\nParte 3 — Crear el punto de montaje y montar:\n  4. Crea el directorio /mnt/nvme1n1 con sudo mkdir.\n  5. Monta /dev/nvme1n1 en /mnt/nvme1n1 con sudo mount.\n  6. Verifica con df -h que el disco aparece montado y con su tamaño correcto.\n\nParte 4 — Ajustar permisos:\n  7. Cambia el propietario y el grupo del punto de montaje a user-ec2 con sudo chown y sudo chgrp (o usa chown user:grupo).\n  8. Verifica los permisos con ls -l /mnt.\n\nParte 5 — Verificación final:\n  9. Crea un archivo de prueba dentro de /mnt/nvme1n1 con touch para confirmar que puedes escribir en el disco.',
    tematicas: ['Gestión de discos y almacenamiento', 'Permisos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2',
      discos: [
        { name: 'nvme0n1',     size: '8G',  type: 'disk', parent: null,      formatted: null,   mountpoint: null },
        { name: 'nvme0n1p1',   size: '8G',  type: 'part', parent: 'nvme0n1', formatted: 'xfs',  mountpoint: '/' },
        { name: 'nvme0n1p128', size: '10M', type: 'part', parent: 'nvme0n1', formatted: 'vfat', mountpoint: '/boot/efi' },
        { name: 'nvme1n1',     size: '30G', type: 'disk', parent: null,      formatted: null,   mountpoint: null }
      ]
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Lista los dispositivos de bloque', comandoSugerido: 'lsblk' },
      { descripcion: 'Comprueba el espacio disponible montado', comandoSugerido: 'df -h' },
      { descripcion: 'Formatea nvme1n1 como ext4', comandoSugerido: 'sudo mkfs -t ext4 /dev/nvme1n1' },
      { descripcion: 'Crea el directorio de montaje /mnt/nvme1n1', comandoSugerido: 'sudo mkdir /mnt/nvme1n1' },
      { descripcion: 'Monta el disco en /mnt/nvme1n1', comandoSugerido: 'sudo mount /dev/nvme1n1 /mnt/nvme1n1' },
      { descripcion: 'Verifica el montaje con df -h', comandoSugerido: 'df -h' },
      { descripcion: 'Cambia el propietario a user-ec2', comandoSugerido: 'sudo chown user-ec2 /mnt/nvme1n1' },
      { descripcion: 'Cambia el grupo a user-ec2', comandoSugerido: 'sudo chgrp user-ec2 /mnt/nvme1n1' },
      { descripcion: 'Verifica los permisos en /mnt', comandoSugerido: 'ls -l /mnt' },
      { descripcion: 'Crea un archivo de prueba en el disco', comandoSugerido: 'touch /mnt/nvme1n1/prueba.txt' }
    ],
    pistas: [
      'lsblk muestra el árbol completo; df sólo lo montado.',
      'Antes de mount siempre va mkfs (un disco sin formato no se monta).',
      'mount necesita un directorio existente como punto de montaje.',
      'sin chown, el disco montado pertenece a root y no podrás escribir.',
      'sudo chown user:grupo /ruta cambia ambos en un solo paso.'
    ],
    comandosUtiles: ['lsblk', 'df', 'mkfs', 'mkdir', 'mount', 'chown', 'chgrp', 'ls', 'touch']
  },

  // ──────────────────────────────────────────────
  // BLOQUE 11A: Mezcla con navegación y archivos básicos (4)
  // ──────────────────────────────────────────────
  {
    id: 108,
    premisa: 'Acaban de adjuntar un volumen EBS nuevo a la instancia. Móntalo en /mnt/proyectos y crea la estructura inicial del proyecto: subcarpetas src, docs y tests, junto con un README.md vacío.',
    tematicas: ['Gestión de discos y almacenamiento', 'Navegación y archivos básicos'],
    estadoInicial: {
      fs: {
        dirs: [{ path: '/mnt/proyectos', owner: 'root', group: 'root', perms: '755' }],
        files: []
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2',
      discos: [
        { name: 'nvme0n1',   size: '8G',  type: 'disk', parent: null,      formatted: null,  mountpoint: null },
        { name: 'nvme0n1p1', size: '8G',  type: 'part', parent: 'nvme0n1', formatted: 'xfs', mountpoint: '/' },
        { name: 'nvme1n1',   size: '20G', type: 'disk', parent: null,      formatted: null,  mountpoint: null }
      ]
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Verifica el disco nuevo con lsblk', comandoSugerido: 'lsblk' },
      { descripcion: 'Formatea el disco como ext4', comandoSugerido: 'sudo mkfs -t ext4 /dev/nvme1n1' },
      { descripcion: 'Monta el disco en /mnt/proyectos', comandoSugerido: 'sudo mount /dev/nvme1n1 /mnt/proyectos' },
      { descripcion: 'Entra al disco montado', comandoSugerido: 'cd /mnt/proyectos' },
      { descripcion: 'Crea las subcarpetas del proyecto', comandoSugerido: 'sudo mkdir src docs tests' },
      { descripcion: 'Crea el README.md vacío', comandoSugerido: 'sudo touch README.md' },
      { descripcion: 'Confirma la estructura', comandoSugerido: 'ls' }
    ],
    pistas: [
      'Antes de mount va siempre mkfs.',
      'cd al punto de montaje te lleva a "dentro" del disco.',
      'mkdir acepta varios nombres de carpeta separados por espacio.'
    ],
    comandosUtiles: ['lsblk', 'mkfs', 'mount', 'cd', 'mkdir', 'touch', 'ls']
  },

  {
    id: 109,
    premisa: 'Quieres respaldar los archivos importantes de tu home en un disco dedicado de respaldos. Formatea el nuevo disco, móntalo en /mnt/backup y copia notas.txt y agenda.md desde tu home.',
    tematicas: ['Gestión de discos y almacenamiento', 'Navegación y archivos básicos'],
    estadoInicial: {
      fs: {
        dirs: [{ path: '/mnt/backup', owner: 'root', group: 'root', perms: '755' }],
        files: [
          { path: '/home/user-ec2/notas.txt', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'Lista de tareas\n' },
          { path: '/home/user-ec2/agenda.md', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '# Agenda\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2',
      discos: [
        { name: 'nvme0n1',   size: '8G',  type: 'disk', parent: null,      formatted: null,  mountpoint: null },
        { name: 'nvme0n1p1', size: '8G',  type: 'part', parent: 'nvme0n1', formatted: 'xfs', mountpoint: '/' },
        { name: 'nvme1n1',   size: '10G', type: 'disk', parent: null,      formatted: null,  mountpoint: null }
      ]
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Lista los discos disponibles', comandoSugerido: 'lsblk' },
      { descripcion: 'Formatea el disco como ext4', comandoSugerido: 'sudo mkfs -t ext4 /dev/nvme1n1' },
      { descripcion: 'Monta el disco en /mnt/backup', comandoSugerido: 'sudo mount /dev/nvme1n1 /mnt/backup' },
      { descripcion: 'Lista los archivos de tu home', comandoSugerido: 'ls /home/user-ec2' },
      { descripcion: 'Copia notas.txt al respaldo', comandoSugerido: 'sudo cp /home/user-ec2/notas.txt /mnt/backup/' },
      { descripcion: 'Copia agenda.md al respaldo', comandoSugerido: 'sudo cp /home/user-ec2/agenda.md /mnt/backup/' },
      { descripcion: 'Verifica el contenido del respaldo', comandoSugerido: 'ls /mnt/backup' }
    ],
    pistas: [
      'cp <origen> <destino> copia archivos a otro directorio.',
      'Necesitas sudo para escribir en /mnt/backup mientras pertenece a root.',
      'ls al final confirma que el respaldo se hizo correctamente.'
    ],
    comandosUtiles: ['lsblk', 'mkfs', 'mount', 'ls', 'cp']
  },

  {
    id: 110,
    premisa: 'Un disco temporal /mnt/temp ya no se necesita. Mueve cualquier archivo recuperable a tu home, elimina los archivos basura y desmonta el disco para liberarlo.',
    tematicas: ['Gestión de discos y almacenamiento', 'Navegación y archivos básicos'],
    estadoInicial: {
      fs: {
        dirs: [{ path: '/mnt/temp', owner: 'user-ec2', group: 'user-ec2', perms: '755' }],
        files: [
          { path: '/mnt/temp/recuperable.txt', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'datos importantes\n' },
          { path: '/mnt/temp/basura.tmp', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'tmp\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2',
      discos: [
        { name: 'nvme0n1',   size: '8G',  type: 'disk', parent: null,      formatted: null,   mountpoint: null },
        { name: 'nvme0n1p1', size: '8G',  type: 'part', parent: 'nvme0n1', formatted: 'xfs',  mountpoint: '/' },
        { name: 'nvme1n1',   size: '5G',  type: 'disk', parent: null,      formatted: 'ext4', mountpoint: '/mnt/temp' }
      ]
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Lista el contenido del disco temporal', comandoSugerido: 'ls /mnt/temp' },
      { descripcion: 'Mueve el archivo recuperable a tu home', comandoSugerido: 'mv /mnt/temp/recuperable.txt /home/user-ec2/' },
      { descripcion: 'Elimina la basura', comandoSugerido: 'rm /mnt/temp/basura.tmp' },
      { descripcion: 'Desmonta el disco', comandoSugerido: 'sudo umount /mnt/temp' },
      { descripcion: 'Verifica con lsblk que el disco quedó libre', comandoSugerido: 'lsblk' }
    ],
    pistas: [
      'Mueve antes de eliminar: una vez desmontado, no podrás acceder al contenido.',
      'umount necesita que ningún proceso esté usando el disco.',
      'Tras umount, lsblk seguirá mostrando el disco pero sin MOUNTPOINTS.'
    ],
    comandosUtiles: ['ls', 'mv', 'rm', 'umount', 'lsblk']
  },

  {
    id: 111,
    premisa: 'Inicializa un disco de configuración del proyecto: formatéalo, móntalo en /mnt/config y crea los archivos de plantilla nginx.conf, app.env y database.yml dentro.',
    tematicas: ['Gestión de discos y almacenamiento', 'Navegación y archivos básicos'],
    estadoInicial: {
      fs: {
        dirs: [{ path: '/mnt/config', owner: 'root', group: 'root', perms: '755' }],
        files: []
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2',
      discos: [
        { name: 'nvme0n1',   size: '8G',  type: 'disk', parent: null,      formatted: null,  mountpoint: null },
        { name: 'nvme0n1p1', size: '8G',  type: 'part', parent: 'nvme0n1', formatted: 'xfs', mountpoint: '/' },
        { name: 'nvme1n1',   size: '5G',  type: 'disk', parent: null,      formatted: null,  mountpoint: null }
      ]
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Verifica el disco nuevo', comandoSugerido: 'lsblk' },
      { descripcion: 'Formatea como ext4', comandoSugerido: 'sudo mkfs -t ext4 /dev/nvme1n1' },
      { descripcion: 'Monta en /mnt/config', comandoSugerido: 'sudo mount /dev/nvme1n1 /mnt/config' },
      { descripcion: 'Entra al directorio del disco', comandoSugerido: 'cd /mnt/config' },
      { descripcion: 'Crea los 3 archivos de plantilla', comandoSugerido: 'sudo touch nginx.conf app.env database.yml' },
      { descripcion: 'Confirma la creación', comandoSugerido: 'ls' }
    ],
    pistas: [
      'touch acepta varios nombres separados por espacio para crear varios archivos.',
      'Hacer cd al punto de montaje simplifica los comandos siguientes.',
      'sudo es necesario porque /mnt/config pertenece a root.'
    ],
    comandosUtiles: ['lsblk', 'mkfs', 'mount', 'cd', 'touch', 'ls']
  },

  // ──────────────────────────────────────────────
  // BLOQUE 11B: Mezcla con unidades afines (3)
  // ──────────────────────────────────────────────
  {
    id: 112,
    premisa: 'El equipo "developers" necesita escribir en el disco compartido /mnt/datos. Formatea y monta el disco, y luego configura los permisos para que el grupo developers tenga lectura y escritura, y el resto solo lectura.',
    tematicas: ['Gestión de discos y almacenamiento', 'Permisos'],
    estadoInicial: {
      fs: {
        dirs: [{ path: '/mnt/datos', owner: 'root', group: 'root', perms: '755' }],
        files: []
      },
      usuarios: [], grupos: [{ name: 'developers' }],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2',
      discos: [
        { name: 'nvme0n1',   size: '8G',  type: 'disk', parent: null,      formatted: null,  mountpoint: null },
        { name: 'nvme0n1p1', size: '8G',  type: 'part', parent: 'nvme0n1', formatted: 'xfs', mountpoint: '/' },
        { name: 'nvme1n1',   size: '15G', type: 'disk', parent: null,      formatted: null,  mountpoint: null }
      ]
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Formatea el disco como ext4', comandoSugerido: 'sudo mkfs -t ext4 /dev/nvme1n1' },
      { descripcion: 'Monta el disco en /mnt/datos', comandoSugerido: 'sudo mount /dev/nvme1n1 /mnt/datos' },
      { descripcion: 'Asigna el grupo developers al disco', comandoSugerido: 'sudo chgrp developers /mnt/datos' },
      { descripcion: 'Da permisos rwx al propietario y grupo, lectura a otros', comandoSugerido: 'sudo chmod 775 /mnt/datos' },
      { descripcion: 'Verifica los permisos', comandoSugerido: 'ls -ld /mnt/datos' }
    ],
    pistas: [
      'chgrp cambia el grupo propietario; chown usuario:grupo cambia ambos.',
      'En notación octal: 7 = rwx, 5 = rx. 775 = propietario rwx, grupo rwx, otros rx.',
      'ls -ld muestra los permisos del directorio sin entrar en él.'
    ],
    comandosUtiles: ['mkfs', 'mount', 'chgrp', 'chmod', 'ls']
  },

  {
    id: 113,
    premisa: 'Diagnostica el estado de recursos del servidor: identifica qué discos están montados, cuánto espacio usa cada partición, cuánto consume tu home, la memoria disponible y los procesos activos.',
    tematicas: ['Gestión de discos y almacenamiento', 'Información del sistema y procesos'],
    estadoInicial: {
      fs: {
        dirs: [{ path: '/mnt/extra', owner: 'root', group: 'root', perms: '755' }],
        files: []
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2',
      discos: [
        { name: 'nvme0n1',   size: '8G',  type: 'disk', parent: null,      formatted: null,   mountpoint: null },
        { name: 'nvme0n1p1', size: '8G',  type: 'part', parent: 'nvme0n1', formatted: 'xfs',  mountpoint: '/' },
        { name: 'nvme1n1',   size: '20G', type: 'disk', parent: null,      formatted: 'ext4', mountpoint: '/mnt/extra' }
      ]
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Visualiza el árbol de dispositivos de bloque', comandoSugerido: 'lsblk' },
      { descripcion: 'Espacio disponible por sistema de archivos', comandoSugerido: 'df -h' },
      { descripcion: 'Tamaño total de tu directorio home', comandoSugerido: 'du -sh /home/user-ec2' },
      { descripcion: 'Memoria libre en formato humano', comandoSugerido: 'free -h' },
      { descripcion: 'Procesos del sistema', comandoSugerido: 'ps aux' }
    ],
    pistas: [
      'lsblk muestra dispositivos; df muestra qué está montado y con cuánto espacio.',
      'du -sh resume el tamaño de un directorio entero.',
      'ps aux lista todos los procesos con su uso de CPU y memoria.'
    ],
    comandosUtiles: ['lsblk', 'df', 'du', 'free', 'ps']
  },

  {
    id: 114,
    premisa: 'Prepara un disco dedicado para los logs del cron: monta nvme1n1 en /mnt/logs, asegúrate de que crond esté corriendo y habilitado al arranque para que pueda escribir los logs allí.',
    tematicas: ['Gestión de discos y almacenamiento', 'Servicios y automatización'],
    estadoInicial: {
      fs: {
        dirs: [{ path: '/mnt/logs', owner: 'root', group: 'root', perms: '755' }],
        files: []
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2',
      discos: [
        { name: 'nvme0n1',   size: '8G',  type: 'disk', parent: null,      formatted: null,  mountpoint: null },
        { name: 'nvme0n1p1', size: '8G',  type: 'part', parent: 'nvme0n1', formatted: 'xfs', mountpoint: '/' },
        { name: 'nvme1n1',   size: '10G', type: 'disk', parent: null,      formatted: null,  mountpoint: null }
      ]
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Lista los discos', comandoSugerido: 'lsblk' },
      { descripcion: 'Formatea el disco como ext4', comandoSugerido: 'sudo mkfs -t ext4 /dev/nvme1n1' },
      { descripcion: 'Monta el disco en /mnt/logs', comandoSugerido: 'sudo mount /dev/nvme1n1 /mnt/logs' },
      { descripcion: 'Inicia el servicio crond', comandoSugerido: 'sudo systemctl start crond' },
      { descripcion: 'Habilita crond al arranque', comandoSugerido: 'sudo systemctl enable crond' },
      { descripcion: 'Verifica que crond está activo', comandoSugerido: 'systemctl status crond' }
    ],
    pistas: [
      'Primero el disco (mkfs + mount), luego el servicio que lo usará.',
      'systemctl start arranca el servicio ahora; enable lo deja persistente.',
      'status confirma que el servicio está active (running).'
    ],
    comandosUtiles: ['lsblk', 'mkfs', 'mount', 'systemctl']
  },

  // ──────────────────────────────────────────────
  // BLOQUE 11C: Puros de discos (pasan filtro restrictivo) (3)
  // ──────────────────────────────────────────────
  {
    id: 115,
    premisa: 'Tienes dos volúmenes EBS recién adjuntos. Uno (nvme1n1) será para datos generales y debe ir en ext4; el otro (nvme2n1) será para una base de datos y debe ir en xfs. Móntalos respectivamente en /mnt/datos y /mnt/db.',
    tematicas: ['Gestión de discos y almacenamiento'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/mnt/datos', owner: 'root', group: 'root', perms: '755' },
          { path: '/mnt/db',    owner: 'root', group: 'root', perms: '755' }
        ],
        files: []
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2',
      discos: [
        { name: 'nvme0n1',   size: '8G',  type: 'disk', parent: null,      formatted: null,  mountpoint: null },
        { name: 'nvme0n1p1', size: '8G',  type: 'part', parent: 'nvme0n1', formatted: 'xfs', mountpoint: '/' },
        { name: 'nvme1n1',   size: '20G', type: 'disk', parent: null,      formatted: null,  mountpoint: null },
        { name: 'nvme2n1',   size: '50G', type: 'disk', parent: null,      formatted: null,  mountpoint: null }
      ]
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Confirma ambos discos disponibles', comandoSugerido: 'lsblk' },
      { descripcion: 'Formatea nvme1n1 como ext4', comandoSugerido: 'sudo mkfs -t ext4 /dev/nvme1n1' },
      { descripcion: 'Formatea nvme2n1 como xfs', comandoSugerido: 'sudo mkfs -t xfs /dev/nvme2n1' },
      { descripcion: 'Monta nvme1n1 en /mnt/datos', comandoSugerido: 'sudo mount /dev/nvme1n1 /mnt/datos' },
      { descripcion: 'Monta nvme2n1 en /mnt/db', comandoSugerido: 'sudo mount /dev/nvme2n1 /mnt/db' },
      { descripcion: 'Verifica que ambos están montados', comandoSugerido: 'lsblk' }
    ],
    pistas: [
      'mkfs -t admite varios tipos: ext4, xfs, vfat...',
      'Cada disco se formatea por separado.',
      'lsblk al final muestra ambos discos con sus puntos de montaje.'
    ],
    comandosUtiles: ['lsblk', 'mkfs', 'mount']
  },

  {
    id: 116,
    premisa: 'Migración de almacenamiento: el disco antiguo /mnt/datos quedó pequeño. Desmóntalo, formatea el disco nuevo (nvme2n1, mayor capacidad) y móntalo en el mismo punto /mnt/datos.',
    tematicas: ['Gestión de discos y almacenamiento'],
    estadoInicial: {
      fs: {
        dirs: [{ path: '/mnt/datos', owner: 'root', group: 'root', perms: '755' }],
        files: []
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2',
      discos: [
        { name: 'nvme0n1',   size: '8G',  type: 'disk', parent: null,      formatted: null,   mountpoint: null },
        { name: 'nvme0n1p1', size: '8G',  type: 'part', parent: 'nvme0n1', formatted: 'xfs',  mountpoint: '/' },
        { name: 'nvme1n1',   size: '10G', type: 'disk', parent: null,      formatted: 'ext4', mountpoint: '/mnt/datos' },
        { name: 'nvme2n1',   size: '50G', type: 'disk', parent: null,      formatted: null,   mountpoint: null }
      ]
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Inspecciona el estado actual', comandoSugerido: 'lsblk' },
      { descripcion: 'Desmonta el disco antiguo', comandoSugerido: 'sudo umount /mnt/datos' },
      { descripcion: 'Formatea el disco nuevo como ext4', comandoSugerido: 'sudo mkfs -t ext4 /dev/nvme2n1' },
      { descripcion: 'Monta el disco nuevo en /mnt/datos', comandoSugerido: 'sudo mount /dev/nvme2n1 /mnt/datos' },
      { descripcion: 'Confirma la migración', comandoSugerido: 'lsblk' }
    ],
    pistas: [
      'Para reusar un punto de montaje, primero hay que desmontarlo.',
      'umount libera el punto sin afectar el disco antiguo (sigue formateado).',
      'En la migración real copiarías los datos antes de desmontar; aquí simplificamos.'
    ],
    comandosUtiles: ['lsblk', 'umount', 'mkfs', 'mount']
  },

  {
    id: 117,
    premisa: 'Auditoría de almacenamiento: necesitas un informe rápido sobre qué particiones existen y qué directorios son puntos de montaje activos. Inspecciona con fdisk, valida con mountpoint y revisa el árbol con lsblk.',
    tematicas: ['Gestión de discos y almacenamiento'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/mnt/montado', owner: 'root', group: 'root', perms: '755' },
          { path: '/mnt/vacio',   owner: 'root', group: 'root', perms: '755' }
        ],
        files: []
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2',
      discos: [
        { name: 'nvme0n1',     size: '8G',  type: 'disk', parent: null,      formatted: null,   mountpoint: null },
        { name: 'nvme0n1p1',   size: '8G',  type: 'part', parent: 'nvme0n1', formatted: 'xfs',  mountpoint: '/' },
        { name: 'nvme0n1p128', size: '10M', type: 'part', parent: 'nvme0n1', formatted: 'vfat', mountpoint: '/boot/efi' },
        { name: 'nvme1n1',     size: '20G', type: 'disk', parent: null,      formatted: 'ext4', mountpoint: '/mnt/montado' }
      ]
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Tabla de particiones detallada', comandoSugerido: 'sudo fdisk -l' },
      { descripcion: 'Verifica que /mnt/montado es punto de montaje', comandoSugerido: 'mountpoint /mnt/montado' },
      { descripcion: 'Verifica que /mnt/vacio NO es punto de montaje', comandoSugerido: 'mountpoint /mnt/vacio' },
      { descripcion: 'Vista jerárquica de bloques', comandoSugerido: 'lsblk' }
    ],
    pistas: [
      'fdisk -l da detalle de cada partición y su tipo.',
      'mountpoint sale con éxito si la ruta es punto de montaje, error si no.',
      'lsblk muestra la misma información en árbol con los mountpoints visibles.'
    ],
    comandosUtiles: ['fdisk', 'mountpoint', 'lsblk']
  }
];
