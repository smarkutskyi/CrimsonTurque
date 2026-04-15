import {useLocation, useNavigate} from "react-router-dom";
import Footer from "../../components/Footer";
import FieldError from "../../components/FieldError";
import React, {useState} from "react";
import TopBarClient from "../../components/client/TopBarClient";
import {useTranslation} from "react-i18next";


const ProfileEdit = () => {
    const navigate = useNavigate();
    const mechanik = useLocation().state;
    const {t} = useTranslation();

    const [form, setForm] = useState({
        imie: mechanik.imie || "",
        nazwisko: mechanik.nazwisko || "",
        mail: mechanik.mail || "",
        haslo: mechanik.haslo || "",
        telefon: mechanik.telefon || "",
        opis: mechanik.opis || ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm(prev => ({ ...prev, [id]: value }));
    };

    const validate = () => {
        const newErrors = {};

        if (!form.imie ) newErrors.imie = t("addMechanik.validation.firstNameRequired");
        if (!form.nazwisko) newErrors.nazwisko = t("addMechanik.validation.lastNameRequired");

        if (form.mail.length <= 3) {
            newErrors.mail = t("addMechanik.validation.emailRequired");
        } else if (form.mail.length > 30) {
            newErrors.mail = t("addMechanik.validation.emailTooLong");
        } else {
            const mailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            if (!mailRegex.test(form.mail)) newErrors.mail = t("addMechanik.validation.emailInvalid");
        }

        if (form.haslo.length > 15 || form.haslo.length < 5) {
            newErrors.haslo = t("addMechanik.validation.passwordLength");
        }

        if (!form.telefon || form.telefon.trim() === "") {
            newErrors.telefon = t("addMechanik.validation.phoneRequired");
        } else if (!/^\+?[0-9 -]{7,15}$/.test(form.telefon)) {
            newErrors.telefon = t("addMechanik.validation.phoneInvalid");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const zapisz = async () => {

        if (!validate()) return;

        const body = {
            imie: form.imie,
            nazwisko: form.nazwisko,
            mail: form.mail,
            haslo: form.haslo,
            telefon: form.telefon,
            opis: form.opis,
        }


        try {
            const res = await fetch("http://localhost:3001/crimsonTorque/auth/editMe", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(body)
            });

            if (res.status === 401) {
                navigate("/zaloguj");
                return;
            }

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error  || "Błąd przy zapisywaniu danych");
            }


            localStorage.setItem(
                "userDisplay",
                JSON.stringify({
                    imie: body.imie,
                    nazwisko: body.nazwisko
                })
            );
            navigate(-1);
        } catch (e) {
            console.error(e);
            alert(e.message);
        }
    };

    return (
        <div className="page">
            <TopBarClient/>
            <header>
                <h1>{t("client.profil.edytujDane")}</h1>
            </header>

            <main>
                <section className="edyt-box">


                    <div className="field">
                        <label htmlFor="imie">{t("addMechanik.firstName")}</label>
                        <input
                            type="text"
                            id="imie"
                            value={form.imie}
                            onChange={handleChange}
                            className={errors.imie ? "errorField" : ""}
                        />
                        <FieldError message={errors.imie} />
                    </div>

                    <div className="field">
                        <label htmlFor="nazwisko">{t("addMechanik.lastName")}</label>
                        <input
                            type="text"
                            id="nazwisko"
                            value={form.nazwisko}
                            onChange={handleChange}
                            className={errors.nazwisko ? "errorField" : ""}
                        />
                        <FieldError message={errors.nazwisko} />
                    </div>

                    <div className="field">
                        <label htmlFor="mail">Email</label>
                        <input
                            type="text"
                            id="mail"
                            value={form.mail}
                            onChange={handleChange}
                            className={errors.mail ? "errorField" : ""}
                        />
                        <FieldError message={errors.mail} />
                    </div>

                    <div className="field">
                        <label htmlFor="haslo">{t("addMechanik.password.label")}</label>
                        <input
                            type="password"
                            id="haslo"
                            value={form.haslo}
                            onChange={handleChange}
                            className={errors.haslo ? "errorField" : ""}
                            placeholder={t("addMechanik.password.placeholder")}
                        />
                        <FieldError message={errors.haslo} />
                    </div>

                    <div className="field">
                        <label htmlFor="telefon">{t("addMechanik.phone")}</label>
                        <input
                            type="text"
                            id="telefon"
                            value={form.telefon}
                            onChange={handleChange}
                            className={errors.telefon ? "errorField" : ""}
                        />
                        <FieldError message={errors.telefon} />
                    </div>

                    <div className="field full-width">
                        <label htmlFor="opis">{t("addMechanik.description.label")}</label>
                        <textarea
                            id="opis"
                            value={form.opis}
                            onChange={handleChange}
                        />
                    </div>

                    <div id="przyciski">
                        <button type="button" className="submitBtn" onClick={zapisz}>{t("wizyty.zapisz")}</button>
                        <button type="button" className="submitBtn" onClick={() => navigate(-1)}>{t("anuluj")}</button>
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


export default ProfileEdit;