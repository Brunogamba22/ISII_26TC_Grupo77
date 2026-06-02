// db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
    constructor() {
        // Si la instancia ya existe, retornamos esa en lugar de crear una nueva
        if (Database.instance) {
            return Database.instance;
        }

        // Si no existe, creamos el pool de conexiones
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306, // 3306 por defecto si no está en el .env
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Prueba rápida para verificar que conecta (se ejecutará solo la primera vez)
        this.pool.getConnection()
            .then(connection => {
                console.log('✅ Conexión a la base de datos MySQL establecida correctamente.');
                connection.release(); // Siempre debemos liberar la conexión de vuelta al pool
            })
            .catch(err => {
                console.error('❌ Error conectando a la base de datos:', err.message);
            });

        // Guardamos esta única instancia en la clase
        Database.instance = this;
    }

    // Método para obtener el pool de conexiones
    getPool() {
        return this.pool;
    }
}

// Instanciamos la clase (aquí se crea la conexión)
const dbInstance = new Database();

// Object.freeze bloquea el objeto para que nadie pueda agregar, modificar o eliminar propiedades accidentalmente
Object.freeze(dbInstance);

// Exportamos solo el pool para que sea más fácil de usar en los controladores
module.exports = dbInstance.getPool();