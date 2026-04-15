import React from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";


const Samochod = ({s, usun}) => {

    const navigate = useNavigate();
    const {t} = useTranslation();

    return (
        <section className="car-card">

            <h3>{s.marka} {s.model}</h3>

            <div className="car-info">
                <div className="car-field wide">
                    <span className="label">{t("client.samochody.rejestracja")}</span>
                    <span className="value">{s.numerRejestracyjny}</span>
                </div>

                <div className="car-field narrow">
                    <span className="label">{t("client.samochody.kolor")}</span>
                    <span className="value">{s.kolor}</span>
                </div>
            </div>

            <div className="visit-actions">
                <button className="table-btn" title="Szczegóły" onClick={() => navigate("/szczegolySamochod", {state: s.id})}>
                    <img src="https://www.svgrepo.com/show/513297/eye.svg" alt="Szczegóły"/>
                </button>
                <button className="table-btn" title="Edytuj" onClick={() => navigate("/editSamochod", {state: s.id})}>
                    <img src="https://www.svgrepo.com/show/513280/brush.svg" alt="Edytuj" />
                </button>
                <button className="table-btn" title="Usuń" onClick={() => usun(s.id)}>
                    <img src="https://www.svgrepo.com/show/501836/trash-recycle-bin.svg" alt="Usuń"/>
                </button>
            </div>

        </section>
    );

};

export default Samochod;