# Cocina de la Abuela Chana — Menú digital

Menú digital estático, adaptable a celulares y listo para publicarse en GitHub Pages.

## Administración del menú

- Abre `admin.html` desde el sitio para crear, editar, ocultar y eliminar productos.
- El administrador guarda un borrador en el navegador.
- Al terminar, descarga `products.json` y reemplázalo en el repositorio.
- Los productos publicados se encuentran en `products.json`.
- El número de WhatsApp se configura en `WHATSAPP_NUMBER` usando código de país.
- Los colores principales están al inicio de `styles.css`.
- La dirección, horarios y teléfono visibles se encuentran en `index.html`.

La administración no necesita servidor y no contiene credenciales de GitHub.

## Publicar en GitHub Pages

1. Crear un repositorio nuevo en GitHub.
2. Subir `index.html`, `styles.css`, `app.js` y este archivo.
3. Abrir **Settings → Pages**.
4. En **Build and deployment**, elegir **Deploy from a branch**.
5. Seleccionar la rama `main` y la carpeta `/ (root)`.

El sitio no requiere instalación, compilación ni servidor.
