import { validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import { generarId, generarJWT } from "../helpers/tokens.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
    csrfToken: req.csrfToken(),
    autenticado: false,
  });
};

const autenticarUsuario = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesión",
      errores: errores.array(),
      csrfToken: req.csrfToken(),
    });
  }

  const { email, password } = req.body;
  //Comprobar si el usuario existe

  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesión",
      errores: [{ msg: "El usuario no existe" }],
      csrfToken: req.csrfToken(),
    });
  }

  //Comprobar si el usuario está confirmado
  if (!usuario.confirmado) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesión",
      errores: [{ msg: "Tu cuenta no ha sido confirmada" }],
      csrfToken: req.csrfToken(),
    });
  }

  //Comprobar la contraseña
  if (!usuario.comprobarPassword(password)) {
    return res.render("auth/login", {
      pagina: "Iniciar Sesión",
      errores: [{ msg: "La contraseña es incorrecta" }],
      csrfToken: req.csrfToken(),
    });
  }

  //Autenticar al usuario
  const token = generarJWT({ id: usuario.id, nombre: usuario.nombre });

  //Almacenar el JWT en una cookie
  return res
    .cookie("_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Solo enviar cookies seguras en producción
      sameSite: "strict", // Evitar el envío de cookies en solicitudes de terceros
      maxAge: 1000 * 60 * 60 * 24, // Expira en 1 día
    })
    .redirect("/mis-propiedades");
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
    csrfToken: req.csrfToken(),
  });
};

const confirmarCuenta = async (req, res) => {
  const { token } = req.params;

  // Verificar si el token es válido
  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Error al confirmar tu cuenta",
      mensaje: "El token no es válido",
      error: true,
    });
  }

  // Confirmar la cuenta del usuario
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();

  res.render("auth/confirmar-cuenta", {
    pagina: "Cuenta confirmada",
    mensaje: "La cuenta se confirmó correctamente",
    error: false,
  });
};

// GET: solo muestra el formulario
const formularioRecuperarPassword = (req, res) => {
  res.render("auth/olvide-password", {
    pagina: "Recuperar Contraseña",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.render("auth/olvide-password", {
      pagina: "Recuperar Contraseña",
      csrfToken: req.csrfToken(),
      errores: errores.array(),
      usuario: req.body,
    });
  }

  // Buscar al usuario (después de validar el formato del email)
  const { email } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) {
    return res.render("auth/olvide-password", {
      pagina: "Recuperar Contraseña",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El email no pertenece a ningún usuario" }],
      usuario: req.body,
    });
  }

  try {
    // Generar un token nuevo y guardarlo
    usuario.token = generarId();
    await usuario.save();

    // Enviar el email con el enlace para crear una nueva contraseña
    await emailOlvidePassword({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
    });

    res.render("auth/olvide-password", {
      pagina: "Recuperar Contraseña",
      mensaje:
        "Te enviamos un email con las instrucciones para crear una nueva contraseña.",
      email,
    });
  } catch (error) {
    res.render("auth/olvide-password", {
      pagina: "Recuperar Contraseña",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "No pudimos enviar el email, intenta de nuevo" }],
      usuario: req.body,
    });
  }
};

const formularioResetPassword = async (req, res) => {
  const { token } = req.params;

  // Verificar si el token es válido
  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Reestablecer Contraseña",
      mensaje: "El vinculo no es válido",
      error: true,
    });
  }

  res.render("auth/reset-password", {
    pagina: "Reestablecer Contraseña",
    csrfToken: req.csrfToken(),
  });
};

const newPassword = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.render("auth/reset-password", {
      pagina: "Reestablecer Contraseña",
      csrfToken: req.csrfToken(),
      errores: errores.array(),
      usuario: req.body,
    });
  }

  // Buscar al usuario por el token
  const { token } = req.params;
  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    return res.render("auth/reset-password", {
      pagina: "Reestablecer Contraseña",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El token no es válido" }],
      usuario: req.body,
    });
  }

  // Actualizar la contraseña del usuario
  usuario.password = req.body.password;
  usuario.token = null;
  await usuario.save();

  res.render("auth/reset-password", {
    pagina: "Reestablecer Contraseña",
    mensaje: "La contraseña se actualizó correctamente",
    error: false,
  });
};

const registrarUsuario = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: errores.array(),
      usuario: req.body,
    });
  }

  if (errores.isEmpty()) {
    const { nombre, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existeUsuario = await Usuario.findOne({ where: { email } });

    if (existeUsuario) {
      return res.render("auth/registro", {
        pagina: "Crear Cuenta",
        csrfToken: req.csrfToken(),
        errores: [{ msg: "El email ya se encuentra registrado" }],
        usuario: req.body,
      });
    }

    // Crear el usuario
    try {
      const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId(),
        confirmado: false,
      });
      await emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token,
      });
      res.render("templates/mensaje", {
        pagina: "Cuenta creada",
        mensaje:
          "Te enviamos un email de confirmación. Abre el enlace que incluye para activar tu cuenta.",
        email,
      });
    } catch (error) {
      res.render("auth/registro", {
        pagina: "Crear Cuenta",
        csrfToken: req.csrfToken(),
        errores: [{ msg: "Hubo un error al crear la cuenta" }],
        usuario: req.body,
      });
    }
  }
};

export {
  formularioLogin,
  formularioRegistro,
  formularioRecuperarPassword,
  resetPassword,
  registrarUsuario,
  confirmarCuenta,
  formularioResetPassword,
  newPassword,
  autenticarUsuario,
};
