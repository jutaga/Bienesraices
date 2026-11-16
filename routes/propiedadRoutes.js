import express from "express";
import {
  admin,
  crearPropiedad,
  guardarPropiedad,
} from "../controllers/propiedadController.js";
import { validarPropiedad } from "./validaciones/propiedadValidaciones.js";
import { protegerRuta } from "../middleware/protegerRutas.js";

const router = express.Router();

router.get("/mis-propiedades", protegerRuta, admin);

router.get("/propiedades/crear", protegerRuta, crearPropiedad);
router.post(
  "/propiedades/crear",
  protegerRuta,
  validarPropiedad,
  guardarPropiedad,
);

export default router;
