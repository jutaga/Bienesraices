import Propiedad from "./Propiedad.js";
import Precio from "./Precio.js";
import Categoria from "./Categoria.js";
import Usuario from "./Usuario.js";

//Propiedad.belongsTo(Precio)
Precio.hasOne(Propiedad);
Categoria.hasOne(Propiedad);
Usuario.hasMany(Propiedad);


export {
  Propiedad,
  Precio,
  Categoria,
  Usuario
}
