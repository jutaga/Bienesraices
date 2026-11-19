import express from "express";
import {
  admin,
  crearPropiedad,
  guardarPropiedad,
  agregarImagen,
  almacenarImagen,
  editar,
  editarPropiedad,
  eliminar
} from "../controllers/propiedadController.js";
import { validarPropiedad } from "./validaciones/propiedadValidaciones.js";
import { protegerRuta } from "../middleware/protegerRutas.js";
import upload from "../middleware/subirArchivo.js";

const router = express.Router();

router.get("/mis-propiedades", protegerRuta, admin);

router.get("/propiedades/crear", protegerRuta, crearPropiedad);
router.post(
  "/propiedades/crear",
  protegerRuta,
  validarPropiedad,
  guardarPropiedad,
);

router.get("/propiedades/agregar-imagen/:id", protegerRuta, agregarImagen);
router.post(
  "/propiedades/agregar-imagen/:id",
  protegerRuta,
  upload.single("imagen"),
  almacenarImagen,
);

router.get("/propiedades/editar/:id", protegerRuta, editar);
router.post("/propiedades/editar/:id", protegerRuta, validarPropiedad, editarPropiedad );

router.post("/propiedades/eliminar/:id", protegerRuta, eliminar)

export default router;
