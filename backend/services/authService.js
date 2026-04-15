const Mechanik = require("../models/Mechanik");
const AuthDTO = require("../dto/AuthDTO");
const {Op} = require("sequelize");
const EmailConflictError = require("../Errors/EmailError");





const login =  async ({mail, haslo}) => {

    const user = await Mechanik.findOne({ where: { Mail: mail } });

    if (!user) {
        throw Error(`Mail doesn't exist`);
    }

    if (haslo !== user.Haslo) {
        throw Error(`Incorrect password`);
    }

    return [AuthDTO.sessionDTO(user), AuthDTO.nameDto(user)];

}

const getUserProfile = async (id) => {


    const mechanik = await Mechanik.findByPk(id);

    if (!mechanik) {
        throw Error(`Mechanik doesn't exist`);
    }

    return AuthDTO.forProfileDTO(mechanik);

}


const walidacjaMechanik = async (body, mechanikId = null) => {

    if (!body.imie || body.imie.trim() === "") {
        throw Error("Imię nie może być puste");
    }
    if (!body.nazwisko || body.nazwisko.trim() === "") {
        throw Error("Nazwisko nie może być puste");
    }

    const capitalize = (s) =>
        s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();



    if (!body.mail || body.mail.trim() === "") {
        throw Error("Email jest wymagany");
    } else if (body.mail.length > 30) {
        throw Error("Email nie może mieć więcej niż 30 znaków");
    } else {
        const mailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!mailRegex.test(body.mail)) throw Error("Niepoprawny format email");
    }

    if (mechanikId === null) {
        const istniejeMail = await Mechanik.findOne({
            where: {
                Mail: body.mail,
            }
        });
        if (istniejeMail) {
            throw new EmailConflictError("Ten email jest już zajęty")
        }
    } else {
        const istniejeMail = await Mechanik.findOne({
            where: {
                Mail: body.mail,
                Id: { [Op.ne]: mechanikId }
            }
        });
        if (istniejeMail) {
            throw new EmailConflictError("Ten email jest już zajęty")
        }
    }



    if (!body.haslo || body.haslo.trim() === "") {
        throw Error("Hasło nie może być puste");
    } else if (body.haslo.length > 15 || body.haslo.length < 5) {
        throw Error("Hasło nie może mieć więcej niż 15 znaków i nie mniej niż 5");
    }


    if (!body.telefon || body.telefon.trim() === "") {
        throw Error("Telefon jest wymagany");
    }
    if (!/^[0-9+ -]{7,15}$/.test(body.telefon)) {
        throw Error("Niepoprawny numer telefonu");
    }


    return {
        Imie: capitalize(body.imie),
        Nazwisko: capitalize(body.nazwisko),
        Mail: body.mail,
        Haslo: body.haslo,
        Telefon: body.telefon,
        Opis: body.opis || ""
    };


};



const edit = async (id, body) => {
    const daneWalidowane = await walidacjaMechanik(body, id);



    await Mechanik.update(
        daneWalidowane,
        { where: { Id: id } }
    );

    return { message: "Dane zostały zaktualizowane" };

};


const rejestracja = async (body) => {


    const daneWalidowane = await walidacjaMechanik(body);

    const user =  await Mechanik.create(daneWalidowane);


    return [AuthDTO.sessionDTO(user.dataValues), AuthDTO.nameDto(user.dataValues)];
};





module.exports = {
    login,
    getUserProfile,
    edit,
    rejestracja,
}

