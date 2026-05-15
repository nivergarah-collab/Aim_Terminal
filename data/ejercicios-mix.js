const ejerciciosMix = [
  // ── Permisos ─────────────────────────────────────────────────

  {
    id: 69,
    premisa: 'Los archivos de configuración de una aplicación tienen permisos demasiado abiertos. Ajusta cada uno según su nivel de sensibilidad: directorio privado, credenciales solo del propietario y configuración legible por el grupo.',
    tematicas: ['Permisos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/config', owner: 'user-ec2', group: 'user-ec2', perms: '777' }
        ],
        files: [
          { path: '/home/user-ec2/config/secret.key', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'SECRET=abc123\n' },
          { path: '/home/user-ec2/config/app.conf',   owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'APP_ENV=production\n' }
        ]
      },
      usuarios: [],
      grupos: [{ name: 'devs' }],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver permisos actuales del directorio y archivos', comandoSugerido: 'ls -l config/' },
      { descripcion: 'Restringir config/ a solo el propietario',        comandoSugerido: 'chmod 700 config/' },
      { descripcion: 'Proteger secret.key: solo el propietario',        comandoSugerido: 'chmod 600 config/secret.key' },
      { descripcion: 'Configuración general legible por el grupo',       comandoSugerido: 'chmod 640 config/app.conf' },
      { descripcion: 'Asignar grupo devs al directorio config/',         comandoSugerido: 'chgrp devs config/' },
      { descripcion: 'Verificar resultado final',                        comandoSugerido: 'ls -l config/' }
    ],
    pistas: [
      '700 = rwx------: solo el propietario puede leer, escribir y entrar.',
      '600 = rw-------: solo el propietario puede leer y escribir, nadie más.',
      '640 = rw-r-----: propietario rw, grupo solo lectura, otros sin acceso.',
      'chgrp grupo ruta cambia el grupo propietario sin tocar el propietario.'
    ],
    comandosUtiles: ['chmod', 'chgrp', 'ls']
  },

  {
    id: 70,
    premisa: 'Un servidor web tiene todos sus archivos con permisos 777. Corrígelos: el directorio debe permitir navegación (755), los archivos públicos deben ser legibles por todos (644) y el archivo de contraseñas debe ser completamente privado (600).',
    tematicas: ['Permisos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/www', owner: 'user-ec2', group: 'user-ec2', perms: '777' }
        ],
        files: [
          { path: '/home/user-ec2/www/index.html', owner: 'user-ec2', group: 'user-ec2', perms: '777', content: '<h1>Inicio</h1>\n' },
          { path: '/home/user-ec2/www/style.css',  owner: 'user-ec2', group: 'user-ec2', perms: '777', content: 'body{margin:0}\n' },
          { path: '/home/user-ec2/www/.htpasswd',  owner: 'user-ec2', group: 'user-ec2', perms: '777', content: 'admin:$apr1$xyz\n' }
        ]
      },
      usuarios: [],
      grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver permisos actuales',                  comandoSugerido: 'ls -l www/' },
      { descripcion: 'Corregir permisos del directorio www/',  comandoSugerido: 'chmod 755 www/' },
      { descripcion: 'Permisos estándar para index.html',      comandoSugerido: 'chmod 644 www/index.html' },
      { descripcion: 'Permisos estándar para style.css',       comandoSugerido: 'chmod 644 www/style.css' },
      { descripcion: 'Proteger .htpasswd completamente',       comandoSugerido: 'chmod 600 www/.htpasswd' },
      { descripcion: 'Verificar todos los permisos',           comandoSugerido: 'ls -l www/' }
    ],
    pistas: [
      '755 = rwxr-xr-x: el propietario controla el dir, los demás solo navegan.',
      '644 = rw-r--r--: el estándar para archivos públicos de solo lectura.',
      '600 = rw-------: el archivo de contraseñas nunca debe ser legible por otros.',
      'Puedes ver archivos ocultos (como .htpasswd) con ls -la.'
    ],
    comandosUtiles: ['chmod', 'ls']
  },

  {
    id: 71,
    premisa: 'Practica chmod con notación simbólica. Un script de métricas debe ser ejecutable por su propietario, y un archivo CSV de resultados debe poder ser leído por el grupo y por otros usuarios.',
    tematicas: ['Permisos'],
    estadoInicial: {
      fs: {
        dirs: [],
        files: [
          { path: '/home/user-ec2/collect.sh',  owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '#!/bin/bash\necho ok\n' },
          { path: '/home/user-ec2/metrics.csv', owner: 'user-ec2', group: 'user-ec2', perms: '600', content: 'cpu,mem\n45,60\n' }
        ]
      },
      usuarios: [],
      grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver permisos actuales de ambos archivos',           comandoSugerido: 'ls -l' },
      { descripcion: 'Agregar ejecución al propietario de collect.sh',    comandoSugerido: 'chmod u+x collect.sh' },
      { descripcion: 'Permitir lectura del CSV al grupo',                  comandoSugerido: 'chmod g+r metrics.csv' },
      { descripcion: 'Permitir lectura del CSV a otros',                   comandoSugerido: 'chmod o+r metrics.csv' },
      { descripcion: 'Verificar collect.sh',                               comandoSugerido: 'ls -l collect.sh' },
      { descripcion: 'Verificar metrics.csv',                              comandoSugerido: 'ls -l metrics.csv' }
    ],
    pistas: [
      'u=propietario, g=grupo, o=otros. chmod u+x añade ejecución sin tocar el resto.',
      'chmod g+r añade lectura al grupo sin modificar propietario ni otros.',
      'Puedes combinar: chmod go+r archivo en lugar de dos comandos separados.',
      'ls -l muestra permisos como rwxrwxrwx: posiciones 1-3 propietario, 4-6 grupo, 7-9 otros.'
    ],
    comandosUtiles: ['chmod', 'ls']
  },

  {
    id: 72,
    premisa: `Crea la estructura de directorios de un proyecto y establece permisos distintos en cada capa.\n\nParte 1 — Estructura:\n  1. Crea el directorio raíz "proyecto/" con tres subdirectorios: "bin/", "lib/" y "conf/".\n  2. Escribe "MODE=prod" en "proyecto/conf/settings.ini".\n\nParte 2 — Permisos por nivel:\n  3. "bin/" accesible para todos: 755.\n  4. "lib/" restringida al grupo propietario: 750.\n  5. "conf/" completamente privada: 700.\n  6. "settings.ini" solo lectura/escritura del propietario: 600.\n  7. Verifica con ls -l proyecto/`,
    tematicas: ['Permisos', 'Navegación y archivos básicos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [],
      grupos: [{ name: 'devs' }],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear directorio raíz proyecto/',              comandoSugerido: 'mkdir proyecto' },
      { descripcion: 'Crear subdirectorios bin/, lib/ y conf/',      comandoSugerido: 'mkdir proyecto/bin proyecto/lib proyecto/conf' },
      { descripcion: 'Crear archivo de configuración settings.ini',  comandoSugerido: 'echo "MODE=prod" > proyecto/conf/settings.ini' },
      { descripcion: 'Permisos 755 para bin/ (acceso público)',      comandoSugerido: 'chmod 755 proyecto/bin' },
      { descripcion: 'Permisos 750 para lib/ (solo grupo)',          comandoSugerido: 'chmod 750 proyecto/lib' },
      { descripcion: 'Permisos 700 para conf/ (solo propietario)',   comandoSugerido: 'chmod 700 proyecto/conf' },
      { descripcion: 'Proteger settings.ini a 600',                  comandoSugerido: 'chmod 600 proyecto/conf/settings.ini' },
      { descripcion: 'Verificar estructura y permisos',              comandoSugerido: 'ls -l proyecto/' }
    ],
    pistas: [
      'mkdir acepta múltiples rutas separadas por espacios.',
      '750 = rwxr-x---: propietario rwx, grupo rx, otros sin acceso.',
      'Empieza por crear la estructura antes de aplicar permisos.',
      'ls -l proyecto/ muestra solo el primer nivel; ls -lR proyecto/ muestra todo.'
    ],
    comandosUtiles: ['mkdir', 'echo', 'chmod', 'ls']
  },

  {
    id: 73,
    premisa: `Configura un directorio de trabajo compartido entre un usuario nuevo y el usuario actual.\n\nParte 1 — Usuarios y grupo:\n  1. Crea el usuario "analista" con directorio home.\n  2. Crea el grupo "equipo".\n  3. Añade user-ec2 al grupo equipo.\n  4. Añade analista al grupo equipo.\n\nParte 2 — Directorio compartido:\n  5. Crea el directorio "datos_compartidos/".\n  6. Cambia su propietario a user-ec2 y su grupo a equipo.\n  7. Establece permisos 770 (propietario y grupo leen/escriben, otros sin acceso).\n  8. Verifica con ls -l.`,
    tematicas: ['Permisos', 'Administración de usuarios y grupos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [],
      grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear usuario analista con home',               comandoSugerido: 'sudo useradd -m analista' },
      { descripcion: 'Crear grupo equipo',                             comandoSugerido: 'sudo groupadd equipo' },
      { descripcion: 'Añadir user-ec2 al grupo equipo',               comandoSugerido: 'sudo usermod -aG equipo user-ec2' },
      { descripcion: 'Añadir analista al grupo equipo',               comandoSugerido: 'sudo usermod -aG equipo analista' },
      { descripcion: 'Crear directorio datos_compartidos/',            comandoSugerido: 'mkdir datos_compartidos' },
      { descripcion: 'Asignar propietario y grupo al directorio',     comandoSugerido: 'sudo chown user-ec2:equipo datos_compartidos' },
      { descripcion: 'Permisos 770: propietario y grupo con acceso total', comandoSugerido: 'chmod 770 datos_compartidos' },
      { descripcion: 'Verificar resultado',                            comandoSugerido: 'ls -l' }
    ],
    pistas: [
      'useradd -m crea el directorio home del nuevo usuario automáticamente.',
      'usermod -aG grupo usuario agrega al grupo sin eliminar membresías existentes.',
      'chown usuario:grupo ruta cambia propietario y grupo en un solo comando.',
      '770 = rwxrwx---: propietario y grupo tienen control total, otros no pueden ni ver.'
    ],
    comandosUtiles: ['sudo', 'useradd', 'groupadd', 'usermod', 'mkdir', 'chown', 'chmod', 'ls']
  },

  // ── Navegación y archivos básicos ────────────────────────────

  {
    id: 74,
    premisa: 'Tu directorio home tiene archivos de código, pruebas y documentación mezclados. Organízalos en subdirectorios por tipo para que el proyecto tenga una estructura clara.',
    tematicas: ['Navegación y archivos básicos'],
    estadoInicial: {
      fs: {
        dirs: [],
        files: [
          { path: '/home/user-ec2/main.py',      owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'def main(): pass\n' },
          { path: '/home/user-ec2/utils.py',     owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'def helper(): pass\n' },
          { path: '/home/user-ec2/test_main.py', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'import unittest\n' },
          { path: '/home/user-ec2/README.md',    owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '# Proyecto\n' },
          { path: '/home/user-ec2/config.yml',   owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'env: dev\n' }
        ]
      },
      usuarios: [],
      grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver los archivos actuales',                     comandoSugerido: 'ls' },
      { descripcion: 'Crear directorios src/, tests/ y docs/',        comandoSugerido: 'mkdir src tests docs' },
      { descripcion: 'Mover main.py al directorio src/',              comandoSugerido: 'mv main.py src/' },
      { descripcion: 'Mover utils.py al directorio src/',             comandoSugerido: 'mv utils.py src/' },
      { descripcion: 'Mover test_main.py al directorio tests/',       comandoSugerido: 'mv test_main.py tests/' },
      { descripcion: 'Mover README.md al directorio docs/',           comandoSugerido: 'mv README.md docs/' },
      { descripcion: 'Verificar contenido de src/',                   comandoSugerido: 'ls src/' }
    ],
    pistas: [
      'mkdir acepta múltiples argumentos para crear varios directorios a la vez.',
      'mv archivo directorio/ mueve el archivo al directorio manteniendo el nombre.',
      'Puedes verificar toda la estructura con ls -R para ver subdirectorios.',
      'config.yml puede quedarse en el home; no todo tiene que moverse.'
    ],
    comandosUtiles: ['ls', 'mkdir', 'mv']
  },

  {
    id: 75,
    premisa: 'Crea el árbol de directorios de una empresa con sus departamentos y navega por él usando rutas absolutas y relativas. Observa cómo cambia el resultado de pwd en cada posición.',
    tematicas: ['Navegación y archivos básicos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [],
      grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear directorio raíz empresa/',               comandoSugerido: 'mkdir empresa' },
      { descripcion: 'Crear departamentos ventas/, ops/ y rrhh/',    comandoSugerido: 'mkdir empresa/ventas empresa/ops empresa/rrhh' },
      { descripcion: 'Crear subdirectorios dentro de ops/',           comandoSugerido: 'mkdir empresa/ops/tools empresa/ops/logs' },
      { descripcion: 'Ver directorio actual',                         comandoSugerido: 'pwd' },
      { descripcion: 'Entrar a empresa/ops con ruta relativa',       comandoSugerido: 'cd empresa/ops' },
      { descripcion: 'Confirmar posición actual',                     comandoSugerido: 'pwd' },
      { descripcion: 'Ver contenido del directorio actual',           comandoSugerido: 'ls' },
      { descripcion: 'Subir dos niveles con ruta relativa',           comandoSugerido: 'cd ../..' },
      { descripcion: 'Confirmar que volviste al home',                comandoSugerido: 'pwd' }
    ],
    pistas: [
      'mkdir ruta/subdir crea el subdirectorio si el padre ya existe.',
      'cd ../.. sube dos niveles en la jerarquía de directorios.',
      'pwd imprime la ruta absoluta de tu posición actual.',
      'Una ruta relativa parte desde tu posición actual; una absoluta empieza con /.'
    ],
    comandosUtiles: ['mkdir', 'pwd', 'cd', 'ls']
  },

  {
    id: 76,
    premisa: 'Gestiona archivos de reportes mensuales: crea una carpeta de respaldo, copia todos los reportes, renombra el más antiguo como obsoleto y elimina un duplicado innecesario.',
    tematicas: ['Navegación y archivos básicos'],
    estadoInicial: {
      fs: {
        dirs: [],
        files: [
          { path: '/home/user-ec2/report_jan.txt', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'Reporte enero\n' },
          { path: '/home/user-ec2/report_feb.txt', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'Reporte febrero\n' },
          { path: '/home/user-ec2/report_mar.txt', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'Reporte marzo\n' }
        ]
      },
      usuarios: [],
      grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver archivos actuales',                                comandoSugerido: 'ls' },
      { descripcion: 'Crear directorio de respaldo respaldos/',               comandoSugerido: 'mkdir respaldos' },
      { descripcion: 'Copiar report_jan.txt al respaldo',                     comandoSugerido: 'cp report_jan.txt respaldos/' },
      { descripcion: 'Copiar report_feb.txt al respaldo',                     comandoSugerido: 'cp report_feb.txt respaldos/' },
      { descripcion: 'Copiar report_mar.txt al respaldo',                     comandoSugerido: 'cp report_mar.txt respaldos/' },
      { descripcion: 'Renombrar report_jan.txt como obsoleto',                comandoSugerido: 'mv report_jan.txt report_jan_old.txt' },
      { descripcion: 'Eliminar el reporte de febrero del home (ya está en respaldo)', comandoSugerido: 'rm report_feb.txt' },
      { descripcion: 'Verificar contenido del respaldo',                      comandoSugerido: 'ls respaldos/' }
    ],
    pistas: [
      'cp origen destino/ copia el archivo al directorio manteniendo el nombre.',
      'mv archivo nuevo_nombre renombra el archivo en el mismo directorio.',
      'rm elimina permanentemente; asegúrate de tener la copia en respaldos/ antes.',
      'ls respaldos/ confirma que las tres copias están a salvo.'
    ],
    comandosUtiles: ['ls', 'mkdir', 'cp', 'mv', 'rm']
  },

  {
    id: 77,
    premisa: `Crea un repositorio de archivos con secciones de distinta visibilidad y asegura cada una con los permisos adecuados.\n\nParte 1 — Estructura:\n  1. Crea el directorio "repo/" con tres subdirectorios: "public/", "private/" y "shared/".\n  2. Crea "repo/public/readme.md" con el texto "Documentación pública".\n  3. Escribe "CLAVE_API=xyz789" en "repo/private/secrets.env".\n\nParte 2 — Permisos:\n  4. "public/" accesible para todos: 755.\n  5. "private/" y su contenido completamente privados: 700 y 600.\n  6. "shared/" con acceso de lectura y ejecución para grupo y otros: 755.\n  7. Verifica con ls -l repo/`,
    tematicas: ['Navegación y archivos básicos', 'Permisos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [],
      grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear directorio repo/ y sus secciones',              comandoSugerido: 'mkdir repo' },
      { descripcion: 'Crear subdirectorios public/, private/ y shared/',    comandoSugerido: 'mkdir repo/public repo/private repo/shared' },
      { descripcion: 'Crear readme.md en la sección pública',               comandoSugerido: 'echo "Documentación pública" > repo/public/readme.md' },
      { descripcion: 'Crear archivo de credenciales en private/',           comandoSugerido: 'echo "CLAVE_API=xyz789" > repo/private/secrets.env' },
      { descripcion: 'Permisos 755 para public/',                           comandoSugerido: 'chmod 755 repo/public' },
      { descripcion: 'Permisos 700 para private/ (solo propietario)',       comandoSugerido: 'chmod 700 repo/private' },
      { descripcion: 'Permisos 600 para secrets.env',                       comandoSugerido: 'chmod 600 repo/private/secrets.env' },
      { descripcion: 'Permisos 755 para shared/',                           comandoSugerido: 'chmod 755 repo/shared' },
      { descripcion: 'Verificar permisos de las tres secciones',            comandoSugerido: 'ls -l repo/' }
    ],
    pistas: [
      'mkdir acepta varias rutas: mkdir repo/public repo/private repo/shared.',
      'echo "texto" > archivo crea el archivo con ese contenido.',
      'Aplica primero la estructura y luego los permisos en el orden que prefieras.',
      '700 en private/ ya impide el acceso; 600 en el archivo añade una capa extra.'
    ],
    comandosUtiles: ['mkdir', 'echo', 'chmod', 'ls']
  },

  {
    id: 78,
    premisa: `Prepara un área de trabajo compartida con directorios individuales para dos nuevos desarrolladores del equipo.\n\nParte 1 — Usuarios:\n  1. Crea los usuarios "dev1" y "dev2" con directorio home.\n\nParte 2 — Workspace:\n  2. Crea el directorio "workspaces/" y dentro un subdirectorio para cada usuario.\n  3. Crea un archivo README.md en cada workspace.\n  4. Asigna cada subdirectorio a su propietario correspondiente.\n  5. Verifica la estructura y los propietarios.`,
    tematicas: ['Navegación y archivos básicos', 'Administración de usuarios y grupos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [],
      grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear usuario dev1 con home',                          comandoSugerido: 'sudo useradd -m dev1' },
      { descripcion: 'Crear usuario dev2 con home',                          comandoSugerido: 'sudo useradd -m dev2' },
      { descripcion: 'Crear directorio de workspaces',                       comandoSugerido: 'mkdir workspaces' },
      { descripcion: 'Crear subdirectorios para cada usuario',               comandoSugerido: 'mkdir workspaces/dev1 workspaces/dev2' },
      { descripcion: 'Crear README.md en el workspace de dev1',              comandoSugerido: 'touch workspaces/dev1/README.md' },
      { descripcion: 'Crear README.md en el workspace de dev2',              comandoSugerido: 'touch workspaces/dev2/README.md' },
      { descripcion: 'Asignar workspaces/dev1 a dev1',                       comandoSugerido: 'sudo chown dev1 workspaces/dev1' },
      { descripcion: 'Asignar workspaces/dev2 a dev2',                       comandoSugerido: 'sudo chown dev2 workspaces/dev2' },
      { descripcion: 'Verificar propietarios',                               comandoSugerido: 'ls -l workspaces/' }
    ],
    pistas: [
      'useradd -m crea el directorio home automáticamente.',
      'mkdir acepta varias rutas: mkdir workspaces/dev1 workspaces/dev2.',
      'touch crea un archivo vacío si no existe.',
      'chown usuario ruta cambia solo el propietario sin modificar el grupo.'
    ],
    comandosUtiles: ['sudo', 'useradd', 'mkdir', 'touch', 'chown', 'ls']
  },

  // ── Administración de usuarios y grupos ──────────────────────

  {
    id: 79,
    premisa: 'Incorpora al usuario "operador" al sistema: crea su cuenta con shell bash, establece su contraseña, actualiza el comentario de la cuenta y verifica su identidad y grupos.',
    tematicas: ['Administración de usuarios y grupos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [],
      grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear usuario operador con home y shell bash',           comandoSugerido: 'sudo useradd -m -s /bin/bash operador' },
      { descripcion: 'Verificar que el usuario fue creado',                    comandoSugerido: 'id operador' },
      { descripcion: 'Establecer contraseña para operador',                    comandoSugerido: 'sudo passwd operador' },
      { descripcion: 'Actualizar el comentario de la cuenta',                  comandoSugerido: 'sudo usermod -c "Operador del sistema" operador' },
      { descripcion: 'Ver los grupos a los que pertenece operador',            comandoSugerido: 'groups operador' },
      { descripcion: 'Ver usuarios activos en el sistema',                     comandoSugerido: 'who' }
    ],
    pistas: [
      'useradd -m crea el home; -s /bin/bash establece el shell de inicio de sesión.',
      'passwd usuario solicita la nueva contraseña dos veces para confirmar.',
      'usermod -c "texto" actualiza el campo GECOS (comentario) de la cuenta.',
      'id muestra uid, gid y grupos; groups solo muestra los grupos.'
    ],
    comandosUtiles: ['sudo', 'useradd', 'id', 'passwd', 'usermod', 'groups', 'who']
  },

  {
    id: 80,
    premisa: 'El usuario "dev1" necesita acceso a los grupos "backend" y "frontend". Crea ambos grupos, agrégalo a los dos y verifica su membresía completa.',
    tematicas: ['Administración de usuarios y grupos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [
        { username: 'dev1', grupos: ['dev1'], shell: '/bin/bash', group: 'dev1' }
      ],
      grupos: [{ name: 'dev1' }],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Verificar identidad y grupos actuales de dev1', comandoSugerido: 'id dev1' },
      { descripcion: 'Crear grupo backend',                            comandoSugerido: 'sudo groupadd backend' },
      { descripcion: 'Crear grupo frontend',                           comandoSugerido: 'sudo groupadd frontend' },
      { descripcion: 'Agregar dev1 al grupo backend',                  comandoSugerido: 'sudo usermod -aG backend dev1' },
      { descripcion: 'Agregar dev1 al grupo frontend',                 comandoSugerido: 'sudo usermod -aG frontend dev1' },
      { descripcion: 'Verificar grupos actualizados de dev1',          comandoSugerido: 'id dev1' },
      { descripcion: 'Confirmar membresía con el comando groups',      comandoSugerido: 'groups dev1' }
    ],
    pistas: [
      'groupadd nombre crea un grupo nuevo vacío.',
      'usermod -aG grupo usuario: la flag -a (append) es esencial para no perder grupos existentes.',
      'Sin -a, usermod -G reemplaza todos los grupos secundarios del usuario.',
      'id muestra los grupos con sus GIDs; groups solo lista los nombres.'
    ],
    comandosUtiles: ['sudo', 'id', 'groupadd', 'usermod', 'groups']
  },

  {
    id: 81,
    premisa: 'El sistema tiene cuentas y grupos que ya no se utilizan. Identifícalos, elimínalos en el orden correcto y confirma que el sistema quedó limpio.',
    tematicas: ['Administración de usuarios y grupos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/temp_user',    owner: 'temp_user',    group: 'temp_user',    perms: '755' },
          { path: '/home/ex_empleado',  owner: 'ex_empleado',  group: 'ex_empleado',  perms: '755' }
        ],
        files: [
          { path: '/home/temp_user/notas.txt',   owner: 'temp_user',   group: 'temp_user',   perms: '644', content: 'temp\n' },
          { path: '/home/ex_empleado/datos.txt', owner: 'ex_empleado', group: 'ex_empleado', perms: '644', content: 'datos\n' }
        ]
      },
      usuarios: [
        { username: 'temp_user',   grupos: ['temp_user'],   shell: '/bin/bash', group: 'temp_user' },
        { username: 'ex_empleado', grupos: ['ex_empleado'], shell: '/bin/bash', group: 'ex_empleado' }
      ],
      grupos: [
        { name: 'temp_user' },
        { name: 'ex_empleado' },
        { name: 'legacy' }
      ],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver usuarios activos en el sistema',                   comandoSugerido: 'who' },
      { descripcion: 'Verificar que temp_user existe',                        comandoSugerido: 'id temp_user' },
      { descripcion: 'Eliminar temp_user junto con su directorio home',       comandoSugerido: 'sudo userdel -r temp_user' },
      { descripcion: 'Verificar que ex_empleado existe',                      comandoSugerido: 'id ex_empleado' },
      { descripcion: 'Eliminar ex_empleado sin borrar su home',               comandoSugerido: 'sudo userdel ex_empleado' },
      { descripcion: 'Eliminar el grupo legacy vacío',                        comandoSugerido: 'sudo groupdel legacy' },
      { descripcion: 'Confirmar que no quedan usuarios no autorizados',       comandoSugerido: 'who' }
    ],
    pistas: [
      'userdel -r elimina el usuario y su directorio home; sin -r solo borra la cuenta.',
      'Un grupo no se puede eliminar si tiene usuarios como grupo primario.',
      'id usuario devuelve un error si el usuario no existe, confirmando la eliminación.',
      'Elimina primero los usuarios y luego los grupos para evitar dependencias.'
    ],
    comandosUtiles: ['sudo', 'who', 'id', 'userdel', 'groupdel']
  },

  {
    id: 82,
    premisa: `Configura un usuario de aplicación con su propio grupo y un directorio de datos privado.\n\nParte 1 — Usuario y grupo:\n  1. Crea el usuario "appuser" con directorio home.\n  2. Crea el grupo "appgroup".\n  3. Asigna appgroup como grupo primario de appuser.\n  4. Verifica la identidad del usuario.\n\nParte 2 — Directorio privado:\n  5. Crea el directorio "appdata/" en tu home.\n  6. Asigna appuser:appgroup como propietario.\n  7. Establece permisos 750: el grupo puede leer y ejecutar, otros sin acceso.\n  8. Verifica con ls -l.`,
    tematicas: ['Administración de usuarios y grupos', 'Permisos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [],
      grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear usuario appuser con directorio home',          comandoSugerido: 'sudo useradd -m appuser' },
      { descripcion: 'Crear grupo appgroup',                                comandoSugerido: 'sudo groupadd appgroup' },
      { descripcion: 'Asignar appgroup como grupo primario de appuser',    comandoSugerido: 'sudo usermod -g appgroup appuser' },
      { descripcion: 'Verificar identidad de appuser',                      comandoSugerido: 'id appuser' },
      { descripcion: 'Crear directorio appdata/',                           comandoSugerido: 'mkdir appdata' },
      { descripcion: 'Asignar appuser:appgroup como dueños de appdata/',   comandoSugerido: 'sudo chown appuser:appgroup appdata' },
      { descripcion: 'Establecer permisos 750 en appdata/',                 comandoSugerido: 'chmod 750 appdata' },
      { descripcion: 'Verificar propietario y permisos',                    comandoSugerido: 'ls -l' }
    ],
    pistas: [
      'usermod -g (minúscula) cambia el grupo primario; -G (mayúscula) gestiona los secundarios.',
      'chown usuario:grupo ruta cambia propietario y grupo en un solo comando.',
      '750 = rwxr-x---: propietario control total, grupo puede leer y ejecutar, otros nada.',
      'id appuser confirma que el gid principal cambió al de appgroup.'
    ],
    comandosUtiles: ['sudo', 'useradd', 'groupadd', 'usermod', 'id', 'mkdir', 'chown', 'chmod', 'ls']
  },

  {
    id: 83,
    premisa: `Realiza el proceso de incorporación (onboarding) de un nuevo desarrollador: crea su cuenta, asígnale al equipo de ingeniería y prepara su directorio de proyectos.\n\nParte 1 — Cuenta y grupo:\n  1. Crea el usuario "nuevo_dev" con home y shell bash.\n  2. Crea el grupo "ingenieria".\n  3. Añade nuevo_dev al grupo ingenieria.\n\nParte 2 — Directorio de trabajo:\n  4. Crea el directorio "proyectos/" y dentro un subdirectorio "proyectos/nuevo_dev/".\n  5. Asigna ese subdirectorio a nuevo_dev.\n  6. Verifica la identidad del usuario y los propietarios del directorio.`,
    tematicas: ['Administración de usuarios y grupos', 'Navegación y archivos básicos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [],
      grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear usuario nuevo_dev con home y bash',           comandoSugerido: 'sudo useradd -m -s /bin/bash nuevo_dev' },
      { descripcion: 'Crear grupo ingenieria',                             comandoSugerido: 'sudo groupadd ingenieria' },
      { descripcion: 'Añadir nuevo_dev al grupo ingenieria',              comandoSugerido: 'sudo usermod -aG ingenieria nuevo_dev' },
      { descripcion: 'Crear directorio raíz de proyectos',                comandoSugerido: 'mkdir proyectos' },
      { descripcion: 'Crear subdirectorio para nuevo_dev',                comandoSugerido: 'mkdir proyectos/nuevo_dev' },
      { descripcion: 'Asignar el subdirectorio a nuevo_dev',              comandoSugerido: 'sudo chown nuevo_dev proyectos/nuevo_dev' },
      { descripcion: 'Verificar grupos de nuevo_dev',                     comandoSugerido: 'id nuevo_dev' },
      { descripcion: 'Verificar propietarios en proyectos/',              comandoSugerido: 'ls -l proyectos/' }
    ],
    pistas: [
      'useradd -m -s /bin/bash crea el home y establece bash como shell en un solo comando.',
      'usermod -aG grupo usuario agrega al grupo secundario sin perder los existentes.',
      'chown usuario ruta cambia solo el propietario, el grupo queda igual.',
      'id nuevo_dev muestra uid, gid primario y todos los grupos secundarios.'
    ],
    comandosUtiles: ['sudo', 'useradd', 'groupadd', 'usermod', 'mkdir', 'chown', 'id', 'ls']
  },

  // ── Triple mix ───────────────────────────────────────────────

  {
    id: 84,
    premisa: `Configura desde cero el entorno de trabajo de un equipo de desarrollo. Debes crear los usuarios con sus roles, estructurar el repositorio del proyecto y asegurar cada directorio con los permisos que corresponden a cada función.\n\nParte 1 — Usuarios y roles:\n  1. Crea el usuario "lider" con home y shell bash.\n  2. Crea el usuario "junior" con home y shell bash.\n  3. Crea el grupo "devteam".\n  4. Asigna devteam como grupo primario de lider (es el responsable del proyecto).\n  5. Agrega junior a devteam como grupo secundario (colaborador).\n\nParte 2 — Estructura del proyecto:\n  6. Crea el directorio "proyecto/" con cuatro subdirectorios: "src/", "tests/", "conf/" y "logs/".\n  7. Crea el archivo "proyecto/src/main.py" con el texto "# Módulo principal".\n  8. Crea el archivo "proyecto/conf/database.env" con el texto "DB_PASS=secreto123".\n\nParte 3 — Propietarios y permisos:\n  9. Asigna lider:devteam como dueños de todo el árbol proyecto/ de forma recursiva.\n  10. "src/" con acceso de lectura para todos: 755.\n  11. "tests/" con escritura para el grupo (el equipo escribe tests): 775.\n  12. "conf/" visible solo para propietario y grupo: 750.\n  13. "database.env" completamente privado: 600.\n  14. "logs/" con escritura universal (cualquier proceso puede registrar): 777.\n  15. Verifica la estructura final con ls -l proyecto/`,
    tematicas: ['Permisos', 'Navegación y archivos básicos', 'Administración de usuarios y grupos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [],
      grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear usuario lider con home y bash',                     comandoSugerido: 'sudo useradd -m -s /bin/bash lider' },
      { descripcion: 'Crear usuario junior con home y bash',                    comandoSugerido: 'sudo useradd -m -s /bin/bash junior' },
      { descripcion: 'Crear grupo devteam',                                      comandoSugerido: 'sudo groupadd devteam' },
      { descripcion: 'Asignar devteam como grupo primario de lider',            comandoSugerido: 'sudo usermod -g devteam lider' },
      { descripcion: 'Agregar junior a devteam como grupo secundario',          comandoSugerido: 'sudo usermod -aG devteam junior' },
      { descripcion: 'Crear directorio raíz proyecto/',                          comandoSugerido: 'mkdir proyecto' },
      { descripcion: 'Crear subdirectorios src/, tests/, conf/ y logs/',        comandoSugerido: 'mkdir proyecto/src proyecto/tests proyecto/conf proyecto/logs' },
      { descripcion: 'Crear archivo principal del proyecto',                    comandoSugerido: 'echo "# Módulo principal" > proyecto/src/main.py' },
      { descripcion: 'Crear archivo de credenciales de base de datos',          comandoSugerido: 'echo "DB_PASS=secreto123" > proyecto/conf/database.env' },
      { descripcion: 'Asignar lider:devteam a todo el árbol proyecto/',        comandoSugerido: 'sudo chown -R lider:devteam proyecto/' },
      { descripcion: 'Código fuente legible por todos: chmod 755 proyecto/src', comandoSugerido: 'chmod 755 proyecto/src' },
      { descripcion: 'Tests escribibles por el grupo: chmod 775 proyecto/tests',comandoSugerido: 'chmod 775 proyecto/tests' },
      { descripcion: 'Configuración visible solo para propietario y grupo',     comandoSugerido: 'chmod 750 proyecto/conf' },
      { descripcion: 'Credenciales completamente privadas: chmod 600',          comandoSugerido: 'chmod 600 proyecto/conf/database.env' },
      { descripcion: 'Logs escribibles para todos los procesos: chmod 777',     comandoSugerido: 'chmod 777 proyecto/logs' },
      { descripcion: 'Verificar estructura y permisos del proyecto',            comandoSugerido: 'ls -l proyecto/' }
    ],
    pistas: [
      'usermod -g (minúscula) cambia el grupo primario; -aG agrega sin reemplazar grupos secundarios.',
      'chown -R usuario:grupo ruta aplica el cambio a todo el árbol de forma recursiva.',
      '775 = rwxrwxr-x: propietario y grupo pueden escribir, otros solo leer y ejecutar.',
      '750 = rwxr-x---: otros no tienen ningún acceso al directorio de configuración.',
      'Aplica chown -R antes de chmod para no perder tiempo cambiando permisos a archivos que luego cambiarán de dueño.',
      'mkdir acepta múltiples rutas separadas por espacios para crear varios dirs a la vez.'
    ],
    comandosUtiles: ['sudo', 'useradd', 'groupadd', 'usermod', 'mkdir', 'echo', 'chown', 'chmod', 'ls']
  },

  {
    id: 85,
    premisa: `Un servidor web heredado tiene usuarios obsoletos y permisos mal configurados. Tu tarea es sanear el sistema: eliminar cuentas que ya no se usan, crear un usuario dedicado para el servicio web, construir la estructura de directorios correcta y aplicar una política de permisos estricta.\n\nParte 1 — Limpieza de cuentas:\n  1. Verifica que "old_admin" existe en el sistema.\n  2. Elimina old_admin junto con su directorio home.\n  3. Verifica que "www_legacy" también existe.\n  4. Elimina www_legacy sin borrar su home (los datos se auditan luego).\n\nParte 2 — Nuevo usuario de servicio:\n  5. Crea el usuario "webuser" con home y shell bash.\n  6. Crea el grupo "webgroup".\n  7. Asigna webgroup como grupo primario de webuser.\n\nParte 3 — Estructura web:\n  8. Crea el directorio "html/" con tres subdirectorios: "assets/", "uploads/" y "private/".\n  9. Crea "html/index.html" con el texto "<h1>Bienvenido</h1>".\n  10. Crea "html/assets/style.css" con el texto "body{margin:0}".\n  11. Crea "html/private/config.ini" con el texto "DB_HOST=localhost".\n\nParte 4 — Política de permisos:\n  12. Asigna webuser:webgroup a todo html/ de forma recursiva.\n  13. Directorio principal html/ navegable por todos: 755.\n  14. Archivos públicos (index.html y style.css) legibles por todos: 644.\n  15. Directorio private/ accesible solo por webuser: 700.\n  16. config.ini completamente privado: 600.\n  17. uploads/ con escritura universal (para subidas del servidor): 777.\n  18. Verifica el resultado con ls -l html/`,
    tematicas: ['Permisos', 'Navegación y archivos básicos', 'Administración de usuarios y grupos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/old_admin',  owner: 'old_admin',  group: 'old_admin',  perms: '755' },
          { path: '/home/www_legacy', owner: 'www_legacy', group: 'www_legacy', perms: '755' }
        ],
        files: [
          { path: '/home/old_admin/notas.txt',    owner: 'old_admin',  group: 'old_admin',  perms: '644', content: 'acceso admin\n' },
          { path: '/home/www_legacy/backup.tar',  owner: 'www_legacy', group: 'www_legacy', perms: '644', content: '__tar__:backup\n' }
        ]
      },
      usuarios: [
        { username: 'old_admin',  grupos: ['old_admin'],  shell: '/bin/bash', group: 'old_admin' },
        { username: 'www_legacy', grupos: ['www_legacy'], shell: '/bin/bash', group: 'www_legacy' }
      ],
      grupos: [
        { name: 'old_admin' },
        { name: 'www_legacy' }
      ],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Verificar que old_admin existe',                              comandoSugerido: 'id old_admin' },
      { descripcion: 'Eliminar old_admin y su directorio home',                    comandoSugerido: 'sudo userdel -r old_admin' },
      { descripcion: 'Verificar que www_legacy existe',                             comandoSugerido: 'id www_legacy' },
      { descripcion: 'Eliminar www_legacy conservando su home',                    comandoSugerido: 'sudo userdel www_legacy' },
      { descripcion: 'Crear usuario webuser con home y bash',                      comandoSugerido: 'sudo useradd -m -s /bin/bash webuser' },
      { descripcion: 'Crear grupo webgroup',                                        comandoSugerido: 'sudo groupadd webgroup' },
      { descripcion: 'Asignar webgroup como grupo primario de webuser',            comandoSugerido: 'sudo usermod -g webgroup webuser' },
      { descripcion: 'Crear directorio html/ con sus secciones',                   comandoSugerido: 'mkdir html' },
      { descripcion: 'Crear subdirectorios assets/, uploads/ y private/',          comandoSugerido: 'mkdir html/assets html/uploads html/private' },
      { descripcion: 'Crear página principal index.html',                           comandoSugerido: 'echo "<h1>Bienvenido</h1>" > html/index.html' },
      { descripcion: 'Crear hoja de estilos style.css',                            comandoSugerido: 'echo "body{margin:0}" > html/assets/style.css' },
      { descripcion: 'Crear archivo de configuración privado',                     comandoSugerido: 'echo "DB_HOST=localhost" > html/private/config.ini' },
      { descripcion: 'Asignar webuser:webgroup a todo html/ recursivamente',      comandoSugerido: 'sudo chown -R webuser:webgroup html/' },
      { descripcion: 'Directorio html/ navegable por todos',                       comandoSugerido: 'chmod 755 html/' },
      { descripcion: 'Permisos estándar para index.html',                          comandoSugerido: 'chmod 644 html/index.html' },
      { descripcion: 'Permisos estándar para style.css',                           comandoSugerido: 'chmod 644 html/assets/style.css' },
      { descripcion: 'Directorio private/ solo para webuser',                      comandoSugerido: 'chmod 700 html/private/' },
      { descripcion: 'config.ini completamente privado',                            comandoSugerido: 'chmod 600 html/private/config.ini' },
      { descripcion: 'uploads/ con escritura universal para subidas',              comandoSugerido: 'chmod 777 html/uploads/' },
      { descripcion: 'Verificar estructura y permisos finales',                    comandoSugerido: 'ls -l html/' }
    ],
    pistas: [
      'userdel -r elimina usuario y home; sin -r solo borra la cuenta y conserva los archivos.',
      'id usuario confirma si existe; devuelve error si ya fue eliminado.',
      'chown -R aplica el cambio de propietario a todos los archivos y subdirectorios del árbol.',
      '700 en private/ basta para bloquearlo: si el directorio no es ejecutable para otros, no pueden ni listar su contenido.',
      '777 en uploads/ es deliberado: el proceso del servidor web necesita escribir archivos de cualquier usuario.',
      'El orden recomendado: usuarios → estructura → chown recursivo → chmod por capas.'
    ],
    comandosUtiles: ['sudo', 'id', 'userdel', 'useradd', 'groupadd', 'usermod', 'mkdir', 'echo', 'chown', 'chmod', 'ls']
  },

  // ── Servicios y automatización ───────────────────────────────

  {
    id: 86,
    premisa: 'Practica el ciclo básico de gestión de un servicio: instala el paquete cronie, arranca el demonio crond, consulta su estado activo y luego deténlo para verificar el cambio.',
    tematicas: ['Servicios y automatización'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Instalar el paquete cronie con yum',       comandoSugerido: 'sudo yum install cronie' },
      { descripcion: 'Arrancar el servicio crond',               comandoSugerido: 'sudo systemctl start crond' },
      { descripcion: 'Consultar el estado del servicio',         comandoSugerido: 'systemctl status crond' },
      { descripcion: 'Detener el servicio crond',                comandoSugerido: 'sudo systemctl stop crond' },
      { descripcion: 'Verificar que el servicio está inactivo',  comandoSugerido: 'systemctl status crond' }
    ],
    pistas: [
      'yum install paquete descarga e instala el paquete y sus dependencias.',
      'systemctl start arranca el servicio ahora; no persiste tras un reinicio.',
      'systemctl stop detiene el servicio; el campo Active cambia a inactive (dead).',
      'status no requiere sudo ya que solo consulta, no modifica el servicio.'
    ],
    comandosUtiles: ['sudo', 'yum', 'systemctl']
  },

  {
    id: 87,
    premisa: 'Configura el servidor web httpd para que esté disponible en cada arranque del sistema. Instálalo, inícialo y habilítalo, luego practica deshabilitarlo y detenerlo.',
    tematicas: ['Servicios y automatización'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Instalar el paquete httpd',                          comandoSugerido: 'sudo yum install httpd' },
      { descripcion: 'Iniciar el servicio httpd',                          comandoSugerido: 'sudo systemctl start httpd' },
      { descripcion: 'Habilitar httpd para que arranque automáticamente',  comandoSugerido: 'sudo systemctl enable httpd' },
      { descripcion: 'Verificar estado: activo y habilitado',              comandoSugerido: 'systemctl status httpd' },
      { descripcion: 'Deshabilitar httpd del arranque automático',         comandoSugerido: 'sudo systemctl disable httpd' },
      { descripcion: 'Detener el servicio httpd',                          comandoSugerido: 'sudo systemctl stop httpd' }
    ],
    pistas: [
      'start/stop controlan si el servicio corre ahora mismo.',
      'enable/disable controlan si arrancará automáticamente al encender el sistema.',
      'Un servicio puede estar activo pero deshabilitado, o inactivo pero habilitado.',
      'systemctl enable muestra el symlink creado en /etc/systemd/system/...'
    ],
    comandosUtiles: ['sudo', 'yum', 'systemctl']
  },

  {
    id: 88,
    premisa: 'Configura una tarea automática con cron: instala y arranca crond, habilítalo para el arranque, abre el editor de crontab para registrar una tarea y lista las entradas activas.',
    tematicas: ['Servicios y automatización'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Instalar cronie',                             comandoSugerido: 'sudo yum install cronie' },
      { descripcion: 'Arrancar el demonio crond',                   comandoSugerido: 'sudo systemctl start crond' },
      { descripcion: 'Habilitar crond al arranque',                 comandoSugerido: 'sudo systemctl enable crond' },
      { descripcion: 'Verificar estado de crond',                   comandoSugerido: 'systemctl status crond' },
      { descripcion: 'Monitorear crond en tiempo real con watch',   comandoSugerido: 'watch systemctl status crond' },
      { descripcion: 'Abrir el editor de crontab',                  comandoSugerido: 'crontab -e' },
      { descripcion: 'Listar las tareas programadas',               comandoSugerido: 'crontab -l' }
    ],
    pistas: [
      'crond es el demonio que ejecuta las tareas; cronie es el paquete que lo incluye.',
      'watch <comando> refresca el estado cada 2 segundos para monitoreo continuo.',
      'crontab -e abre el editor; cada línea sigue el formato: min hora día mes díasemana comando.',
      'crontab -l lista sin modificar; crontab -r elimina todas las tareas del usuario.'
    ],
    comandosUtiles: ['sudo', 'yum', 'systemctl', 'watch', 'crontab']
  },

  {
    id: 89,
    premisa: `Prepara el entorno de un servicio web antes de arrancarlo: crea los directorios necesarios, instala httpd y ponlo en marcha.\n\nParte 1 — Estructura de directorios:\n  1. Crea el directorio "servicio/" con dos subdirectorios: "logs/" y "conf/".\n  2. Crea el archivo "servicio/logs/access.log" vacío.\n  3. Crea el archivo "servicio/conf/httpd.conf" con el texto "ServerName localhost".\n\nParte 2 — Servicio:\n  4. Instala el paquete httpd.\n  5. Inicia httpd y habilítalo al arranque.\n  6. Verifica su estado.\n  7. Lista el contenido de servicio/logs/ para confirmar la estructura.`,
    tematicas: ['Servicios y automatización', 'Navegación y archivos básicos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear directorio raíz servicio/',                        comandoSugerido: 'mkdir servicio' },
      { descripcion: 'Crear subdirectorios logs/ y conf/',                     comandoSugerido: 'mkdir servicio/logs servicio/conf' },
      { descripcion: 'Crear archivo de log vacío',                             comandoSugerido: 'touch servicio/logs/access.log' },
      { descripcion: 'Crear archivo de configuración del servidor',            comandoSugerido: 'echo "ServerName localhost" > servicio/conf/httpd.conf' },
      { descripcion: 'Instalar httpd',                                          comandoSugerido: 'sudo yum install httpd' },
      { descripcion: 'Iniciar el servicio httpd',                              comandoSugerido: 'sudo systemctl start httpd' },
      { descripcion: 'Habilitar httpd al arranque automático',                 comandoSugerido: 'sudo systemctl enable httpd' },
      { descripcion: 'Verificar que httpd está activo y habilitado',           comandoSugerido: 'systemctl status httpd' },
      { descripcion: 'Listar el directorio de logs',                           comandoSugerido: 'ls servicio/logs/' }
    ],
    pistas: [
      'mkdir acepta varias rutas: mkdir servicio/logs servicio/conf crea los dos a la vez.',
      'touch crea un archivo vacío; útil para preparar archivos de log antes de que el servicio escriba en ellos.',
      'start e enable pueden ejecutarse en cualquier orden, pero es habitual arrancar primero y habilitar después.',
      'status muestra tanto si está corriendo (Active) como si arrancará solo (Loaded: enabled/disabled).'
    ],
    comandosUtiles: ['mkdir', 'touch', 'echo', 'sudo', 'yum', 'systemctl', 'ls']
  },

  {
    id: 90,
    premisa: `Organiza el directorio de trabajo de un cron job antes de configurarlo: prepara la estructura de carpetas donde se guardarán los resultados, arranca el demonio crond y programa la tarea.\n\nParte 1 — Estructura de directorios:\n  1. Crea el directorio "automatizacion/" con dos subdirectorios: "scripts/" y "logs/".\n  2. Crea el script "automatizacion/scripts/tarea.sh" con el texto "#!/bin/bash".\n  3. Crea el archivo de log vacío "automatizacion/logs/salida.log".\n\nParte 2 — Servicio y tarea programada:\n  4. Instala cronie y arranca crond.\n  5. Habilita crond al arranque.\n  6. Verifica el estado del servicio.\n  7. Abre el crontab para programar la tarea.\n  8. Lista las tareas activas para confirmar.`,
    tematicas: ['Servicios y automatización', 'Navegación y archivos básicos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear directorio raíz automatizacion/',                        comandoSugerido: 'mkdir automatizacion' },
      { descripcion: 'Crear subdirectorios scripts/ y logs/',                        comandoSugerido: 'mkdir automatizacion/scripts automatizacion/logs' },
      { descripcion: 'Crear el script de la tarea',                                  comandoSugerido: 'echo "#!/bin/bash" > automatizacion/scripts/tarea.sh' },
      { descripcion: 'Crear el archivo de log donde cron escribirá la salida',       comandoSugerido: 'touch automatizacion/logs/salida.log' },
      { descripcion: 'Instalar el paquete cronie',                                   comandoSugerido: 'sudo yum install cronie' },
      { descripcion: 'Arrancar el demonio crond',                                    comandoSugerido: 'sudo systemctl start crond' },
      { descripcion: 'Habilitar crond para que arranque automáticamente',            comandoSugerido: 'sudo systemctl enable crond' },
      { descripcion: 'Verificar que crond está activo',                              comandoSugerido: 'systemctl status crond' },
      { descripcion: 'Programar la tarea con crontab -e',                            comandoSugerido: 'crontab -e' },
      { descripcion: 'Confirmar que la tarea quedó registrada',                      comandoSugerido: 'crontab -l' }
    ],
    pistas: [
      'Preparar el directorio antes de instalar el servicio es buena práctica: el script ya existe cuando cron lo ejecute.',
      'echo "#!/bin/bash" > archivo crea el script con la línea de shebang.',
      'Una entrada cron típica: "* * * * * /ruta/tarea.sh >> /ruta/logs/salida.log 2>&1".',
      'start arranca ahora; enable persiste tras reinicios. Ambos son necesarios en producción.',
      'crontab -l confirma que la entrada fue guardada correctamente por el editor.'
    ],
    comandosUtiles: ['mkdir', 'echo', 'touch', 'sudo', 'yum', 'systemctl', 'crontab']
  },

  {
    id: 91,
    premisa: `Monta un servidor que combina un servicio web con tareas programadas. Debes preparar la estructura de archivos, poner en marcha dos servicios independientes y configurar un cron job que trabaje sobre los directorios creados.\n\nParte 1 — Estructura de trabajo:\n  1. Crea el directorio "servidor/" con tres subdirectorios: "web/", "scripts/" y "logs/".\n  2. Crea "servidor/web/index.html" con el texto "<h1>Estado del servidor</h1>".\n  3. Crea el script "servidor/scripts/check.sh" con el texto "#!/bin/bash".\n  4. Dale permiso de ejecución al propietario del script.\n\nParte 2 — Servidor web httpd:\n  5. Instala httpd con yum.\n  6. Inicia httpd y habilítalo al arranque.\n  7. Verifica su estado.\n  8. Reinicia httpd (simula un cambio de configuración).\n\nParte 3 — Automatización con cron:\n  9. Instala cronie y arranca crond.\n  10. Habilita crond al arranque.\n  11. Monitorea crond en tiempo real con watch.\n  12. Abre el crontab y programa la tarea.\n  13. Lista las tareas activas para confirmar.`,
    tematicas: ['Servicios y automatización', 'Navegación y archivos básicos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear directorio servidor/ con subdirectorios web/, scripts/ y logs/', comandoSugerido: 'mkdir servidor' },
      { descripcion: 'Crear los tres subdirectorios de trabajo',                             comandoSugerido: 'mkdir servidor/web servidor/scripts servidor/logs' },
      { descripcion: 'Crear la página web de estado',                                        comandoSugerido: 'echo "<h1>Estado del servidor</h1>" > servidor/web/index.html' },
      { descripcion: 'Crear el script de verificación',                                      comandoSugerido: 'echo "#!/bin/bash" > servidor/scripts/check.sh' },
      { descripcion: 'Dar permiso de ejecución al script',                                   comandoSugerido: 'chmod u+x servidor/scripts/check.sh' },
      { descripcion: 'Instalar el paquete httpd',                                            comandoSugerido: 'sudo yum install httpd' },
      { descripcion: 'Iniciar el servicio httpd',                                            comandoSugerido: 'sudo systemctl start httpd' },
      { descripcion: 'Habilitar httpd al arranque automático',                               comandoSugerido: 'sudo systemctl enable httpd' },
      { descripcion: 'Verificar que httpd está activo y habilitado',                         comandoSugerido: 'systemctl status httpd' },
      { descripcion: 'Reiniciar httpd para aplicar cambios de configuración',                comandoSugerido: 'sudo systemctl restart httpd' },
      { descripcion: 'Instalar cronie',                                                      comandoSugerido: 'sudo yum install cronie' },
      { descripcion: 'Arrancar el demonio crond',                                            comandoSugerido: 'sudo systemctl start crond' },
      { descripcion: 'Habilitar crond al arranque',                                          comandoSugerido: 'sudo systemctl enable crond' },
      { descripcion: 'Monitorear crond en tiempo real',                                      comandoSugerido: 'watch systemctl status crond' },
      { descripcion: 'Programar la tarea en crontab',                                        comandoSugerido: 'crontab -e' },
      { descripcion: 'Confirmar las tareas activas',                                         comandoSugerido: 'crontab -l' }
    ],
    pistas: [
      'restart equivale a stop + start: úsalo tras modificar la configuración de un servicio.',
      'Puedes gestionar httpd y crond de forma completamente independiente; no se afectan entre sí.',
      'watch <comando> refresca la salida cada 2 segundos; presiona Ctrl+C para salir.',
      'chmod u+x añade ejecución solo al propietario sin tocar los permisos de grupo y otros.',
      'Una entrada cron útil: "* * * * * bash /home/user-ec2/servidor/scripts/check.sh >> servidor/logs/check.log".',
      'Instala los dos paquetes antes de gestionar los servicios para tenerlos listos a la vez.'
    ],
    comandosUtiles: ['mkdir', 'echo', 'chmod', 'sudo', 'yum', 'systemctl', 'watch', 'crontab']
  },

  {
    id: 92,
    premisa: `Realiza el despliegue completo de una aplicación: crea un usuario dedicado para el servicio, construye la estructura de directorios con permisos por capa, instala y arranca crond, y programa una tarea automática que trabajará sobre esa estructura.\n\nParte 1 — Usuario y grupo de servicio:\n  1. Crea el usuario "svcuser" con home y shell bash.\n  2. Crea el grupo "svcgroup".\n  3. Asigna svcgroup como grupo primario de svcuser.\n  4. Verifica la identidad del usuario creado.\n\nParte 2 — Estructura con permisos:\n  5. Crea el directorio "despliegue/" con tres subdirectorios: "conf/", "scripts/" y "logs/".\n  6. Escribe "ENV=produccion" en "despliegue/conf/app.env".\n  7. Crea el script "despliegue/scripts/run.sh" con "#!/bin/bash" y dale permiso de ejecución.\n  8. Asigna svcuser:svcgroup a todo el árbol despliegue/ de forma recursiva.\n  9. Permisos 750 en conf/ (solo propietario y grupo acceden).\n  10. Permisos 600 en conf/app.env (credenciales privadas).\n  11. Permisos 755 en scripts/ (ejecutable por todos).\n  12. Permisos 777 en logs/ (cualquier proceso puede escribir).\n\nParte 3 — Servicio y automatización:\n  13. Instala cronie y arranca crond.\n  14. Habilita crond al arranque.\n  15. Verifica el estado del servicio.\n  16. Monitorea crond con watch.\n  17. Abre el crontab y programa la tarea.\n  18. Lista las tareas activas para confirmar.`,
    tematicas: ['Servicios y automatización', 'Permisos', 'Navegación y archivos básicos', 'Administración de usuarios y grupos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear usuario svcuser con home y bash',                       comandoSugerido: 'sudo useradd -m -s /bin/bash svcuser' },
      { descripcion: 'Crear grupo svcgroup',                                         comandoSugerido: 'sudo groupadd svcgroup' },
      { descripcion: 'Asignar svcgroup como grupo primario de svcuser',             comandoSugerido: 'sudo usermod -g svcgroup svcuser' },
      { descripcion: 'Verificar identidad de svcuser',                               comandoSugerido: 'id svcuser' },
      { descripcion: 'Crear directorio raíz despliegue/',                            comandoSugerido: 'mkdir despliegue' },
      { descripcion: 'Crear subdirectorios conf/, scripts/ y logs/',                comandoSugerido: 'mkdir despliegue/conf despliegue/scripts despliegue/logs' },
      { descripcion: 'Crear archivo de configuración con variable de entorno',      comandoSugerido: 'echo "ENV=produccion" > despliegue/conf/app.env' },
      { descripcion: 'Crear el script principal de la aplicación',                  comandoSugerido: 'echo "#!/bin/bash" > despliegue/scripts/run.sh' },
      { descripcion: 'Dar permiso de ejecución al script',                           comandoSugerido: 'chmod u+x despliegue/scripts/run.sh' },
      { descripcion: 'Asignar svcuser:svcgroup a todo el árbol despliegue/',       comandoSugerido: 'sudo chown -R svcuser:svcgroup despliegue/' },
      { descripcion: 'Proteger conf/: solo propietario y grupo',                    comandoSugerido: 'chmod 750 despliegue/conf' },
      { descripcion: 'Proteger app.env: credenciales privadas',                     comandoSugerido: 'chmod 600 despliegue/conf/app.env' },
      { descripcion: 'Scripts ejecutables por todos',                                comandoSugerido: 'chmod 755 despliegue/scripts' },
      { descripcion: 'Logs escribibles por cualquier proceso',                       comandoSugerido: 'chmod 777 despliegue/logs' },
      { descripcion: 'Instalar cronie',                                              comandoSugerido: 'sudo yum install cronie' },
      { descripcion: 'Arrancar el demonio crond',                                   comandoSugerido: 'sudo systemctl start crond' },
      { descripcion: 'Habilitar crond al arranque del sistema',                     comandoSugerido: 'sudo systemctl enable crond' },
      { descripcion: 'Verificar que crond está activo y habilitado',                comandoSugerido: 'systemctl status crond' },
      { descripcion: 'Monitorear crond en tiempo real',                             comandoSugerido: 'watch systemctl status crond' },
      { descripcion: 'Programar la tarea en crontab',                               comandoSugerido: 'crontab -e' },
      { descripcion: 'Confirmar las tareas activas',                                comandoSugerido: 'crontab -l' }
    ],
    pistas: [
      'usermod -g (minúscula) reemplaza el grupo primario; distinto de -aG que agrega secundarios.',
      'chown -R aplica el cambio de propietario recursivamente a todo el árbol antes de configurar permisos.',
      '750 en conf/ ya protege las credenciales: sin ejecutar ese directorio, nadie accede a app.env.',
      '777 en logs/ es intencional: el script de cron necesita escribir sin importar con qué usuario corra.',
      'El orden recomendado: primero usuarios, luego estructura, luego chown -R, luego chmod por capa.',
      'Una entrada cron típica: "* * * * * bash /home/user-ec2/despliegue/scripts/run.sh >> despliegue/logs/output.log 2>&1".',
      'watch Ctrl+C para salir del monitoreo y continuar con el siguiente paso.'
    ],
    comandosUtiles: ['sudo', 'useradd', 'groupadd', 'usermod', 'id', 'mkdir', 'echo', 'chmod', 'chown', 'yum', 'systemctl', 'watch', 'crontab']
  },

  // ── Mezcla Nav + Permisos + Admin — nivel básico ─────────────

  {
    id: 93,
    premisa: 'Incorpora a "carlos" al sistema, crea su espacio de trabajo en el directorio actual y asígnale la propiedad para que solo él pueda modificarlo.',
    tematicas: ['Navegación y archivos básicos', 'Permisos', 'Administración de usuarios y grupos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear usuario carlos con directorio home',      comandoSugerido: 'sudo useradd -m carlos' },
      { descripcion: 'Verificar que carlos fue creado',               comandoSugerido: 'id carlos' },
      { descripcion: 'Crear su espacio de trabajo',                   comandoSugerido: 'mkdir workspace_carlos' },
      { descripcion: 'Crear un archivo de notas inicial',             comandoSugerido: 'touch workspace_carlos/notas.txt' },
      { descripcion: 'Ceder la propiedad del directorio a carlos',    comandoSugerido: 'sudo chown carlos workspace_carlos' },
      { descripcion: 'Ceder la propiedad del archivo a carlos',       comandoSugerido: 'sudo chown carlos workspace_carlos/notas.txt' },
      { descripcion: 'Restringir el workspace: solo carlos accede',   comandoSugerido: 'chmod 750 workspace_carlos' },
      { descripcion: 'Verificar propietario y permisos',              comandoSugerido: 'ls -l' }
    ],
    pistas: [
      'useradd -m crea el directorio /home/carlos automáticamente.',
      'chown usuario ruta cambia el propietario sin modificar permisos.',
      '750 = rwxr-x---: carlos tiene control total, grupo puede leer, otros nada.',
      'id carlos confirma que el usuario existe y muestra su uid y gid.'
    ],
    comandosUtiles: ['sudo', 'useradd', 'id', 'mkdir', 'touch', 'chown', 'chmod', 'ls']
  },

  {
    id: 94,
    premisa: 'Ana y Luis trabajan juntos y necesitan una carpeta compartida. Crea el grupo "equipo", añádelos a ambos y prepara el directorio con acceso total para el grupo pero sin acceso para otros.',
    tematicas: ['Navegación y archivos básicos', 'Permisos', 'Administración de usuarios y grupos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [
        { username: 'ana',  grupos: ['ana'],  shell: '/bin/bash', group: 'ana' },
        { username: 'luis', grupos: ['luis'], shell: '/bin/bash', group: 'luis' }
      ],
      grupos: [{ name: 'ana' }, { name: 'luis' }],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Verificar identidad de ana',                        comandoSugerido: 'id ana' },
      { descripcion: 'Crear el grupo equipo',                              comandoSugerido: 'sudo groupadd equipo' },
      { descripcion: 'Añadir ana al grupo equipo',                        comandoSugerido: 'sudo usermod -aG equipo ana' },
      { descripcion: 'Añadir luis al grupo equipo',                       comandoSugerido: 'sudo usermod -aG equipo luis' },
      { descripcion: 'Crear el directorio compartido',                    comandoSugerido: 'mkdir compartido' },
      { descripcion: 'Asignar user-ec2 como dueño y equipo como grupo',  comandoSugerido: 'sudo chown user-ec2:equipo compartido' },
      { descripcion: 'Acceso total para dueño y grupo, cero para otros', comandoSugerido: 'chmod 770 compartido' },
      { descripcion: 'Verificar resultado',                               comandoSugerido: 'ls -l' }
    ],
    pistas: [
      'usermod -aG grupo usuario agrega al grupo sin eliminar los grupos existentes.',
      'chown usuario:grupo ruta cambia propietario y grupo en un solo comando.',
      '770 = rwxrwx---: propietario y grupo tienen control total, otros sin acceso.',
      'id ana mostrará el grupo equipo una vez que se haya ejecutado usermod.'
    ],
    comandosUtiles: ['sudo', 'id', 'groupadd', 'usermod', 'mkdir', 'chown', 'chmod', 'ls']
  },

  {
    id: 95,
    premisa: 'Crea un usuario de aplicación y organiza sus archivos de configuración. El archivo de credenciales debe ser completamente privado; el de configuración general puede ser legible por todos.',
    tematicas: ['Navegación y archivos básicos', 'Permisos', 'Administración de usuarios y grupos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear usuario appuser con home',                    comandoSugerido: 'sudo useradd -m appuser' },
      { descripcion: 'Crear directorio de configuración',                 comandoSugerido: 'mkdir config' },
      { descripcion: 'Crear archivo de configuración general',            comandoSugerido: 'echo "APP_ENV=produccion" > config/settings.conf' },
      { descripcion: 'Crear archivo de credenciales',                     comandoSugerido: 'echo "DB_PASS=secreto" > config/credentials.env' },
      { descripcion: 'Permisos estándar para settings.conf',              comandoSugerido: 'chmod 644 config/settings.conf' },
      { descripcion: 'Proteger credentials.env: solo el propietario',     comandoSugerido: 'chmod 600 config/credentials.env' },
      { descripcion: 'Ceder la propiedad de credentials.env a appuser',  comandoSugerido: 'sudo chown appuser config/credentials.env' },
      { descripcion: 'Verificar permisos y propietarios',                 comandoSugerido: 'ls -l config/' }
    ],
    pistas: [
      '644 = rw-r--r--: lectura universal, escritura solo para el propietario.',
      '600 = rw-------: solo el propietario puede leer y escribir el archivo.',
      'Puedes cambiar el propietario de un solo archivo sin afectar el directorio que lo contiene.',
      'ls -l muestra propietario, grupo y permisos en una sola vista.'
    ],
    comandosUtiles: ['sudo', 'useradd', 'mkdir', 'echo', 'chmod', 'chown', 'ls']
  },

  {
    id: 96,
    premisa: 'Prepara el espacio de trabajo de "devuser": crea su cuenta, organiza sus archivos en carpetas por tipo y aplica permisos distintos a cada sección según la privacidad del contenido.',
    tematicas: ['Navegación y archivos básicos', 'Permisos', 'Administración de usuarios y grupos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear usuario devuser con home',                      comandoSugerido: 'sudo useradd -m devuser' },
      { descripcion: 'Crear directorio workspace con dos secciones',        comandoSugerido: 'mkdir workspace' },
      { descripcion: 'Crear carpetas codigo/ y privado/ dentro del workspace', comandoSugerido: 'mkdir workspace/codigo workspace/privado' },
      { descripcion: 'Crear un script de ejemplo en codigo/',               comandoSugerido: 'echo "print(\'hello\')" > workspace/codigo/script.py' },
      { descripcion: 'Crear un token de acceso en privado/',                comandoSugerido: 'echo "TOKEN=xyz789" > workspace/privado/token.env' },
      { descripcion: 'Asignar todo el workspace a devuser',                 comandoSugerido: 'sudo chown -R devuser workspace/' },
      { descripcion: 'Código visible para todos: 755',                      comandoSugerido: 'chmod 755 workspace/codigo' },
      { descripcion: 'Privado accesible solo por devuser: 700',             comandoSugerido: 'chmod 700 workspace/privado' },
      { descripcion: 'Verificar estructura y permisos',                     comandoSugerido: 'ls -l workspace/' }
    ],
    pistas: [
      'chown -R devuser workspace/ aplica el cambio a todos los archivos y subdirectorios.',
      '755 en codigo/ permite que cualquiera navegue y lea los scripts.',
      '700 en privado/ bloquea por completo el acceso a quienes no sean el propietario.',
      'mkdir acepta varias rutas a la vez: mkdir workspace/codigo workspace/privado.'
    ],
    comandosUtiles: ['sudo', 'useradd', 'mkdir', 'echo', 'chown', 'chmod', 'ls']
  },

  // ── Mezcla Nav + Permisos + Admin — nivel intermedio básico ──

  {
    id: 97,
    premisa: `Un directorio de proyecto heredado tiene permisos demasiado abiertos y propietario incorrecto. Audita el estado actual, crea el grupo de trabajo, asigna los usuarios y corrige los permisos archivo por archivo.\n\nParte 1 — Auditoría:\n  1. Lista el contenido del home para ver la situación general.\n  2. Inspecciona los permisos dentro de proyecto/.\n\nParte 2 — Grupo y usuarios:\n  3. Crea el grupo "equipo_dev".\n  4. Añade bob y alice al grupo.\n\nParte 3 — Corrección:\n  5. Asigna user-ec2:equipo_dev a todo el árbol proyecto/ de forma recursiva.\n  6. Directorio raíz navegable por todos: 755.\n  7. El readme puede ser leído por cualquiera: 644.\n  8. La configuración es solo para propietario y grupo: 640.\n  9. Verifica el resultado final.`,
    tematicas: ['Navegación y archivos básicos', 'Permisos', 'Administración de usuarios y grupos'],
    estadoInicial: {
      fs: {
        dirs: [
          { path: '/home/user-ec2/proyecto', owner: 'user-ec2', group: 'user-ec2', perms: '777' }
        ],
        files: [
          { path: '/home/user-ec2/proyecto/readme.txt',   owner: 'user-ec2', group: 'user-ec2', perms: '777', content: '# Proyecto\n' },
          { path: '/home/user-ec2/proyecto/config.conf',  owner: 'user-ec2', group: 'user-ec2', perms: '777', content: 'DB_HOST=localhost\n' }
        ]
      },
      usuarios: [
        { username: 'bob',   grupos: ['bob'],   shell: '/bin/bash', group: 'bob' },
        { username: 'alice', grupos: ['alice'], shell: '/bin/bash', group: 'alice' }
      ],
      grupos: [{ name: 'bob' }, { name: 'alice' }],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver situación general del home',                         comandoSugerido: 'ls -l' },
      { descripcion: 'Inspeccionar permisos dentro de proyecto/',              comandoSugerido: 'ls -l proyecto/' },
      { descripcion: 'Crear grupo equipo_dev',                                  comandoSugerido: 'sudo groupadd equipo_dev' },
      { descripcion: 'Añadir bob al grupo equipo_dev',                         comandoSugerido: 'sudo usermod -aG equipo_dev bob' },
      { descripcion: 'Añadir alice al grupo equipo_dev',                       comandoSugerido: 'sudo usermod -aG equipo_dev alice' },
      { descripcion: 'Asignar user-ec2:equipo_dev a todo proyecto/ recursivo', comandoSugerido: 'sudo chown -R user-ec2:equipo_dev proyecto/' },
      { descripcion: 'Directorio proyecto/ navegable para todos',              comandoSugerido: 'chmod 755 proyecto/' },
      { descripcion: 'readme.txt legible por todos',                            comandoSugerido: 'chmod 644 proyecto/readme.txt' },
      { descripcion: 'config.conf restringido a propietario y grupo',          comandoSugerido: 'chmod 640 proyecto/config.conf' },
      { descripcion: 'Verificar permisos corregidos',                          comandoSugerido: 'ls -l proyecto/' }
    ],
    pistas: [
      'Empieza siempre auditando con ls -l antes de modificar nada.',
      'chown -R cambia propietario y grupo en todo el árbol de una vez.',
      '640 = rw-r-----: propietario rw, grupo solo lectura, otros sin acceso.',
      'Aplica chown -R antes que chmod para no depender del propietario anterior.'
    ],
    comandosUtiles: ['ls', 'sudo', 'groupadd', 'usermod', 'chown', 'chmod']
  },

  {
    id: 98,
    premisa: `Dos nuevos colaboradores necesitan un espacio de trabajo compartido con secciones diferenciadas: una pública donde ambos puedan escribir y una privada de solo lectura para el grupo.\n\nParte 1 — Usuarios y grupo:\n  1. Crea los usuarios "colab1" y "colab2" con home.\n  2. Crea el grupo "proyecto".\n  3. Añade a ambos al grupo proyecto.\n\nParte 2 — Estructura y archivos:\n  4. Crea el directorio "trabajo/" con dos subdirectorios: "publico/" y "privado/".\n  5. Crea un archivo de documentación en publico/ y un archivo de configuración en privado/.\n\nParte 3 — Propietarios y permisos:\n  6. Asigna user-ec2:proyecto a todo el árbol trabajo/ de forma recursiva.\n  7. Sección pública escribible por el grupo: 775.\n  8. Sección privada de solo lectura para el grupo: 750.\n  9. El archivo de configuración es solo del propietario: 640.\n  10. Verifica la estructura final.`,
    tematicas: ['Navegación y archivos básicos', 'Permisos', 'Administración de usuarios y grupos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear usuario colab1 con home',                          comandoSugerido: 'sudo useradd -m colab1' },
      { descripcion: 'Crear usuario colab2 con home',                          comandoSugerido: 'sudo useradd -m colab2' },
      { descripcion: 'Crear grupo proyecto',                                    comandoSugerido: 'sudo groupadd proyecto' },
      { descripcion: 'Añadir colab1 al grupo proyecto',                        comandoSugerido: 'sudo usermod -aG proyecto colab1' },
      { descripcion: 'Añadir colab2 al grupo proyecto',                        comandoSugerido: 'sudo usermod -aG proyecto colab2' },
      { descripcion: 'Crear directorio trabajo/ con sus secciones',            comandoSugerido: 'mkdir trabajo' },
      { descripcion: 'Crear subdirectorios publico/ y privado/',               comandoSugerido: 'mkdir trabajo/publico trabajo/privado' },
      { descripcion: 'Crear documentación en la sección pública',              comandoSugerido: 'echo "Guia de uso" > trabajo/publico/guia.txt' },
      { descripcion: 'Crear configuración en la sección privada',              comandoSugerido: 'echo "DB_HOST=localhost" > trabajo/privado/config.conf' },
      { descripcion: 'Asignar user-ec2:proyecto a todo el árbol trabajo/',    comandoSugerido: 'sudo chown -R user-ec2:proyecto trabajo/' },
      { descripcion: 'Sección pública escribible por el grupo',                comandoSugerido: 'chmod 775 trabajo/publico' },
      { descripcion: 'Sección privada de solo lectura para el grupo',          comandoSugerido: 'chmod 750 trabajo/privado' },
      { descripcion: 'Archivo de config accesible solo por propietario y grupo', comandoSugerido: 'chmod 640 trabajo/privado/config.conf' },
      { descripcion: 'Verificar estructura y permisos finales',                 comandoSugerido: 'ls -l trabajo/' }
    ],
    pistas: [
      '775 = rwxrwxr-x: propietario y grupo pueden escribir; otros solo leer.',
      '750 = rwxr-x---: el grupo puede leer y entrar, pero no escribir.',
      '640 = rw-r-----: propietario rw, grupo solo lectura, sin acceso para otros.',
      'chown -R aplica el cambio antes de chmod para que los permisos queden con el dueño correcto.'
    ],
    comandosUtiles: ['sudo', 'useradd', 'groupadd', 'usermod', 'mkdir', 'echo', 'chown', 'chmod', 'ls']
  },

  {
    id: 99,
    premisa: `El home contiene archivos sueltos sin organizar que pertenecen a distintos equipos. Reorganízalos en carpetas por tipo, crea el grupo de soporte y transfiere la propiedad de los informes a ese equipo.\n\nParte 1 — Organización:\n  1. Lista los archivos actuales para ver la situación.\n  2. Crea tres carpetas: "informes/", "datos/" y "respaldos/".\n  3. Mueve cada archivo a su carpeta correspondiente.\n\nParte 2 — Grupo y propietario:\n  4. Crea el grupo "soporte".\n  5. Añade el usuario "agente" al grupo soporte.\n  6. Cede la propiedad de informes/ al grupo soporte.\n\nParte 3 — Permisos:\n  7. Los informes son de solo lectura para el grupo: 750.\n  8. El archivo de reporte puede ser leído por el grupo: 640.\n  9. Los datos son navegables por todos: 755.\n  10. Verifica el resultado.`,
    tematicas: ['Navegación y archivos básicos', 'Permisos', 'Administración de usuarios y grupos'],
    estadoInicial: {
      fs: {
        dirs: [],
        files: [
          { path: '/home/user-ec2/reporte_q1.txt', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'Q1: 1200\n' },
          { path: '/home/user-ec2/metricas.csv',   owner: 'user-ec2', group: 'user-ec2', perms: '644', content: 'fecha,valor\n' },
          { path: '/home/user-ec2/backup_jan.tar', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '__tar__:backup\n' }
        ]
      },
      usuarios: [
        { username: 'agente', grupos: ['agente'], shell: '/bin/bash', group: 'agente' }
      ],
      grupos: [{ name: 'agente' }],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver los archivos actuales en el home',                   comandoSugerido: 'ls' },
      { descripcion: 'Crear carpetas informes/, datos/ y respaldos/',          comandoSugerido: 'mkdir informes datos respaldos' },
      { descripcion: 'Mover el reporte a informes/',                           comandoSugerido: 'mv reporte_q1.txt informes/' },
      { descripcion: 'Mover las métricas a datos/',                            comandoSugerido: 'mv metricas.csv datos/' },
      { descripcion: 'Mover el respaldo a respaldos/',                         comandoSugerido: 'mv backup_jan.tar respaldos/' },
      { descripcion: 'Crear grupo soporte',                                     comandoSugerido: 'sudo groupadd soporte' },
      { descripcion: 'Añadir agente al grupo soporte',                         comandoSugerido: 'sudo usermod -aG soporte agente' },
      { descripcion: 'Asignar el grupo soporte al directorio informes/',       comandoSugerido: 'sudo chown user-ec2:soporte informes/' },
      { descripcion: 'Asignar el grupo soporte al archivo de reporte',         comandoSugerido: 'sudo chown user-ec2:soporte informes/reporte_q1.txt' },
      { descripcion: 'Directorio informes/ de solo lectura para el grupo',     comandoSugerido: 'chmod 750 informes/' },
      { descripcion: 'Reporte legible por el grupo',                           comandoSugerido: 'chmod 640 informes/reporte_q1.txt' },
      { descripcion: 'Datos navegables por todos',                             comandoSugerido: 'chmod 755 datos/' },
      { descripcion: 'Verificar resultado',                                    comandoSugerido: 'ls -l' }
    ],
    pistas: [
      'mkdir acepta varias rutas: mkdir informes datos respaldos crea las tres a la vez.',
      'mv archivo directorio/ mueve el archivo al directorio manteniendo el nombre.',
      'Cambia el grupo de informes/ y del archivo por separado: chown no es -R aquí.',
      '640 en el reporte permite que agente (miembro de soporte) lo lea sin poder modificarlo.'
    ],
    comandosUtiles: ['ls', 'mkdir', 'mv', 'sudo', 'groupadd', 'usermod', 'chown', 'chmod']
  },

  {
    id: 100,
    premisa: `Configura un proyecto con dos roles bien definidos: "admin_proj" tiene control total sobre todo el árbol, mientras que el grupo "lectores" (al que pertenece "lector") solo puede acceder a la documentación pública, sin ver ni la configuración ni los recursos privados.\n\nParte 1 — Usuarios y grupo:\n  1. Crea los usuarios "admin_proj" y "lector" con home.\n  2. Crea el grupo "lectores".\n  3. Añade lector al grupo lectores.\n\nParte 2 — Estructura y archivos:\n  4. Crea el directorio "repo/" con tres subdirectorios: "docs/", "src/" y "privado/".\n  5. Crea "repo/docs/manual.txt" con texto de documentación.\n  6. Crea "repo/src/app.py" con código de ejemplo.\n  7. Crea "repo/privado/secrets.env" con credenciales.\n\nParte 3 — Propietarios y permisos:\n  8. Asigna admin_proj:lectores a todo el árbol repo/.\n  9. Directorio raíz repo/ accesible para el grupo: 750.\n  10. docs/ visible para el grupo (lectores pueden entrar): 755.\n  11. src/ solo para el propietario: 700.\n  12. privado/ completamente cerrado para otros: 700.\n  13. Verifica la estructura final.`,
    tematicas: ['Navegación y archivos básicos', 'Permisos', 'Administración de usuarios y grupos'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear usuario admin_proj con home',                      comandoSugerido: 'sudo useradd -m admin_proj' },
      { descripcion: 'Crear usuario lector con home',                          comandoSugerido: 'sudo useradd -m lector' },
      { descripcion: 'Crear grupo lectores',                                    comandoSugerido: 'sudo groupadd lectores' },
      { descripcion: 'Añadir lector al grupo lectores',                        comandoSugerido: 'sudo usermod -aG lectores lector' },
      { descripcion: 'Crear directorio raíz repo/',                            comandoSugerido: 'mkdir repo' },
      { descripcion: 'Crear subdirectorios docs/, src/ y privado/',            comandoSugerido: 'mkdir repo/docs repo/src repo/privado' },
      { descripcion: 'Crear documentación pública',                            comandoSugerido: 'echo "Guia de usuario v1.0" > repo/docs/manual.txt' },
      { descripcion: 'Crear código fuente de ejemplo',                         comandoSugerido: 'echo "def main(): pass" > repo/src/app.py' },
      { descripcion: 'Crear archivo de credenciales',                          comandoSugerido: 'echo "API_KEY=abc123" > repo/privado/secrets.env' },
      { descripcion: 'Asignar admin_proj:lectores a todo el árbol repo/',     comandoSugerido: 'sudo chown -R admin_proj:lectores repo/' },
      { descripcion: 'Directorio raíz accesible para el grupo: 750',          comandoSugerido: 'chmod 750 repo/' },
      { descripcion: 'docs/ visible para el grupo de lectores: 755',          comandoSugerido: 'chmod 755 repo/docs' },
      { descripcion: 'src/ cerrado para el grupo: 700',                        comandoSugerido: 'chmod 700 repo/src' },
      { descripcion: 'privado/ completamente cerrado para otros: 700',        comandoSugerido: 'chmod 700 repo/privado' },
      { descripcion: 'Verificar permisos de las tres secciones',              comandoSugerido: 'ls -l repo/' }
    ],
    pistas: [
      'Para que lectores entre a docs/, repo/ también debe ser accesible para el grupo (750 lo permite).',
      '750 en repo/ da al grupo lectura y ejecución (entrar), pero no escritura.',
      '700 en src/ y privado/ bloquea por completo el acceso al grupo y a otros.',
      'chown -R admin_proj:lectores aplica el nuevo propietario y grupo a todo el árbol antes de ajustar permisos.',
      'El orden importa: si aplicas chmod antes que chown, el propietario puede no ser el esperado.'
    ],
    comandosUtiles: ['sudo', 'useradd', 'groupadd', 'usermod', 'mkdir', 'echo', 'chown', 'chmod', 'ls']
  }
];
