// Plantillas HTML para los emails.
// Los clientes de correo (Gmail, Outlook...) no soportan Tailwind ni CSS
// externo: por eso se usan tablas y estilos inline. Los colores son los
// mismos de la paleta del sitio (arena, bosque, terracota).

const colores = {
  arena50: "#faf7f2",
  arena100: "#f3ede3",
  arena200: "#e6dccb",
  bosque700: "#1f5a45",
  bosque900: "#0f2f24",
  terracota400: "#e0915a",
  texto: "#0f2f24",
  textoSuave: "#5b6b64",
};

const fuenteTitulo = "Georgia, 'Times New Roman', serif";
const fuenteTexto =
  "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// Evita que el nombre que escribe el usuario se interprete como HTML
const escapar = (texto = "") =>
  String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Estructura común: fondo, cabecera con el logo, tarjeta y pie
const layout = ({
  titulo,
  preheader,
  contenido,
  motivo = "Recibiste este correo porque se creó una cuenta con esta dirección.",
}) => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>${titulo}</title>
</head>
<body style="margin:0; padding:0; background-color:${colores.arena50};">
  <!-- Texto de vista previa que muestra la bandeja de entrada -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${preheader}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${colores.arena50};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

          <!-- Cabecera -->
          <tr>
            <td style="background-color:${colores.bosque900}; border-radius:16px 16px 0 0; padding:28px 40px;">
              <span style="font-family:${fuenteTitulo}; font-size:24px; color:${colores.arena50};">Bienes<span style="color:${colores.terracota400};">Raíces</span></span>
            </td>
          </tr>

          <!-- Contenido -->
          <tr>
            <td style="background-color:#ffffff; border:1px solid ${colores.arena200}; border-top:0; border-radius:0 0 16px 16px; padding:40px;">
              ${contenido}
            </td>
          </tr>

          <!-- Pie -->
          <tr>
            <td align="center" style="padding:24px 16px; font-family:${fuenteTexto}; font-size:12px; line-height:18px; color:${colores.textoSuave};">
              © ${new Date().getFullYear()} Bienes Raíces · Casas, departamentos y terrenos.<br>
              ${motivo}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// Botón compatible con Outlook (tabla con fondo + enlace con padding)
const boton = (texto, url) => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:32px 0;">
    <tr>
      <td align="center" bgcolor="${colores.bosque900}" style="border-radius:999px;">
        <a href="${url}" target="_blank" style="display:inline-block; padding:14px 32px; font-family:${fuenteTexto}; font-size:16px; font-weight:600; color:${colores.arena50}; text-decoration:none; border-radius:999px;">${texto} &rarr;</a>
      </td>
    </tr>
  </table>`;

export const plantillaConfirmarCuenta = ({ nombre, url }) => {
  const nombreSeguro = escapar(nombre);

  return layout({
    titulo: "Confirma tu cuenta",
    preheader: `${nombreSeguro}, solo falta un paso para activar tu cuenta en Bienes Raíces.`,
    contenido: `
      <p style="margin:0 0 8px; font-family:${fuenteTexto}; font-size:12px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:${colores.terracota400};">Último paso</p>
      <h1 style="margin:0; font-family:${fuenteTitulo}; font-size:30px; line-height:38px; font-weight:normal; color:${colores.texto};">Confirma tu cuenta</h1>

      <p style="margin:24px 0 0; font-family:${fuenteTexto}; font-size:16px; line-height:26px; color:${colores.texto};">Hola <strong>${nombreSeguro}</strong>,</p>
      <p style="margin:12px 0 0; font-family:${fuenteTexto}; font-size:16px; line-height:26px; color:${colores.textoSuave};">
        Gracias por registrarte en Bienes Raíces. Para activar tu cuenta y empezar a publicar y encontrar propiedades, confirma tu email con el siguiente botón:
      </p>

      ${boton("Confirmar mi cuenta", url)}

      <!-- Enlace de respaldo -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:${colores.arena100}; border-radius:12px; padding:16px 20px; font-family:${fuenteTexto}; font-size:13px; line-height:20px; color:${colores.textoSuave};">
            ¿El botón no funciona? Copia y pega este enlace en tu navegador:<br>
            <a href="${url}" target="_blank" style="color:${colores.bosque700}; word-break:break-all;">${url}</a>
          </td>
        </tr>
      </table>

      <p style="margin:24px 0 0; font-family:${fuenteTexto}; font-size:13px; line-height:20px; color:${colores.textoSuave};">
        Si tú no creaste esta cuenta, puedes ignorar este mensaje.
      </p>
    `,
  });
};

export const textoConfirmarCuenta = ({ nombre, url }) =>
  `Hola ${nombre},

Gracias por registrarte en Bienes Raíces. Para activar tu cuenta, abre este enlace:

${url}

Si tú no creaste esta cuenta, puedes ignorar este mensaje.`;

export const plantillaOlvidePassword = ({ nombre, url }) => {
  const nombreSeguro = escapar(nombre);

  return layout({
    titulo: "Restablece tu contraseña",
    preheader: `${nombreSeguro}, recibimos una solicitud para restablecer tu contraseña en Bienes Raíces.`,
    motivo:
      "Recibiste este correo porque se pidió restablecer la contraseña de esta cuenta.",
    contenido: `
      <p style="margin:0 0 8px; font-family:${fuenteTexto}; font-size:12px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:${colores.terracota400};">Recupera tu acceso</p>
      <h1 style="margin:0; font-family:${fuenteTitulo}; font-size:30px; line-height:38px; font-weight:normal; color:${colores.texto};">Restablece tu contraseña</h1>

      <p style="margin:24px 0 0; font-family:${fuenteTexto}; font-size:16px; line-height:26px; color:${colores.texto};">Hola <strong>${nombreSeguro}</strong>,</p>
      <p style="margin:12px 0 0; font-family:${fuenteTexto}; font-size:16px; line-height:26px; color:${colores.textoSuave};">
        Recibimos una solicitud para restablecer la contraseña de tu cuenta en Bienes Raíces. Usa el siguiente botón para crear una nueva:
      </p>

      ${boton("Crear nueva contraseña", url)}

      <!-- Enlace de respaldo -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:${colores.arena100}; border-radius:12px; padding:16px 20px; font-family:${fuenteTexto}; font-size:13px; line-height:20px; color:${colores.textoSuave};">
            ¿El botón no funciona? Copia y pega este enlace en tu navegador:<br>
            <a href="${url}" target="_blank" style="color:${colores.bosque700}; word-break:break-all;">${url}</a>
          </td>
        </tr>
      </table>

      <!-- Aviso de seguridad -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
        <tr>
          <td style="border-left:3px solid ${colores.terracota400}; padding:4px 0 4px 16px; font-family:${fuenteTexto}; font-size:13px; line-height:20px; color:${colores.textoSuave};">
            <strong style="color:${colores.texto};">¿No fuiste tú?</strong> Ignora este mensaje: tu contraseña actual seguirá funcionando y nadie podrá cambiarla sin este enlace.
          </td>
        </tr>
      </table>
    `,
  });
};

export const textoOlvidePassword = ({ nombre, url }) =>
  `Hola ${nombre},

Recibimos una solicitud para restablecer la contraseña de tu cuenta en Bienes Raíces. Para crear una nueva, abre este enlace:

${url}

¿No fuiste tú? Ignora este mensaje: tu contraseña actual seguirá funcionando.`;
