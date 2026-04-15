const {Wizyta, Samochod, Mechanik} = require('../models');
const WizytaDTO = require('../dto/wizytaDTO');
const sequelize = require("../db/db");

const clientWizyta = async (id, page = 1, limit = 5) => {

    const offset = (page - 1) * limit;

    const wizyty = await Wizyta.findAll({
        where: {
            Mechanik_id: id
        },
        include: [
            {
                model: Samochod
            }
        ], limit, offset, order: [["Id", "DESC"]]});



    const count = await Wizyta.count({
        where: { Mechanik_id: id }
    });




    return {
        data : wizyty.map((w) => WizytaDTO.clientWizytaDTO(w)),
        total: count
    };
}

const remove = async (wizytaId, mechanikId) => {
    const transakcja = await sequelize.transaction();
    try {
        const wizyta = await Wizyta.findOne({
            where: { Id: wizytaId, Mechanik_id: mechanikId},
            include: [{
                model: Samochod
            }],
            transaction: transakcja
        });

        if (!wizyta) throw Error("Nie znaleziono wizyty");

        const samochodId = wizyta.Samochod.Id;
        if (!samochodId) throw Error("Wizyta nie ma przypisanego samochodu");

        await Wizyta.destroy({ where: { Id: wizytaId }, transaction: transakcja });

        const ileWizyt = await Wizyta.count({
            where: { Samochod_id: samochodId },
            transaction: transakcja
        });

        if (ileWizyt === 0) {
            await Samochod.destroy({ where: { Id: samochodId }, transaction: transakcja });
        }

        await transakcja.commit();
        return true;
    } catch (e) {
        await transakcja.rollback();
        throw e;
    }
};

const szegoly = async (id, mechanikId) => {

    const wizyta = await Wizyta.findOne({
        where:{
            Id: id,
            Mechanik_id: mechanikId
        },
        include: [{model: Samochod}]});


    if (!wizyta) {
        throw  Error("Wizyta not found");
    }

    return WizytaDTO.szczegolyDTO(wizyta);
}

const update = async (wizytaId, body, mechanikId) => {

    walidacjaCzasu();


    const wizyta = await Wizyta.findOne({
        where: {
            Id: wizytaId,
            Mechanik_id: mechanikId
        }
    });


    if (!wizyta) {
        throw  Error("Wizyta not found");
    }


    const samochod = await Samochod.findOne({
        where: {
            Id: body.Samochod_id,
        }, include: [{
            model: Wizyta,
            where: {Mechanik_id: mechanikId}
        }]
    });

    if (!samochod) {
        throw Error("Samochód nie należy do tego mechanika lub nie istnieje");
    }



    const result = await Wizyta.update(body, {
        where: {
            Id: wizytaId,
            Mechanik_id: mechanikId
        }, returning: true
    });

    return result;

}

const dodajClient = async (mechanikId, body) => {


    body.Mechanik_id = mechanikId;

    walidacjaCzasu(body.CzasRozpoczecia, body.CzasZakonczenia, body.Status);



    const samochod = await Samochod.findOne({
        where: {
            Id: body.Samochod_id,
        }, include: [{
            model: Wizyta,
            where: {Mechanik_id: mechanikId}
        }]
    });



    if (!samochod) {
        throw Error("Samochód nie należy do tego mechanika lub nie istnieje");
    }

    const result = await Wizyta.create(body);

    return result;

}



const walidacjaCzasu = (czasRoz, czasZak, status) =>{

    if (!czasZak && status) {
        throw Error("Wizyta jeśli wizyta ma czas Zakończenia to musi mieć status true ");
    }

    if (!czasZak || !czasRoz) {
        return;
    }

    const start = new Date(czasRoz);
    const end = new Date(czasZak);

    if (end && end < start ){
        throw Error("Czas rozpoczęcia nie może być późniejszy od czasu Zakończenia")
    }
}

const walidacjaNumerRejVin = async (numerRejestracyjny, vin, mechanikId) => {

    const numereRej = await Samochod.findOne({
        where: {
            NumerRejestracyjny: numerRejestracyjny
        }, include: [{
            model: Wizyta,
            where: {Mechanik_id: mechanikId}
        }]
    });
    if (numereRej) {
        throw Error("Już jest samochód z tym numerem Rejestracyjnym dla tego użytkownka: " + mechanikId);
    }

    const numerVin = await Samochod.findOne({
        where: {
            NumerVin: vin
        }, include: [{
            model: Wizyta,
            where: {Mechanik_id: mechanikId}
        }]
    });
    if (numerVin) {
        throw Error("Już jest samochód z tym numerem Rejestracyjnym dla tego użytkownka: " + mechanikId);
    }


}


