import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

import FieldError from "../../components/FieldError";
import Footer from "../../components/Footer";
import TopBarClient from "../../components/client/TopBarClient";
import {useTranslation} from "react-i18next";



const WizytaEdytujClient = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const id = location.state;
    const [samochody, setSamochody] = useState([]);
    const [form, setForm] = useState({
        samochodId: "",
        czas_start: "",
        czas_koniec: "",
        status: "",
        koszt: "",
        opis: ""
    });
    const [errors, setErrors] = useState({});
    const {t} = useTranslation();


    useEffect(() => {
        pobierz();
    }, []);



    const pobierz = async () => {

        try{
            const resMain = await fetch(`http://localhost:3001/crimsonTorque/wizyta/${id}`, {
                method: "GET",
                credentials: "include",
            });

            if (resMain.status === 401) {
                navigate("/zaloguj");
                return;
            }

            if (!resMain.ok){
                throw new Error(resMain.statusText);
            }

            const dataMain = await resMain.json();

            setForm({
                samochodId: dataMain.samochod_id,
                czas_start: new Date(dataMain.czasRozpoczecia).toISOString().slice(0, 16),
                czas_koniec: dataMain.czasZakonczenia?.slice(0, 16) || "",
                status: dataMain.status === true ? "Zakończona" : "Zaplanowana",
                koszt: dataMain.koszt,
                opis: dataMain.opis
            });

            const resSamochody = await fetch("http://localhost:3001/crimsonTorque/samochod/allForClientWizyty", {
                method: "GET",
                credentials: "include",
            })

            if (!resSamochody.ok){
                throw new Error(resSamochody.statusText);
            }

            const dataSamochody = await resSamochody.json();
            setSamochody(dataSamochody);


        } catch (e) {
            console.log(e);
        }
    }

    const handleSubmit = async () => {
        if (!validateWizyta(form)){
            return;
        }


        try {

            const dataSave = {
                Samochod_id: form.samochodId,
                CzasRozpoczecia: form.czas_start ? form.czas_start : null,
                CzasZakonczenia: form.czas_koniec ? form.czas_koniec : null,
                Status: form.status === "Zakończona" ? true : false,
                Koszt: form.koszt,
                Opis: form.opis,
            };

            const res = await fetch(`http://localhost:3001/crimsonTorque/wizyta/${id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify(dataSave)
            });

            if (res.status === 401) {
                navigate("/zaloguj");
                return;
            }

            if (!res.ok) {
                throw new Error("Nie udało się zapisać wizyty");
            }

            navigate(-1);

        } catch (e) {
            console.log(e.message);
            alert(e.message);
        }
    }

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm(prev => ({ ...prev, [id]: value }));
    };


    const validateWizyta = (form) => {
        const errors = {};


        if (!form.samochodId) {
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






    return (

        <div>

            <TopBarClient/>
            <header>
                <h1>{t("wizyta.edit")}</h1>
            </header>

            <main>
                <section className="edyt-box">


                    <div className="field">
                        <label htmlFor="samochodId">{t("wizyty.car")}</label>
                        <select
                            className={errors.samochodId ? "errorField" : ""}
                            id="samochodId"
                            value={form.samochodId}
                            onChange={handleChange}
                        >
                            <option value="">-- {t("wybierz")} --</option>
                            {samochody.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.marka} {s.model} ({s.numerRejestracyjny})
                                </option>
                            ))}
                        </select>

                        <FieldError message={errors.samochodId}/>
                    </div>


                    <div className="field">
                        <label htmlFor="czas_start">{t("wizyty.czasRoz")}</label>
                        <input
                            className={errors.czas_start ? "errorField" : ""}
                            type="datetime-local"
                            id="czas_start"
                            value={form.czas_start}
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
                            value={form.czas_koniec}
                            onChange={handleChange}
                        />
                        <FieldError message={errors.czas_koniec}/>
                    </div>


                    <div className="field">
                        <label htmlFor="status">{t("wizyty.status")}</label>
                        <select
                            className={errors.status ? "errorField" : ""}
                            id="status"
                            value={form.status}
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
                            value={form.koszt}
                            onChange={handleChange}
                        />
                        <FieldError message={errors.koszt}/>
                    </div>


                    <div className="field">
                        <label htmlFor="opis">{t("wizyty.opis")}</label>
                        <textarea
                            className={errors.opis ? "errorField" : ""}
                            id="opis"
                            value={form.opis}
                            onChange={handleChange}
                        />
                        <FieldError message={errors.opis}/>
                    </div>

                    <div id="przyciski">
                        <button className="submitBtn" onClick={() => handleSubmit()}>{t("wizyta.zapisz")}</button>
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
};

export default WizytaEdytujClient;