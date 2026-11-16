import express from "express";
import { admin, crearPropiedad, guardarPropiedad } from "../controllers/propiedadController.js";
import { validarPropiedad } from "./validaciones/propiedadValidaciones.js";

const router = express.Router();

router.get("/mis-propiedades", admin)

router.get("/propiedades/crear", crearPropiedad);
router.post("/propiedades/crear", validarPropiedad , guardarPropiedad);


export default router;
