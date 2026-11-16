import { Categoria, Precio, Propiedad } from "../models/index.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

const admin = (req, res) => {
  res.render("propiedades/admin", {
    pagina: "Mis propiedades",
  });
};

const crearPropiedad = async (req, res) => {
  //Consultar mopdelo de precio y categoria
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll({ order: [["orden", "ASC"]] }),
  ]);

  res.render("propiedades/crear", {
    pagina: "Crear propiedad",
    barra: true,
    categorias,
    precios,
    csrfToken: req.csrfToken(),
  });
};

const guardarPropiedad = async (req, res, next) => {
  //Validacion
  let errores = validationResult(req);

  if (!errores.isEmpty()) {
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll({ order: [["orden", "ASC"]] }),
    ]);

    return res.render("propiedades/crear", {
      pagina: "Crear propiedad",
      barra: true,
      categorias,
      precios,
      errores: errores.array(),
      csrfToken: req.csrfToken(),
      datos: req.body,
    });
  }

  // Crear el registro
  const { _token } = req.cookies;
  const { id: usuarioId } = jwt.verify(_token, process.env.JWT_SECRET);

  const {
    titulo,
    descripcion,
    habitaciones,
    estacionamiento,
    wc,
    calle,
    lat,
    lng,
    precio: precioId,
    categoria: categoriaId,
  } = req.body;

  try {
    const propiedadGuardar = await Propiedad.create({
      titulo,
      descripcion,
      habitaciones,
      estacionamiento,
      wc,
      calle,
      lat,
      lng,
      precioId,
      categoriaId,
      usuarioId,
      img: "NADA POR EL MOMENTO"
    });
  } catch (error) {
    console.log(error);
  }
};

export { admin, crearPropiedad, guardarPropiedad };
