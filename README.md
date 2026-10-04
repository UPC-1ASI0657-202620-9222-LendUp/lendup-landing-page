# LendUp Landing Page

Landing page estática, responsive y bilingüe para **LendUp**, una plataforma de préstamo temporal de objetos entre estudiantes universitarios.

> **Presta lo que no usas. Consigue lo que necesitas.**

La implementación usa únicamente HTML5, CSS3 y JavaScript vanilla. No requiere compilación, framework ni dependencias instaladas.

## Contenido

- Hero de producto con una muestra visual del catálogo.
- Beneficios y explicación para prestatarios y prestamistas.
- Flujo interactivo “Cómo funciona” para ambos roles.
- Catálogo demostrativo con assets oficiales de LendUp.
- Seguridad, pagos mediante proveedor externo y modelo por comisión.
- Misión, visión y grid de seis integrantes con avatar de respaldo.
- FAQ accesible mediante acordeones.
- CTA final y footer completo.
- Selector ES/EN persistido en `localStorage`.
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

La página puede abrirse directamente desde `index.html`. Para probarla en condiciones similares a producción, se recomienda un servidor estático:

### Python

```bash
python -m http.server 8080
```

Abrir `http://localhost:8080`.

### Node.js

```bash
npx serve .
```

No hay paso de build.

## Configuración del frontend

Todas las URLs del producto se encuentran en [`js/config.js`](js/config.js):

```js
APP_URL: "https://app.lendup.pe",
LOGIN_URL: "https://app.lendup.pe/login",
REGISTER_URL: "https://app.lendup.pe/register"
```

Reemplaza esos valores por el dominio definitivo del frontend. Los CTA usan atributos `data-app-link`, `data-login-link` y `data-register-link`; `main.js` les asigna las URLs centralizadas.

## Dominio, canonical y SEO

Antes de publicar, reemplaza `https://TU-DOMINIO.com` en:

- `index.html`
- `terms.html`
- `privacy.html`
- `robots.txt`
- `sitemap.xml`
- `SITE_URL` en `js/config.js`

No se incluye una imagen Open Graph inventada. Puede añadirse cuando exista un arte social oficial.

## Traducciones

Los textos de interfaz están en [`js/translations.js`](js/translations.js), separados en los objetos `es` y `en`.

Para agregar un texto traducible:

1. Añade la misma clave en ambos idiomas.
2. Usa `data-i18n="ruta.de.la.clave"` en el HTML.
3. Para atributos accesibles usa `data-i18n-aria`.
4. `data-i18n-html` se reserva para texto controlado que necesita marcado, como el título del hero.

Las páginas legales contienen bloques completos en español e inglés mediante `data-legal-lang`.

## Editar el equipo

El equipo se administra en `window.LENDUP_TEAM` dentro de [`js/config.js`](js/config.js):

```js
{ name: "Nombre Apellido", initials: "NA", image: "assets/team/nombre.webp" }
```

Si `image` está vacío, se muestra automáticamente un avatar con iniciales. Guarda las fotos optimizadas en `assets/team/` y evita publicar información personal no autorizada.

## Reemplazar imágenes

Los assets actuales provienen del frontend oficial de LendUp. Los PNG de cámara, tablet y herramientas se convirtieron a WebP optimizado para reducir el peso de la página. Para reemplazarlos:

- Conserva los nombres y rutas actuales para no modificar el HTML; o
- Actualiza el atributo `src` correspondiente en `index.html`.

Usa WebP o AVIF cuando sea posible, conserva una relación de aspecto coherente y comprime las imágenes antes de publicar.

## Publicar en GitHub Pages

1. Sube el repositorio a GitHub.
2. Abre **Settings → Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**.
4. Elige la rama principal y la carpeta raíz `/`.
5. Guarda y espera la URL de publicación.
6. Actualiza los canonical, `robots.txt` y `sitemap.xml` con esa URL.

Las rutas son relativas, por lo que el sitio funciona también en un subdirectorio de GitHub Pages.

## Publicar en Vercel

1. Importa el repositorio desde el dashboard de Vercel.
2. Selecciona **Other** como framework.
3. Deja vacío el comando de build.
4. Usa `.` como directorio de salida si la interfaz lo solicita.
5. Publica y reemplaza `https://TU-DOMINIO.com` por el dominio final.

## Accesibilidad y rendimiento

- Un único `h1` por página.
- Landmarks semánticos, skip link y foco visible.
- Menú móvil con `aria-expanded`, `aria-controls`, cierre con Escape y cierre al navegar.
- Tabs con roles ARIA y soporte para flechas, Home y End.
- FAQ con botones reales y paneles asociados.
- Respeto de `prefers-reduced-motion`.
- Imágenes fuera del hero con `loading="lazy"`.
- CSS y JavaScript sin frameworks ni librerías pesadas.

Los iconos se cargan con Lucide mediante CDN. Si el despliegue requiere funcionamiento totalmente offline, descarga la distribución de Lucide, sírvela localmente y cambia el `script src` en las páginas.

## Referencias de diseño

- La organización general toma inspiración estructural de [LandingPageAuraNeuro](https://github.com/UPC-1ASI0730-2520-7468-Mithycore/LandingPageAuraNeuro): navegación, secciones, selector de idioma, “Cómo funciona”, CTA, footer, páginas legales y menú móvil.
- La identidad visual, los tokens, el tratamiento de catálogo, la marca y los assets proceden del [frontend oficial de LendUp](https://github.com/UPC-1ASI0657-202620-9222-LendUp/lendup-frontend-web).

No se copiaron la estética verde/negra, los textos, los planes ni los testimonios de la referencia estructural.

## Pendientes antes del lanzamiento

- Confirmar el dominio real del frontend y actualizar `js/config.js`.
- Reemplazar `https://TU-DOMINIO.com` por el dominio de la landing.
- Cargar nombres y fotografías autorizadas del equipo.
- Someter `terms.html` y `privacy.html` a revisión legal y completar entidad responsable, contacto, jurisdicción, fechas, proveedores y plazos.
- Definir y comunicar la comisión cuando el producto la haya establecido, sin anticipar porcentajes ni quién la absorbe.
