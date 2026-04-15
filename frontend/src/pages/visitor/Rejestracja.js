import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import FieldError from "../../components/FieldError";
import TopBarVisitor from "../../components/visitor/TopBarVisitor";
import Footer from "../../components/Footer";
import {useTranslation} from "react-i18next";


const Rejestracja = () => {

    const navigate = useNavigate();
    const [form, setForm] = useState({
        imie: "",
        nazwisko: "",
        mail: "",
        haslo: "",
        telefon: "",
        opis: ""
    });

    const [errors, setErrors] = useState({});
    const {t} = useTranslation();

    const handleChange = (e) => {
        const {id, value} = e.target;
        setForm(prev => ({...prev, [id]: value}));

    }
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

    const rejestracja = async () => {

        try {

            if (!validate()) return;

            const body = {
                imie: form.imie,
                nazwisko: form.nazwisko,
                mail: form.mail,
                haslo: form.haslo,
                telefon: form.telefon,
                opis: form.opis
            };
            console.log(body);

            const res = await fetch('http://localhost:3001/crimsonTorque/auth/rejestracja', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
                credentials: 'include'
            });

            if (res.status === 409) {
                setErrors(prev => ({ ...prev, mail: "Ten email jest już zajęty" }));
                return;
            }

            if (!res.ok) {
                throw new Error(res.statusText);
            }

            const data = await res.json();

            localStorage.setItem(
                'userDisplay',
                JSON.stringify({
                imie: data.imie,
                nazwisko: data.nazwisko
                })
            );

            navigate("/wizyty");

        } catch (e) {
            console.error(e);
        }

    }



    return (
        <div>
            <TopBarVisitor/>
            <h1>{t("addMechanik.titleRej")}</h1>

            <main>
                <section className="edyt-box">

                    <div className="field">
                        <label htmlFor="imie">{t("addMechanik.firstName")}</label>
                        <input type="text" id="imie" value={form.imie} onChange={handleChange} className={errors.imie ? "errorField" : ""} placeholder="Jan"/>
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
                            placeholder="Kowalski"
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
                            placeholder="jan.kowalski@example.com"
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
                            placeholder={t("{t(addMechanik.password.placeholder)}")}
                        />
                        <FieldError message={errors.haslo} />
                    </div>


                    <div className="field full-width">
                        <label htmlFor="telefon">{t("addMechanik.phone")}</label>
                        <input
                            type="text"
                            id="telefon"
                            value={form.telefon}
                            onChange={handleChange}
                            className={errors.telefon ? "errorField" : ""}
                            placeholder="123-456-789"
                        />
                        <FieldError message={errors.telefon} />
                    </div>

                    <div className="field full-width">
                        <label htmlFor="opis">{t("addMechanik.description.label")}</label>
                        <textarea
                            id="opis"
                            value={form.opis}
                            onChange={handleChange}
                            className={errors.opis ? "errorField" : ""}
                            placeholder={t("addMechanik.description.placeholder")}
                        />
                        <FieldError message={errors.opis} />
                    </div>

                    <button type="button" className="submitBtn" onClick={rejestracja}>Zaloguj się</button>
                    {Object.keys(errors).length > 0 && (
                        <div id="errSummary">
                            {t("addMechanik.errorsSummary")}
                        </div>
                    )}


                    <p>{t("addMechanik.haveAccount")} <u onClick={() => navigate("/zaloguj")}>{t("addMechanik.loginLink")}</u></p>

                </section>
            </main>

            <Footer/>
        </div>
    );
}


export default Rejestracja;