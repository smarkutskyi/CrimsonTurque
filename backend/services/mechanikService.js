const Mechanik = require("../models/Mechanik");
const MechanikDTO = require("../dto/MechanikDTO");

const {Op, where} = require("sequelize");
const EmailConflictError = require("../Errors/EmailError");
const sequelize = require("../db/db");
const {Wizyta} = require("../models");



const searchByNameFNameL = async ({ imie, nazwisko, page = 1, limit = 5 }) => {
    const where = {
        admin: false,
    };

    const hasImie = imie && imie.trim() !== "";
    const hasNazwisko = nazwisko && nazwisko.trim() !== "";

    if (!hasImie && !hasNazwisko) {
        throw new Error("Podaj imię lub nazwisko");
    }

    if (hasImie) {
        where.Imie = { [Op.like]: `${imie.trim()}%` };
    }

    if (hasNazwisko) {
        where.Nazwisko = { [Op.like]: `${nazwisko.trim()}%` };
    }

    const offset = (page - 1) * limit;


    const rows = await Mechanik.findAll({
        where,
        limit,
        offset,
    });


    const total = await Mechanik.count({ where });

    return {
        data: rows.map(MechanikDTO.toSearchDTO),
        total
    };
};

const getAllForWizytaAdmin = async () => {
    const mechanicy = await Mechanik.findAll({ where: { admin: false } });



    return mechanicy.map(MechanikDTO.forWizytaAdmin);
}


const getAllAdmin = async (page = 1, limit = 10) => {

    const offset = (page - 1) * limit;

    const mechanicy = await Mechanik.findAll({
        where: { admin: false },  limit, offset, order: [["Id", "DESC"]] });

    const count = await Mechanik.count();

    return {
        mechanicy: mechanicy.map(MechanikDTO.forWizytaAdmin),
        total: count
    }
}


const getByIdAdmin = async (id) => {
    const mechanik = await Mechanik.findOne({where: {Id: id, Admin: false}});

    if (!mechanik) {
        throw new Error("Mechanik not found");
    }

    return MechanikDTO.szczegolyDTO(mechanik);
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


const editAdmin = async (id, body ) => {

    const daneWalidowane = await walidacjaMechanik(body, id);

    await Mechanik.update(
        daneWalidowane,
        { where: { Id: id , Admin: false } },
    );

    return { message: "Dane zostały zaktualizowane" };

}

const dodajAdmin = async ( body) => {
    const daneWalidowane = await walidacjaMechanik(body);


    const mechanik = await Mechanik.create(daneWalidowane);
    if (!mechanik) {
        throw Error("Mechanik niedodany");
    }

    return { message: "Dane zostały dodane" };

}

const usunAdmin = async (id) => {

    const transakcja = await sequelize.transaction();

    try {
        await Wizyta.destroy({where: {Mechanik_id: id}, transaction: transakcja});

        const mechanik = await Mechanik.destroy({where: {Id: id, Admin: false}, transaction: transakcja});
        if (mechanik === 0) {
            throw Error("Mechanik nieusunięty");
        }

        await transakcja.commit();

        return mechanik;


    } catch (e) {
        await transakcja.rollback()
        throw e
    }


}



module.exports = {
    searchByNameFNameL,
    getAllForWizytaAdmin,
    getAllAdmin,
    getByIdAdmin,
    editAdmin,
    dodajAdmin,
    usunAdmin
};
