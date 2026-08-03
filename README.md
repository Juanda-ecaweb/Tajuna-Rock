# XVIII Tajuña Rock 2026 - Web publica

Sitio web estatico para GitHub Pages del festival **XVIII Tajuña Rock 2026**.

## Tecnologias

- HTML5
- CSS3
- JavaScript nativo
- Sin frameworks
- Sin base de datos

## Estructura

```
web/
â”œâ”€â”€ index.html
â”œâ”€â”€ festival.html
â”œâ”€â”€ bandas.html
â”œâ”€â”€ publico.html
â”œâ”€â”€ prensa.html
â”œâ”€â”€ acreditaciones.html
â”œâ”€â”€ grupos.html
â”œâ”€â”€ comerciantes.html
â”œâ”€â”€ patrocinadores.html
â”œâ”€â”€ contacto.html
â”œâ”€â”€ css/
â”‚   â””â”€â”€ estilos.css
â”œâ”€â”€ js/
â”‚   â”œâ”€â”€ principal.js
â”‚   â””â”€â”€ datos.js
â”œâ”€â”€ imagenes/
â”‚   â”œâ”€â”€ cartel/
â”‚   â”œâ”€â”€ bandas/
â”‚   â”œâ”€â”€ logos/
â”‚   â””â”€â”€ patrocinadores/
â”œâ”€â”€ documentos/
â”‚   â”œâ”€â”€ publico/
â”‚   â”œâ”€â”€ prensa/
â”‚   â”œâ”€â”€ grupos/
â”‚   â””â”€â”€ comerciantes/
â”œâ”€â”€ README.md
â””â”€â”€ .nojekyll
```

## Como abrir localmente

1. Abre la carpeta `web` en VS Code.
2. Haz doble clic en `index.html` o abre ese archivo con cualquier navegador.
3. Navega entre paginas usando el menu.

No requiere instalacion ni compilacion.

## Como actualizar contenido rapidamente

La información editable esta centralizada en `js/datos.js`.

1. Edita nombre, fecha, lugar o entrada en `FESTIVAL_DATA`.
2. Edita `bandas` para anadir:
   - `imagen`: ruta relativa (por ejemplo `imagenes/bandas/ktulu.jpg`)
   - `descripcion`: solo texto confirmado
   - `enlaceOficial`: solo enlace confirmado
3. Cartel oficial de portada:
   - Copia el cartel en `imagenes/cartel/cartel-oficial-2026.png`
   - O cambia la ruta en `FESTIVAL_DATA.media.cartelOficial.ruta` dentro de `js/datos.js`
4. Edita `documentos.publico`, `documentos.prensa`, `documentos.grupos`, `documentos.comerciantes`:
   - `titulo`: texto visible
   - `ruta`: ruta relativa real al archivo
5. Copia imagenes y PDFs en sus carpetas correspondientes.
6. Recarga el navegador.

## Como publicar en GitHub Pages

1. Sube el contenido al repositorio GitHub.
2. En GitHub, entra en `Settings` del repositorio.
3. Abre `Pages`.
4. En `Build and deployment`, selecciona:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main` (o la rama que uses)
   - Carpeta: `/ (root)` si esta carpeta es la raiz del repo.
5. Guarda y espera la publicacion.
6. GitHub mostrara la URL publica de Pages.

Si el proyecto esta dentro de una subcarpeta en el repositorio, mueve estos archivos a la raiz publicada o ajusta la configuracion para publicar esa carpeta.

## Privacidad y limites en esta version

- Sin cookies de seguimiento.
- Sin Google Analytics ni Meta Pixel.
- Sin datos personales.
- Sin enlaces ni datos no confirmados.
- Los datos faltantes aparecen como `PENDIENTE`.

