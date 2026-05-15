# LINUX_LAB — Simulador de Terminal Linux

Aplicación web educativa que simula una terminal Linux interactiva. El usuario resuelve ejercicios guiados escribiendo comandos reales en un entorno virtual que mantiene un sistema de archivos, usuarios, grupos y permisos propios de Unix.

---

## Tabla de contenidos

1. [Visión general](#visión-general)
2. [Características](#características)
3. [Arquitectura](#arquitectura)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Stack tecnológico](#stack-tecnológico)
6. [Ejecución](#ejecución)
7. [Ejercicios — estructura de datos](#ejercicios--estructura-de-datos)
8. [Añadir ejercicios](#añadir-ejercicios)
9. [Sistema de comandos](#sistema-de-comandos)
10. [Sistema de configuración](#sistema-de-configuración)
11. [Hoja de ruta](#hoja-de-ruta)

---

## Visión general

LINUX_LAB es un simulador de terminal educativo orientado a quienes aprenden administración de sistemas Linux. El usuario escribe comandos dentro de un entorno completamente virtual (sin backend, sin shell real) y la aplicación valida cada paso, ofrece pistas progresivas y mantiene el estado del sistema coherente entre comandos.

**Estado actual:** 100 ejercicios, 9 temáticas, 32+ comandos simulados, 3 ejercicios de lección.

---

## Características

### Terminal simulada
- Más de 32 comandos Linux implementados con comportamiento realista.
- Soporte de tuberías (`cmd1 | cmd2`) y redirección de salida (`>`, `>>`).
- Expansión de variables de entorno (`$HOME`, `$USER`, `$PWD`, variables definidas con `export`).
- Historial de comandos navegable con ↑ / ↓.
- Prompt dinámico: `usuario@host:directorio$`.

### Sistema de archivos virtual
- Árbol de directorios completo a partir de `/`.
- Permisos Unix (rwx) por propietario, grupo y otros.
- Notación octal y simbólica en `chmod`.
- Propietario y grupo por nodo; `chown`, `chgrp` con flag `-R`.
- Soporte de enlaces simbólicos (`ln -s`).

### Gestión de usuarios y grupos
- `useradd`, `userdel`, `usermod`, `passwd`, `su`, `sudo`.
- `groupadd`, `groupdel`.
- Validación real de permisos: un usuario no puede modificar lo que no le pertenece.
- `user-ec2` es miembro del grupo `sudo` por defecto.

### Ejercicios guiados
- 100 ejercicios estructurados en 9 temáticas.
- Cada ejercicio define su estado inicial (archivos, directorios, usuarios, grupos preexistentes).
- Lista de pasos con sugerencia de comando para cada uno.
- Sistema de pistas de tres niveles (genérica → palabras clave → comando exacto).
- Botón de solución que ejecuta todos los pasos automáticamente.
- Detección automática de finalización del ejercicio.

### Controles de sesión
- **Deshacer / Rehacer**: revertir o reaplicar comandos con restauración completa del estado.
- **Filtro de ejercicios**: por temática o por comandos específicos (modo restrictivo).
- **Navegación**: anterior, siguiente, aleatorio, salto por número.
- **Exportar log**: descarga el historial de la terminal en formato `.md`.

### Configuración persistente
- Selección de temáticas y comandos guardada en `localStorage`.
- Filtro restrictivo: muestra solo ejercicios cuyos comandos están todos seleccionados.
- Toast de conteo en tiempo real al cambiar la selección.

---

## Arquitectura

```
┌──────────────────────────────────────────────────────────────┐
│                        index.html                            │
│                                                              │
│   ┌──────────┐   ┌─────────────────┐   ┌─────────────────┐  │
│   │ Sidebar  │   │    Terminal      │   │   Panel info    │  │
│   │  (nav)   │   │  (input/output) │   │ (ejercicio/paso)│  │
│   └──────────┘   └────────┬────────┘   └────────┬────────┘  │
│                            │                     │           │
└────────────────────────────┼─────────────────────┼───────────┘
                             │                     │
              ┌──────────────▼──────────────┐      │
              │         src/ui.js           │◄─────┘
              │  (punto de entrada, wiring) │
              └──────┬───────────┬──────────┘
                     │           │
        ┌────────────▼───┐  ┌────▼──────────────┐
        │ executeCommand │  │  loadExercise /    │
        │  terminal.js   │  │  step-validator.js │
        └────────┬───────┘  └────────────────────┘
                 │
     ┌───────────▼────────────┐
     │   terminal-parser.js   │  tokenize · parseRedirect · splitPipes
     └───────────┬────────────┘
                 │
     ┌───────────▼────────────┐
     │ terminal-commands.js   │  COMMANDS{ cmd → handler }
     └───┬───────────┬────────┘
         │           │
   ┌─────▼────┐  ┌───▼──────┐
   │  vfs.js  │  │ users.js │
   │(VirtualFS│  │(VirtualUs│
   │    )     │  │   ers)   │
   └──────────┘  └──────────┘
```

### Flujo de ejecución de un comando

```
Enter pulsado
  → executeCommand(rawInput)
    → splitPipes()          [separa segmentos de tubería]
    → por cada segmento:
        tokenize()          [respeta comillas]
        parseRedirect()     [extrae > >>]
        parseFlags()        [separa -flags de args]
        COMMANDS[cmd](...)  [despacha al handler]
        handler → vfs / vusers  [modifica estado]
        aplica redirección si procede
    → renderOutputLines()   [pinta salida en pantalla]
    → snapshotState()       [push a undoStack]
    → checkStepProgress()   [valida paso actual]
    → updateUI()            [prompt, pasos, panel]
```

### Estado global compartido

| Variable | Módulo | Descripción |
|---|---|---|
| `vfs` | terminal.js | Instancia única de VirtualFS |
| `vusers` | terminal.js | Instancia única de VirtualUsers |
| `termState` | terminal.js | `{ cwd, lastExit, services, packages, crontab }` |
| `envVars` | terminal.js | Variables de entorno de sesión |
| `commandHistory` | terminal.js | Historial de comandos ejecutados |
| `currentExercise` | ui.js | Ejercicio activo |
| `currentStepIndex` | ui.js | Paso actual |
| `undoStack / redoStack` | ui.js | Pilas de snapshots para deshacer/rehacer |
| `TOOL_COMMANDS` | tool-commands.js | Base de datos de documentación de comandos |
| `listaEjercicios` | ejercicios.js | Array de los 100 ejercicios |
| `AppSettings` | settings.js | Singleton de configuración persistente |

---

## Estructura del proyecto

```
Aim_Terminal/
│
├── index.html              # Página principal: simulador de terminal
├── settings.html           # Página de configuración de temáticas
├── lessons.html            # Catálogo de ejercicios de lección
│
├── ejercicios.js           # Los 100 ejercicios (array listaEjercicios)
├── settings.js             # AppSettings: persistencia en localStorage
│
├── src/
│   ├── vfs.js              # VirtualFS + VirtualNode
│   ├── users.js            # VirtualUsers (usuarios y grupos)
│   ├── terminal-parser.js  # tokenize, parseFlags, splitPipes, expandVars
│   ├── terminal-commands.js# Handlers de comandos + tabla COMMANDS
│   ├── terminal.js         # Estado global, executeCommand, undo/redo
│   ├── tool-commands.js    # TOOL_COMMANDS: docs de comandos para el panel
│   ├── step-validator.js   # _stepSatisfied, checkStepProgress
│   ├── exercise-nav.js     # getFilteredExercises, navigateToExercise
│   ├── settings-ui.js      # Renderizado y wiring de settings.html
│   └── ui.js               # Punto de entrada, renderizado, wiring de index.html
│
└── Docs/
    ├── PRD.md              # Documento de requisitos del producto
    ├── Paso_a_paso.md      # Guía de implementación paso a paso
    └── 50_ejercicios_basicos.md
```

### Orden de carga de scripts (index.html)

```html
ejercicios.js          <!-- listaEjercicios (global) -->
settings.js            <!-- AppSettings (global) -->
src/vfs.js             <!-- VirtualFS, VirtualNode (clases) -->
src/users.js           <!-- VirtualUsers (clase) -->
src/terminal-parser.js <!-- funciones de parsing (globales) -->
src/terminal-commands.js <!-- COMMANDS + handlers (globales) -->
src/terminal.js        <!-- vfs, vusers, termState, executeCommand -->
src/tool-commands.js   <!-- TOOL_COMMANDS (global) -->
src/step-validator.js  <!-- checkStepProgress, _stepSatisfied -->
src/exercise-nav.js    <!-- navigateToExercise, getFilteredExercises -->
src/ui.js              <!-- wiring DOM, loadExercise (DOMContentLoaded) -->
```

> No hay bundler. Todos los scripts comparten el mismo scope global (`window`). El orden de carga importa para respetar las dependencias.

---

## Stack tecnológico

| Categoría | Tecnología |
|---|---|
| Lenguaje | JavaScript ES6+ (sin transpilador) |
| Estilos | Tailwind CSS vía CDN (plugins: forms, container-queries) |
| Tipografías | Google Fonts: Fira Code, Lexend, Space Grotesk |
| Iconos | Material Symbols Outlined (Google) |
| Tema | Dark mode por clase (`.dark`), paleta Material Design 3 |
| Persistencia | `localStorage` (solo configuración) |
| Backend | Ninguno — aplicación 100 % cliente |
| Bundler | Ninguno — archivos estáticos |
| Tests | Ninguno — validación manual en navegador |

### Paleta de colores (Material Design 3 — tema oscuro)

| Token | Valor | Uso |
|---|---|---|
| `primary-container` | `#2ecc71` | Acentos, toggles activos, prompt |
| `surface` | `#0e150f` | Fondo general |
| `surface-container-high` | `#242c25` | Sidebar, cards |
| `on-surface` | `#dce5da` | Texto principal |
| `on-surface-variant` | `#bbcbbb` | Texto secundario |

---

## Ejecución

No se requiere instalación ni servidor. Basta con abrir `index.html` directamente en cualquier navegador moderno:

```
# Desde el directorio del proyecto
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

O con un servidor local ligero para evitar restricciones CORS al cargar scripts:

```bash
# Python 3
python3 -m http.server 8080

# Node.js (npx)
npx serve .
```

Luego visitar `http://localhost:8080`.

**Requisitos del navegador:** soporte de ES6+ (Chrome 60+, Firefox 55+, Safari 12+, Edge 18+).

---

## Ejercicios — estructura de datos

Cada ejercicio es un objeto JavaScript dentro del array `listaEjercicios` en `ejercicios.js`.

```js
{
  id: 42,                         // Número único (entero positivo)
  esLeccion: true,                // Opcional. Excluye el ejercicio de la navegación normal
                                  // y lo hace accesible solo desde lessons.html

  premisa: `Texto descriptivo del ejercicio.
  Puede ser multilínea usando template literals.
  Usa \n\nParte 1 — Título:\n  1. Paso...
  para ejercicios con secciones.`,

  tematicas: [                    // Una o más temáticas (ver lista abajo)
    'Permisos',
    'Navegación y archivos básicos'
  ],

  estadoInicial: {
    fs: {
      dirs: [
        {
          path: '/home/user-ec2/midir',
          owner: 'user-ec2',
          group: 'user-ec2',
          perms: '755'            // Octal en string
        }
      ],
      files: [
        {
          path: '/home/user-ec2/midir/archivo.txt',
          owner: 'user-ec2',
          group: 'user-ec2',
          perms: '644',
          content: 'contenido del archivo\n'
        }
      ]
    },
    usuarios: [
      {
        username: 'otrousuario',
        grupos: ['otrousuario'],   // Grupos a los que pertenece
        shell: '/bin/bash',
        group: 'otrousuario'      // Grupo primario
      }
    ],
    grupos: [
      { name: 'migrupo' }
    ],
    usuarioActual: 'user-ec2',
    directorioActual: '/home/user-ec2'
  },

  condicionesExito: null,          // Reservado para validaciones automáticas futuras

  pasos: [
    {
      descripcion: 'Texto visible en la lista de pasos',
      comandoSugerido: 'chmod 755 midir'   // Comando que completa este paso
    }
  ],

  pistas: [
    'Pista genérica: explica el concepto.',
    'Pista intermedia: menciona el comando.',
    'Pista exacta: muestra el comando completo.'
  ],

  comandosUtiles: ['chmod', 'ls']   // Usados por el filtro restrictivo de settings
}
```

### Temáticas disponibles

| Temática | Comandos principales |
|---|---|
| `Navegación y archivos básicos` | `ls`, `cd`, `pwd`, `mkdir`, `rm`, `cp`, `mv`, `touch`, `ln` |
| `Permisos` | `chmod`, `chown`, `chgrp`, `umask` |
| `Administración de usuarios y grupos` | `useradd`, `userdel`, `usermod`, `groupadd`, `groupdel`, `passwd`, `su`, `sudo`, `who`, `w` |
| `Manipulación avanzada de archivos` | `find`, `grep`, `sed`, `awk`, `head`, `tail`, `wc`, `sort`, `uniq`, `cut`, `cat`, `echo` |
| `Compresión y archivos` | `tar`, `gzip`, `gunzip`, `zip`, `unzip` |
| `Información del sistema y procesos` | `ps`, `top`, `kill`, `df`, `du`, `free`, `uptime`, `uname`, `history`, `watch` |
| `Redes básicas` | `ping`, `ifconfig`, `netstat`, `curl`, `wget`, `ssh` |
| `Variables de entorno y redirección` | `export`, `env`, `tee`, `xargs` |
| `Servicios y automatización` | `systemctl`, `yum`, `crontab`, `watch` |

### Distribución actual de ejercicios

| Temática | Apariciones |
|---|---|
| Navegación y archivos básicos | 40 |
| Administración de usuarios y grupos | 28 |
| Permisos | 27 |
| Servicios y automatización | 24 |
| Manipulación avanzada de archivos | 12 |
| Compresión y archivos | 10 |
| Información del sistema y procesos | 6 |
| Variables de entorno y redirección | 4 |

> Los ejercicios mixtos aparecen contados en cada temática que incluyen.

---

## Añadir ejercicios

1. Abrir `ejercicios.js`.
2. Agregar un nuevo objeto al array `listaEjercicios` con `id` mayor al último existente (actualmente 100).
3. Seguir la estructura descrita en la sección anterior.
4. Si el ejercicio debe estar solo en `lessons.html`, añadir `esLeccion: true`.

**Pautas de estilo:**

- `premisa` de una línea para ejercicios simples; formato `\n\nParte N — Título:\n  N. Paso` para los compuestos.
- El campo `pasos` define el orden de validación: el validador avanza al siguiente paso cuando `comandoSugerido` concuerda con lo ejecutado.
- `pistas` debe tener entre 3 y 6 entradas, de menor a mayor especificidad.
- `comandosUtiles` debe incluir todos los comandos del campo `pasos`, sin duplicados.

---

## Sistema de comandos

### Cómo funciona el despacho

```
executeCommand(raw)
  → splitPipes(raw)        → segmentos separados por |
  → _execSegment(seg, ...) → por cada segmento:
      tokenize(seg)            → tokens respetando comillas
      parseRedirect(tokens)    → extrae > >>
      parseFlags(rest)         → separa -flags de args
      COMMANDS[cmd](ctx)       → llama al handler
```

### Contexto que recibe cada handler

```js
handler({
  cmd,       // nombre del comando ('chmod')
  args,      // argumentos sin flags (['755', 'archivo.txt'])
  flags,     // Set de caracteres de flag (Set {'R'})
  rest,      // tokens crudos sin el comando (['755', 'archivo.txt'])
  cwd,       // directorio actual absoluto
  u,         // objeto usuario actual { username, uid, gid, home, shell }
  home,      // home del usuario actual
  groups,    // array de nombres de grupo del usuario actual
  stdin,     // string de entrada por tubería (null si no hay)
  redirect,  // { op: '>' | '>>', file: 'ruta' } o null
  getNode,   // p => vfs._getNode(vfs.resolve(p, cwd, home))
})
```

### Añadir un nuevo comando

1. Crear la función handler en `src/terminal-commands.js`:

```js
function cmdMiComando({ args, flags, cwd, home, u, groups }) {
  if (!args.length) return { ok: false, lines: ['micomando: falta operando'] };
  // lógica...
  return { ok: true, lines: ['resultado'] };
}
```

2. Registrar en la tabla `COMMANDS`:

```js
const COMMANDS = {
  // ...comandos existentes...
  micomando: cmdMiComando,
};
```

3. Añadir a `KNOWN_COMMANDS` para que el corrector de tipografías lo reconozca:

```js
const KNOWN_COMMANDS = [
  // ...
  'micomando',
];
```

4. Opcionalmente, añadir documentación en `src/tool-commands.js`:

```js
{
  cmd: 'micomando',
  desc: 'Descripción breve',
  synopsis: 'micomando [opciones] <argumento>',
  options: [
    { flag: '-v', desc: 'Modo detallado' }
  ],
  examples: [
    { cmd: 'micomando archivo.txt', desc: 'Uso básico' }
  ]
}
```

---

## Sistema de configuración

`settings.js` exporta el singleton `AppSettings` que gestiona las preferencias del usuario en `localStorage`.

| Clave localStorage | Getter / Setter | Descripción |
|---|---|---|
| `tat_comandos` | `getComandos()` / `setComandos(obj)` | Estado booleano por comando |
| `tat_filtro_restrictivo` | `getFiltroRestrictivo()` / `setFiltroRestrictivo(bool)` | Modo de filtro |

### Métodos de consulta

```js
// Devuelve Set<string> de temáticas activas, o null si no hay preferencias guardadas
AppSettings.getActiveTematicas()

// Devuelve Set<string> de comandos seleccionados, o null si no hay preferencias
AppSettings.getSelectedComandos()

// Devuelve true si el filtro restrictivo está activado
AppSettings.getFiltroRestrictivo()
```

### Lógica de filtrado de ejercicios

```
getFiltroRestrictivo() === true
  → getFilteredExercises() incluye un ejercicio si:
      ejercicio.comandosUtiles es subconjunto de getSelectedComandos()

getFiltroRestrictivo() === false
  → getFilteredExercises() incluye un ejercicio si:
      ejercicio.tematicas tiene intersección con getActiveTematicas()
      O si getActiveTematicas() === null (sin preferencias → todos)
```

---

## Hoja de ruta

| Estado | Funcionalidad |
|---|---|
| ✅ | Simulador de terminal con 32+ comandos |
| ✅ | Sistema de archivos virtual con permisos Unix |
| ✅ | Gestión de usuarios y grupos virtual |
| ✅ | 100 ejercicios guiados en 9 temáticas |
| ✅ | Sistema de pistas de 3 niveles |
| ✅ | Deshacer / Rehacer con snapshots de estado |
| ✅ | Filtrado de ejercicios por temática y modo restrictivo |
| ✅ | Exportar log de terminal en formato `.md` |
| ✅ | Navegación de ejercicios (anterior, siguiente, aleatorio, por número) |
| ✅ | Lecciones interactivas (`esLeccion`) accesibles desde `lessons.html` |
| ⬜ | Conexión a IA para generación de ejercicios dinámicos |
| ⬜ | Sistema de progreso persistente por usuario |
| ⬜ | Modo evaluación (sin pistas) |
| ⬜ | Soporte de más comandos (zip, ssh, awk avanzado) |
| ⬜ | Tests automatizados del motor de comandos |
