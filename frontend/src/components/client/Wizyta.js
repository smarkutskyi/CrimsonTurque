import React from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";


const Wizyta = ({w, usun}) => {

    const navigate = useNavigate();
    const [data, time] = w.czasRozpoczecia.split("T");
    const hour = time.slice(0, 5);
    const {t} = useTranslation();

    const statusText = w.status ? t("wizytaStatus.zakonczona") : t("wizytaStatus.zaplanowana");
    const statusClass = w.status ? "visit-status done" : "visit-status planned";

    return (
        <section className="visit-card">

            <div className="visit-main">
                <h2>
                    {t("client.wizyty.car")}:
                    <span>{w.marka} {w.model} ({w.numerRejestracyjny})</span>
                </h2>

                <div className="visit-info">
                    <p><strong>{t("client.wizyty.startDate")}:</strong> {data}</p>
                    <p><strong>{t("client.wizyty.hour")}:</strong> {hour}</p>
                    <p><strong>{t("client.wizyty.cost")}:</strong> {w.koszt}</p>

                    <p className={statusClass}>{statusText}</p>
                </div>
            </div>

            <div className="visit-actions">
                <button className="table-btn" title="Szczegóły" onClick={() => navigate(`/szczegolyWizyta`, {state: w.id} )}>
                    <img src="https://www.svgrepo.com/show/513297/eye.svg" alt="Szczegóły"/>
                </button>
                <button className="table-btn" title="Edytuj" onClick={() => navigate("/editWizyta", {state: w.id})}>
                    <img src="https://www.svgrepo.com/show/513280/brush.svg" alt="Edytuj"/>
                </button>

                <button className="table-btn" title="Usuń" onClick={() => usun(w.id)}>
                    <img src="https://www.svgrepo.com/show/501836/trash-recycle-bin.svg" alt="Usuń"/>
                </button>
            </div>

        </section>
    );
}

export default Wizyta;