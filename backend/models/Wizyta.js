const {DataTypes} = require('sequelize');
const sequelize = require("../db/db");

const Wizyta = sequelize.define("Wizyta", {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CzasRozpoczecia: {
        type: 'DATETIME WITHOUT TIME ZONE',
        allowNull: false,
    },
    CzasZakonczenia: {
        type: 'DATETIME WITHOUT TIME ZONE',
        allowNull: true,
    },
    Opis: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    Koszt: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    Status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
}, {
    tableName: "Wizyta",
    timestamps: false,
});

module.exports = Wizyta;