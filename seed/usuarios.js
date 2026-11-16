import bcrypt from "bcrypt";

const usuarios = [
  {
    nombre: "juan dev",
    email: "juanpablo@hotmail.com",
    confirmado: 1,
    password: bcrypt.hashSync("juanpablo", 10),
  },
];

export default usuarios;
