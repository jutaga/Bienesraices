// Sequelize es un ORM: permite trabajar con la base de datos usando
// objetos y métodos de JavaScript en lugar de escribir SQL a mano.
import { Sequelize } from "sequelize";
import dotenv from "dotenv";


dotenv.config({ path: ".env" });

// Crea la conexión a la base de datos.
// Los tres primeros parámetros son, en orden:
//   1. Nombre de la base de datos -> "bienesraices_node_mvc"
//   2. Usuario de MySQL           -> "pablo"
//   3. Password de ese usuario    -> "" (vacío = sin password)
// El cuarto parámetro es un objeto con el resto de la configuración.
const db = new Sequelize(process.env.MYSQL_BD_DATABASE, process.env.MYSQL_BD_USER, process.env.MYSQL_BD_PASSWORD, {

    // Dirección del servidor MySQL. "localhost" = tu propia computadora.
    host : process.env.MYSQL_BD_HOST,

    // Tipo de base de datos que se usa. Sequelize también soporta
    // "postgres", "sqlite", "mariadb", "mssql", etc.
    // Para "mysql" necesita tener instalado el paquete mysql2.
    dialect : "mysql",

    // Puerto donde escucha MySQL. 3306 es el puerto por defecto.
    port : 3306,

    // Opciones que se aplican por defecto a TODOS los modelos (tablas).
    define : {
        // Agrega automáticamente las columnas createdAt y updatedAt
        // a cada tabla, y las llena con la fecha de creación y de la
        // última modificación de cada registro.
        timestamps : true
    },

    // Pool de conexiones: en lugar de abrir y cerrar una conexión en cada
    // consulta, Sequelize mantiene un grupo de conexiones abiertas y las
    // reutiliza. Esto hace la aplicación más rápida.
    pool : {
        // Número máximo de conexiones abiertas al mismo tiempo.
        max: 5,

        // Número mínimo de conexiones que se mantienen abiertas.
        // 0 = si no hay actividad, se pueden cerrar todas.
        min: 0,

        // Tiempo máximo (en milisegundos) que espera para conseguir una
        // conexión antes de lanzar un error. 30000 ms = 30 segundos.
        acquire: 30000,

        // Tiempo (en milisegundos) que una conexión puede estar sin usarse
        // antes de cerrarse. 10000 ms = 10 segundos.
        idle: 10000
    },
    operatorAliases: false
});


// Exportar la conexión a la base de datos para usarla en otros archivos.
export default db;