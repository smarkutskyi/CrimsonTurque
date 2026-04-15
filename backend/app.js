// var createError = require('http-errors');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

const express = require('express');

const app = express();

const cors = require("cors");
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
})); // to musi być bo pozwala Reactowi łączyć się z backendem jeśli maja rózne porty

app.use(express.json());


const session = require("express-session");
app.use(session({
    name: 'session',
    secret: "bardzoMocnyKlucz",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        httpOnly: true,
        maxAge: 3600000,
    }
}));

const sequelize = require("./db/db");
sequelize.sync()
    .then(() => {
        console.log("Baza danych zsynchronizowana");
    })
    .catch(err => {

        console.error("Błąd synchronizacji bazy:", err);

    });


const mechanikRouter = require('./routes/mechanik');
app.use('/crimsonTorque/mechanik', mechanikRouter);

const authRoute = require("./routes/auth");
app.use("/crimsonTorque/auth", authRoute);

const wizytaRoute = require("./routes/wizyta");
app.use("/crimsonTorque/wizyta", wizytaRoute);

const samochodRouter = require("./routes/samochod");
app.use("/crimsonTorque/samochod", samochodRouter);

//to na dole musi być, bo express patrzy na to co jest pierwsze)))
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});





module.exports = app;
