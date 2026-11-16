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
  const { id: usuarioId } = req.usuario;

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
    const propiedadGuardada = await Propiedad.create({
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
      img: "NADA POR EL MOMENTO",
    });

    res.redirect("/propiedades/agregar-imagen/".concat(usuarioId));
  } catch (error) {
    console.log(error);
  }
};

export { admin, crearPropiedad, guardarPropiedad };
