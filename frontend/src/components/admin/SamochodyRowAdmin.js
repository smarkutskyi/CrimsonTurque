import { useNavigate } from "react-router-dom";
import {useTranslation} from "react-i18next";

const SamochodRowAdmin = ({ s, usun}) => {
    const navigate = useNavigate();
    const {t} = useTranslation();

    return (
        <tr>
            <td>{s.id}</td>
            <td>{s.marka}</td>
            <td>{s.model}</td>
            <td>{s.numerRejestracyjny}</td>
            <td>{s.rokProdukcji}</td>
            <td>
                <button className="table-btn" onClick={() => navigate("/admin/samochodSzczegoly", { state: s.id })}>
                    {t("szczegoly")}
                </button>
                <button className="table-btn" onClick={() => navigate("/admin/samochodEdit", { state: s.id })}>
                    {t("wizyty.edytuj")}
                </button>
                <button className="table-btn" onClick={() => usun(s.id)}>{t("wizyty.delete")}</button>
            </td>
        </tr>
    );
};

export default SamochodRowAdmin;
