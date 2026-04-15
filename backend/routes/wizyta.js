const express = require('express');
const requireLogin = require("../middleware/requireLogin");
const routes = express.Router();
const wizytaService = require("../services/wizytaService");
const {szczegolySamochodClient} = require("../services/wizytaService");
const requireAdmin = require("../middleware/requireAdmin");




routes.get("/allForAdmin", requireAdmin, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;


    try {
        const data = await wizytaService.getAllForAdmin(page, limit);



        res.status(200).json(data);

    } catch (e) {
        res.status(400).send(e.message);
    }

});

routes.get("/clientPage", requireLogin, async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const wizyty = await wizytaService.clientWizyta(req.session.user.id, page, limit);
        res.status(200).json(wizyty);

    } catch (e) {
        res.status(404).send(e.message);
    }
});




routes.post("/addClient", requireLogin, async (req, res) => {

    try {

        const count = await wizytaService.dodajClient(req.session.user.id, req.body);

        res.status(200).json(count);

    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

routes.post("/addWithCarClient", requireLogin, async (req, res) => {
    try {

        await wizytaService.dodajWithCarClient(req.session.user.id, req.body);

        res.sendStatus(200);


    } catch (e) {
       res.status(400).send(e.message);
    }
});

routes.get("/forSzczegolySamochodClient/:id", requireLogin, async (req, res) => {

    const page = parseInt(req.query.page) || null;
    const limit = parseInt(req.query.limit) || null;

    try {


        const wizyty = await szczegolySamochodClient(req.params.id, req.session.user.id, page, limit);

        res.status(200).json(wizyty);

    } catch (e) {
        res.status(400).send(e.message);
    }
});

routes.get("/admin/forCar/:id", requireAdmin, async (req, res) => {



    const page = parseInt(req.query.page) || null;
    const limit = parseInt(req.query.limit) || null;


    try {

        const odp = await wizytaService.getForCarAdmin(page, limit, req.params.id);
        res.status(200).json(odp);

    } catch (e) {
        res.status(400).send(e.message);
    }
});

routes.get("/admin/forMechanik/:id", requireAdmin, async (req, res) => {

    const page = parseInt(req.query.page) || null;
    const limit = parseInt(req.query.limit) || null;


    try {

        const odp = await wizytaService.getForMechanikAdmin(page, limit, req.params.id);
        res.status(200).json(odp);

    } catch (e) {
        res.status(400).send(e.message);
    }
})

routes.delete("/admin/:id", requireAdmin, async (req, res) => {


    try {

        const odp = await wizytaService.removeAdmin(req.params.id);

        res.status(200).json(odp);

    } catch (e) {
        res.status(400).send(e.message);
    }

})

routes.get("/admin/:id", requireAdmin, async (req, res) => {

    try {

        const wizyta = await wizytaService.getByIdAdmin(req.params.id);

        res.status(200).json(wizyta);

    } catch (e) {
        res.status(404).send(e.message);
    }

});

routes.put("/admin/:id", requireAdmin, async (req, res) => {

    try {


        const odp = await wizytaService.updateAdmin(req.params.id, req.body);

        res.status(200).json(odp);


    } catch (e) {
        res.status(404).send(e.message);
    }

});

routes.post("/admin/add", requireAdmin, async (req, res) => {


    try {

        const odp = await wizytaService.dodajAdmin(req.body);

        res.status(200).json(odp);


    } catch (e) {
        res.status(400).send(e.message);
    }

});

routes.delete("/:id", requireLogin, async (req, res) => {

    const deleted = await wizytaService.remove(req.params.id, req.session.user.id);

    if (deleted === 0) {
        return res.status(404).send("Nie znaleziono wizyty");
    }

    res.status(200).json({message: "Wizyta usunięta"});

});




routes.get("/:id", requireLogin, async (req, res) => {

    try {
        const wizyta = await wizytaService.szegoly(req.params.id, req.session.user.id);

        res.status(200).json(wizyta);

    } catch (e){
        res.status(404).send("Nie znaleziono wizyty");
    }


});


routes.put("/:id", requireLogin, async (req, res) => {

    try {
        const row = await wizytaService.update(req.params.id, req.body, req.session.user.id);

        res.status(200).json(row);

    } catch (e) {
        res.status(404).send(e.message);
    }


});







module.exports = routes;
