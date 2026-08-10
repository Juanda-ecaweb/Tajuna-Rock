# Configuración del formulario de acreditaciones — Tajuña Rock 2026

Esta guía explica paso a paso cómo conectar el formulario de acreditación de prensa de la web con Google Sheets mediante Google Apps Script.

---

## 1. Crear la hoja de Google Sheets

1. Ve a [sheets.google.com](https://sheets.google.com) e inicia sesión con la cuenta de Google del festival.
2. Crea una hoja nueva.
3. Ponle el nombre que quieras (por ejemplo: `Acreditaciones Tajuña Rock 2026`).
4. El script creará automáticamente la pestaña `Solicitudes` con sus cabeceras la primera vez que llegue una solicitud.

---

## 2. Obtener el ID de la hoja

La URL de tu hoja tiene este aspecto:

```
https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/edit
```

El ID es la cadena larga entre `/d/` y `/edit`. Cópiala.

---

## 3. Abrir Google Apps Script

1. Dentro de la hoja de Google Sheets, ve al menú **Extensiones → Apps Script**.
2. Se abrirá el editor de Apps Script en una nueva pestaña.
3. Borra el contenido por defecto del archivo `Code.gs`.

---

## 4. Pegar el código

1. Abre el archivo `Code.gs` de esta carpeta.
2. Copia todo su contenido.
3. Pégalo en el editor de Apps Script.

---

## 5. Configurar SPREADSHEET_ID

En las primeras líneas de `Code.gs` encontrarás:

```javascript
const SPREADSHEET_ID = "PEGA_AQUI_EL_ID_DE_GOOGLE_SHEETS";
```

Sustituye `PEGA_AQUI_EL_ID_DE_GOOGLE_SHEETS` por el ID que copiaste en el paso 2.

---

## 6. Configurar ORGANIZATION_EMAIL

En las primeras líneas de `Code.gs` encontrarás:

```javascript
const ORGANIZATION_EMAIL = "PEGA_AQUI_EL_CORREO_DE_PRENSA";
```

Sustituye `PEGA_AQUI_EL_CORREO_DE_PRENSA` por la dirección de correo donde quieres recibir los avisos de nuevas solicitudes (por ejemplo: `tajunarock@gmail.com`).

---

## 7. Desplegar como aplicación web

1. En el editor de Apps Script, haz clic en **Implementar → Nueva implementación**.
2. Haz clic en el icono de engranaje junto a "Tipo" y selecciona **Aplicación web**.
3. Configura lo siguiente:
   - **Descripción:** `Formulario acreditaciones prensa`
   - **Ejecutar como:** `Yo (tu cuenta de Google)`
   - **Quién tiene acceso:** `Cualquier usuario` *(necesario para que la web pública pueda enviar solicitudes)*
4. Haz clic en **Implementar**.
5. Google pedirá que autorices los permisos. Acepta todos.

---

## 8. Copiar la URL del despliegue

Tras desplegar, Apps Script mostrará una URL con este aspecto:

```
https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec
```

Copia esa URL completa.

---

## 9. Pegar la URL en el JavaScript de la web

Abre el archivo `js/principal.js` del proyecto.

Busca esta línea (está cerca del principio de la función `setupAcreditacionForm`):

```javascript
const GOOGLE_APPS_SCRIPT_URL = "PEGA_AQUI_LA_URL_DEL_SCRIPT";
```

Sustituye `PEGA_AQUI_LA_URL_DEL_SCRIPT` por la URL que copiaste.

Guarda el archivo y súbelo a GitHub para que el cambio se publique en la web.

---

## 10. Probar el formulario

1. Abre la página de prensa en el navegador.
2. Rellena el formulario con datos de prueba.
3. Haz clic en "Enviar solicitud de acreditación".
4. Comprueba:
   - Que aparece el mensaje de confirmación en la página.
   - Que llega un correo de aviso a `ORGANIZATION_EMAIL`.
   - Que llega un correo de confirmación al correo introducido en el formulario.
   - Que aparece una nueva fila en la pestaña `Solicitudes` de Google Sheets.

---

## 11. Revisar los registros si algo falla

1. En el editor de Apps Script, ve a **Ver → Registros de ejecución** (o pulsa Ctrl+Enter en la función).
2. Podrás ver los errores registrados con `Logger.log`.
3. Los errores de correo no impiden que la solicitud se guarde en la hoja.

---

## 12. Volver a desplegar tras modificar Code.gs

Cada vez que modifiques `Code.gs` debes publicar una nueva versión para que los cambios sean efectivos:

1. Ve a **Implementar → Gestionar implementaciones**.
2. Haz clic en el lápiz (editar) de la implementación activa.
3. En "Versión", selecciona **Nueva versión**.
4. Haz clic en **Implementar**.

La URL del despliegue no cambia entre versiones, por lo que no necesitas actualizar la web.

---

## Notas sobre CORS

El formulario envía los datos con `fetch` usando `mode: "no-cors"`. Esto significa:

- La petición llega correctamente a Apps Script.
- La respuesta del servidor es **opaca**: el navegador la recibe pero el JavaScript no puede leer su contenido.
- Desde la web solo podemos confirmar que la petición fue enviada, no si Apps Script la procesó con éxito.
- Si necesitas leer la respuesta, deberías usar un proxy o una función serverless propia.

Para la mayoría de los casos este comportamiento es suficiente.
