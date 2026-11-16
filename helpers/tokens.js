import jwt from "jsonwebtoken";

export const generarJWT = (datos) => {
  return jwt.sign({ id: datos.id, nombre: datos.nombre }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const generarId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};
