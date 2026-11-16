import express from "express";
import {
  formularioResetPassword,
  confirmarCuenta,
  formularioLogin,
  formularioRecuperarPassword,
  formularioRegistro,
  registrarUsuario,
  resetPassword,
  newPassword,
  autenticarUsuario
} from "../controllers/usuarioController.js";
import {
  validarLogin,
  validarRegistro,
  validarOlvidePassword,
  validarNuevoPassword,
} from "./validaciones/usuarioValidaciones.js";
const router = express.Router();

//Routing
router.get("/login", formularioLogin);
router.post("/login", validarLogin, autenticarUsuario);


router.get("/registro", formularioRegistro);
router.post("/registro", validarRegistro, registrarUsuario);

router.get("/confirmar/:token", confirmarCuenta);

router.get("/cambiar-password/:token", formularioResetPassword);
router.post("/cambiar-password/:token", validarNuevoPassword, newPassword);

router.get("/olvide-password", formularioRecuperarPassword);
router.post("/olvide-password", validarOlvidePassword, resetPassword);

export default router;
