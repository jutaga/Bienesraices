import { Categoria, Precio, Propiedad } from "../models/index.js";
import { validationResult } from "express-validator";
import { unlink } from "node:fs/promises";

const admin = async (req, res) => {
  const { id } = req.usuario;

  const propiedades = await Propiedad.findAll({
    where: { usuarioId: id },
    include: [Categoria, Precio],
  });

  res.render("propiedades/admin", {
    pagina: "Mis propiedades",
    propiedades,
    csrfToken: req.csrfToken(),
    mensaje: req.query.eliminada
      ? "La propiedad se eliminó correctamente"
      : null,
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
    await Propiedad.create({
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
      img: "",
    });

    res.redirect("/propiedades/agregar-imagen/".concat(usuarioId));
  } catch (error) {
    console.log(error);
  }
};

const agregarImagen = async (req, res) => {
  const { id } = req.params;
  const { id: usuarioId } = req.usuario;

  //Validar que exista
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) return res.redirect("/mis-propiedades");

  //Validar que no este publicada
  if (propiedad.publicado) {
    return res.redirect("/mis-propiedades");
  }

  //Validar el que el id si es del usuario
  if (propiedad.usuarioId !== usuarioId) {
    return res.redirect("/mis-propiedades");
  }

  return res.render("propiedades/agregar-imagen", {
    pagina: "Agregar Imagen",
    csrfToken: req.csrfToken(),
    propiedad,
  });
};

const almacenarImagen = async (req, res) => {
  const { id } = req.params;
  const { id: usuarioId } = req.usuario;

  //Validar que exista
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) return res.redirect("/mis-propiedades");

  //Validar que no este publicada
  if (propiedad.publicado) {
    return res.redirect("/mis-propiedades");
  }

  //Validar el que el id si es del usuario
  if (propiedad.usuarioId !== usuarioId) {
    return res.redirect("/mis-propiedades");
  }

  try {
    //Almacenar la imagen y publicar propiedad
    propiedad.img = req.file.filename;

    propiedad.publicado = true;

    await propiedad.save();

    res.json({ ok: true });
  } catch (error) {
    console.log(error);
  }
};

const editar = async (req, res) => {
  const { id } = req.params;
  const { id: usuarioId } = req.usuario;

  //validar que exista
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) return res.redirect("/mis-propiedades");

  //Validar el que el id si es del usuario
  if (propiedad.usuarioId !== usuarioId)
    return res.redirect("/mis-propiedades");

  //Consultar mopdelo de precio y categoria
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll({ order: [["orden", "ASC"]] }),
  ]);

  return res.render("propiedades/editar", {
    pagina: "Editar propiedad".concat(" ").concat(propiedad.titulo),
    categorias,
    precios,
    csrfToken: req.csrfToken(),
    propiedad,
  });
};

const editarPropiedad = async (req, res) => {
  const { id } = req.params;
  const { id: usuarioId } = req.usuario;
  //validar que exista
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) return res.redirect("/mis-propiedades");

  //Validar el que el id si es del usuario
  if (propiedad.usuarioId !== usuarioId)
    return res.redirect("/mis-propiedades");

  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll({ order: [["orden", "ASC"]] }),
  ]);

  //Validacion
  let errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.render("propiedades/editar", {
      pagina: "Editar propiedad",
      categorias,
      precios,
      errores: errores.array(),
      csrfToken: req.csrfToken(),
      datos: req.body,
      propiedad,
    });
  }

  //Reescribir el objeto
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
    propiedad.set({
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
    });
    await propiedad.save();
    return res.render("propiedades/editar", {
      pagina: "Editar propiedad",
      csrfToken: req.csrfToken(),
      precios,
      categorias,
      propiedad,
      mensaje: "La propiedad se actualizó correctamente",
    });
  } catch (error) {
    console.log(error);
  }
};

const eliminar = async (req, res) => {
  const { id } = req.params;
  const { id: usuarioId } = req.usuario;

  //validar que exista
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) return res.redirect("/mis-propiedades");

  //Validar el que el id si es del usuario
  if (propiedad.usuarioId !== usuarioId)
    return res.redirect("/mis-propiedades");

  //Eliminar imagen

  if (!!propiedad.img) {
    await unlink(`public/uploads/${propiedad.img}`);
  }

  //Eliminar la propiedad
  await propiedad.destroy();
  return res.redirect("/mis-propiedades?eliminada=1");
};

export {
  admin,
  crearPropiedad,
  guardarPropiedad,
  agregarImagen,
  almacenarImagen,
  editar,
  editarPropiedad,
  eliminar,
};
