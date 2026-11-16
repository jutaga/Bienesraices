import categorias from "./categorias.js";

import precios from "./precios.js";
import db from "../config/db.js";
import { Categoria, Precio } from "../models/index.js";

const importarDatos = async () => {
  try {
    //Autenticar
    await db.authenticate();

    //Generar las columnas o await db.sync() solo conoce las tablas que esten importadas aqui;
    // await Categoria.sync();
    // await Precio.sync();

    await db.sync({ alter: true });

    //Insertar los datos
    await Promise.all([
      Categoria.bulkCreate(categorias),
      Precio.bulkCreate(precios),
    ]);

    console.log("Datos importados correctamente");
    process.exit(0); // Detener la app satisfactoriamente
  } catch (error) {
    console.log(error);
    process.exit(1); // Detener la app con error
  }
};

const eliminarDatos = async () => {
  try {
    await Promise.all([
      Categoria.destroy({
        where: {},
      }),
      Precio.destroy({
        where: {},
      }),
    ]);
    console.log("Datos eliminados correctamente");
    process.exit(0);
  } catch (error) {
    console.log("Error al eliminar los datos");
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  importarDatos();
}

if (process.argv[2] === "-e") {
  eliminarDatos();
}
