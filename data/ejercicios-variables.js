const ejerciciosVariables = [
  // ──────────────────────────────────────────────
  // BLOQUE 7: Variables de entorno y redirección (6)
  // ──────────────────────────────────────────────
  {
    id: 47,
    premisa: 'Configura variables de entorno para una aplicación y guarda la salida en archivos.',
    tematicas: ['Variables de entorno y redirección'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver las variables de entorno actuales', comandoSugerido: 'env' },
      { descripcion: 'Exportar variable APP_ENV', comandoSugerido: 'export APP_ENV=production' },
      { descripcion: 'Verificar que se exportó', comandoSugerido: 'echo $APP_ENV' },
      { descripcion: 'Guardar las variables de entorno en un archivo', comandoSugerido: 'env > entorno.txt' }
    ],
    pistas: [
      'env muestra todas las variables de entorno.',
      'export NOMBRE=valor define y exporta una variable.',
      'echo $VARIABLE muestra el valor de la variable.'
    ],
    comandosUtiles: ['env', 'export', 'echo']
  },

  {
    id: 48,
    premisa: 'Usa redirección para capturar la salida de comandos de diagnóstico.',
    tematicas: ['Variables de entorno y redirección'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Guardar información del sistema en sistema.txt', comandoSugerido: 'uname -a > sistema.txt' },
      { descripcion: 'Añadir el uptime al mismo archivo', comandoSugerido: 'uptime >> sistema.txt' },
      { descripcion: 'Añadir el uso de memoria', comandoSugerido: 'free -h >> sistema.txt' },
      { descripcion: 'Ver el archivo completo', comandoSugerido: 'cat sistema.txt' }
    ],
    pistas: [
      '> redirige la salida y sobreescribe el archivo.',
      '>> añade al final del archivo sin borrar.',
      'cat muestra el contenido del archivo.'
    ],
    comandosUtiles: ['echo', 'cat', 'uname', 'free']
  },

  {
    id: 49,
    premisa: 'Usa tee para ver y guardar simultáneamente la salida de un proceso de auditoría.',
    tematicas: ['Variables de entorno y redirección'],
    estadoInicial: {
      fs: { dirs: [], files: [] },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Guardar listado y mostrarlo a la vez con tee', comandoSugerido: 'ls | tee listado.txt' },
      { descripcion: 'Ver el archivo generado', comandoSugerido: 'cat listado.txt' },
      { descripcion: 'Ver variables de entorno guardando en env.txt', comandoSugerido: 'env | tee env.txt' }
    ],
    pistas: [
      'tee escribe en pantalla y en archivo simultáneamente.',
      'ls | tee archivo redirige la salida de ls a tee.',
      'tee -a añade al archivo en lugar de sobreescribir.'
    ],
    comandosUtiles: ['tee', 'env', 'ls', 'cat']
  },

  {
    id: 50,
    premisa: 'Procesa una lista de nombres de archivos con xargs para operaciones por lotes.',
    tematicas: ['Variables de entorno y redirección'],
    estadoInicial: {
      fs: {
        dirs: [],
        files: [
          { path: '/home/user-ec2/a.tmp', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '' },
          { path: '/home/user-ec2/b.tmp', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '' },
          { path: '/home/user-ec2/c.tmp', owner: 'user-ec2', group: 'user-ec2', perms: '644', content: '' }
        ]
      },
      usuarios: [], grupos: [],
      usuarioActual: 'user-ec2',
      directorioActual: '/home/user-ec2'
    },
    condicionesExito: null,
    pasos: [
      { descripcion: 'Ver archivos .tmp presentes', comandoSugerido: 'ls' },
      { descripcion: 'Exportar variable BATCH=1', comandoSugerido: 'export BATCH=1' },
      { descripcion: 'Verificar variable exportada', comandoSugerido: 'echo $BATCH' }
    ],
    pistas: [
      'xargs pasa la entrada estándar como argumentos a otro comando.',
      'find . -name "*.tmp" | xargs rm elimina todos los .tmp.',
      'export define variables disponibles para subprocesos.'
    ],
    comandosUtiles: ['xargs', 'export', 'echo', 'env']
  }
];
