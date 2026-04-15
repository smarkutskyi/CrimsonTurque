import React, { useState } from "react";
import TopBarVisitor from "../../components/visitor/TopBarVisitor";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import FieldError from "../../components/FieldError";
import {useTranslation} from "react-i18next";

const Zaloguj = () => {
    const [mail, setMail] = useState("");
    const [haslo, setHaslo] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const {t} = useTranslation();

    const zalogujSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};


        if (!mail || mail.trim() === "") newErrors.mail = "Email jest wymagany";
        if (!haslo || haslo.trim() === "") newErrors.haslo = "Hasło jest wymagane";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const res = await fetch(`http://localhost:3001/crimsonTorque/auth/login`, {
                method: 'POST',
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mail, haslo })
            });

            const data = await res.json();


            if (!res.ok) {
                newErrors.message = res.statusText;
                setErrors(newErrors);
                throw new Error(data.error || "Błąd logowania");
            }

            localStorage.setItem(
                "userDisplay",
                JSON.stringify({
                    imie: data.imie,
                    nazwisko: data.nazwisko
                })
            );


            if (data.role === "admin") navigate("/admin/wizytyList");
            else if (data.role === "mechanik") navigate("/wizyty");
            else navigate("/*");

        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="page">
            <TopBarVisitor/>

            <header>
                <h1>{t("login.title")}</h1>
            </header>

            <main>
                <section className="zaloguj">
                    <form onSubmit={zalogujSubmit}>

                        <div className="field">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={mail}
                                onChange={(e) => setMail(e.target.value)}
                                className={errors.mail || errors.message ? "errorField" : ""}
                                placeholder={t("login.placeholderMail")}
                            />

                            <FieldError message={errors.mail} />
                        </div>

                        <div className="field">
                            <label htmlFor="password">{t("login.password")}</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={haslo}
                                onChange={(e) => setHaslo(e.target.value)}
                                className={errors.haslo || errors.message ? "errorField" : ""}
                                placeholder={t("login.placeholderPassword")}

                            />
                            <FieldError message={errors.haslo} />
                        </div>

                        <button type="submit" className="submitBtn">Zaloguj się</button>
                        {Object.keys(errors).length > 0 && (
                            <div id="errSummary">
                                {t("login.err-sum")}
                            </div>
                        )}


                        <p>{t("login.pytanie")}<br/><u onClick={() => navigate("/rejestracja")}>{t("login.zarejestruj")}</u></p>
                    </form>


                </section>


            </main>

            <Footer/>
        </div>
    );
};

export default Zaloguj;
