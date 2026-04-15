const requireAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.status(403).json({ error: "Brak uprawnień admina" });
    }
    next();
};

module.exports = requireAdmin;
