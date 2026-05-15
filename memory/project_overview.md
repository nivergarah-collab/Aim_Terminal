---
name: project-overview
description: LINUX_LAB — simulador de terminal Linux educativo en browser, arquitectura, stack y estructura del proyecto
metadata:
  type: project
---

**Qué es:** LINUX_LAB (nombre de archivo: aim_terminal) es una app web 100% cliente (sin backend) que simula una terminal Linux interactiva. El usuario resuelve ejercicios guiados escribiendo comandos reales en un entorno virtual.

**Why:** Herramienta educativa para aprender administración de sistemas Linux.

**Estado actual:** 100 ejercicios, 9 temáticas, 32+ comandos simulados, 3 ejercicios de lección (`esLeccion: true`).

## Stack
- JS ES6+ sin transpilador ni bundler (scripts en scope global, orden de carga importa)
- Tailwind CSS vía CDN
- `localStorage` para persistencia de configuración
- Sin tests automatizados

## Archivos clave
- `index.html` — página principal (simulador)
- `ejercicios.js` — array `listaEjercicios` (importa de `data/ejercicios-*.js`)
- `src/vfs.js` — VirtualFS (sistema de archivos virtual con permisos Unix)
- `src/users.js` — VirtualUsers (usuarios y grupos)
- `src/terminal-parser.js` — tokenize, parseFlags, splitPipes, expandVars
- `src/terminal-commands.js` — COMMANDS + handlers (tabla de despacho)
- `src/terminal.js` — estado global (`vfs`, `vusers`, `termState`, `envVars`), `executeCommand`
- `src/step-validator.js` — `_stepSatisfied`, `checkStepProgress`
- `src/exercise-nav.js` — `getFilteredExercises`, `navigateToExercise`
- `src/ui.js` — punto de entrada DOM, wiring de index.html
- `src/nano.js` — overlay de editor nano
- `settings.js` — singleton `AppSettings` (localStorage)
- `errores.md` — log de bugs conocidos (revisión manual 10/05)

## Flujo de un comando
Enter → `executeCommand` → `splitPipes` → por segmento: `tokenize` → `parseRedirect` → `parseFlags` → `COMMANDS[cmd]` → modifica `vfs`/`vusers` → `renderOutputLines` → `snapshotState` (undo) → `checkStepProgress` → `updateUI`

**How to apply:** Al modificar comandos, buscar el handler en `terminal-commands.js`. Al modificar validación de pasos, editar `step-validator.js`. Al añadir ejercicios, editar los archivos en `data/` y asegurarse de que `ejercicios.js` los importa.
