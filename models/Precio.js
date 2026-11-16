import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Precio = db.define("precios", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Precio;
