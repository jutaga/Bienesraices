import { DataTypes } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcrypt";

const Usuario = db.define(
  "usuarios",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    token: DataTypes.STRING(60),
    confirmado: DataTypes.BOOLEAN,
  },
  {
    hooks: {
      beforeSave: async (usuario) => {
        if (usuario.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
    },
    scopes: {
      eliminarPassword: {
        attributes: {
          exclude: [
            "password",
            "token",
            "confirmado",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    },
  },
);

//Método para comprobar la contraseña
Usuario.prototype.comprobarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export default Usuario;
