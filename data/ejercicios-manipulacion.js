const ejerciciosManipulacion = [
  // ──────────────────────────────────────────────
  // BLOQUE 4: Manipulación avanzada de archivos (8)
  // ──────────────────────────────────────────────
  {
    id: 27,
    premisa: 'Analiza logs de acceso para encontrar todas las peticiones con error 404.',
    tematicas: ['Manipulación avanzada de archivos'],
    estadoInicial: {
      fs: {
        dirs: [],
        files: [
          {
            path: '/home/user-ec2/access.log',
            owner: 'user-ec2', group: 'user-ec2', perms: '644',
            content: '192.168.1.1 GET /index.html 200\n192.168.1.2 GET /missing.html 404\n192.168.1.3 POST /api 200\n10.0.0.1 GET /lost.php 404\n'
          }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver el contenido completo del log', comandoSugerido: 'cat access.log' },
      { descripcion: 'Filtrar solo las líneas con código 404', comandoSugerido: 'grep 404 access.log' },
      { descripcion: 'Contar cuántas peticiones dieron 404', comandoSugerido: 'grep -c 404 access.log' }
    ],
    pistas: [
      'grep patrón archivo busca líneas que coincidan.',
      'grep -c cuenta las coincidencias.',
      'grep -i hace búsqueda sin distinción de mayúsculas.'
    ],
    comandosUtiles: ['grep', 'cat', 'wc']
  },

  {
    id: 28,
    premisa: 'Procesa un archivo CSV de usuarios para extraer solo los nombres de usuario.',
    tematicas: ['Manipulación avanzada de archivos'],
    estadoInicial: {
      fs: {
        dirs: [],
        files: [
          {
            path: '/home/user-ec2/usuarios.csv',
            owner: 'user-ec2', group: 'user-ec2', perms: '644',
            content: 'username,email,rol\nana,ana@corp.com,admin\nbob,bob@corp.com,dev\ncarlos,carlos@corp.com,ops\n'
          }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver el archivo CSV', comandoSugerido: 'cat usuarios.csv' },
      { descripcion: 'Extraer solo la primera columna', comandoSugerido: 'cut -d, -f1 usuarios.csv' },
      { descripcion: 'Ver las primeras 3 líneas del archivo', comandoSugerido: 'head -3 usuarios.csv' },
      { descripcion: 'Ver solo la última línea', comandoSugerido: 'tail -1 usuarios.csv' }
    ],
    pistas: [
      'cut -d, -f1 divide por coma y toma el primer campo.',
      'head -n muestra las primeras n líneas.',
      'tail -n muestra las últimas n líneas.'
    ],
    comandosUtiles: ['cut', 'head', 'tail', 'cat']
  },

  {
    id: 29,
    premisa: 'Ordena y elimina duplicados de un listado de IPs de acceso al servidor.',
    tematicas: ['Manipulación avanzada de archivos'],
    estadoInicial: {
      fs: {
        dirs: [],
        files: [
          {
            path: '/home/user-ec2/ips.txt',
            owner: 'user-ec2', group: 'user-ec2', perms: '644',
            content: '10.0.0.5\n192.168.1.1\n10.0.0.5\n172.16.0.1\n192.168.1.1\n10.0.0.3\n'
          }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver el contenido del archivo', comandoSugerido: 'cat ips.txt' },
      { descripcion: 'Ordenar las IPs alfabéticamente', comandoSugerido: 'sort ips.txt' },
      { descripcion: 'Ordenar y eliminar duplicados', comandoSugerido: 'sort -u ips.txt' },
      { descripcion: 'Contar cuántas IPs únicas hay', comandoSugerido: 'sort -u ips.txt | wc -l' }
    ],
    pistas: [
      'sort ordena líneas alfabéticamente.',
      'sort -u ordena y elimina duplicados.',
      'wc -l cuenta líneas.'
    ],
    comandosUtiles: ['sort', 'uniq', 'wc', 'cat']
  },

  {
    id: 30,
    premisa: 'Busca archivos de configuración modificados recientemente en el sistema.',
    tematicas: ['Manipulación avanzada de archivos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/etc', owner: 'user-ec2', group: 'user-ec2', perms: '755' },
          { path: '/home/user-ec2/etc/nginx', owner: 'user-ec2', group: 'user-ec2', perms: '755' }
        ],
        files: [
          { path: '/home/user-ec2/etc/hosts', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '127.0.0.1 localhost\n' },
          { path: '/home/user-ec2/etc/nginx/nginx.conf', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'worker_processes 4;\n' },
          { path: '/home/user-ec2/etc/resolv.conf', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'nameserver 8.8.8.8\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Buscar todos los archivos .conf en etc/', comandoSugerido: 'find etc -name "*.conf"' },
      { descripcion: 'Buscar archivos con nombre "hosts"', comandoSugerido: 'find etc -name "hosts"' },
      { descripcion: 'Contar líneas de nginx.conf', comandoSugerido: 'wc -l etc/nginx/nginx.conf' }
    ],
    pistas: [
      'find directorio -name "patrón" busca por nombre.',
      'Los comodines como *.conf requieren comillas.',
      'wc -l archivo cuenta las líneas.'
    ],
    comandosUtiles: ['find', 'wc', 'grep']
  },

  {
    id: 31,
    premisa: 'Reemplaza una cadena de configuración obsoleta en un archivo de parámetros.',
    tematicas: ['Manipulación avanzada de archivos'],
    estadoInicial: {
      fs: {
        dirs: [],
        files: [
          {
            path: '/home/user-ec2/config.ini',
            owner: 'user-ec2', group: 'user-ec2', perms: '644',
            content: 'host=old-server\nport=3306\ndb=myapp\nhost_backup=old-server\n'
          }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver el archivo original', comandoSugerido: 'cat config.ini' },
      { descripcion: 'Sustituir old-server por new-server', comandoSugerido: 'sed -i "s/old-server/new-server/g" config.ini' },
      { descripcion: 'Verificar el resultado', comandoSugerido: 'cat config.ini' }
    ],
    pistas: [
      'sed -i edita el archivo en su lugar (in-place).',
      's/old/new/g sustituye todas las ocurrencias.',
      'Sin -i, sed muestra el resultado sin modificar el archivo.'
    ],
    comandosUtiles: ['sed', 'cat', 'grep']
  },

  {
    id: 32,
    premisa: 'Genera estadísticas sobre el contenido de un archivo de texto de datos.',
    tematicas: ['Manipulación avanzada de archivos'],
    estadoInicial: {
      fs: {
        dirs: [],
        files: [
          {
            path: '/home/user-ec2/datos.txt',
            owner: 'user-ec2', group: 'user-ec2', perms: '644',
            content: 'manzana\nbanana\nmanzana\ncereza\nbanana\nbanana\nfresa\n'
          }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Contar líneas, palabras y caracteres', comandoSugerido: 'wc datos.txt' },
      { descripcion: 'Ordenar el archivo', comandoSugerido: 'sort datos.txt' },
      { descripcion: 'Contar ocurrencias de cada valor', comandoSugerido: 'sort datos.txt | uniq -c' }
    ],
    pistas: [
      'wc sin flags muestra líneas, palabras y bytes.',
      'uniq -c cuenta ocurrencias consecutivas.',
      'Debes ordenar antes de usar uniq para agrupar.'
    ],
    comandosUtiles: ['wc', 'sort', 'uniq', 'cat']
  },

  {
    id: 33,
    premisa: 'Extrae y procesa información de un log estructurado con awk.',
    tematicas: ['Manipulación avanzada de archivos'],
    estadoInicial: {
      fs: {
        dirs: [],
        files: [
          {
            path: '/home/user-ec2/ventas.log',
            owner: 'user-ec2', group: 'user-ec2', perms: '644',
            content: 'producto precio cantidad\nmanzana 1.50 100\nbanana 0.80 200\ncereza 3.00 50\n'
          }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver el archivo de ventas', comandoSugerido: 'cat ventas.log' },
      { descripcion: 'Mostrar solo el nombre del producto y precio', comandoSugerido: 'awk \'{print $1, $2}\' ventas.log' },
      { descripcion: 'Filtrar solo líneas que no son la cabecera', comandoSugerido: 'awk \'NR>1 {print $1}\' ventas.log' }
    ],
    pistas: [
      'awk procesa texto campo por campo.',
      '$1, $2 son el primer y segundo campo.',
      'NR es el número de línea actual.'
    ],
    comandosUtiles: ['awk', 'cat', 'grep']
  },

  {
    id: 34,
    premisa: 'Busca recursivamente patrones de error en los logs de múltiples servicios.',
    tematicas: ['Manipulación avanzada de archivos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/logs', owner: 'user-ec2', group: 'user-ec2', perms: '755' }
        ],
        files: [
          { path: '/home/user-ec2/logs/app.log', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'INFO: start\nERROR: null pointer\nINFO: end\n' },
          { path: '/home/user-ec2/logs/db.log', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'INFO: connected\nWARN: slow query\nERROR: timeout\n' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver los logs disponibles', comandoSugerido: 'ls logs' },
      { descripcion: 'Buscar ERROR en app.log', comandoSugerido: 'grep ERROR logs/app.log' },
      { descripcion: 'Buscar ERROR en todos los logs', comandoSugerido: 'grep ERROR logs/app.log logs/db.log' },
      { descripcion: 'Ver las últimas 2 líneas de db.log', comandoSugerido: 'tail -2 logs/db.log' }
    ],
    pistas: [
      'grep patrón archivo1 archivo2 busca en múltiples archivos.',
      'grep -r busca recursivamente en directorios.',
      'tail -n muestra las últimas n líneas.'
    ],
    comandosUtiles: ['grep', 'tail', 'head', 'ls']
  }
];
