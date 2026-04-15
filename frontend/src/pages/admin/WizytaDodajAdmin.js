import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import TopBarClient from "../../components/client/TopBarClient";
import FieldError from "../../components/FieldError";
import Footer from "../../components/Footer";
import TopBarAdmin from "../../components/admin/TopBarAdmin";
import {useTranslation} from "react-i18next";


const WizytaDodajAdmin = () => {

    const navigate = useNavigate();

    const [samochody, setSamochody] = useState([]);
    const [mechanicy, setMechanicy] = useState([]);
    const [form, setForm] = React.useState({
        samochodId : "",
        mechanikId : "",
        czas_start: "",
        czas_koniec: "",
        status: "Zaplanowana",
        koszt: "",
        opis: ""
    });
    const [errors, setErrors] = React.useState({});
    const {t} = useTranslation();



    const pobierz = async () => {

        try {
            const resSamochody = await fetch("http://localhost:3001/crimsonTorque/samochod/allForWizytyAdmin", {
                method: "GET",
                credentials: "include",
            })

            if (resSamochody.status === 403) {
                navigate("/zaloguj");
            }

            if (!resSamochody.ok){
                throw new Error(resSamochody.statusText);


            }

            const dataSamochody = await resSamochody.json();
            setSamochody(dataSamochody);


            const resMechanicy =  await fetch(`http://localhost:3001/crimsonTorque/mechanik/allForWizytaAdmin`, {
                method: "GET",
                credentials: "include",
            });

            if (!resMechanicy.ok){
                throw new Error(resSamochody.statusText);
            }

            const dataMechanicy = await resMechanicy.json();
            setMechanicy(dataMechanicy);


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



    const validateWizyta = () => {
        const errors = {};



        if (!form.samochodId) {
            errors.samochodId = t("wizyta.error_selectCar");
        }

        if (!form.mechanikId) {
            errors.mechanikId = t("wizyta.error_selectMechanic");
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




    const add = async () => {
        if (!validateWizyta()) {
            return;
        }

        const data = {
            Samochod_id: form.samochodId,
            Mechanik_id: form.mechanikId,
            CzasRozpoczecia: form.czas_start,
            CzasZakonczenia: form.czas_koniec ? form.czas_koniec : null,
            Status: form.status === "Zakończona" ? true : false,
            Koszt: form.koszt,
            Opis: form.opis,
        }

        try {

            const res = await fetch("http://localhost:3001/crimsonTorque/wizyta/admin/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data)
            });

            if (res.status === 403) {
                navigate("/zaloguj");
            }

            if (!res.ok) {
                throw new Error(res.statusText);
            }

            navigate("/admin/wizytyList")


        } catch (e) {
            alert(e.message)
            console.error(e);
        }


    }




    return (<div>

        <TopBarAdmin/>
        <header>
            <h1>{t("wizyty.add")}</h1>
        </header>

        <main>
            <section className="edyt-box">


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


                <div className="field">
                    <label htmlFor="mechanikId">{t("wizyty.mechanik")}</label>
                    <select className={errors.mechanikId ? "errorField" : ""}
                            id="mechanikId"
                            value={form.mechanikId}
                            onChange={handleChange}>
                        <option value="">-- {t("wybierz")} --</option>
                        {mechanicy.map(m => (
                            <option key={m.id} value={m.id}>
                                {m.imie} {m.nazwisko} {m.mail}
                            </option>
                        ))}
                    </select>

                    <FieldError message={errors.mechanikId}/>
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
                    <button className="submitBtn" onClick={add}>{t("wizyty.zapisz")}</button>
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




export default WizytaDodajAdmin;