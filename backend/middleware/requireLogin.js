const requireLogin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== "mechanik") {
        return res.status(401).json({ error: "Brak logowania" });
    }
    next();
};

module.exports = requireLogin;
