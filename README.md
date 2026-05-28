# Página Especial de Día Especial (Con Teclado, Carta y Video)

Esta es una plantilla de página web interactiva con temática romántica en acuarela. Está estructurada en 4 etapas:
1. **Cargador Floral (Preloader)**: Un círculo animado de 8 tulipanes y un corazón latiendo.
2. **Teclado de Bloqueo**: Para digitar la clave secreta **`0328`** (28 de marzo).
3. **Carta Intermedia (Tap to open)**: Un sobre de carta cerrado. Al hacer clic, hace un "pop" físico y brotan flores secuencialmente hasta llenar la pantalla (animación fluida de 5 fotogramas).
4. **Apartado Desbloqueado Dividido**:
   - **Lado izquierdo**: Un reproductor de video especial.
   - **Lado derecho**: Tarjeta romántica dedicada a *"Mi persona favorita"*.

---

## Cómo Personalizar los Elementos

### 1. Cambiar los Fondos de Pantalla
Los fondos se encuentran en la carpeta `assets/`:
- **Teclado**: Reemplaza el archivo `assets/background.png` con la imagen que quieras de fondo para el teclado.
- **Sección final**: Reemplaza el archivo `assets/final_background.png` con la imagen de fondo para el video y el texto.

### 2. Cambiar la Contraseña
La contraseña por defecto es **`0328`**. Para cambiarla:
1. Abre `script.js`.
2. Busca la línea:
   ```javascript
   const CORRECT_CODE = "0328";
   ```
3. Cambia `"0328"` por la combinación de 4 números que desees.

### 3. Colocar un Video Real (Soporte local MP4 o YouTube)

La página está configurada de manera inteligente para detectar automáticamente cómo deseas reproducir tu video al subirlo a internet:

*   **Opción A (Recomendada: Subir tu propio archivo MP4 a GitHub)**:
    1. Graba o prepara tu video especial en formato `.mp4`.
    2. Guárdalo dentro de la carpeta `assets/` con el nombre exacto `video.mp4` (quedando como `assets/video.mp4`).
    3. Sube el archivo a tu repositorio de GitHub junto con el resto del código.
    4. **¡Listo!** Cuando la página se abra online en GitHub Pages, detectará automáticamente el archivo, ocultará YouTube y reproducirá tu propio video local de forma nativa e ilimitada.
*   **Opción B (Usar un video de YouTube)**:
    1. Si no subes ningún archivo `video.mp4` a la carpeta `assets/`, la página usará por defecto el reproductor de YouTube.
    2. Para cambiar el video de YouTube por defecto, abre `index.html`, busca el elemento `<iframe>` con el ID `youtube-iframe` (cerca de la línea 205) y cambia el código en el atributo `src` (`https://www.youtube.com/embed/CÓDIGO_DE_TU_VIDEO`).

### 4. Personalizar el Texto y Nombres de la Carta final
Abre `index.html` y ve a la sección `<!-- Tarjeta de Texto Romántico al final -->` (cerca de la línea 240). Puedes cambiar:
- Los nombres en el sello de cera modificando los textos `From: Zoey` y `For: Jim`.
- La frase romántica modificando el elemento `.footer-quote`.
- La firma modificando `.romantic-signature`.

Abre `index.html` y ve a la sección `<!-- Columna 2: Texto de Mi Persona Favorita -->` (cerca de la línea 153). Puedes editar el título, la frase en cursiva (`.romantic-quote`) o la descripción para dedicar el texto con tus propias palabras.

---

## Cómo Publicar en GitHub Pages

Para subir esta página a internet de forma gratuita y que cualquiera la pueda ver online:

### Paso 1: Crear un repositorio en GitHub
1. Inicia sesión en [GitHub](https://github.com).
2. Haz clic en **New** (Nuevo repositorio).
3. Nombra tu repositorio (ejemplo: `nuestro-dia-especial`).
4. Configúralo como **Public** (Público).
5. No agregues archivos de inicialización (como README o .gitignore).
6. Haz clic en **Create repository** (Crear repositorio).

### Paso 2: Subir el código desde tu computadora
Abre la terminal en la carpeta del proyecto (`C:\Users\Piero\.gemini\antigravity\scratch\landing-page`) y ejecuta:

```bash
# Inicializar repositorio local
git init

# Agregar todos los archivos
git add .

# Crear el primer commit
git commit -m "Initial commit: Carta interactiva con video"

# Asegurar la rama principal main
git branch -M main

# Enlazar con tu repositorio de GitHub (reemplaza con tu enlace real)
git remote add origin https://github.com/TU-USUARIO/MI-REPOSITORIO.git

# Subir los archivos a la nube
git push -u origin main
```

### Paso 3: Activar GitHub Pages
1. Abre tu repositorio en la página de GitHub.
2. Ve a la pestaña **Settings** (Configuración) en la parte superior.
3. Haz clic en **Pages** en la barra lateral izquierda.
4. En **Build and deployment**, bajo **Source**, elige **Deploy from a branch**.
5. Bajo **Branch**, selecciona **main** y **/ (root)**.
6. Presiona **Save** (Guardar).
7. Espera 1 a 2 minutos. GitHub te proporcionará un enlace como: `https://tu-usuario.github.io/nuestro-dia-especial/`.
