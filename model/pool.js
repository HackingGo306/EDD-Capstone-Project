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
      ca: process.env.DATABASE_SSL_CA, // paste the full CA block from Aiven
    },

    connectTimeout: 10000,
    multipleStatements: true,
    connectionLimit: 100,
    waitForConnections: true,
    debug: false,
    charset: "utf8mb4",
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
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
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  });
}

module.exports = pool;
