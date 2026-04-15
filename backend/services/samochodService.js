
const {Samochod, Wizyta, Mechanik} = require("../models");
const sequelize = require("../db/db");
const SamochodDTO = require("../dto/SamochodDTO");
const {Op} = require("sequelize");

const allForClientWizyty = async (id) => {

    const samochody = await Samochod.findAll( {
        include: [{
            model: Wizyta,
            where: {Mechanik_id: id}
        }]
    });

    if (!samochody) {
        throw Error("Not Found");
    }

    return samochody.map((samochod) => SamochodDTO.allForClientWizyty(samochod));

};

const allForClientCarList = async (id, page = 1, limit = 9) => {

    const offset = (page - 1) * limit;

    const samochody = await Samochod.findAll( {
        include: [{
            model: Wizyta,
            where: {Mechanik_id: id}
        }], limit, offset, order: [["id", "DESC"]]
    });

    const total = await Samochod.count({
        distinct: true,
        col: "Id",
        include: [{
            model: Wizyta,
            where: {Mechanik_id: id}
        }]
    });



    return {
        samochody: samochody.map((samochod) => SamochodDTO.allForClientCarList(samochod)),
        total: total
    };


};

const szczegoly = async (id, mechanikId) => {

    const samochod = await Samochod.findOne({
        where: {Id: id},
        include: [{
            model: Wizyta,
            where: {Mechanik_id: mechanikId}
        }]
    })

    if (!samochod) {
        throw Error("Not Found");
    }
    return SamochodDTO.szczegoly(samochod);

}


const usunSamochod = async (samochodId, mechanikId) => {

    const transakcja = await sequelize.transaction();

    try {

        const samochod = await Samochod.findOne({
            where: {Id: samochodId},
            transaction: transakcja,
            include: [{
                model: Wizyta,
                where: {Mechanik_id: mechanikId}
            }]
        });


        if (!samochod) {
            throw  Error("Samochód nie istnieje");
        }


        await Wizyta.destroy({
            where: { Samochod_id: samochodId },
            transaction: transakcja
        });


        await Samochod.destroy({
            where: { Id: samochodId },
            transaction: transakcja
        });


        await transakcja.commit();

        return { message: "Samochód i wszystkie powiązane wizyty zostały usunięte" };
    } catch (e) {
        await transakcja.rollback();
        throw e;
    }
};


const walidacjaNumerRejVin = async (numerRejestracyjny, vin, mechanikId, samochodId) => {

    if (!samochodId) {
        throw  Error("Brak ID samochodu przy edycji");
    }


    const konfliktRej = await Samochod.findOne({
        where: {
            NumerRejestracyjny: numerRejestracyjny,
            Id: { [Op.ne]: samochodId }
        },
        include: [{
            model: Wizyta,
            where: { Mechanik_id: mechanikId }
        }]
    });

    if (konfliktRej) {
        throw  Error("Inny samochód tego mechanika ma już ten numer rejestracyjny");
    }


    const konfliktVin = await Samochod.findOne({
        where: {
            NumerVin: vin,
            Id: { [Op.ne]: samochodId }
        },
        include: [{
            model: Wizyta,
            where: { Mechanik_id: mechanikId }
        }]
    });

    if (konfliktVin) {
        throw  Error("Inny samochód tego mechanika ma już ten numer VIN");
    }


}


const edytujClient = async (samochodId, mechanikId, body) => {


    const samochod = await Samochod.findOne({
        where: { Id: samochodId },
        include: [{
            model: Wizyta,
            where: { Mechanik_id: mechanikId }
        }]
    });

    if (!samochod) {
        throw new Error("Brak dostępu do tego samochodu");
    }


    await walidacjaNumerRejVin(body.NumerRejestracyjny, body.NumerVin, mechanikId, samochodId);


    await Samochod.update(body, {
        where: { Id: samochodId }
    });

    return { message: "Zmodyfikowano samochód" };
};


const getAllForWizytaAdmin = async () => {

    const samochody = await Samochod.findAll();

    return samochody.map((samochod) => SamochodDTO.allForClientWizyty(samochod));

}

const getAllForCarListAdmin = async (page = 1, limit = 10) => {

    const offset = (page - 1) * limit;

    const samochody = await Samochod.findAll({limit, offset, order : [["Id", "DESC"]]});

    const count = await Samochod.count();

    return {
        samochody: samochody.map((samochod) => (SamochodDTO.allForCarListAdmin(samochod))),
        total: count
    };

}


const szczegolyAdmin = async (id) => {

    const samochod = await Samochod.findOne({where: {Id: id}});

    if (!samochod) {
        throw Error("Brak ID samochod");
    }

    return SamochodDTO.szczegoly(samochod);

}


const edytujAdmin = async (samochodId, body) => {

    const samochod = await Samochod.findOne({
        where: { Id: samochodId }
    });

    if (!samochod) {
        throw new Error("Brak dostępu do tego samochodu");
    }


    await Samochod.update(body, {
        where: { Id: samochodId }
    });

    return { message: "Zmodyfikowano samochód" };
}


const dodajAdmin = async (body) => {

    const samochod = await Samochod.create(body);

    if (samochod === 0) {
        throw Error("Nie dodano");
    }
    return samochod;

}
const usunSamochodAdmin = async (id) => {


    const transakcja = await sequelize.transaction();
    try {

        await Wizyta.destroy({where: {Samochod_id: id}, transaction: transakcja});


        const samochod = await Samochod.destroy({where: {Id: id}, transaction: transakcja});
        if (samochod === 0) {
            throw Error("Nie usunięto");
        }


        await transakcja.commit();

        return samochod;

    } catch (e){

        await transakcja.rollback();
    }



}


module.exports = {
    allForClientWizyty,
    allForClientCarList,
    szczegoly,
    usunSamochod,
    edytujClient,
    getAllForWizytaAdmin,
    getAllForCarListAdmin,
    szczegolyAdmin,
    edytujAdmin,
    dodajAdmin,
    usunSamochodAdmin
}