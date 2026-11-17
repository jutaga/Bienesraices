// Configuración de webpack
// Toma tus archivos de src/js y los compila (empaqueta) en public/js,
// que es la carpeta que Express sirve al navegador.
//
// Comandos:
//   npm run js        -> compila y se queda vigilando cambios
//   npm run js:build  -> compila una vez, minificado (para producción)
import path from "path";

export default {
  // "development" compila rápido y deja el código legible.
  // El script js:build lo cambia a "production" con --mode production.
  mode: "development",

  // Un archivo de entrada por cada script que quieras en el navegador.
  // La clave (mapa) es el nombre del archivo que se genera: public/js/mapa.js
  entry: {
    mapa: "./src/js/mapa.js",
    agregarImagen : "./src/js/agregarImagen.js"
  },

  output: {
    filename: "[name].js",
    path: path.resolve("public/js"),
  },

  // Sin esto, en modo development webpack usa eval() y el código se lee mal
  // en las herramientas del navegador. Con source-map ves tu código original.
  devtool: "source-map",
};
