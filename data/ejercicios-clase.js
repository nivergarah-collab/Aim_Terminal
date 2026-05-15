const ejerciciosClase = [
  // ──────────────────────────────────────────────
  // BLOQUE CLASE: Ejercicios de aula
  // ──────────────────────────────────────────────
  {
    id: 51,
    esLeccion: true,
    premisa: 'Actividad práctica: colaboración controlada en Linux.\n\nEres el administrador del sistema. Tu objetivo es configurar usuarios, grupos y permisos para permitir una colaboración controlada sobre un archivo compartido.\n\nParte 1 — Usuarios y grupos:\n  1. Crea usuario1 y usuario2 con directorio home (useradd -m).\n  2. Crea el grupo grupo1.\n  3. Asigna grupo1 como grupo primario de usuario1 (usermod -g).\n  4. Agrega usuario2 al grupo1 como grupo secundario (usermod -aG).\n\nParte 2 — Directorio y archivo compartido:\n  5. Crea el directorio "PracticaLinux" en tu home y establece permisos 755 en /home/user-ec2.\n  6. Dentro de "PracticaLinux", crea "info.txt" con el texto: "Datos del equipo: usuario1 y usuario2 colaboran en este archivo."\n  7. Cambia el propietario de info.txt a usuario1:grupo1 y establece permisos 640.\n  8. Verifica los permisos con ls -l.\n\nParte 3 — Sesión como usuario2 (solo lectura):\n  9. Cambia a usuario2, lee info.txt, ve a su home y crea respuesta.txt con: "Leído correctamente por usuario2."\n\nParte 4 — Habilitar escritura grupal:\n  10. Vuelve a user-ec2 y cambia los permisos de info.txt a 660.\n  11. Cambia a usuario2 y agrega al final de info.txt: "Respuesta de usuario2: colaboración exitosa."',
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
      { descripcion: 'Crear usuario1 con directorio home', comandoSugerido: 'sudo useradd -m usuario1' },
      { descripcion: 'Crear usuario2 con directorio home', comandoSugerido: 'sudo useradd -m usuario2' },
      { descripcion: 'Crear grupo grupo1', comandoSugerido: 'sudo groupadd grupo1' },
      { descripcion: 'Asignar grupo1 como grupo primario de usuario1', comandoSugerido: 'sudo usermod -g grupo1 usuario1' },
      { descripcion: 'Agregar usuario2 al grupo1', comandoSugerido: 'sudo usermod -aG grupo1 usuario2' },
      { descripcion: 'Crear directorio de trabajo PracticaLinux', comandoSugerido: 'mkdir PracticaLinux' },
      { descripcion: 'Dar permisos 755 al home de user-ec2', comandoSugerido: 'chmod 755 /home/user-ec2' },
      { descripcion: 'Entrar al directorio PracticaLinux', comandoSugerido: 'cd PracticaLinux' },
      { descripcion: 'Crear archivo info.txt con datos de prueba', comandoSugerido: 'echo "Datos del equipo: usuario1 y usuario2 colaboran en este archivo." > info.txt' },
      { descripcion: 'Cambiar propietario de info.txt a usuario1:grupo1', comandoSugerido: 'sudo chown usuario1:grupo1 info.txt' },
      { descripcion: 'Establecer permisos 640 en info.txt', comandoSugerido: 'sudo chmod 640 info.txt' },
      { descripcion: 'Verificar permisos con ls -l', comandoSugerido: 'ls -l' },
      { descripcion: 'Cambiar a usuario2', comandoSugerido: 'su usuario2' },
      { descripcion: 'Leer info.txt como usuario2', comandoSugerido: 'cat /home/user-ec2/PracticaLinux/info.txt' },
      { descripcion: 'Ir al home de usuario2', comandoSugerido: 'cd ~' },
      { descripcion: 'Crear respuesta.txt con comentario', comandoSugerido: 'echo "Leído correctamente por usuario2." > respuesta.txt' },
      { descripcion: 'Volver a user-ec2', comandoSugerido: 'su user-ec2' },
      { descripcion: 'Cambiar permisos de info.txt a 660 para permitir escritura al grupo', comandoSugerido: 'sudo chmod 660 /home/user-ec2/PracticaLinux/info.txt' },
      { descripcion: 'Cambiar a usuario2 de nuevo', comandoSugerido: 'su usuario2' },
      { descripcion: 'Agregar línea a info.txt como usuario2', comandoSugerido: 'echo "Respuesta de usuario2: colaboración exitosa." >> /home/user-ec2/PracticaLinux/info.txt' }
    ],
    pistas: [
      'useradd -m crea el directorio home del usuario automáticamente.',
      'usermod -g establece el grupo primario; usermod -aG agrega a un grupo secundario sin quitar los existentes.',
      'chmod 640 = rw-r----- : propietario lee/escribe, grupo solo lee, otros sin acceso.',
      'chmod 660 = rw-rw---- : propietario y grupo pueden leer y escribir.',
      'Para que usuario2 acceda a /home/user-ec2, ese directorio necesita permiso de ejecución para otros (755).',
      'su usuario cambia al usuario indicado; su user-ec2 vuelve al usuario original.'
    ],
    comandosUtiles: ['useradd', 'groupadd', 'usermod', 'mkdir', 'chmod', 'chown', 'ls', 'su', 'sudo', 'echo', 'cat', 'cd']
  },

  {
    id: 52,
    esLeccion: true,
    premisa: 'Ejercicio de clase: manipulación de archivos y automatización de tareas.\n\nParte 1 — Archivos:\n  1. Crea los archivos "archivo1.txt" y "archivo2.txt", y el directorio "destino/".\n  2. Copia "archivo1.txt" como "copia.txt" y luego como "copia2.txt" (esta última con salida detallada usando -v).\n  3. Mueve "archivo2.txt" a "destino/" y renombra "archivo1.txt" como "nuevo_nombre.txt".\n  4. Demuestra la sobrescritura: crea "ejemplo.txt" y "destino/ejemplo.txt", luego mueve "ejemplo.txt" a "destino/" (sobrescribe el existente). Vuelve a crear "ejemplo.txt" y muévelo con -n (evita la sobrescritura).\n  5. Elimina "copia.txt" con confirmación (-i).\n\nParte 2 — Paquetes:\n  6. Instala el paquete "cronie" con yum.\n\nParte 3 — Servicios:\n  7. Inicia el servicio "crond" con systemctl start.\n  8. Habilítalo para que arranque automáticamente con systemctl enable.\n  9. Verifica su estado con systemctl status.\n\nParte 4 — Cron:\n  10. Abre el crontab con: EDITOR=nano crontab -e\n  11. Verifica el archivo "prueba.txt" generado por el cron con cat.\n  12. Lista las tareas programadas con crontab -l.',
    tematicas: ['Navegación y archivos básicos', 'Servicios y automatización'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear archivos archivo1.txt y archivo2.txt', comandoSugerido: 'touch archivo1.txt archivo2.txt' },
      { descripcion: 'Crear directorio destino', comandoSugerido: 'mkdir destino' },
      { descripcion: 'Copiar archivo1.txt como copia.txt', comandoSugerido: 'cp archivo1.txt copia.txt' },
      { descripcion: 'Copiar con detalle (-v): archivo1.txt → copia2.txt', comandoSugerido: 'cp -v archivo1.txt copia2.txt' },
      { descripcion: 'Mover archivo2.txt a destino/', comandoSugerido: 'mv archivo2.txt destino/' },
      { descripcion: 'Renombrar archivo1.txt → nuevo_nombre.txt', comandoSugerido: 'mv archivo1.txt nuevo_nombre.txt' },
      { descripcion: 'Crear ejemplo.txt en el directorio actual', comandoSugerido: 'touch ejemplo.txt' },
      { descripcion: 'Crear ejemplo.txt dentro de destino/', comandoSugerido: 'touch destino/ejemplo.txt' },
      { descripcion: 'Mover ejemplo.txt a destino/ (sobrescribe)', comandoSugerido: 'mv ejemplo.txt destino/' },
      { descripcion: 'Recrear ejemplo.txt para demostrar -n', comandoSugerido: 'touch ejemplo.txt' },
      { descripcion: 'Intentar mover con -n (no sobrescribe si existe)', comandoSugerido: 'mv -n ejemplo.txt destino/' },
      { descripcion: 'Eliminar copia.txt con confirmación', comandoSugerido: 'rm -i copia.txt' },
      { descripcion: 'Instalar paquete cronie con yum', comandoSugerido: 'sudo yum install cronie' },
      { descripcion: 'Iniciar el servicio crond', comandoSugerido: 'sudo systemctl start crond' },
      { descripcion: 'Habilitar crond al arranque', comandoSugerido: 'sudo systemctl enable crond' },
      { descripcion: 'Ver estado del servicio crond', comandoSugerido: 'systemctl status crond' },
      { descripcion: 'Abrir crontab en editor', comandoSugerido: 'EDITOR=nano crontab -e' },
      { descripcion: 'Ver archivo generado por el cron', comandoSugerido: 'cat prueba.txt' },
      { descripcion: 'Listar tareas cron activas', comandoSugerido: 'crontab -l' }
    ],
    pistas: [
      'touch acepta varios archivos separados por espacio: touch a.txt b.txt',
      'cp -v muestra el detalle de cada archivo copiado.',
      'mv sin flags sobrescribe el destino; con -n evita la sobrescritura si ya existe.',
      'rm -i pide confirmación antes de eliminar (en el simulador auto-confirma).',
      'sudo yum install -y paquete instala sin pedir confirmación.',
      'systemctl start inicia el servicio ahora; enable lo activa al arrancar el sistema.',
      'EDITOR=nano crontab -e abre el crontab en nano. En el simulador se aplica automáticamente.',
      'crontab -l muestra las tareas programadas del usuario actual.'
    ],
    comandosUtiles: ['touch', 'mkdir', 'cp', 'mv', 'rm', 'yum', 'systemctl', 'crontab', 'cat', 'sudo']
  },

  {
    id: 53,
    esLeccion: true,
    premisa: 'Desafío: automatización de tareas de archivos y servicios.\n\nParte A — Preparación del entorno:\n  1. Crea el directorio /home/alumno con sudo.\n  2. Asigna su propiedad a tu usuario: sudo chown user-ec2:user-ec2 /home/alumno\n  3. Crea los subdirectorios "backup" y "temporal" dentro de /home/alumno.\n  4. Crea los archivos "datos.txt" y "registro.txt" en /home/alumno.\n\nParte B — Manipulación de archivos:\n  5. Copia datos.txt al directorio backup/.\n  6. Mueve registro.txt al directorio temporal/.\n  7. Intenta mover datos.txt a backup/ con -n (no sobrescribirá porque ya existe).\n  8. Elimina datos.txt con confirmación (-i).\n  9. Verifica el estado con ls /home/alumno.\n\nParte C — Instalación y servicio:\n  10. Instala el paquete "cronie" con yum.\n  11. Inicia el servicio "crond" con systemctl.\n  12. Verifica que está activo con systemctl status.\n\nParte D — Automatización con cron:\n  13. Abre el crontab con: EDITOR=nano crontab -e\n      (El simulador añade una tarea de ejemplo automáticamente.)\n  14. Lista las tareas programadas con crontab -l.\n\nParte E — Verificación final:\n  15. Revisa el archivo "prueba.txt" generado por el cron con cat.\n  16. Verifica el contenido final de /home/alumno con ls.',
    tematicas: ['Navegación y archivos básicos', 'Servicios y automatización'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Crear /home/alumno con privilegios', comandoSugerido: 'sudo mkdir /home/alumno' },
      { descripcion: 'Asignar propiedad de /home/alumno a user-ec2', comandoSugerido: 'sudo chown user-ec2:user-ec2 /home/alumno' },
      { descripcion: 'Crear subdirectorio backup', comandoSugerido: 'mkdir /home/alumno/backup' },
      { descripcion: 'Crear subdirectorio temporal', comandoSugerido: 'mkdir /home/alumno/temporal' },
      { descripcion: 'Crear archivo datos.txt', comandoSugerido: 'touch /home/alumno/datos.txt' },
      { descripcion: 'Crear archivo registro.txt', comandoSugerido: 'touch /home/alumno/registro.txt' },
      { descripcion: 'Copiar datos.txt al directorio backup/', comandoSugerido: 'cp /home/alumno/datos.txt /home/alumno/backup/' },
      { descripcion: 'Mover registro.txt al directorio temporal/', comandoSugerido: 'mv /home/alumno/registro.txt /home/alumno/temporal/' },
      { descripcion: 'Intentar mover con -n (no sobrescribe si ya existe)', comandoSugerido: 'mv -n /home/alumno/datos.txt /home/alumno/backup/' },
      { descripcion: 'Eliminar datos.txt con confirmación', comandoSugerido: 'rm -i /home/alumno/datos.txt' },
      { descripcion: 'Verificar estructura con ls', comandoSugerido: 'ls /home/alumno' },
      { descripcion: 'Instalar paquete cronie', comandoSugerido: 'sudo yum install cronie' },
      { descripcion: 'Iniciar el servicio crond', comandoSugerido: 'sudo systemctl start crond' },
      { descripcion: 'Verificar estado del servicio', comandoSugerido: 'systemctl status crond' },
      { descripcion: 'Abrir crontab para agregar tarea automática', comandoSugerido: 'EDITOR=nano crontab -e' },
      { descripcion: 'Listar tareas programadas del crontab', comandoSugerido: 'crontab -l' },
      { descripcion: 'Revisar archivo generado por el cron', comandoSugerido: 'cat prueba.txt' },
      { descripcion: 'Verificar estado final de /home/alumno', comandoSugerido: 'ls /home/alumno' }
    ],
    pistas: [
      'sudo mkdir /home/alumno crea la carpeta con privilegios de root.',
      'sudo chown user-ec2:user-ec2 /home/alumno te da propiedad del directorio.',
      'cp origen destino/ copia el archivo dentro del directorio destino.',
      'mv -n origen destino/ no sobrescribe si el archivo ya existe en el destino.',
      'rm -i archivo pide confirmación antes de eliminar (el simulador auto-confirma).',
      'sudo yum install cronie instala el demonio cron en sistemas Red Hat / Amazon Linux.',
      'systemctl start inicia el servicio ahora; status verifica si está activo.',
      'EDITOR=nano crontab -e abre el editor de tareas programadas.'
    ],
    comandosUtiles: ['sudo', 'mkdir', 'chown', 'touch', 'cp', 'mv', 'rm', 'ls', 'yum', 'systemctl', 'crontab', 'cat']
  },

  {
    id: 54,
    premisa: `Eres administrador de un servidor web. Debes practicar el ciclo completo de vida de un servicio instalando y gestionando Apache (httpd).\n\nTus tareas:\n  1. Instala el paquete "httpd" con yum.\n  2. Inicia el servicio "httpd" con systemctl.\n  3. Verifica que está activo con systemctl status httpd.\n  4. Habilita el servicio para que arranque automáticamente al inicio del sistema.\n  5. Detén el servicio con systemctl stop httpd.\n  6. Comprueba que está detenido con systemctl status httpd.\n  7. Reinicia el servicio con systemctl restart httpd.\n  8. Confirma que vuelve a estar activo con systemctl status httpd.`,

    tematicas: ['Servicios y automatización'],

    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },

    condicionesExito: null,

    pasos: [
      { descripcion: 'Instalar paquete httpd',                  comandoSugerido: 'sudo yum install httpd' },
      { descripcion: 'Iniciar servicio httpd',                  comandoSugerido: 'sudo systemctl start httpd' },
      { descripcion: 'Verificar que httpd está activo',         comandoSugerido: 'systemctl status httpd' },
      { descripcion: 'Habilitar httpd al arranque del sistema', comandoSugerido: 'sudo systemctl enable httpd' },
      { descripcion: 'Detener el servicio httpd',               comandoSugerido: 'sudo systemctl stop httpd' },
      { descripcion: 'Verificar que httpd está detenido',       comandoSugerido: 'systemctl status httpd' },
      { descripcion: 'Reiniciar el servicio httpd',             comandoSugerido: 'sudo systemctl restart httpd' },
      { descripcion: 'Confirmar que httpd vuelve a estar activo', comandoSugerido: 'systemctl status httpd' }
    ],

    pistas: [
      'sudo yum install httpd descarga e instala el servidor web Apache.',
      'systemctl start inicia el servicio ahora mismo; enable lo activa al arranque.',
      'systemctl stop detiene el servicio sin deshabilitarlo del arranque.',
      'systemctl restart equivale a stop + start; útil tras cambios de configuración.',
      'systemctl status muestra si el servicio está active (running) o inactive (dead).',
      'Necesitas sudo para start, stop, restart y enable; status no lo requiere.'
    ],

    comandosUtiles: ['sudo', 'yum', 'systemctl']
  },

  {
    id: 55,
    premisa: `Eres administrador de sistemas. Debes configurar la automatización de tareas con cron: instalar el demonio, arrancarlo, programar una tarea y eliminarla al finalizar.\n\nTus tareas:\n  1. Instala el paquete "cronie" (el demonio cron) con yum.\n  2. Inicia el servicio "crond" con systemctl.\n  3. Habilita "crond" para que arranque automáticamente.\n  4. Verifica el estado del servicio con systemctl status crond.\n  5. Abre el crontab con: EDITOR=nano crontab -e\n     (El simulador añade una tarea de ejemplo automáticamente.)\n  6. Lista las tareas programadas con crontab -l.\n  7. Revisa el archivo "prueba.txt" generado por el cron con cat.\n  8. Elimina todas las tareas del crontab con crontab -r.`,

    tematicas: ['Servicios y automatización'],

    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },

    condicionesExito: null,

    pasos: [
      { descripcion: 'Instalar paquete cronie',               comandoSugerido: 'sudo yum install cronie' },
      { descripcion: 'Iniciar el servicio crond',             comandoSugerido: 'sudo systemctl start crond' },
      { descripcion: 'Habilitar crond al arranque',           comandoSugerido: 'sudo systemctl enable crond' },
      { descripcion: 'Verificar estado de crond',             comandoSugerido: 'systemctl status crond' },
      { descripcion: 'Abrir editor de crontab',               comandoSugerido: 'EDITOR=nano crontab -e' },
      { descripcion: 'Listar tareas programadas en crontab',  comandoSugerido: 'crontab -l' },
      { descripcion: 'Revisar archivo generado por el cron',  comandoSugerido: 'cat prueba.txt' },
      { descripcion: 'Eliminar todas las tareas del crontab', comandoSugerido: 'crontab -r' }
    ],

    pistas: [
      'sudo yum install cronie instala el paquete que incluye el demonio crond.',
      'systemctl start crond activa el servicio; enable lo hace persistente tras reinicios.',
      'EDITOR=nano crontab -e abre el editor; el prefijo EDITOR= es ignorado por el simulador.',
      'Una entrada cron tiene el formato: minuto hora día mes día_semana comando.',
      'crontab -l lista las tareas actuales sin editarlas.',
      'crontab -r elimina todo el crontab del usuario actual; úsalo con precaución.',
      'cat prueba.txt muestra el contenido que la tarea de ejemplo habría escrito.'
    ],

    comandosUtiles: ['sudo', 'yum', 'systemctl', 'crontab', 'cat']
  },

  {
    id: 56,
    premisa: `Eres administrador de un servidor de producción. Debes instalar y poner en marcha dos servicios simultáneamente: el servidor web Apache (httpd) y el demonio de tareas programadas (crond).\n\nTus tareas:\n  1. Instala el paquete "httpd" con yum.\n  2. Instala el paquete "cronie" con yum.\n  3. Inicia el servicio "httpd" con systemctl.\n  4. Inicia el servicio "crond" con systemctl.\n  5. Habilita "httpd" para que arranque automáticamente.\n  6. Habilita "crond" para que arranque automáticamente.\n  7. Verifica el estado de "httpd" con systemctl status.\n  8. Verifica el estado de "crond" con systemctl status.`,

    tematicas: ['Servicios y automatización'],

    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },

    condicionesExito: null,

    pasos: [
      { descripcion: 'Instalar paquete httpd',           comandoSugerido: 'sudo yum install httpd' },
      { descripcion: 'Instalar paquete cronie',          comandoSugerido: 'sudo yum install cronie' },
      { descripcion: 'Iniciar servicio httpd',           comandoSugerido: 'sudo systemctl start httpd' },
      { descripcion: 'Iniciar servicio crond',           comandoSugerido: 'sudo systemctl start crond' },
      { descripcion: 'Habilitar httpd al arranque',      comandoSugerido: 'sudo systemctl enable httpd' },
      { descripcion: 'Habilitar crond al arranque',      comandoSugerido: 'sudo systemctl enable crond' },
      { descripcion: 'Verificar estado de httpd',        comandoSugerido: 'systemctl status httpd' },
      { descripcion: 'Verificar estado de crond',        comandoSugerido: 'systemctl status crond' }
    ],

    pistas: [
      'sudo yum install <paquete> instala cada servicio por separado.',
      'systemctl start activa el servicio ahora; enable lo hace persistente.',
      'Puedes gestionar varios servicios sin reiniciar el sistema.',
      'systemctl status <servicio> muestra si está active (running) o inactive.',
      'El orden lógico es: instalar → iniciar → habilitar → verificar.',
      'Necesitas sudo para yum, start y enable; status funciona sin él.'
    ],

    comandosUtiles: ['sudo', 'yum', 'systemctl']
  },

  {
    id: 57,
    premisa: `Eres responsable de automatizar la recolección de logs en un servidor. Debes crear la estructura de directorios, registrar un evento inicial y programar una tarea cron que siga generando entradas.\n\nParte 1 — Estructura de archivos:\n  1. Crea el directorio "logs" en tu directorio personal.\n  2. Crea el archivo "logs/app.log" con touch.\n  3. Escribe "Sistema iniciado" en logs/app.log con echo y redirección.\n\nParte 2 — Automatización con cron:\n  4. Instala el paquete "cronie" con yum.\n  5. Inicia el servicio "crond" con systemctl.\n  6. Habilita "crond" para que arranque automáticamente.\n  7. Abre el crontab con: EDITOR=nano crontab -e\n  8. Lista las tareas activas con crontab -l.\n  9. Revisa el archivo "prueba.txt" generado por el cron con cat.\n  10. Confirma el contenido de logs/app.log con cat.`,

    tematicas: ['Servicios y automatización', 'Navegación y archivos básicos'],

    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },

    condicionesExito: null,

    pasos: [
      { descripcion: 'Crear directorio logs',                 comandoSugerido: 'mkdir logs' },
      { descripcion: 'Crear archivo logs/app.log',            comandoSugerido: 'touch logs/app.log' },
      { descripcion: 'Escribir entrada inicial en app.log',   comandoSugerido: 'echo "Sistema iniciado" > logs/app.log' },
      { descripcion: 'Instalar paquete cronie',               comandoSugerido: 'sudo yum install cronie' },
      { descripcion: 'Iniciar el servicio crond',             comandoSugerido: 'sudo systemctl start crond' },
      { descripcion: 'Habilitar crond al arranque',           comandoSugerido: 'sudo systemctl enable crond' },
      { descripcion: 'Abrir editor de crontab',               comandoSugerido: 'EDITOR=nano crontab -e' },
      { descripcion: 'Listar tareas programadas',             comandoSugerido: 'crontab -l' },
      { descripcion: 'Revisar archivo generado por el cron',  comandoSugerido: 'cat prueba.txt' },
      { descripcion: 'Confirmar contenido de logs/app.log',   comandoSugerido: 'cat logs/app.log' }
    ],

    pistas: [
      'mkdir logs crea el directorio; touch logs/app.log crea el archivo dentro.',
      'echo "texto" > archivo escribe en el archivo, sobrescribiendo el contenido.',
      'sudo yum install cronie instala el demonio cron en sistemas Red Hat / Amazon Linux.',
      'Instala y arranca crond antes de editar el crontab.',
      'EDITOR=nano crontab -e abre el editor; el simulador añade una tarea de ejemplo.',
      'crontab -l muestra las tareas sin modificarlas.',
      'cat archivo muestra el contenido en pantalla para verificar su contenido.'
    ],

    comandosUtiles: ['mkdir', 'touch', 'echo', 'sudo', 'yum', 'systemctl', 'crontab', 'cat']
  },

  {
    id: 58,
    premisa: `Eres administrador de un servidor de datos. Debes crear un directorio con datos de ventas, comprimirlo como backup y programar su ejecución automática con cron.\n\nParte 1 — Datos y backup:\n  1. Crea el directorio "datos".\n  2. Crea el directorio "backups".\n  3. Escribe "2024,enero,1500" en el archivo "datos/ventas.csv" con echo y redirección.\n  4. Verifica el contenido de datos/ventas.csv con cat.\n  5. Comprime el directorio "datos/" en "backups/ventas.tar.gz" con tar.\n  6. Lista el contenido de "backups/" para confirmar que el archivo existe.\n\nParte 2 — Automatización con cron:\n  7. Instala el paquete "cronie" con yum.\n  8. Inicia el servicio "crond" con systemctl.\n  9. Habilita "crond" para que arranque automáticamente.\n  10. Abre el crontab con: EDITOR=nano crontab -e\n  11. Lista las tareas programadas con crontab -l.`,

    tematicas: ['Navegación y archivos básicos', 'Compresión y archivos', 'Servicios y automatización'],

    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },

    condicionesExito: null,

    pasos: [
      { descripcion: 'Crear directorio datos',                      comandoSugerido: 'mkdir datos' },
      { descripcion: 'Crear directorio backups',                    comandoSugerido: 'mkdir backups' },
      { descripcion: 'Escribir línea de ventas en datos/ventas.csv', comandoSugerido: 'echo "2024,enero,1500" > datos/ventas.csv' },
      { descripcion: 'Verificar contenido de datos/ventas.csv',     comandoSugerido: 'cat datos/ventas.csv' },
      { descripcion: 'Comprimir datos/ en backups/ventas.tar.gz',   comandoSugerido: 'tar -czvf backups/ventas.tar.gz datos/' },
      { descripcion: 'Verificar archivo comprimido en backups/',     comandoSugerido: 'ls backups' },
      { descripcion: 'Instalar paquete cronie',                     comandoSugerido: 'sudo yum install cronie' },
      { descripcion: 'Iniciar el servicio crond',                   comandoSugerido: 'sudo systemctl start crond' },
      { descripcion: 'Habilitar crond al arranque',                 comandoSugerido: 'sudo systemctl enable crond' },
      { descripcion: 'Abrir editor de crontab',                     comandoSugerido: 'EDITOR=nano crontab -e' },
      { descripcion: 'Listar tareas programadas',                   comandoSugerido: 'crontab -l' }
    ],

    pistas: [
      'mkdir crea un directorio; puedes usarlo varias veces para distintas rutas.',
      'echo "texto" > archivo escribe en el archivo, creándolo si no existe.',
      'tar -czvf archivo.tar.gz directorio/ comprime el directorio en un archivo .tar.gz.',
      'Instala cronie antes de intentar iniciar crond.',
      'systemctl start inicia el servicio ahora; enable lo activa en el arranque.',
      'EDITOR=nano crontab -e abre el editor; el simulador añade una tarea de ejemplo.',
      'crontab -l lista las tareas sin modificarlas.'
    ],

    comandosUtiles: ['mkdir', 'echo', 'cat', 'tar', 'ls', 'sudo', 'yum', 'systemctl', 'crontab']
  },

  {
    id: 59,
    premisa: `Eres administrador de un servidor web. Debes crear archivos de log, analizarlos con herramientas de texto y luego instalar y arrancar el servidor Apache.\n\nParte 1 — Análisis de logs:\n  1. Crea el directorio "logs".\n  2. Escribe "GET /index.html 200 OK" en "logs/access.log" con echo.\n  3. Escribe "ERROR: Connection refused" en "logs/error.log" con echo.\n  4. Busca la palabra "ERROR" en logs/error.log con grep.\n  5. Muestra la última línea de logs/access.log con tail.\n  6. Cuenta las líneas de logs/access.log con wc -l.\n\nParte 2 — Servidor web:\n  7. Instala el paquete "httpd" con yum.\n  8. Inicia el servicio "httpd" con systemctl.\n  9. Habilita "httpd" para que arranque automáticamente.\n  10. Verifica el estado del servicio con systemctl status httpd.`,

    tematicas: ['Manipulación avanzada de archivos', 'Servicios y automatización'],

    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },

    condicionesExito: null,

    pasos: [
      { descripcion: 'Crear directorio logs',                       comandoSugerido: 'mkdir logs' },
      { descripcion: 'Escribir entrada en logs/access.log',         comandoSugerido: 'echo "GET /index.html 200 OK" > logs/access.log' },
      { descripcion: 'Escribir error en logs/error.log',            comandoSugerido: 'echo "ERROR: Connection refused" > logs/error.log' },
      { descripcion: 'Buscar "ERROR" en logs/error.log',            comandoSugerido: 'grep "ERROR" logs/error.log' },
      { descripcion: 'Ver última línea de logs/access.log',         comandoSugerido: 'tail -n 1 logs/access.log' },
      { descripcion: 'Contar líneas de logs/access.log',            comandoSugerido: 'wc -l logs/access.log' },
      { descripcion: 'Instalar paquete httpd',                      comandoSugerido: 'sudo yum install httpd' },
      { descripcion: 'Iniciar el servicio httpd',                   comandoSugerido: 'sudo systemctl start httpd' },
      { descripcion: 'Habilitar httpd al arranque',                 comandoSugerido: 'sudo systemctl enable httpd' },
      { descripcion: 'Verificar estado del servicio httpd',         comandoSugerido: 'systemctl status httpd' }
    ],

    pistas: [
      'echo "texto" > archivo crea el archivo y escribe en él; >> añade al final.',
      'grep "patrón" archivo busca y muestra las líneas que contienen el patrón.',
      'tail -n N archivo muestra las últimas N líneas del archivo.',
      'wc -l archivo cuenta el número de líneas.',
      'Instala httpd con yum antes de intentar iniciarlo con systemctl.',
      'systemctl enable httpd garantiza que el servidor arranca tras cada reinicio.',
      'systemctl status muestra si el servicio está active (running) o inactive.'
    ],

    comandosUtiles: ['mkdir', 'echo', 'grep', 'tail', 'wc', 'sudo', 'yum', 'systemctl']
  },

  {
    id: 60,
    premisa: `Eres desarrollador que debe preparar un proyecto para despliegue: organizar los fuentes, analizarlos y empaquetar el resultado en un archivo comprimido para distribuir.\n\nParte 1 — Estructura del proyecto:\n  1. Crea el directorio "proyecto".\n  2. Crea los subdirectorios "proyecto/src" y "proyecto/docs".\n  3. Escribe 'print("App iniciada")' en "proyecto/src/main.py" con echo.\n  4. Escribe "Documentacion del proyecto" en "proyecto/docs/README.txt" con echo.\n  5. Usa find para localizar todos los archivos ".py" dentro de proyecto/.\n  6. Busca la palabra "App" en proyecto/src/main.py con grep.\n  7. Comprime el directorio "proyecto/" en "proyecto.tar.gz" con tar.\n\nParte 2 — Automatización con cron:\n  8. Instala el paquete "cronie" con yum.\n  9. Inicia el servicio "crond" con systemctl.\n  10. Abre el crontab con: EDITOR=nano crontab -e\n  11. Lista las tareas registradas con crontab -l.`,

    tematicas: ['Navegación y archivos básicos', 'Manipulación avanzada de archivos', 'Compresión y archivos', 'Servicios y automatización'],

    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },

    condicionesExito: null,

    pasos: [
      { descripcion: 'Crear directorio proyecto',                          comandoSugerido: 'mkdir proyecto' },
      { descripcion: 'Crear subdirectorio proyecto/src',                   comandoSugerido: 'mkdir proyecto/src' },
      { descripcion: 'Crear subdirectorio proyecto/docs',                  comandoSugerido: 'mkdir proyecto/docs' },
      { descripcion: 'Escribir código en proyecto/src/main.py',           comandoSugerido: 'echo "print(\\"App iniciada\\")" > proyecto/src/main.py' },
      { descripcion: 'Escribir documentación en proyecto/docs/README.txt', comandoSugerido: 'echo "Documentacion del proyecto" > proyecto/docs/README.txt' },
      { descripcion: 'Buscar archivos .py dentro de proyecto/',            comandoSugerido: 'find proyecto -name "*.py"' },
      { descripcion: 'Buscar "App" en proyecto/src/main.py',              comandoSugerido: 'grep "App" proyecto/src/main.py' },
      { descripcion: 'Comprimir proyecto/ en proyecto.tar.gz',             comandoSugerido: 'tar -czvf proyecto.tar.gz proyecto/' },
      { descripcion: 'Instalar paquete cronie',                            comandoSugerido: 'sudo yum install cronie' },
      { descripcion: 'Iniciar el servicio crond',                          comandoSugerido: 'sudo systemctl start crond' },
      { descripcion: 'Abrir editor de crontab',                            comandoSugerido: 'EDITOR=nano crontab -e' },
      { descripcion: 'Listar tareas programadas',                          comandoSugerido: 'crontab -l' }
    ],

    pistas: [
      'Crea los directorios padre antes que los hijos: mkdir proyecto antes de mkdir proyecto/src.',
      'echo "texto" > archivo crea el archivo si no existe y escribe en él.',
      'find directorio -name "*.ext" busca archivos con esa extensión dentro del árbol.',
      'grep "patrón" archivo filtra las líneas que coinciden.',
      'tar -czvf archivo.tar.gz directorio/ empaqueta y comprime en un solo paso.',
      'Instala cronie y arranca crond antes de editar el crontab.',
      'crontab -l muestra las tareas activas sin modificarlas.'
    ],

    comandosUtiles: ['mkdir', 'echo', 'find', 'grep', 'tar', 'sudo', 'yum', 'systemctl', 'crontab']
  },

  {
    id: 61,
    premisa: `Eres responsable del despliegue de una aplicación. Debes crear la estructura de configuración, verificar su contenido, hacer una copia de seguridad y arrancar los servicios necesarios.\n\nParte 1 — Configuración de la aplicación:\n  1. Crea el directorio "app".\n  2. Crea el subdirectorio "app/config".\n  3. Escribe "HOST=localhost" en "app/config/settings.conf" con echo.\n  4. Verifica el contenido del archivo con cat.\n  5. Busca la clave "HOST" con grep en app/config/settings.conf.\n  6. Copia settings.conf a settings.conf.bak dentro de app/config/.\n  7. Lista el contenido de app/config/ para confirmar la copia.\n\nParte 2 — Servidor web:\n  8. Instala el paquete "httpd" con yum.\n  9. Inicia el servicio "httpd" con systemctl.\n  10. Habilita "httpd" para que arranque automáticamente.\n  11. Verifica el estado de httpd con systemctl status.\n\nParte 3 — Automatización con cron:\n  12. Instala el paquete "cronie" con yum.\n  13. Inicia el servicio "crond" con systemctl.\n  14. Abre el crontab con: EDITOR=nano crontab -e`,

    tematicas: ['Navegación y archivos básicos', 'Manipulación avanzada de archivos', 'Servicios y automatización'],

    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },

    condicionesExito: null,

    pasos: [
      { descripcion: 'Crear directorio app',                           comandoSugerido: 'mkdir app' },
      { descripcion: 'Crear subdirectorio app/config',                 comandoSugerido: 'mkdir app/config' },
      { descripcion: 'Escribir configuración en settings.conf',        comandoSugerido: 'echo "HOST=localhost" > app/config/settings.conf' },
      { descripcion: 'Verificar contenido de settings.conf',           comandoSugerido: 'cat app/config/settings.conf' },
      { descripcion: 'Buscar clave HOST en settings.conf',             comandoSugerido: 'grep "HOST" app/config/settings.conf' },
      { descripcion: 'Copiar settings.conf a settings.conf.bak',       comandoSugerido: 'cp app/config/settings.conf app/config/settings.conf.bak' },
      { descripcion: 'Verificar copia en app/config/',                  comandoSugerido: 'ls app/config' },
      { descripcion: 'Instalar paquete httpd',                          comandoSugerido: 'sudo yum install httpd' },
      { descripcion: 'Iniciar servicio httpd',                          comandoSugerido: 'sudo systemctl start httpd' },
      { descripcion: 'Habilitar httpd al arranque',                     comandoSugerido: 'sudo systemctl enable httpd' },
      { descripcion: 'Verificar estado de httpd',                       comandoSugerido: 'systemctl status httpd' },
      { descripcion: 'Instalar paquete cronie',                         comandoSugerido: 'sudo yum install cronie' },
      { descripcion: 'Iniciar servicio crond',                          comandoSugerido: 'sudo systemctl start crond' },
      { descripcion: 'Abrir editor de crontab',                         comandoSugerido: 'EDITOR=nano crontab -e' }
    ],

    pistas: [
      'Crea los directorios de fuera hacia adentro: app antes que app/config.',
      'echo "clave=valor" > archivo crea el archivo de configuración si no existe.',
      'cat archivo muestra el contenido en pantalla; grep filtra por patrón.',
      'cp origen destino copia un archivo; cp archivo app/config/ lo copia dentro de esa carpeta.',
      'Instala httpd y cronie por separado con sudo yum install.',
      'systemctl start inicia el servicio; enable lo hace persistente.',
      'Puedes gestionar httpd y crond de forma independiente con systemctl.'
    ],

    comandosUtiles: ['mkdir', 'echo', 'cat', 'grep', 'cp', 'ls', 'sudo', 'yum', 'systemctl', 'crontab']
  },

  {
    id: 62,
    premisa: `Eres administrador de sistemas. Debes practicar el ciclo de vida completo de un servicio web: instalarlo, iniciarlo, detenerlo, reiniciarlo y habilitarlo para que arranque automáticamente.\n\nParte 1 — Ciclo básico del servicio:\n  1. Instala el paquete "httpd" con yum.\n  2. Inicia el servicio "httpd" con systemctl start.\n  3. Verifica que está activo con systemctl status httpd.\n  4. Detén el servicio con systemctl stop httpd.\n  5. Comprueba que figura como inactivo con systemctl status httpd.\n  6. Reinicia el servicio con systemctl restart httpd.\n  7. Comprueba que vuelve a estar activo con systemctl status httpd.\n\nParte 2 — Persistencia al arranque:\n  8. Habilita el servicio al arranque con systemctl enable httpd.\n  9. Verifica el estado final (activo y habilitado) con systemctl status httpd.`,

    tematicas: ['Servicios y automatización'],

    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },

    condicionesExito: null,

    pasos: [
      { descripcion: 'Instalar paquete httpd',                    comandoSugerido: 'sudo yum install httpd' },
      { descripcion: 'Iniciar el servicio httpd',                 comandoSugerido: 'sudo systemctl start httpd' },
      { descripcion: 'Verificar que httpd está activo',           comandoSugerido: 'systemctl status httpd' },
      { descripcion: 'Detener el servicio httpd',                 comandoSugerido: 'sudo systemctl stop httpd' },
      { descripcion: 'Verificar que httpd está detenido',         comandoSugerido: 'systemctl status httpd' },
      { descripcion: 'Reiniciar el servicio httpd',               comandoSugerido: 'sudo systemctl restart httpd' },
      { descripcion: 'Verificar que httpd vuelve a estar activo', comandoSugerido: 'systemctl status httpd' },
      { descripcion: 'Habilitar httpd al arranque del sistema',   comandoSugerido: 'sudo systemctl enable httpd' },
      { descripcion: 'Verificar estado final: activo y habilitado', comandoSugerido: 'systemctl status httpd' }
    ],

    pistas: [
      'sudo yum install httpd descarga e instala el servidor web Apache.',
      'systemctl start inicia el servicio ahora; stop lo detiene; restart lo reinicia.',
      'systemctl status muestra si el servicio está "active (running)" o "inactive (dead)".',
      'systemctl enable hace que el servicio arranque automáticamente tras cada reinicio.',
      'Necesitas sudo para start, stop, restart y enable; status no requiere privilegios.',
      'restart equivale a stop + start: útil para aplicar cambios sin perder la habilitación.'
    ],

    comandosUtiles: ['sudo', 'yum', 'systemctl']
  },

  {
    id: 63,
    premisa: `Eres administrador de un servidor. Debes comprender la diferencia entre un servicio activo (running) y uno habilitado (enabled): un servicio puede estar corriendo sin persistir tras un reinicio, y viceversa.\n\nParte 1 — Activar y habilitar:\n  1. Instala el paquete "cronie" con yum.\n  2. Inicia el servicio "crond" con systemctl start.\n  3. Habilita "crond" para que arranque automáticamente con systemctl enable.\n  4. Verifica que está activo y habilitado con systemctl status crond.\n\nParte 2 — Detener y deshabilitar:\n  5. Detén el servicio con systemctl stop crond.\n  6. Deshabilita el servicio con systemctl disable crond.\n  7. Verifica que figura como inactivo y deshabilitado con systemctl status crond.\n  8. Vuelve a iniciar el servicio (sin habilitarlo) con systemctl start crond.`,

    tematicas: ['Servicios y automatización'],

    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },

    condicionesExito: null,

    pasos: [
      { descripcion: 'Instalar paquete cronie',                       comandoSugerido: 'sudo yum install cronie' },
      { descripcion: 'Iniciar el servicio crond',                     comandoSugerido: 'sudo systemctl start crond' },
      { descripcion: 'Habilitar crond al arranque',                   comandoSugerido: 'sudo systemctl enable crond' },
      { descripcion: 'Verificar que crond está activo y habilitado',  comandoSugerido: 'systemctl status crond' },
      { descripcion: 'Detener el servicio crond',                     comandoSugerido: 'sudo systemctl stop crond' },
      { descripcion: 'Deshabilitar crond del arranque',               comandoSugerido: 'sudo systemctl disable crond' },
      { descripcion: 'Verificar que crond está inactivo y deshabilitado', comandoSugerido: 'systemctl status crond' },
      { descripcion: 'Volver a iniciar crond sin habilitarlo',        comandoSugerido: 'sudo systemctl start crond' }
    ],

    pistas: [
      '"running" y "enabled" son estados independientes: un servicio puede estar corriendo sin estar habilitado.',
      'systemctl enable/disable controla si el servicio arranca con el sistema.',
      'systemctl start/stop controla si el servicio está corriendo ahora mismo.',
      'systemctl status muestra ambos estados: Active y Loaded (enabled/disabled).',
      'disable no detiene el servicio si ya está corriendo: debes hacer stop por separado.',
      'Un servicio iniciado sin enable volverá a estar detenido tras el próximo reinicio.'
    ],

    comandosUtiles: ['sudo', 'yum', 'systemctl']
  },

  {
    id: 64,
    premisa: `Eres administrador de un servidor de producción. Debes instalar, configurar y monitorear activamente dos servicios simultáneos: el servidor web Apache y el demonio cron. Usa watch para observar el estado en tiempo real.\n\nParte 1 — Servidor web (httpd):\n  1. Instala el paquete "httpd" con yum.\n  2. Inicia el servicio "httpd" con systemctl start.\n  3. Habilita "httpd" con systemctl enable.\n  4. Monitorea el estado de httpd en tiempo real con: watch systemctl status httpd\n\nParte 2 — Demonio de tareas programadas (crond):\n  5. Instala el paquete "cronie" con yum.\n  6. Inicia el servicio "crond" con systemctl start.\n  7. Habilita "crond" con systemctl enable.\n  8. Monitorea el estado de crond en tiempo real con: watch systemctl status crond`,

    tematicas: ['Servicios y automatización'],

    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },

    condicionesExito: null,

    pasos: [
      { descripcion: 'Instalar paquete httpd',                  comandoSugerido: 'sudo yum install httpd' },
      { descripcion: 'Iniciar servicio httpd',                  comandoSugerido: 'sudo systemctl start httpd' },
      { descripcion: 'Habilitar httpd al arranque',             comandoSugerido: 'sudo systemctl enable httpd' },
      { descripcion: 'Monitorear estado de httpd con watch',    comandoSugerido: 'watch systemctl status httpd' },
      { descripcion: 'Instalar paquete cronie',                 comandoSugerido: 'sudo yum install cronie' },
      { descripcion: 'Iniciar servicio crond',                  comandoSugerido: 'sudo systemctl start crond' },
      { descripcion: 'Habilitar crond al arranque',             comandoSugerido: 'sudo systemctl enable crond' },
      { descripcion: 'Monitorear estado de crond con watch',    comandoSugerido: 'watch systemctl status crond' }
    ],

    pistas: [
      'sudo yum install <paquete> instala el paquete antes de poder gestionar su servicio.',
      'systemctl start + enable: el servicio corre ahora y arrancará en cada reinicio.',
      'watch <comando> re-ejecuta el comando cada 2 segundos para monitoreo continuo.',
      'watch systemctl status <servicio> es el patrón habitual para observar el estado en vivo.',
      'Puedes gestionar múltiples servicios de forma independiente con systemctl.',
      'En el simulador, watch muestra el resultado de la última ejecución del comando.'
    ],

    comandosUtiles: ['sudo', 'yum', 'systemctl', 'watch']
  },

  {
    id: 65,
    premisa: `Eres responsable de desplegar un servidor web con archivos de configuración propios. Debes crear y verificar los archivos de configuración y luego arrancar el servicio.\n\nParte 1 — Archivos de configuración:\n  1. Crea el directorio "app" y dentro el subdirectorio "app/config".\n  2. Escribe "HOST=0.0.0.0" en "app/config/httpd.conf" con echo.\n  3. Verifica el contenido del archivo con cat.\n  4. Busca la clave "HOST" con grep.\n  5. Copia httpd.conf a httpd.conf.bak dentro de app/config/.\n\nParte 2 — Servidor web:\n  6. Instala el paquete "httpd" con yum.\n  7. Inicia el servicio "httpd" con systemctl start.\n  8. Habilita "httpd" con systemctl enable.\n  9. Monitorea el estado del servicio con: watch systemctl status httpd`,

    tematicas: ['Navegación y archivos básicos', 'Manipulación avanzada de archivos', 'Servicios y automatización'],

    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },

    condicionesExito: null,

    pasos: [
      { descripcion: 'Crear directorio app',                       comandoSugerido: 'mkdir app' },
      { descripcion: 'Crear subdirectorio app/config',             comandoSugerido: 'mkdir app/config' },
      { descripcion: 'Escribir configuración en httpd.conf',       comandoSugerido: 'echo "HOST=0.0.0.0" > app/config/httpd.conf' },
      { descripcion: 'Verificar contenido de httpd.conf',          comandoSugerido: 'cat app/config/httpd.conf' },
      { descripcion: 'Buscar clave HOST en httpd.conf',            comandoSugerido: 'grep "HOST" app/config/httpd.conf' },
      { descripcion: 'Hacer copia de seguridad de httpd.conf',     comandoSugerido: 'cp app/config/httpd.conf app/config/httpd.conf.bak' },
      { descripcion: 'Instalar paquete httpd',                     comandoSugerido: 'sudo yum install httpd' },
      { descripcion: 'Iniciar servicio httpd',                     comandoSugerido: 'sudo systemctl start httpd' },
      { descripcion: 'Habilitar httpd al arranque',                comandoSugerido: 'sudo systemctl enable httpd' },
      { descripcion: 'Monitorear estado de httpd con watch',       comandoSugerido: 'watch systemctl status httpd' }
    ],

    pistas: [
      'Crea los directorios de fuera hacia adentro: app antes que app/config.',
      'echo "clave=valor" > archivo crea el archivo si no existe.',
      'grep "patrón" archivo filtra las líneas que contienen el patrón.',
      'cp origen destino.bak es el patrón habitual para hacer una copia de seguridad.',
      'Instala httpd con yum antes de intentar iniciarlo con systemctl.',
      'watch systemctl status httpd muestra el estado del servicio en tiempo real.'
    ],

    comandosUtiles: ['mkdir', 'echo', 'cat', 'grep', 'cp', 'sudo', 'yum', 'systemctl', 'watch']
  },

  {
    id: 66,
    premisa: `Eres administrador de un servidor multiusuario. Debes crear un usuario dedicado para el servicio web, asignarlo a un grupo y luego instalar y poner en marcha el servidor Apache.\n\nParte 1 — Usuarios y grupos:\n  1. Crea el usuario "webadmin" con directorio personal usando useradd.\n  2. Crea el grupo "webteam" con groupadd.\n  3. Agrega "webadmin" al grupo "webteam" con usermod.\n  4. Verifica los grupos de "webadmin" con el comando id.\n\nParte 2 — Servidor web:\n  5. Instala el paquete "httpd" con yum.\n  6. Inicia el servicio "httpd" con systemctl start.\n  7. Habilita "httpd" con systemctl enable.\n  8. Verifica el estado del servicio con systemctl status httpd.\n  9. Monitorea el servicio en tiempo real con: watch systemctl status httpd`,

    tematicas: ['Administración de usuarios y grupos', 'Servicios y automatización'],

    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },

    condicionesExito: null,

    pasos: [
      { descripcion: 'Crear usuario webadmin con home',            comandoSugerido: 'sudo useradd -m webadmin' },
      { descripcion: 'Crear grupo webteam',                        comandoSugerido: 'sudo groupadd webteam' },
      { descripcion: 'Añadir webadmin al grupo webteam',           comandoSugerido: 'sudo usermod -aG webteam webadmin' },
      { descripcion: 'Verificar grupos de webadmin',               comandoSugerido: 'id webadmin' },
      { descripcion: 'Instalar paquete httpd',                     comandoSugerido: 'sudo yum install httpd' },
      { descripcion: 'Iniciar servicio httpd',                     comandoSugerido: 'sudo systemctl start httpd' },
      { descripcion: 'Habilitar httpd al arranque',                comandoSugerido: 'sudo systemctl enable httpd' },
      { descripcion: 'Verificar estado de httpd',                  comandoSugerido: 'systemctl status httpd' },
      { descripcion: 'Monitorear estado de httpd con watch',       comandoSugerido: 'watch systemctl status httpd' }
    ],

    pistas: [
      'sudo useradd -m webadmin crea el usuario y su directorio /home/webadmin.',
      'sudo groupadd webteam crea el grupo; luego usermod -aG lo añade sin perder los grupos existentes.',
      'id webadmin muestra el uid, gid y todos los grupos a los que pertenece.',
      'Instala httpd con yum antes de gestionar su servicio con systemctl.',
      'systemctl enable garantiza que httpd arranque automáticamente tras cada reinicio.',
      'watch systemctl status httpd refresca el estado del servicio cada 2 segundos.'
    ],

    comandosUtiles: ['sudo', 'useradd', 'groupadd', 'usermod', 'id', 'yum', 'systemctl', 'watch']
  },

  {
    id: 67,
    premisa: `Eres administrador de un servidor en producción. Debes organizar los logs existentes, comprimirlos como backup y luego arrancar el servidor web con monitoreo activo.\n\nParte 1 — Logs y backup:\n  1. Crea el directorio "logs".\n  2. Escribe "INFO: Servidor iniciado" en "logs/app.log" con echo.\n  3. Verifica el contenido de logs/app.log con cat.\n  4. Comprime el directorio "logs/" en "logs_backup.tar.gz" con tar.\n  5. Lista el directorio actual para confirmar que el archivo .tar.gz existe.\n\nParte 2 — Servidor web con monitoreo:\n  6. Instala el paquete "httpd" con yum.\n  7. Inicia el servicio "httpd" con systemctl start.\n  8. Habilita "httpd" con systemctl enable.\n  9. Monitorea el estado de httpd con: watch systemctl status httpd`,

    tematicas: ['Navegación y archivos básicos', 'Compresión y archivos', 'Servicios y automatización'],

    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },

    condicionesExito: null,

    pasos: [
      { descripcion: 'Crear directorio logs',                      comandoSugerido: 'mkdir logs' },
      { descripcion: 'Escribir entrada inicial en logs/app.log',   comandoSugerido: 'echo "INFO: Servidor iniciado" > logs/app.log' },
      { descripcion: 'Verificar contenido de logs/app.log',        comandoSugerido: 'cat logs/app.log' },
      { descripcion: 'Comprimir logs/ en logs_backup.tar.gz',      comandoSugerido: 'tar -czvf logs_backup.tar.gz logs/' },
      { descripcion: 'Verificar que logs_backup.tar.gz existe',    comandoSugerido: 'ls' },
      { descripcion: 'Instalar paquete httpd',                     comandoSugerido: 'sudo yum install httpd' },
      { descripcion: 'Iniciar servicio httpd',                     comandoSugerido: 'sudo systemctl start httpd' },
      { descripcion: 'Habilitar httpd al arranque',                comandoSugerido: 'sudo systemctl enable httpd' },
      { descripcion: 'Monitorear estado de httpd con watch',       comandoSugerido: 'watch systemctl status httpd' }
    ],

    pistas: [
      'echo "texto" > archivo crea el archivo si no existe y escribe en él.',
      'tar -czvf archivo.tar.gz directorio/ comprime el directorio en un solo paso.',
      'ls confirma que el archivo .tar.gz fue creado en el directorio actual.',
      'Instala httpd con yum antes de intentar iniciarlo con systemctl.',
      'systemctl start + enable: el servicio corre ahora y arrancará en cada reinicio.',
      'watch systemctl status httpd muestra el estado actualizado cada 2 segundos.'
    ],

    comandosUtiles: ['mkdir', 'echo', 'cat', 'tar', 'ls', 'sudo', 'yum', 'systemctl', 'watch']
  },

  {
    id: 68,
    premisa: `Desafío de integración: prepara una estructura de archivos de proyecto, empaqueta una versión de respaldo, gestiona el ciclo completo de dos servicios y programa una tarea automática.\n\nParte 1 — Estructura del proyecto:\n  1. Crea el directorio "proyecto" y dentro "proyecto/config".\n  2. Escribe "ENV=produccion" en "proyecto/config/app.conf" con echo.\n  3. Comprime "proyecto/" en "proyecto_v1.tar.gz" con tar.\n\nParte 2 — Servidor web (httpd):\n  4. Instala el paquete "httpd" con yum.\n  5. Inicia y habilita "httpd" con systemctl start y systemctl enable.\n  6. Verifica el estado de httpd con systemctl status httpd.\n  7. Detén httpd con systemctl stop y reinícialo con systemctl restart.\n  8. Monitorea httpd con: watch systemctl status httpd\n\nParte 3 — Demonio cron:\n  9. Instala "cronie" y arranca y habilita "crond".\n\nParte 4 — Automatización con cron:\n  10. Abre el crontab con: EDITOR=nano crontab -e\n  11. Lista las tareas con crontab -l.`,

    tematicas: ['Navegación y archivos básicos', 'Compresión y archivos', 'Servicios y automatización'],

    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },

    condicionesExito: null,

    pasos: [
      { descripcion: 'Crear directorio proyecto',                    comandoSugerido: 'mkdir proyecto' },
      { descripcion: 'Crear subdirectorio proyecto/config',          comandoSugerido: 'mkdir proyecto/config' },
      { descripcion: 'Escribir configuración en app.conf',           comandoSugerido: 'echo "ENV=produccion" > proyecto/config/app.conf' },
      { descripcion: 'Comprimir proyecto/ en proyecto_v1.tar.gz',   comandoSugerido: 'tar -czvf proyecto_v1.tar.gz proyecto/' },
      { descripcion: 'Instalar paquete httpd',                       comandoSugerido: 'sudo yum install httpd' },
      { descripcion: 'Iniciar servicio httpd',                       comandoSugerido: 'sudo systemctl start httpd' },
      { descripcion: 'Habilitar httpd al arranque',                  comandoSugerido: 'sudo systemctl enable httpd' },
      { descripcion: 'Verificar estado de httpd',                    comandoSugerido: 'systemctl status httpd' },
      { descripcion: 'Detener httpd',                                comandoSugerido: 'sudo systemctl stop httpd' },
      { descripcion: 'Reiniciar httpd',                             comandoSugerido: 'sudo systemctl restart httpd' },
      { descripcion: 'Monitorear httpd con watch',                   comandoSugerido: 'watch systemctl status httpd' },
      { descripcion: 'Instalar paquete cronie',                      comandoSugerido: 'sudo yum install cronie' },
      { descripcion: 'Iniciar servicio crond',                       comandoSugerido: 'sudo systemctl start crond' },
      { descripcion: 'Habilitar crond al arranque',                  comandoSugerido: 'sudo systemctl enable crond' },
      { descripcion: 'Abrir editor de crontab',                      comandoSugerido: 'EDITOR=nano crontab -e' },
      { descripcion: 'Listar tareas programadas',                    comandoSugerido: 'crontab -l' }
    ],

    pistas: [
      'tar -czvf archivo.tar.gz directorio/ crea el backup comprimido en un solo paso.',
      'systemctl start inicia ahora; enable persiste el servicio tras reinicios.',
      'stop detiene el servicio; restart lo reinicia (equivale a stop + start).',
      'watch <comando> refresca el estado cada 2 segundos para monitoreo continuo.',
      'Instala y arranca cronie/crond antes de editar el crontab con crontab -e.',
      'Puedes gestionar httpd y crond de forma independiente con sus propios systemctl.',
      'crontab -l lista las tareas activas sin modificar nada.'
    ],

    comandosUtiles: ['mkdir', 'echo', 'tar', 'sudo', 'yum', 'systemctl', 'watch', 'crontab']
  }
];
