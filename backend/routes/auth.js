const express = require("express");
const router = express.Router();
const authService = require("../services/authService");
const requireLogin = require("../middleware/requireLogin");

const requireAdmin = require("../middleware/requireAdmin");
const EmailConflictError = require("../Errors/EmailError");



router.post("/login", async (req, res) => {
    // console.log("Jestes tu");

    try {
        const [authSes, authSend] = await authService.login(req.body);

        req.session.user = authSes;

        res.status(200).send(authSend);

    } catch (e){
        return res.status(401).json({ error: e.message });
    }


    // console.log(new Date().toISOString());

    // console.log("SESSION AFTER LOGIN:", req.session);

});

router.post("/logout", requireLogin, (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("session");
        res.status(200).json({ message: "Wylogowano" });
    });
});


router.post("/admin/logout", requireAdmin, (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("session");
        res.status(200).json({ message: "Wylogowano" });
    });
});

// to dla testu
router.get("/meTest", requireLogin, async (req, res) => {
    console.log("SESSION AFTER LOGIN:", req.session);
    try {

        res.status(200).json({
            session: req.session,
            role: req.session.user.role,
        });

    } catch (e){
        res.status(401).json({ error: e.message });
    }

});

router.get("/me", requireLogin, async (req, res) => {
    try {

        const mechanik = await authService.getUserProfile(req.session.user.id);

        res.status(200).json(mechanik);

    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

router.put("/editMe", requireLogin, async (req, res) => {


    try {
        const message = await authService.edit(req.session.user.id, req.body);

        res.status(200).json(message);
    }  catch (e) {
        if (e instanceof EmailConflictError) {
            return res.status(409).json({ error: e.message });
        }
        res.status(400).json({ error: e.message });
    }

});



router.post("/rejestracja", async (req, res) => {

    try {
        console.log("W ruterze");
        const [authSes, authSend] = await authService.rejestracja(req.body);

        req.session.user = authSes;

        res.status(200).send(authSend);

    } catch (e) {
        if (e instanceof EmailConflictError) {
            return res.status(409).json({ error: e.message });
        }
        res.status(400).json({ error: e.message });
    }


})


router.get("/meAdmin", requireAdmin, async (req, res) => {

    try {
        res.status(200).json({message: "Ty admin)))"});
    } catch (e){
        res.status(500).json({ error: e.message });
    }
})




module.exports = router;
