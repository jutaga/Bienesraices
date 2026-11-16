//const express = require('express');
import csrf from "csurf";
import cookieParser from "cookie-parser";
import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import propiedadRoutes  from "./routes/propiedadRoutes.js";

import db from "./config/db.js";

//Crear el servidor
const app = express();

//Habilitar lectura de datos de formularios
//(debe ir antes de CSRF: csurf busca el token en req.body._csrf)
app.use(express.urlencoded({ extended: true }));

//habilitar Cookie Parser
app.use(cookieParser());

//Habilitar CSRF
app.use(
  csrf({
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Solo enviar cookies seguras en producción
      sameSite: "lax", // Evitar el envío de cookies en solicitudes de terceros
    },
  }),
);

// Probar la conexión a la base de datos
try {
  await db.authenticate();
  db.sync(); // Sincronizar los modelos con la base de datos
  console.log("Conexión correcta a la base de datos");
} catch (error) {
  console.error("Error al conectar a la base de datos:", error);
}

//Habilitar PUG
app.set("view engine", "pug");
app.set("views", "./views");

//Carpeta pública
app.use(express.static("public"));

//Routing
app.use("/auth", usuarioRoutes);
app.use("/", propiedadRoutes);

//Definir un puerto y arrancar el servidor
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
