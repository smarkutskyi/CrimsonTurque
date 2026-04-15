import { useNavigate } from "react-router-dom";
import {useTranslation} from "react-i18next";

const MechanikRowAdmin = ({ m, usun }) => {
    const navigate = useNavigate();
    const {t} = useTranslation();

    return (
        <tr>
            <td>{m.id}</td>
            <td>{m.imie}</td>
            <td>{m.nazwisko}</td>
            <td>{m.mail}</td>
            <td>
                <button
                    className="table-btn"
                    onClick={() => navigate("/admin/mechanikSzczegoly", { state: m.id })}
                >
                    {t("szczegoly")}
                </button>
                <button
                    className="table-btn"
                    onClick={() => navigate("/admin/mechanikEdit", { state: m.id })}
                >
                    {t("wizyty.edytuj")}
                </button>
                <button
                    className="table-btn"
                    onClick={() => usun(m.id)}
                >
                    {t("wizyty.delete")}
                </button>
            </td>
        </tr>
    );
};

export default MechanikRowAdmin;