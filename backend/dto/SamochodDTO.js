

const allForClientWizyty = (samochod) => ({
    id: samochod.Id,
    marka: samochod.Marka,
    model: samochod.Model,
    numerRejestracyjny: samochod.NumerRejestracyjny,
    vin: samochod.NumerVin,
});

const allForClientCarList = (samochod) => ({
    id: samochod.Id,
    marka: samochod.Marka,
    model: samochod.Model,
    numerRejestracyjny: samochod.NumerRejestracyjny,
    kolor: samochod.Kolor,
});

const szczegoly = (samochod) => ({
    marka: samochod.Marka,
    model: samochod.Model,
    numerRejestracyjny: samochod.NumerRejestracyjny,
    kolor: samochod.Kolor,
    vin: samochod.NumerVin,
    przebieg: samochod.Przebieg,
    rokProdukcji: samochod.RokProdukcji,
});

const allForCarListAdmin = (samochod) => ({
    id: samochod.Id,
    marka: samochod.Marka,
    model: samochod.Model,
    numerRejestracyjny: samochod.NumerRejestracyjny,
    rokProdukcji: samochod.RokProdukcji,
});


module.exports = {
    allForClientWizyty,
    allForClientCarList,
    szczegoly,
    allForCarListAdmin,

};