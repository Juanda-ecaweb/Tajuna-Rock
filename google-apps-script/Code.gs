// =============================================================
// Tajuña Rock 2026 — Formulario de acreditación de prensa
// Google Apps Script — doPost handler
// =============================================================
// CONFIGURACIÓN MANUAL (rellenar antes de desplegar):

const SPREADSHEET_ID     = "PEGA_AQUI_EL_ID_DE_GOOGLE_SHEETS";
const SHEET_NAME         = "Solicitudes";
const ORGANIZATION_EMAIL = "PEGA_AQUI_EL_CORREO_DE_PRENSA";

// =============================================================

const CABECERAS = [
  "fecha_solicitud",
  "codigo_solicitud",
  "estado",
  "medio",
  "web_medio",
  "nombre",
  "email",
  "telefono",
  "tipo_acreditacion",
  "cobertura",
  "solicita_entrevista",
  "entrevista_bandas",
  "entrevista_observaciones",
  "acepta_normas",
  "acepta_privacidad",
  "fecha_respuesta",
  "decision",
  "motivo_decision",
  "tipo_credencial",
  "codigo_credencial",
  "email_confirmacion_enviado"
];

// Campos obligatorios que deben llegar en el POST
const CAMPOS_OBLIGATORIOS = [
  "medio", "nombre", "email", "telefono", "tipo_acreditacion", "cobertura",
  "acepta_normas", "acepta_privacidad"
];

// ─────────────────────────────────────────────────────────────
// Punto de entrada principal
// ─────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const paramsMulti = e && e.parameters ? e.parameters : {};

    function valorUnico(campo) {
      return (params[campo] || "").trim();
    }

    function valoresMultiples(campo) {
      const valores = paramsMulti[campo];
      if (!Array.isArray(valores)) {
        return [];
      }
      return valores
        .map((valor) => limpiar(valor))
        .filter(Boolean);
    }

    // 1. Honeypot: rechazar silenciosamente si el campo website tiene texto
    if (valorUnico("website") !== "") {
      return respuestaOk("ok");
    }

    // 2. Validar campos obligatorios
    for (const campo of CAMPOS_OBLIGATORIOS) {
      const valor = valorUnico(campo);
      if (!valor || valor === "false") {
        return respuestaError("Faltan campos obligatorios: " + campo);
      }
    }

    // 3. Validar formato de correo
    if (!validarEmail(valorUnico("email"))) {
      return respuestaError("Formato de correo no válido.");
    }

    const solicitaEntrevista = valorUnico("solicita_entrevista").toUpperCase() === "SI";
    const bandasEntrevista = solicitaEntrevista ? valoresMultiples("entrevista_bandas") : [];

    if (solicitaEntrevista && !bandasEntrevista.length) {
      return respuestaError("Selecciona al menos una banda para solicitar la entrevista.");
    }

    // 4. Preparar datos limpios
    const datos = {
      medio:                   limpiar(valorUnico("medio")),
      web_medio:               limpiar(valorUnico("web_medio")),
      nombre:                  limpiar(valorUnico("nombre")),
      email:                   limpiar(valorUnico("email")).toLowerCase(),
      telefono:                limpiar(valorUnico("telefono")),
      tipo_acreditacion:       limpiar(valorUnico("tipo_acreditacion")),
      cobertura:               limpiar(valorUnico("cobertura")),
      solicita_entrevista:     solicitaEntrevista ? "SI" : "NO",
      entrevista_bandas:       bandasEntrevista.join(", "),
      entrevista_observaciones:solicitaEntrevista ? limpiar(valorUnico("entrevista_observaciones")) : "",
      acepta_normas:           valorUnico("acepta_normas") === "true" ? "SI" : "NO",
      acepta_privacidad:       valorUnico("acepta_privacidad") === "true" ? "SI" : "NO"
    };

    // 5. Abrir hoja y obtener / crear pestaña
    const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    const hoja  = obtenerOCrearHoja(ss);

    // 6. Evitar duplicados evidentes (mismo email + medio en los últimos 5 minutos)
    if (esDuplicado(hoja, datos.email, datos.medio)) {
      return respuestaOk("duplicado_ignorado");
    }

    // 7. Generar código único y fecha
    const fecha  = new Date();
    const codigo = generarCodigo();

    // 8. Construir fila según CABECERAS
    const fila = [
      Utilities.formatDate(fecha, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"),
      codigo,
      "PENDIENTE",
      datos.medio,
      datos.web_medio,
      datos.nombre,
      datos.email,
      datos.telefono,
      datos.tipo_acreditacion,
      datos.cobertura,
      datos.solicita_entrevista,
      datos.entrevista_bandas,
      datos.entrevista_observaciones,
      datos.acepta_normas,
      datos.acepta_privacidad,
      "",   // fecha_respuesta
      "",   // decision
      "",   // motivo_decision
      "",   // tipo_credencial
      "",   // codigo_credencial
      ""    // email_confirmacion_enviado (se actualiza tras enviar correo)
    ];

    hoja.appendRow(fila);

    // 9. Enviar correo de aviso a la organización (el fallo no impide guardar)
    let emailEnviado = "NO";
    try {
      enviarAvisoOrganizacion(datos, codigo);
      enviarConfirmacionSolicitante(datos, codigo);
      emailEnviado = "SI";
    } catch (mailError) {
      Logger.log("Error al enviar correo: " + mailError.message);
    }

    // 10. Registrar si el correo de confirmación se envió
    const ultimaFila = hoja.getLastRow();
    const colEmailConfirmacion = CABECERAS.indexOf("email_confirmacion_enviado") + 1;
    hoja.getRange(ultimaFila, colEmailConfirmacion).setValue(emailEnviado);

    return respuestaOk(codigo);

  } catch (err) {
    Logger.log("Error en doPost: " + err.message);
    return respuestaError("Error interno. Intente de nuevo.");
  }
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function obtenerOCrearHoja(ss) {
  let hoja = ss.getSheetByName(SHEET_NAME);
  if (!hoja) {
    hoja = ss.insertSheet(SHEET_NAME);
    hoja.appendRow(CABECERAS);
    hoja.setFrozenRows(1);
  }
  return hoja;
}

