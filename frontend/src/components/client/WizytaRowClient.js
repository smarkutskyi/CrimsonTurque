
import React from "react";
import {useTranslation} from "react-i18next";


const WizytaRowClient = ({ w, navigate }) => {

    const [data, czas] = w.czasRozpoczecia.split("T");
    const {t} = useTranslation();

    return (
        <tr>
            <td>{data} {czas.slice(0,5)}</td>
            <td>{w.status ? t("wizytaStatus.zakonczona") : t("wizytaStatus.zaplanowana")}</td>
            <td>{w.koszt} zł</td>
            <td>
                <button
                    className="table-btn"
                    onClick={() => navigate(`/szczegolyWizyta`, {state: w.id})}
                >
                    {t("szczegoly")}
                </button>
                <button className="table-btn"
                        onClick={() => navigate(`/editWizyta`, {state: w.id})}
                >
                    {t("wizyty.edytuj")}
                </button>
            </td>
        </tr>
    );
};

export default WizytaRowClient;