const mysql = require("mysql2");

let pool = null;

// Seperate development and production databases
if (process.env.NODE_ENV === "production") {
  console.log("Using production database configuration.");
  pool = mysql.createPool({
    host: process.env.MARIA_HOST,
    user: process.env.MARIA_USER,
    password: process.env.MARIA_PASSWORD,
    database: process.env.MARIA_DATABASE,
    port: process.env.MARIA_PORT || 3306,
    ssl: {
      ca: process.env.DATABASE_SSL_CA,
    },

    connectTimeout: 10000,
    multipleStatements: true,
    connectionLimit: 100,
    waitForConnections: true,
    debug: false,
    charset: "utf8mb4",
    idleTimeout: 60000,
  });
} else {
  console.log("Using development database configuration.");
  pool = mysql.createPool({
    host: process.env.MARIA_HOST,
    user: process.env.MARIA_USER,
    password: process.env.MARIA_PASSWORD,
    database: process.env.MARIA_DATABASE,

    connectTimeout: 10000,
    multipleStatements: true,
    connectionLimit: 100,
    waitForConnections: true,
    debug: false,
    charset: "utf8mb4",
    idleTimeout: 60000,
  });
}

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the MariaDB database.");

    connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(10) NOT NULL PRIMARY KEY,
        name VARCHAR(40),
        email VARCHAR(60),
        hashed_password VARCHAR(64),
        salt VARCHAR(64),
        created_at INT(10)
      )
    `);

    connection.release();
  }
});

module.exports = pool;
