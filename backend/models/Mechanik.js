const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Mechanik = sequelize.define("Mechanik", {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Imie: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Nazwisko: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Opis: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Telefon: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    Haslo: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    Mail: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    Admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: "mechanik",
    timestamps: false
});

module.exports = Mechanik;