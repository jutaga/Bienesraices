import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {
  plantillaConfirmarCuenta,
  textoConfirmarCuenta,
  plantillaOlvidePassword,
  textoOlvidePassword,
} from "./plantillasEmail.js";

dotenv.config({ path: ".env" });

export const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const { email, nombre, token } = datos;

  // Enlace de confirmación: BACKEND_URL y PORT vienen del .env
  // Las rutas de usuario están montadas en /auth (ver index.js)
  const url = `${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}`;

  // Enviar el email
  await transport.sendMail({
    from: '"Bienes Raíces" <no-reply@bienesraices.com>',
    to: email,
    subject: "Confirma tu cuenta en Bienes Raíces",
    text: textoConfirmarCuenta({ nombre, url }),
    html: plantillaConfirmarCuenta({ nombre, url }),
  });
};

export const emailOlvidePassword = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const { email, nombre, token } = datos;

  // Enlace de recuperación de contraseña
  const url = `${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/cambiar-password/${token}`;

  // Enviar el email
  await transport.sendMail({
    from: '"Bienes Raíces" <no-reply@bienesraices.com>',
    to: email,
    subject: "Recupera tu contraseña en Bienes Raíces",
    text: textoOlvidePassword({ nombre, url }),
    html: plantillaOlvidePassword({ nombre, url }),
  });
};
