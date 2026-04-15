import React from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";



const TopBarClient = () => {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("userDisplay"));

    const {t, i18n} = useTranslation();


    const logout = async () => {

        try {

            const res = await fetch("http://localhost:3001/crimsonTorque/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            if (res.status === 401) {
                navigate("/zaloguj");
            }

            if (!res.ok) {
                throw new Error(res.statusText);
            }

            localStorage.removeItem("userDisplay");

            navigate("/zaloguj");

        } catch (e) {
            console.log(e);
        }

    }


    return (
        <div className="gornypasek">
            <span>CrimsonTorque</span>
            <div className="nav-buttons">
                <button className="nav-btn" onClick={() => navigate("/wizyty")}>{t("topBar.visits")}</button>
                <button className="nav-btn" onClick={() => navigate("/samochody") }>{t("topBar.cars")}</button>
                {/*<button className="nav-btn" onClick={() => navigate("/contact")}>Kalendarz</button>*/}
                <button className="nav-btn" onClick={() => navigate("/profile")}>
                    {user ? `${user.imie} ${user.nazwisko} ` : "" }
                </button>
                <button className="nav-btn" onClick={logout}>
                    {t("topBar.logout")}
                </button>
                <button
                    className="lang-btn"
                    onClick={() => i18n.changeLanguage("pl")}
                >
                    PL
                </button>

                <button
                    className="lang-btn"
                    onClick={() => i18n.changeLanguage("en")}
                >
                    EN
                </button>
            </div>
        </div>
    );
};

export default TopBarClient;