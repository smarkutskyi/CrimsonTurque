const Mechanik = require('./Mechanik')
const Samochod = require('./Samochod')
const Wizyta = require("./Wizyta")

Mechanik.hasMany(Wizyta, {
    foreignKey: 'Mechanik_id',
});

Wizyta.belongsTo(Mechanik, {
    foreignKey: 'Mechanik_id',
});

Samochod.hasMany(Wizyta, {
    foreignKey: 'Samochod_id',
});

Wizyta.belongsTo(Samochod, {
    foreignKey: 'Samochod_id'
});


module.exports = {
    Mechanik, Wizyta, Samochod
};