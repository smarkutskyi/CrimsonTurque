const express = require('express');
const routes = express.Router();
const samochodService = require('../services/samochodService');
const requireLogin = require("../middleware/requireLogin");

const requireAdmin = require("../middleware/requireAdmin");


routes.get("/allForClientWizyty", requireLogin, async (req, res) => {
    try {
        const samochody = await samochodService.allForClientWizyty(req.session.user.id);

        res.status(200).json(samochody);

    } catch (e) {
        res.status(404).send({"message": "Not Found"});
    }

});

routes.get("/allForClientLista", requireLogin, async (req, res) => {
   try {

       const page = parseInt(req.query.page) || 1;
       const limit = parseInt(req.query.limit) || 5;

       const samochody = await samochodService.allForClientCarList(req.session.user.id, page, limit);

       res.status(200).json(samochody);
   } catch (e) {
       res.status(400).send({message: e.message});
   }

});

routes.get("/allForWizytyAdmin", requireAdmin, async (req, res) => {



    try {

        const samochody = await samochodService.getAllForWizytaAdmin();

        res.status(200).json(samochody);

    } catch (e) {
        res.status(404).send({"error": "Not Found"});
    }
});

routes.get("/admin/all", requireAdmin, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    try {

        const samochody = await samochodService.getAllForCarListAdmin(page, limit);

        res.status(200).json(samochody);

    } catch (e) {
        res.status(400).send({"message": e.message});
    }

})

routes.post("/admin/add", requireAdmin, async (req, res) => {

    console.log("KSDJSLKJDSKLJD");
    try {
        const odp = await samochodService.dodajAdmin(req.body);

        res.status(200).json(odp);

    } catch (e) {
        res.status(400).send({"message": e.message});
    }

});

routes.get("/admin/:id", requireAdmin, async (req, res) => {

    try {

        const samochod = await samochodService.szczegolyAdmin(req.params.id);

        res.status(200).json(samochod);

    } catch (e) {
        res.status(400).send({"message": e.message});
    }
})

routes.put("/admin/:id", requireAdmin, async (req, res) => {
    try {

        const odp = await samochodService.edytujAdmin(req.params.id, req.body);


        res.status(200).json(odp);
    } catch (e){
        res.status(400).send({message: e.message});
    }


});

routes.delete("/admin/:id", requireAdmin, async (req, res) => {


    try {
        const message = await samochodService.usunSamochodAdmin(req.params.id);

        res.status(200).json(message);

    } catch (e) {
        res.status(400).send({message: e.message});
    }
})

routes.get("/:id", requireLogin, async (req, res) => {

    try {
        const samochod = await samochodService.szczegoly(req.params.id, req.session.user.id);

        res.status(200).json(samochod);
    } catch (e) {
        res.status(400).send({message: e.message});
    }
});


routes.delete("/:id", requireLogin, async (req, res) => {

    try {
        const message = await samochodService.usunSamochod(req.params.id, req.session.user.id);

        res.status(200).json(message);

    } catch (e) {
        res.status(400).send({message: e.message});
    }

});


routes.put("/:id", requireLogin, async (req, res) => {
    try {

        const odp = await samochodService.edytujClient(req.params.id, req.session.user.id, req.body);


        res.status(200).json(odp);
    } catch (e){
        res.status(400).send({message: e.message});
    }
});


module.exports = routes;