function generarCodigo() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let parte = "";
  for (let i = 0; i < 8; i++) {
    parte += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return "TR26-S-" + parte;
}

function esDuplicado(hoja, email, medio) {
  const datos = hoja.getDataRange().getValues();
  const ahora = new Date().getTime();
  const limiteMs = 5 * 60 * 1000; // 5 minutos

  // Columnas por índice (0-based) según CABECERAS
  const iEmail = CABECERAS.indexOf("email");
  const iMedio = CABECERAS.indexOf("medio");
  const iFecha = CABECERAS.indexOf("fecha_solicitud");

  for (let i = 1; i < datos.length; i++) {
    const filaEmail = (datos[i][iEmail] || "").toLowerCase();
    const filaMedio = (datos[i][iMedio] || "").toLowerCase();
    const filaFecha = datos[i][iFecha] ? new Date(datos[i][iFecha]).getTime() : 0;

    if (
      filaEmail === email.toLowerCase() &&
      filaMedio === medio.toLowerCase() &&
      (ahora - filaFecha) < limiteMs
    ) {
      return true;
    }
  }
  return false;
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || "").trim());
}

function limpiar(valor) {
  if (!valor) return "";
  // Elimina etiquetas HTML básicas para evitar inyección en correos
  return String(valor).replace(/<[^>]*>/g, "").trim().substring(0, 500);
}

function enviarAvisoOrganizacion(datos, codigo) {
  const asunto = "Nueva solicitud de acreditación: " + datos.medio + " - " + datos.nombre;
  const cuerpo = [
    "AREA: PRENSA",
    "",
    "CODIGO_SOLICITUD: " + codigo,
    "FECHA_SOLICITUD: " + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm"),
    "",
    "MEDIO: " + datos.medio,
    "NOMBRE: " + datos.nombre,
    "EMAIL: " + datos.email,
    "TELEFONO: " + datos.telefono,
    "TIPO_ACREDITACION: " + datos.tipo_acreditacion,
    "WEB_MEDIO: " + (datos.web_medio || ""),
    "COBERTURA: " + datos.cobertura,
    "",
    "SOLICITA_ENTREVISTA: " + datos.solicita_entrevista,
    "ENTREVISTA_BANDAS: " + (datos.entrevista_bandas || ""),
    "ENTREVISTA_OBSERVACIONES: " + (datos.entrevista_observaciones || ""),
    "",
    "ACEPTA_NORMAS: " + datos.acepta_normas,
    "ACEPTA_PRIVACIDAD: " + datos.acepta_privacidad
  ].join("\n");

  MailApp.sendEmail(ORGANIZATION_EMAIL, asunto, cuerpo);
}

function enviarConfirmacionSolicitante(datos, codigo) {
  const asunto = "Solicitud de acreditación recibida – XVIII Tajuña Rock 2026";
  const cuerpo = [
    "Hola, " + datos.nombre + ":",
    "",
    "Hemos recibido correctamente tu solicitud de acreditación para el XVIII Tajuña Rock 2026.",
    "",
    "Código de solicitud: " + codigo,
    "Medio: " + datos.medio,
    "Tipo solicitado: " + datos.tipo_acreditacion,
    "Entrevista solicitada: " + datos.solicita_entrevista,
    "",
    "La recepción de esta solicitud no implica su aprobación automática. La organización revisará la información y comunicará la resolución por correo electrónico.",
    "",
    "Fecha del festival: sábado 29 de agosto de 2026.",
    "Lugar: Morata de Tajuña.",
    "",
    "Gracias por tu interés en Tajuña Rock."
  ].join("\n");

  MailApp.sendEmail(datos.email, asunto, cuerpo);
}

function respuestaOk(codigo) {
  return ContentService
    .createTextOutput(JSON.stringify({ resultado: "ok", codigo: codigo }))
    .setMimeType(ContentService.MimeType.JSON);
}

function respuestaError(mensaje) {
  return ContentService
    .createTextOutput(JSON.stringify({ resultado: "error", mensaje: mensaje }))
    .setMimeType(ContentService.MimeType.JSON);
}
