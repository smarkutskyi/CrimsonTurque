import React, {useEffect, useState} from "react";
import TopBarClient from "../../components/client/TopBarClient";
import FieldError from "../../components/FieldError";
import Footer from "../../components/Footer";
import {useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";


const SamochodEdytujClient = () => {

    const id = useLocation().state;
    const navigate = useNavigate();
    const {t} = useTranslation();

    const [nowySamochod, setNowySamochod] = useState({
        vin: "",
        marka: "",
        model: "",
        nrRejestracyjny: "",
        rokProdukcji: "",
        przebieg: "",
        kolor: ""
    });

    const [errors, setErrors] = useState({});
    const [samochody, setSamochody] = useState([]);

    useEffect(() => {
        pobierzSamochod();
        samochodyDlaWalidacji();
    }, []);

    const pobierzSamochod = async () => {
        try {
            const res = await fetch(
                `http://localhost:3001/crimsonTorque/samochod/${id}`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (res.status === 401) {
                navigate("/zaloguj");
                return;
            }

            if (!res.ok) {
                throw new Error("Nie udało się pobrać samochodu");
            }

            const data = await res.json();

            setNowySamochod({
                vin: data.vin,
                marka: data.marka,
                model: data.model,
                nrRejestracyjny: data.numerRejestracyjny,
                rokProdukcji: data.rokProdukcji,
                przebieg: data.przebieg,
                kolor: data.kolor
            });

        } catch (e) {
            console.error(e);
        }
    };

    const samochodyDlaWalidacji = async () => {

        try {
            const resSamochody = await fetch("http://localhost:3001/crimsonTorque/samochod/allForClientWizyty", {
                method: "GET",
                credentials: "include",
            })

            if (resSamochody.status === 401) {
                navigate("/zaloguj");
            }

            if (!resSamochody.ok){
                throw new Error(resSamochody.statusText);
            }

            const dataSamochody = await resSamochody.json();

            setSamochody(dataSamochody.filter(s => s.id !== id));

        } catch (e) {
            console.error(e.message);
        }
    }


    const handleNowySamochodChange = (e) => {
        const { id, value } = e.target;
        setNowySamochod(v => ({ ...v, [id]: value }));
    };


    const validateNowySamochod = () => {
        const newErrors = {};


        if (!nowySamochod.vin) {
            newErrors.vin = "VIN jest wymagany";
        } else if (!/^[A-Za-z0-9]{17}$/.test(nowySamochod.vin)) {
            newErrors.vin = "VIN musi mieć dokładnie 17 znaków (litery i cyfry)";
        } else if (
            samochody.some(
                s => s.vin?.toUpperCase() === nowySamochod.vin.toUpperCase()
            )
        ) {
            newErrors.vin = "Samochód z takim VIN już istnieje";
        }


        if (!nowySamochod.marka || !nowySamochod.marka.trim()) {
            newErrors.marka = "Marka jest wymagana";
        }

        if (!nowySamochod.model || !nowySamochod.model.trim()) {
            newErrors.model = "Model jest wymagany";
        }

        if (!nowySamochod.kolor || !nowySamochod.kolor.trim()) {
            newErrors.kolor = "Kolor jest wymagany";
        }

        if (!nowySamochod.nrRejestracyjny) {
            newErrors.nrRejestracyjny = "Numer rejestracyjny jest wymagany";
        } else if (!/^[A-Za-z0-9]{1,9}$/.test(nowySamochod.nrRejestracyjny)) {
            newErrors.nrRejestracyjny =
                "Numer rejestracyjny może mieć max 9 znaków (litery i cyfry)";
        } else if (
            samochody.some(
                s =>
                    s.numerRejestracyjny?.toUpperCase() ===
                    nowySamochod.nrRejestracyjny.toUpperCase()
            )
        ) {
            newErrors.nrRejestracyjny =
                "Samochód z takim numerem rejestracyjnym już istnieje";
        }


        if (!nowySamochod.rokProdukcji) {
            newErrors.rokProdukcji = "Rok produkcji jest wymagany";
        } else if (!/^\d{4}$/.test(nowySamochod.rokProdukcji)) {
            newErrors.rokProdukcji = "Rok produkcji musi mieć 4 cyfry";
        }


        if (!nowySamochod.przebieg) {
            newErrors.przebieg = "Przebieg jest wymagany";
        } else if (!/^\d+$/.test(nowySamochod.przebieg)) {
            newErrors.przebieg = "Przebieg musi być liczbą";
        }


        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const zapisz = async () => {
        if (!validateNowySamochod()) return;

        try {
            const res = await fetch(
                `http://localhost:3001/crimsonTorque/samochod/${id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        NumerVin: nowySamochod.vin,
                        Marka: nowySamochod.marka,
                        Model: nowySamochod.model,
                        NumerRejestracyjny: nowySamochod.nrRejestracyjny,
                        RokProdukcji: nowySamochod.rokProdukcji,
                        Przebieg: nowySamochod.przebieg,
                        Kolor: nowySamochod.kolor
                    })
                }
            );

            if (res.status === 401) {
                navigate("/zaloguj");
                return;
            }

            if (!res.ok) {
                throw new Error("Błąd przy zapisie samochodu");
            }

            navigate(-1);

        } catch (e) {
            console.error(e);
            alert(e.message);
        }
    };

    return (
        <div>

            <TopBarClient/>
            <header>
                <h1>{t("samochod.smEdytuj")}</h1>
            </header>

            <main>
                <section className="edyt-box">


                    <div className="field">
                        <label htmlFor="vin">VIN</label>
                        <input
                            className={errors.vin ? "errorField" : ""}
                            type="text"
                            id="vin"
                            placeholder={t("samochod.numerVin")}
                            value={nowySamochod.vin}
                            onChange={handleNowySamochodChange}
                        />
                        <FieldError message={errors.vin} />
                    </div>

                    <div className="field">
                        <label htmlFor="marka">{t("samochod.marka")}</label>
                        <input
                            className={errors.marka ? "errorField" : ""}
                            type="text"
                            id="marka"
                            placeholder={t("samochod.placeMarka")}
                            value={nowySamochod.marka}
                            onChange={handleNowySamochodChange}
                        />
                        <FieldError message={errors.marka} />
                    </div>

                    <div className="field">
                        <label htmlFor="model">Model</label>
                        <input
                            className={errors.model ? "errorField" : ""}
                            type="text"
                            id="model"
                            placeholder={t("samochod.placeModel")}
                            value={nowySamochod.model}
                            onChange={handleNowySamochodChange}
                        />
                        <FieldError message={errors.model} />
                    </div>

                    <div className="field">
                        <label htmlFor="nrRejestracyjny">{t("samochod.nrRejestracyjny")}</label>
                        <input
                            className={errors.nrRejestracyjny ? "errorField" : ""}
                            type="text"
                            id="nrRejestracyjny"
                            placeholder="ABC 1234"
                            value={nowySamochod.nrRejestracyjny}
                            onChange={handleNowySamochodChange}
                        />
                        <FieldError message={errors.nrRejestracyjny} />
                    </div>

                    <div className="field">
                        <label htmlFor="rokProdukcji">{t("samochod.rokProdukcji")}</label>
                        <input
                            className={errors.rokProdukcji ? "errorField" : ""}
                            type="text"
                            id="rokProdukcji"
                            placeholder="2020"
                            value={nowySamochod.rokProdukcji}
                            onChange={handleNowySamochodChange}
                        />
                        <FieldError message={errors.rokProdukcji} />
                    </div>

                    <div className="field">
                        <label htmlFor="przebieg">{t("samochod.przebieg")} (km)</label>
                        <input
                            className={errors.przebieg ? "errorField" : ""}
                            type="text"
                            id="przebieg"
                            placeholder="np. 45000"
                            value={nowySamochod.przebieg}
                            onChange={handleNowySamochodChange}
                        />
                        <FieldError message={errors.przebieg} />
                    </div>

                    <div className="field full-width">
                        <label htmlFor="kolor">{t("samochod.kolor")}</label>
                        <input
                            className={errors.kolor ? "errorField" : ""}
                            type="text"
                            id="kolor"
                            placeholder={t("samochod.placeKolor")}
                            value={nowySamochod.kolor}
                            onChange={handleNowySamochodChange}
                        />
                        <FieldError message={errors.kolor} />
                    </div>




                    <div id="przyciski">
                        <button className="submitBtn" onClick={zapisz}>
                            {t("wizyta.zapisz")}
                        </button>
                        <button
                            className="submitBtn"
                            onClick={() => navigate(-1)}
                        >
                            {t("anuluj")}
                        </button>
                    </div>
                    {Object.keys(errors).length > 0 && (
                        <div id="errSummary">
                            {t("addMechanik.errorsSummary")}
                        </div>
                    )}



                </section>
            </main>

            <Footer/>
        </div>
    );

}



export default SamochodEdytujClient;