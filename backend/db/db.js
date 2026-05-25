const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

function connectWithRetry() {
  db.getConnection((err, connection) => {
    if (err) {
      console.log("MySQL not ready. Retrying in 5 sec...");
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log("Connected to MySQL");
      connection.release();
    }
  });
}

connectWithRetry();

module.exports = db;