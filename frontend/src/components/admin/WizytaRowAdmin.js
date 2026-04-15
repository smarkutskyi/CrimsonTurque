import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const WizytaRowAdmin = ({ w, usun }) => {

    const navigate = useNavigate();

    const [data, time] = w.czasRozpoczecia.split("T");
    const hour = time.slice(0, 5);

    const statusText = w.status ? "Zakończona" : "Zaplanowana";
    const {t} = useTranslation();


    return (
        <tr>
            <td>{w.id}</td>
            <td>{w.marka} {w.model}</td>
            <td>{w.imie} {w.nazwisko}</td>
            <td>{data} {hour}</td>
            <td>{statusText}</td>
            <td>
                <button className="table-btn" onClick={() => navigate("/admin/wizytaSzczegoly", {state: w.id} )}>{t("szczegoly")}</button>
                <button className="table-btn" onClick={() => navigate("/admin/wizytaEdit", {state: w.id})}>{t("wizyty.edytuj")}</button>
                <button className="table-btn" onClick={() => usun(w.id)}>{t("wizyty.delete")}</button>
            </td>
        </tr>
    );
};

export default WizytaRowAdmin;