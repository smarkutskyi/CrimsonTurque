import React from "react";
import {useNavigate} from "react-router-dom";
import { useTranslation } from "react-i18next";

const TopBarVisitor = () => {

    const navigate = useNavigate();
    const { i18n, t } = useTranslation();


    return (
        <div className="gornypasek">
            <span>CrimsonTorque</span>
            <div className="nav-buttons">
                <button className="nav-btn" onClick={() => navigate("/")}>
                    {t("topBar.home")}
                </button>
                <button className="nav-btn" onClick={() => navigate("/aboutUs")}>
                    {t("topBar.aboutUs")}
                </button>
                <button className="nav-btn" onClick={() => navigate("/contact")}>
                    {t("topBar.contact")}
                </button>
                <button className="nav-btn" onClick={() => navigate("/searchMechanik")}>
                    {t("topBar.searchMechanic")}
                </button>
                <button className="nav-btn" onClick={() => navigate("/zaloguj")}>
                    {t("topBar.login")}
                </button>
                <button className="nav-btn" onClick={() => navigate("/rejestracja")}>
                    {t("topBar.register")}
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

export default TopBarVisitor;