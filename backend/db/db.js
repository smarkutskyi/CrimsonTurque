// const sqlite3 = require('sqlite3').verbose();
// const path = require('path');
//
// const db = new sqlite3.Database(path.join(__dirname, 'data.sqlite'), (err) => {
//     if (err) console.error("DB ERROR:", err);
//     else console.log("Połączono z SQLite");
// });
//
//
// db.serialize(() => {
//     db.run(`
//         CREATE TABLE IF NOT EXISTS mechanik (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             imie TEXT NOT NULL CHECK (length(imie) <= 10),
//             nazwisko TEXT NOT NULL CHECK (length(nazwisko) <= 20),
//             opis TEXT NOT NULL CHECK (length(opis) <= 500)
//             )
//     `);
// });
//
// module.exports = db;


const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./db/data.sqlite",
    logging: false
});

module.exports = sequelize;