import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Footer from "../../components/Footer";
import TopBarClient from "../../components/client/TopBarClient";
import {useTranslation} from "react-i18next";

const ProfileSzczegoly = () => {
    const navigate = useNavigate();
    const [mechanik, setMechanik] = useState(null);
    const {t} = useTranslation();

    useEffect(() => {
        pobierz();
    }, []);

    const pobierz = async () => {
        try {
            const res = await fetch("http://localhost:3001/crimsonTorque/auth/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (res.status === 401) {
                navigate("/zaloguj");
                return;
            }

            if (!res.ok) {
                throw new Error("Błąd przy pobieraniu profilu");
            }

            const data = await res.json();
            setMechanik(data);

        } catch (e) {
            console.error(e);
        }
    };

    if (!mechanik) {
        return <p>Ładowanie danych...</p>;
    }

    return (
        <div className="page">

            <TopBarClient/>

            <header>
                <h1>{t("client.profil.moje")}</h1>
            </header>

            <main>
                <section className="details-box">
                    <p><strong>{t("addMechanik.firstName")}:</strong> {mechanik.imie}</p>
                    <p><strong>{t("addMechanik.lastName")}:</strong> {mechanik.nazwisko}</p>
                    <p><strong>Mail:</strong> {mechanik.mail}</p>
                    <p><strong>{t("addMechanik.password.label")}:</strong> {mechanik.haslo}</p>
                    <p><strong>{t("addMechanik.phone")}:</strong> {mechanik.telefon}</p>
                    <div className="detail-description">
                        <strong>{t("addMechanik.description.label")}:</strong>
                        <br/>
                        <span id="opis">{t("addMechanik.description.lable")}</span>
                    </div>

                    <div id="przyciski">
                        <button
                            id="edytuj"
                            className="submitBtn"
                            onClick={() => navigate("/profile/edytuj", {state: mechanik})}
                        >
                            {t("wizyty.edytuj")}
                        </button>

                        <button
                            id="powrot"
                            className="submitBtn"
                            onClick={() => navigate(-1)}
                        >
                            {t("wizyty.back")}
                        </button>
                    </div>


                </section>
            </main>

            <Footer/>
        </div>
    );
}


export default ProfileSzczegoly;