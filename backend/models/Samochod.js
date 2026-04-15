const {DataTypes} = require("sequelize");
const sequelize = require("../db/db");


const Samochod = sequelize.define("Samochod", {
    Id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Marka : {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    Model : {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    NumerVin : {
        type: DataTypes.STRING(17),
        allowNull: false
    },
    NumerRejestracyjny : {
        type: DataTypes.STRING(9),
        allowNull: false
    },
    RokProdukcji : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Przebieg : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Kolor: {
        type: DataTypes.STRING(15),
        allowNull: false
    }

}, {
    tableName: "Samochod",
    timestamps: false});

module.exports = Samochod;