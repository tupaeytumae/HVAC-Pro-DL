# HVAC Pro · D.L.

Aplicación web progresiva para apoyo al diagnóstico HVAC mediante tablas presión-temperatura generadas con CoolProp.

## Archivos incluidos

- `index.html`: interfaz y presentación de resultados.
- `engine/`: cálculos, evidencias y coordinación del diagnóstico.
- `diagnostics/`: un módulo independiente por patrón diagnóstico.
- `profiles/`: parámetros según el dispositivo de expansión.
- `test/`: pruebas del motor, perfiles y selección de resultados.
- `generate_pt.py`: generador de tablas P‑T.
- `pt_data.js`: archivo inicial vacío; GitHub Actions lo sustituye por las tablas reales.
- `requirements.txt`: versión de CoolProp.
- `manifest.webmanifest`: instalación como PWA.
- `sw.js`: funcionamiento offline.
- `icon-192.png` y `icon-512.png`: iconos.
- `.github/workflows/generar-tablas.yml`: automatización.
- `.nojekyll`: publicación directa en GitHub Pages.

## Refrigerantes

- R407C
- R410A
- R32
- R134a
- R22
- R290

## Perfiles de expansión

- `unknown`: evaluación conjunta y conservadora de SH y SC.
- `capillary`: mayor sensibilidad al recalentamiento.
- `txv`: mayor importancia del subenfriamiento y del control de recalentamiento.
- `eev`: control de recalentamiento más estrecho y comprobación de subenfriamiento.

Los rangos del perfil son orientativos. La carga final debe comprobarse con
el método y los valores objetivo indicados por el fabricante del equipo.

## Alcance del diagnóstico

La aplicación trabaja exclusivamente en refrigeración. Las compatibilidades
se expresan como indicios cualitativos y no como probabilidades estadísticas.
Un resultado estable exige que todas las evidencias disponibles sean normales.

## Instalación en GitHub

1. Sube **el contenido de esta carpeta**, no la carpeta contenedora.
2. Conserva exactamente la carpeta `.github/workflows`.
3. Abre la pestaña **Actions**.
4. Selecciona **Generar tablas CoolProp**.
5. Pulsa **Run workflow**.
6. Espera a que finalice correctamente.
7. Comprueba que `pt_data.js` haya aumentado considerablemente de tamaño.

## Activar GitHub Pages

1. Ve a **Settings → Pages**.
2. En **Build and deployment**, selecciona **Deploy from a branch**.
3. Elige la rama `main`.
4. Elige la carpeta `/ (root)`.
5. Guarda.

La dirección tendrá normalmente este formato:

`https://USUARIO.github.io/NOMBRE-REPOSITORIO/`

## Uso técnico

Las presiones se introducen en `bar(g)`. Para mezclas zeotrópicas:

- evaporación: temperatura **dew**, `Q=1`;
- condensación: temperatura **bubble**, `Q=0`.

La aplicación es una ayuda orientativa. Deben comprobarse además el caudal de aire, la carga por peso, la estanqueidad, la intensidad, la tensión, la temperatura de descarga y los datos del fabricante.
