import React from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";


const TopBarAdmin = () => {

    const navigate = useNavigate();
    const {t, i18n} = useTranslation();

    const user = JSON.parse(localStorage.getItem("userDisplay"));

    const logout = async () => {

        try {

            const res = await fetch("http://localhost:3001/crimsonTorque/auth/admin/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            if (res.status === 403) {
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
                <button className="nav-btn" onClick={() => navigate("/admin/wizytyList")}>{t("topBar.visits")}</button>
                <button className="nav-btn" onClick={() => navigate("/admin/samochodyList") }>{t("topBar.cars")}</button>
                <button className="nav-btn" onClick={() => navigate("/admin/mechanicyList")}>{t("topBar.mechanicy")}</button>
                <button className="nav-btn" onClick={logout}>
                    Wyloguj
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

}

export default TopBarAdmin;