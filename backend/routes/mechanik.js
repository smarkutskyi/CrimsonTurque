const express = require("express");
const router = express.Router();
const mechanikService = require("../services/mechanikService");
const requireLogin = require("../middleware/requireLogin");
const requireAdmin = require("../middleware/requireAdmin");
const {Mechanik} = require("../models");
const EmailConflictError = require("../Errors/EmailError");


router.get("/search", async (req, res) => {
    try {
        const { imie, nazwisko } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const result = await mechanikService.searchByNameFNameL({
            imie,
            nazwisko,
            page,
            limit
        });

        res.json(result);

    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});



router.get("/admin/all", requireAdmin, async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {

        const mechanicy = await mechanikService.getAllAdmin(page, limit);

        res.status(200).json(mechanicy);

    } catch (e) {
        res.status(400).json({ error: e.message });
    }


});

router.post("/admin/add", requireAdmin, async (req, res) => {


    try {

        const odp = await mechanikService.dodajAdmin(req.body);

        res.status(200).json(odp);

    } catch (e){
        if (e instanceof EmailConflictError) {
            return res.status(409).json({ error: e.message });
        }
        res.status(400).json({ error: e.message });
    }


});

router.delete("/admin/:id", requireAdmin, async (req, res) => {
    try {
        console.log("TUUUUUUUUT");
        const odp = await mechanikService.usunAdmin(req.params.id);

        res.status(200).json(odp);

    } catch (e) {
        res.status(400).json({ error: e.message });
    }


})

router.get("/admin/:id", requireAdmin, async (req, res) => {

    try {

        const mechanicy = await mechanikService.getByIdAdmin(req.params.id);

        res.status(200).json(mechanicy);

    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});


router.put("/admin/:id", requireAdmin, async (req, res) => {



    try {

        const odp = await mechanikService.editAdmin(req.params.id, req.body);

        res.status(200).json(odp);

    }  catch (e) {
        if (e instanceof EmailConflictError) {
            return res.status(409).json({ error: e.message });
        }
        res.status(400).json({ error: e.message });
    }

})

router.get("/allForWizytaAdmin", requireAdmin,async (req, res) => {

    try {

        const mechanicy = await mechanikService.getAllForWizytaAdmin();

        res.status(200).json(mechanicy);

    } catch (e) {
        res.status(400).json({ error: e.message });
    }


});










module.exports = router;
