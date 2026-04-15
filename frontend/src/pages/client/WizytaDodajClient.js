import React, {useEffect, useState} from "react";
import FieldError from "../../components/FieldError";
import {data, useNavigate} from "react-router-dom";
import TopBarClient from "../../components/client/TopBarClient";
import Footer from "../../components/Footer";
import {useTranslation} from "react-i18next";



const WizytaDodajClient = () => {
    const navigate = useNavigate();

    const [samochody, setSamochody] = useState([]);
    const [form, setForm] = React.useState({
        samochodId : "",
        czas_start: "",
        czas_koniec: "",
        status: "Zaplanowana",
        koszt: "",
        opis: ""
    });
    const [errors, setErrors] = React.useState({});
    const {t} = useTranslation();

    const [trybSamochodu, setTrybSamochodu] = useState("wybierz");
    const [nowySamochod, setNowySamochod] = useState({
        vin: "",
        marka: "",
        model: "",
        nrRejestracyjny: "",
        rokProdukcji: "",
        przebieg: "",
        kolor: "",
    });



    const pobierz = async () => {

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
            setSamochody(dataSamochody);

        } catch (e) {
            console.error(e.message);
        }

    };

    useEffect(() => {
        pobierz()


    }, []);




    const handleChange = (e) => {
        const {id, value} = e.target;
        setForm(v => ({ ...v, [id]: value }));
    }

    const handleNowySamochodChange = (e) => {
        const { id, value } = e.target;
        setNowySamochod(v => ({ ...v, [id]: value }));
    };

    const validateWizyta = () => {
        const errors = {};



        if (trybSamochodu === "wybierz" && !form.samochodId) {
            errors.samochodId = t("wizyta.error_selectCar");
        }



        if (!form.czas_start) {
            errors.czas_start = t("wizyta.error_startTime");
        }

        if (!form.opis || !form.opis.trim()) {
            errors.opis = t("wizyta.error_visitDescription");
        }

        if (!form.koszt) {
            errors.koszt = t("wizyta.error_costRequired");
        } else if (!/^\d{1,10}([.,]\d{1,2})?$/.test(form.koszt)) {
            errors.koszt = t("wizyta.error_costFormat");
        }

        const start = form.czas_start ? new Date(form.czas_start) : null;
        const end = form.czas_koniec ? new Date(form.czas_koniec) : null;

        if (form.status === "Zakończona" && !form.czas_koniec) {
            errors.czas_koniec = t("wizyta.error_endTimeRequired");
        }

        if (start && end && end < start) {
            errors.czas_koniec = t("wizyta.error_endBeforeStart");
            errors.czas_start = t("wizyta.error_startAfterEnd");
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateNowySamochod = () => {
        const newErrors = {};


        if (!nowySamochod.vin) {
            newErrors.vin = t("samochod.error_vinRequired");
        } else if (!/^[A-Za-z0-9]{17}$/.test(nowySamochod.vin)) {
            newErrors.vin = t("samochod.error_vinFormat");
        } else if (samochody.some(s => s.vin?.toUpperCase() === nowySamochod.vin.toUpperCase())) {
            newErrors.vin = t("samochod.error_vinExists");
        }

        if (!nowySamochod.marka) {
            newErrors.marka = t("samochod.error_brandRequired");
        }

        if (!nowySamochod.model) {
            newErrors.model = t("samochod.error_modelRequired");
        }

        if (!nowySamochod.nrRejestracyjny) {
            newErrors.nrRejestracyjny = t("samochod.error_registrationRequired");
        } else if (!/^[A-Za-z0-9]{1,9}$/.test(nowySamochod.nrRejestracyjny)) {
            newErrors.nrRejestracyjny = t("samochod.error_registrationFormat");
        } else if (
            samochody.some(
                s => s.numerRejestracyjny?.toUpperCase() === nowySamochod.nrRejestracyjny.toUpperCase()
            )
        ) {
            newErrors.nrRejestracyjny = t("samochod.error_registrationExists");
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

        if (!nowySamochod.kolor) {
            newErrors.kolor = t("samochod.error_colorRequired");
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };



    const add = async () => {
        if (!validateWizyta()) {
            return;
        }

        const data = {
            Samochod_id: form.samochodId,
            CzasRozpoczecia: form.czas_start ? form.czas_start : null,
            CzasZakonczenia: form.czas_koniec ? form.czas_koniec : null,
            Status: form.status === "Zakończona" ? true : false,
            Koszt: form.koszt,
            Opis: form.opis,
        }

        try {

            const res = await fetch("http://localhost:3001/crimsonTorque/wizyta/addClient", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data)
            });

            if (res.status === 401) {
                navigate("/zaloguj");
            }

            if (!res.ok) {
                throw new Error(res.statusText);
            }

            navigate("/wizyty")


        } catch (e) {
            alert(e.message)
            console.error(e);
        }


    }

    const addWithNewCar = async () => {

        if (!validateNowySamochod()){
            return;
        }

        if (!validateWizyta()) {
            return;
        }


        const body = {
            dataSamochod : {
                NumerVin: nowySamochod.vin,
                Marka: nowySamochod.marka,
                Model: nowySamochod.model,
                NumerRejestracyjny: nowySamochod.nrRejestracyjny,
                RokProdukcji: nowySamochod.rokProdukcji,
                Przebieg: nowySamochod.przebieg,
                Kolor: nowySamochod.kolor,
            },
            dataWizyta : {
                CzasRozpoczecia: form.czas_start ? form.czas_start : null,
                CzasZakonczenia: form.czas_koniec ? form.czas_koniec : null,
                Status: form.status === "Zakończona" ? true : false,
                Koszt: form.koszt,
                Opis: form.opis,
            }
        }

        try {
            const res = await fetch("http://localhost:3001/crimsonTorque/wizyta/addWithCarClient", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(body)
            });


            if (res.status === 401) navigate("/zaloguj");
            if (!res.ok) throw new Error("Błąd przy dodawaniu wizyty");

            navigate("/wizyty");

        } catch (e) {
            console.error(e);
            alert(e.message)
        }

    }



    return (<div>

        <TopBarClient/>
        <header>
            <h1>{t("wizyty.add")}</h1>
        </header>

        <main>
            <section className="edyt-box">

                <div className="field">
                    <label>{t("wizyty.car")}</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="trybSamochodu"
                                value="wybierz"
                                checked={trybSamochodu === "wybierz"}
                                onChange={() => setTrybSamochodu("wybierz")}
                            />
                            <span>{t("wizyty.wybZlisty")}</span>
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="trybSamochodu"
                                value="nowy"
                                checked={trybSamochodu === "nowy"}
                                onChange={() => setTrybSamochodu("nowy")}
                            />
                            <span>{t("wizyty.dodajnowy")} </span>
                        </label>
                    </div>
                </div>


                {trybSamochodu === "wybierz" && (
                    <div className="field">
                        <label htmlFor="samochodId">{t("wizyty.samochodZlisty")}</label>
                        <select
                            className={errors.samochodId ? "errorField" : ""}
                            id="samochodId"
                            onChange={handleChange}
                            value={form.samochodId}
                        >
                            <option value="">-- {t("wybierz")} --</option>
                            {samochody.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.marka} {s.model} ({s.numerRejestracyjny})
                                </option>
                            ))}
                        </select>
                        <FieldError message={errors.samochodId} />
                    </div>
                )}

                {trybSamochodu === "nowy" && (
                    <>
                        <div className="field">
                            <label htmlFor="vin">VIN</label>
                            <input
                                className={errors.vin ? "errorField" : ""}
                                type="text"
                                id="vin"
                                placeholder="Numer VIN"
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
                            <label htmlFor="przebieg">Przebieg (km)</label>
                            <input
                                className={errors.przebieg ? "errorField" : ""}
                                type="text"
                                id="przebieg"
                                placeholder="45000"
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
                    </>
                )}



                <div className="field">
                    <label htmlFor="czas_start">{t("wizyty.czasRoz")}</label>
                    <input
                        className={errors.czas_start ? "errorField" : ""}
                        type="datetime-local"
                        id="czas_start"
                        onChange={handleChange}
                    />
                    <FieldError message={errors.czas_start}/>
                </div>

                <div className="field">
                    <label htmlFor="czas_koniec">{t("wizyty.czasZak")}</label>
                    <input
                        className={errors.czas_koniec ? "errorField" : ""}
                        type="datetime-local"
                        id="czas_koniec"
                        onChange={handleChange}

                    />
                    <FieldError message={errors.czas_koniec}/>
                </div>


                <div className="field">
                    <label htmlFor="status">{t("wizyty.status")}</label>
                    <select
                        className={errors.status ? "errorField" : ""}
                        id="status"
                        onChange={handleChange}
                    >
                        <option value="Zaplanowana">{t("wizytaStatus.zaplanowana")}</option>
                        <option value="Zakończona">{t("wizytaStatus.zakonczona")}</option>
                    </select>
                    <FieldError message={errors.status}/>
                </div>


                <div className="field">
                    <label htmlFor="koszt">{t("wizyty.koszt")}</label>
                    <input
                        className={errors.koszt ? "errorField" : ""}
                        type="text"
                        id="koszt"

                        onChange={handleChange}
                    />
                    <FieldError message={errors.koszt}/>
                </div>


                <div className="field">
                    <label htmlFor="opis">{t("wizyty.opis")}</label>
                    <textarea
                        className={errors.opis ? "errorField" : ""}
                        id="opis"
                        onChange={handleChange}
                    />
                    <FieldError message={errors.opis}/>
                </div>

                <div id="przyciski">
                    <button className="submitBtn" onClick={() => trybSamochodu === "wybierz" ? add() : addWithNewCar() }>{t("wizyty.zapisz")}</button>
                    <button
                        className="submitBtn"
                        onClick={() => navigate(-1)}
                    >
                        {t("anuluj")}
                    </button>
                </div>
                {Object.keys(errors).length > 0 && (
                    <div id="errSummary">
                        {t("addmechanik.errorsSummary")}
                    </div>
                )}



            </section>
        </main>
        <Footer/>
    </div>);
}


export default WizytaDodajClient;