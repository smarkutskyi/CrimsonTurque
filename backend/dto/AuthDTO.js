

const sessionDTO = (user) => ({
    id: user.Id,
    role: user.Admin ? "admin" : "mechanik"
});

const nameDto = (user) => ({
    imie: user.Imie,
    nazwisko: user.Nazwisko,
    role: user.Admin ? "admin" : "mechanik",
})


const forProfileDTO = (user) => ({
    imie: user.Imie,
    nazwisko: user.Nazwisko,
    mail: user.Mail,
    haslo: user.Haslo,
    telefon: user.Telefon,
    opis: user.Opis,
});


module.exports = {
    sessionDTO, nameDto, forProfileDTO
}
