import { body } from "express-validator";

// Validaciones del formulario de crear propiedad (views/propiedades/crear.pug)
// Uso en la ruta:
//   router.post("/propiedades/crear", validarPropiedad, guardarPropiedad);
// Los nombres ("titulo", "categoria", ...) son los name de los campos del formulario.

// habitaciones, estacionamiento y wc son selects con valores de 0 a 10
const cantidad = (campo, texto) =>
  body(campo)
    .isInt({ min: 0, max: 10 })
    .withMessage(`Selecciona la cantidad de ${texto}`);

const validarPropiedad = [
  body("titulo")
    .trim()
    .notEmpty()
    .withMessage("El título del anuncio es obligatorio")
    .isLength({ max: 100 })
    .withMessage("El título no puede tener más de 100 caracteres"),

  body("descripcion")
    .trim()
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ max: 200 })
    .withMessage("La descripción no puede tener más de 200 caracteres"),

  // categoria y precio llegan como el id (UUID) de la base de datos
  body("categoria").isUUID().withMessage("Selecciona una categoría"),
  body("precio").isUUID().withMessage("Selecciona un rango de precio"),

  cantidad("habitaciones", "habitaciones"),
  cantidad("estacionamiento", "estacionamientos"),
  cantidad("wc", "baños"),

  // lat y lng los llena el mapa al mover el pin
  body("lat").notEmpty().withMessage("Ubica la propiedad en el mapa"),
];

export { validarPropiedad };
