
const toSearchDTO = (mechanik) => ({
    imie: mechanik.Imie,
    nazwisko: mechanik.Nazwisko,
    opis: mechanik.Opis,
    telefon: mechanik.Telefon,
});


const szczegolyDTO = (mechanik) => ({
    id: mechanik.Id,
    imie: mechanik.Imie,
    nazwisko: mechanik.Nazwisko,
    mail: mechanik.Mail,
    haslo: mechanik.Haslo,
    telefon: mechanik.Telefon,
    opis: mechanik.Opis,
});


const forWizytaAdmin = (mechanik) => ({
   id: mechanik.Id,
   imie: mechanik.Imie,
   nazwisko: mechanik.Nazwisko,
   mail: mechanik.Mail,
});




module.exports = {
    szczegolyDTO,
    toSearchDTO,
    forWizytaAdmin,
};
