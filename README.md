# LendUp Landing Page

Landing page estática, responsive y bilingüe para **LendUp**, una plataforma de préstamo temporal de objetos entre estudiantes universitarios.

> **Presta lo que no usas. Consigue lo que necesitas.**

Está construida exclusivamente con HTML5, CSS3 y JavaScript vanilla. No necesita compilación, framework ni dependencias instaladas.

## Qué incluye

- Header sticky con navegación activa, menú móvil accesible, selector ES/EN y CTA hacia el catálogo.
- Hero de tres slides con controles, indicadores, autoplay pausado por interacción, gestos táctiles y soporte para movimiento reducido.
- Slider de beneficios interactivo en escritorio y cards apiladas en tablet/móvil.
- Secciones informativas para prestatarios y prestamistas, sin CTA redundantes.
- Catálogo demostrativo con los assets oficiales de LendUp.
- Flujo “Cómo funciona” con selector de rol y espacio configurable para un video de producto.
- Seguridad, flujo económico con proveedor externo y modelo de comisión por operación.
- Misión, visión y equipo real con avatar de iniciales como respaldo.
- FAQ accesible, CTA final y footer con redes configurables.
- Páginas de términos, privacidad y error 404.
- SEO base, Open Graph, Twitter Cards, `robots.txt` y `sitemap.xml`.

## Estructura

```text
/
├── index.html
├── terms.html
├── privacy.html
├── 404.html
├── favicon.ico
├── robots.txt
├── sitemap.xml
├── README.md
├── css/
│   └── styles.css
├── js/
│   ├── config.js
│   ├── translations.js
│   └── main.js
└── assets/
    ├── brand/
    │   ├── icon-32.png
    │   ├── icon-64.png
    │   ├── logo-mark-on-dark.webp
    │   ├── logo-mark-on-light.webp
    │   └── logo-stacked-on-light.webp
    ├── images/
    │   ├── books.webp
    │   ├── calculator.webp
    │   ├── camera.webp
    │   ├── tablet.webp
    │   └── tools.webp
    └── team/
```

## Ejecutar localmente

La landing puede abrirse directamente desde `index.html`. Para probar navegación, rutas y comportamiento de forma equivalente a producción, usa un servidor estático.

Con Python:

```bash
python -m http.server 8080
```

Luego abre `http://localhost:8080`.

Con Node.js:

```bash
npx serve .
```

No existe un paso de build.

## Configurar URLs del producto

Todas las rutas externas se centralizan en [`js/config.js`](js/config.js):

```js
APP_URL: "https://app.lendup.pe",
EXPLORE_URL: "https://app.lendup.pe/explore",
PUBLISH_URL: "https://app.lendup.pe/objects/new",
SITE_URL: "https://TU-DOMINIO.com"
```

- `APP_URL`: dominio base de la aplicación.
- `EXPLORE_URL`: catálogo de objetos; alimenta los CTA “Buscar objetos”.
- `PUBLISH_URL`: creación de publicaciones; alimenta el enlace “Publica un objeto”.
- `SITE_URL`: dominio definitivo de esta landing.

El HTML usa `data-app-link`, `data-explore-link` y `data-publish-link`; `main.js` aplica las URLs sin duplicarlas por la página.

## Configurar el video de producto

En [`js/config.js`](js/config.js), asigna a `ABOUT_PRODUCT_YOUTUBE_ID` únicamente el ID del video, no la URL completa:

```js
ABOUT_PRODUCT_YOUTUBE_ID: "dQw4w9WgXcQ"
```

Mientras el valor esté vacío se muestra un placeholder accesible y visualmente integrado. Cuando existe un ID válido, se renderiza el iframe con carga diferida y dominio `youtube-nocookie.com`.

## Configurar redes sociales

Edita `SOCIAL_LINKS` en [`js/config.js`](js/config.js):

```js
SOCIAL_LINKS: {
  github: "https://github.com/organizacion/repositorio",
  youtube: "",
  instagram: "",
  linkedin: ""
}
```

Solo se muestran las redes con una URL válida. Dejar un valor vacío oculta ese icono; no se crean perfiles ficticios.

## Dominio, canonical y SEO

Antes de publicar, reemplaza `https://TU-DOMINIO.com` en:

- `index.html`
- `terms.html`
- `privacy.html`
- `robots.txt`
- `sitemap.xml`
- `SITE_URL` en `js/config.js`

