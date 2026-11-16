import { body } from "express-validator";

// Cada validación es un arreglo de middlewares de express-validator.
// Se usan en las rutas antes del controlador, por ejemplo:
//   router.post("/login", validarLogin, autenticarUsuario);
// El controlador solo tiene que revisar validationResult(req).

// Reglas que se repiten en varios formularios
const email = body("email").isEmail().withMessage("El email no es válido");

const passwordNueva = body("password")
  .isLength({ min: 6 })
  .withMessage("La contraseña debe tener al menos 6 caracteres");

// En las rutas, req.body todavía no existe cuando se escribe la regla,
// así que .equals(req.body.password) no sirve aquí. Con .custom()
// recibimos req en el momento en que se valida.
const repetirPassword = body("repetir_password")
  .custom((valor, { req }) => valor === req.body.password)
  .withMessage("Las contraseñas no coinciden");

const validarLogin = [
  email,
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

const validarRegistro = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  email,
  passwordNueva,
  repetirPassword,
];

const validarOlvidePassword = [email];

const validarNuevoPassword = [passwordNueva, repetirPassword];

export {
  validarLogin,
  validarRegistro,
  validarOlvidePassword,
  validarNuevoPassword,
};