const dodajWithCarClient = async (mechanikId, body) => {



    walidacjaCzasu(body.dataWizyta.CzasRozpoczecia, body.dataWizyta.CzasZakonczenia, body.dataWizyta.Status);

    await walidacjaNumerRejVin(body.dataSamochod.NumerRejestracyjny, body.dataSamochod.NumerVin, mechanikId);

    const transakcja = await sequelize.transaction();

    try {
        const nowySamochod = await Samochod.create(body.dataSamochod, {transaction : transakcja});

        body.dataWizyta.Mechanik_id = mechanikId;
        body.dataWizyta.Samochod_id = nowySamochod.Id;


        const nowaWizyta = await Wizyta.create(body.dataWizyta, {transaction : transakcja});

        await transakcja.commit();

    } catch (e) {
        await transakcja.rollback();
        console.log(e.message);
        throw e;
    }

}

const szczegolySamochodClient = async (samochodId, mechanikId, page= 1, limit = 10) => {

    const offset = (page - 1) * limit;

    const wizyty = await Wizyta.findAll({
        where: {
            Mechanik_id: mechanikId,
            Samochod_id: samochodId,
        }, limit, offset, order: [["Id", "DESC"]]
    });

    const count = await Wizyta.count({
        where: {
            Mechanik_id: mechanikId,
            Samochod_id: samochodId,
        }});

    return {
        wizyty : wizyty.map(w => WizytaDTO.samochodSzczegolyDTO(w)),
        total : count,
    };

}

const getAllForAdmin = async (page = 1, limit = 10) => {

    const offset = (page - 1) * limit;


    const wizyta = await Wizyta.findAll({
        include: [
            {model: Samochod},
            {model: Mechanik}
        ], limit, offset, order : [["Id", "DESC"]]
    });

    const count = await Wizyta.count();


    return {
        wizyty: wizyta.map(w => WizytaDTO.listaAdminDTO(w)),
        total: count
    };
}

const getByIdAdmin = async (id) => {

    const wizyta = await Wizyta.findOne({
        where: {
            Id: id
        }, include: [
            {model: Samochod},
            {model: Mechanik}
        ]
    });

    if (!wizyta) {
        throw Error("Not Found");
    }



    return WizytaDTO.szczegolyAdminDTO(wizyta)

};

const updateAdmin = async (wizytaId, body) => {

    walidacjaCzasu();


    const wizyta = await Wizyta.findOne({
        where: {
            Id: wizytaId
        }
    });


    if (!wizyta) {
        throw  Error("Wizyta not found");
    }


    const samochod = await Samochod.findOne({
        where: {
            Id: body.Samochod_id,
        }, include: [{
            model: Wizyta
        }]
    });

    if (!samochod) {
        throw Error("Samochód nie należy do tego mechanika lub nie istnieje");
    }



    const result = await Wizyta.update(body, {
        where: {
            Id: wizytaId
        }
    });

    return result;


}

const dodajAdmin = async (body) => {





    walidacjaCzasu(body.CzasRozpoczecia, body.CzasZakonczenia, body.Status);


    const  transakcja =  await sequelize.transaction();

    try {


        const samochod = await Samochod.findOne({
            where: {
                Id: body.Samochod_id,
            }
        });

        if (!samochod) {
            throw Error("Samochód nie istnieje");
        }


        const mechanik = await Mechanik.findByPk(body.Mechanik_id);

        if (!mechanik) {
            throw Error("Mechanik nie istnieje");
        }

        const result = await Wizyta.create(body);

        await transakcja.commit();

        return result;

    } catch (e) {
        await transakcja.rollback();
        throw e;
    }

}

const removeAdmin = async (id) => {

    const odp = await Wizyta.destroy({where: {
        Id: id}
    });

    if (odp === 0) {
        throw Error("Not Found");
    }
    return odp;

}


const getForCarAdmin = async (page = 1, limit = 10, samochodId) => {

    const offset = (page - 1) * limit;


    const wizyta = await Wizyta.findAll({
        include: [
            {model: Samochod, where: {Id: samochodId}},
            {model: Mechanik}
        ], limit, offset, order : [["Id", "DESC"]]
    });

    const count = await Wizyta.count({
        include: [
            {model: Samochod, where: {Id: samochodId}}
        ]
    });


    return {
        wizyty: wizyta.map(w => WizytaDTO.listaAdminDTO(w)),
        total: count
    };
}

const getForMechanikAdmin = async (page = 1, limit = 10, mechanikId) => {


    const offset = (page - 1) * limit;


    const wizyty = await Wizyta.findAll({
        include: [
            {model: Samochod},
            {model: Mechanik, where: {Id: mechanikId}}
        ], limit, offset, order : [["Id", "DESC"]]
    });

    const count = await Wizyta.count({
        include: [
            {model: Mechanik, where: {Id: mechanikId}}
        ]
    });


    return {
        wizyty: wizyty.map(w => WizytaDTO.listaAdminDTO(w)),
        total: count
    };
}




module.exports = {
    clientWizyta,
    remove,
    szegoly,
    update,
    dodajClient,
    dodajWithCarClient,
    szczegolySamochodClient,
    getAllForAdmin,
    getByIdAdmin,
    updateAdmin,
    dodajAdmin,
    removeAdmin,
    getForCarAdmin,
    getForMechanikAdmin,
}