Cuando exista una pieza social oficial, también puede añadirse como `og:image` y `twitter:image`; actualmente no se inventa una imagen de campaña.

## Modificar traducciones

Los textos de interfaz están en [`js/translations.js`](js/translations.js), dentro de los objetos `es` y `en`.

Para agregar o cambiar contenido:

1. Crea o edita la misma clave en ambos idiomas.
2. Usa `data-i18n="ruta.de.la.clave"` para texto normal.
3. Usa `data-i18n-aria` para etiquetas accesibles.
4. Reserva `data-i18n-html` para contenido controlado que necesita marcado.

El idioma inicial es español, el selector cambia el contenido sin recargar, se guarda en `localStorage` y actualiza `<html lang>`.

## Modificar el equipo

Los seis integrantes se administran en `window.LENDUP_TEAM` dentro de [`js/config.js`](js/config.js):

```js
{ name: "Apellidos, Nombres", initials: "AN", image: "assets/team/foto.webp" }
```

Si `image` queda vacío, la interfaz muestra un avatar con iniciales. Guarda fotografías optimizadas y autorizadas en `assets/team/`.

## Reemplazar imágenes

Los assets actuales proceden del frontend oficial de LendUp y están optimizados en WebP. Para reemplazarlos:

- Mantén el mismo nombre y ruta; o
- Actualiza el `src` correspondiente en `index.html`.

Usa WebP o AVIF cuando sea posible, comprime los archivos y conserva las dimensiones declaradas para evitar saltos de layout.

## Desplegar en GitHub Pages

1. Sube el repositorio a GitHub.
2. Abre **Settings → Pages**.
3. En **Build and deployment**, elige **Deploy from a branch**.
4. Selecciona la rama principal y la carpeta raíz `/`.
5. Guarda y espera la URL de publicación.
6. Actualiza canonical, `robots.txt`, `sitemap.xml` y `SITE_URL` con esa URL.

Las rutas de assets son relativas, por lo que la landing también funciona en un subdirectorio de GitHub Pages.

## Desplegar en Vercel

1. Importa el repositorio en Vercel.
2. Selecciona **Other** como framework.
3. Deja vacío el comando de build.
4. Usa `.` como directorio de salida si la interfaz lo solicita.
5. Publica y sustituye `https://TU-DOMINIO.com` por el dominio final.

## Accesibilidad y rendimiento

- Landmarks semánticos, un solo `h1`, skip link y foco visible.
- Menú móvil con `aria-expanded`, `aria-controls`, cierre con Escape y cierre al navegar.
- Carruseles controlables, indicadores accesibles, pausa por foco/hover y gestos táctiles.
- Selector de roles navegable por teclado y FAQ con botones reales.
- Respeto de `prefers-reduced-motion`, que desactiva autoplay y transiciones no esenciales.
- Imágenes fuera del hero con `loading="lazy"`, dimensiones declaradas y JavaScript diferido.
- CSS y JavaScript sin frameworks ni librerías pesadas.

Los iconos se sirven con Lucide mediante CDN. Para un despliegue totalmente offline, descarga Lucide, sírvelo como asset local y sustituye el `script src` en las páginas.

## Referencias de diseño

- La arquitectura de navegación, las ideas de interacción, el comportamiento responsive y la organización de secciones toman inspiración de [LandingPageAuraNeuro](https://github.com/UPC-1ASI0730-2520-7468-Mithycore/LandingPageAuraNeuro).
- La identidad visual, los tokens, el tratamiento del catálogo, la marca y los assets proceden del [frontend oficial de LendUp](https://github.com/UPC-1ASI0657-202620-9222-LendUp/lendup-frontend-web).

No se copiaron la estética verde/negra, los textos, los planes ni los testimonios de la referencia estructural.

## Pendientes antes del lanzamiento

- Confirmar las URLs definitivas de aplicación, catálogo y publicación en `js/config.js`.
- Reemplazar `https://TU-DOMINIO.com` por el dominio de la landing.
- Asignar el ID oficial de YouTube cuando exista el video de producto.
- Añadir únicamente perfiles sociales oficiales verificados.
- Incorporar fotografías del equipo solo con autorización.
- Someter `terms.html` y `privacy.html` a revisión legal y completar entidad responsable, contacto, jurisdicción, fechas, proveedores y plazos.
- Definir la comisión cuando el producto la haya establecido, sin anticipar porcentajes ni quién la asume.
