const clientWizytaDTO = (wizyta) => ({
    id: wizyta.Id,
    marka: wizyta.Samochod.Marka,
    model: wizyta.Samochod.Model,
    numerRejestracyjny: wizyta.Samochod.NumerRejestracyjny,
    koszt: wizyta.Koszt,
    status: wizyta.Status,
    czasRozpoczecia: wizyta.CzasRozpoczecia
});

const szczegolyDTO = (wizyta) => ({
    id: wizyta.Id,
    czasRozpoczecia: wizyta.CzasRozpoczecia,
    czasZakonczenia: wizyta.CzasZakonczenia,
    koszt: wizyta.Koszt,
    opis: wizyta.Opis,
    status: wizyta.Status,
    samochod_id: wizyta.Samochod.Id,
    marka: wizyta.Samochod.Marka,
    model: wizyta.Samochod.Model,
})

const samochodSzczegolyDTO = (wizyta) => ({
    id: wizyta.Id,
    czasRozpoczecia: wizyta.CzasRozpoczecia,
    status: wizyta.Status,
    koszt: wizyta.Koszt,
});

const listaAdminDTO = (wizyta) => ({
    id: wizyta.Id,
    marka: wizyta.Samochod.Marka,
    model: wizyta.Samochod.Model,
    imie: wizyta.Mechanik.Imie,
    nazwisko: wizyta.Mechanik.Nazwisko,
    czasRozpoczecia: wizyta.CzasRozpoczecia,
    status: wizyta.Status,
});


const szczegolyAdminDTO = (wizyta) => ({
    id: wizyta.Id,
    czasRozpoczecia: wizyta.CzasRozpoczecia,
    czasZakonczenia: wizyta.CzasZakonczenia,
    koszt: wizyta.Koszt,
    opis: wizyta.Opis,
    status: wizyta.Status,
    samochod_id: wizyta.Samochod.Id,
    marka: wizyta.Samochod.Marka,
    model: wizyta.Samochod.Model,
    mechanikId: wizyta.Samochod.Id,
    imie: wizyta.Mechanik.Imie,
    nazwisko: wizyta.Mechanik.Nazwisko,
})



module.exports = {
    clientWizytaDTO,
    szczegolyDTO,
    samochodSzczegolyDTO,
    listaAdminDTO,
    szczegolyAdminDTO
}