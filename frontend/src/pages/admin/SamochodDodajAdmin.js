import React, {useState} from "react";
import FieldError from "../../components/FieldError";
import {useNavigate} from "react-router-dom";
import TopBarAdmin from "../../components/admin/TopBarAdmin";
import Footer from "../../components/Footer";
import {useTranslation} from "react-i18next";


const SamochodEditAdmin = () => {

    const navigate = useNavigate();

    const [nowySamochod, setNowySamochod] = useState({
        vin: "",
        marka: "",
        model: "",
        nrRejestracyjny: "",
        rokProdukcji: "",
        przebieg: "",
        kolor: "",
    });
    const [errors, setErrors] = useState([]);
    const {t} = useTranslation();




    const add = async () => {

        if (!validateNowySamochod()){
            return;
        }

        const body = {

            NumerVin: nowySamochod.vin,
            Marka: nowySamochod.marka,
            Model: nowySamochod.model,
            NumerRejestracyjny: nowySamochod.nrRejestracyjny,
            RokProdukcji: nowySamochod.rokProdukcji,
            Przebieg: nowySamochod.przebieg,
            Kolor: nowySamochod.kolor

        }

        try {
            const res = await fetch("http://localhost:3001/crimsonTorque/samochod/admin/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(body)
            });


            if (res.status === 403) navigate("/zaloguj");
            if (!res.ok) throw new Error("Błąd przy dodawaniu wizyty");

            navigate("/admin/samochodyList");

        } catch (e) {
            console.error(e);
            alert(e.message)
        }

    }
    const handleNowySamochodChange = (e) => {
        const { id, value } = e.target;
        setNowySamochod(v => ({ ...v, [id]: value }));
    };

    const validateNowySamochod = () => {


        const newErrors = {};

        if (!nowySamochod.vin) {
            newErrors.vin = t("samochod.error_vinRequired");
        } else if (!/^[A-Za-z0-9]{17}$/.test(nowySamochod.vin)) {
            newErrors.vin = t("samochod.error_vinFormat");
        }

        if (!nowySamochod.marka || !nowySamochod.marka.trim()) {
            newErrors.marka = t("samochod.error_brandRequired");
        }

        if (!nowySamochod.model || !nowySamochod.model.trim()) {
            newErrors.model = t("samochod.error_modelRequired");
        }

        if (!nowySamochod.kolor || !nowySamochod.kolor.trim()) {
            newErrors.kolor = t("samochod.error_colorRequired");
        }

        if (!nowySamochod.nrRejestracyjny) {
            newErrors.nrRejestracyjny = t("samochod.error_registrationRequired");
        } else if (!/^[A-Za-z0-9]{1,9}$/.test(nowySamochod.nrRejestracyjny)) {
            newErrors.nrRejestracyjny = t("samochod.error_registrationFormat");
        }

        if (!nowySamochod.rokProdukcji) {
            newErrors.rokProdukcji = t("samochod.error_yearRequired");
        } else if (!/^\d{4}$/.test(nowySamochod.rokProdukcji)) {
            newErrors.rokProdukcji = t("samochod.error_yearFormat");
        }

        if (!nowySamochod.przebieg) {
            newErrors.przebieg = t("samochod.error_mileageRequired");
        } else if (!/^\d+$/.test(nowySamochod.przebieg)) {
            newErrors.przebieg = t("samochod.error_mileageFormat");
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };



    return (
        <div>
            <TopBarAdmin/>
            <header>
                <h1>{t("samochod.dodaj")}</h1>
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
                        <button className="submitBtn" onClick={() =>  add()}>{t("wizyty.zapisz")}</button>
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

            <Footer />
        </div>
    );


}

export default SamochodEditAdmin;