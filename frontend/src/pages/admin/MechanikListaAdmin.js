import TopBarAdmin from "../../components/admin/TopBarAdmin";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import MechanikRowAdmin from "../../components/admin/MechanikRowAdmin";
import {useTranslation} from "react-i18next";

const MechanicyListaAdmin = () => {
    const navigate = useNavigate();

    const [mechanicy, setMechanicy] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;
    const {t} = useTranslation();

    const pobierz = async (pageNumber = page) => {
        try {
            const res = await fetch(
                `http://localhost:3001/crimsonTorque/mechanik/admin/all?page=${pageNumber}&limit=${limit}`,
                { credentials: "include", method: "GET" }
            );

            if (res.status === 403) {
                navigate("/zaloguj");
                return;
            }

            if (!res.ok) throw new Error(res.statusText);

            const data = await res.json();

            setMechanicy(data.mechanicy);
            setTotal(data.total);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        pobierz(page);
    }, [page]);


    const usunMechanik = async (id) => {

        const potwierdz = window.confirm(
            t("usunMechanik")
        );

        if (!potwierdz) return;

        try {
            const res = await fetch(`http://localhost:3001/crimsonTorque/mechanik/admin/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            if (res.status === 403) {
                navigate("/zaloguj");
            }

            if (!res.ok) throw new Error(res.statusText);

            pobierz(page);

        } catch (e) {
            console.error(e);
        }

    }


    return (
        <div>
            <TopBarAdmin />

            <header>
                <h1>{t("addMechanik.lista")}</h1>
            </header>

            <main>
                <section>

                    <div id="przyciski">
                        <button
                            className="submitBtn"
                            onClick={() => navigate("/admin/mechanikDodaj")}
                        >
                            {t("addMechanik.dodaj")}
                        </button>
                    </div>

                    <table className="tabela">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>{t("addMechanik.firstName")}</th>
                            <th>{t("addMechanik.lastName")}</th>
                            <th>Email</th>
                            <th>{t("akcje")}</th>
                        </tr>
                        </thead>

                        <tbody>
                        {mechanicy.length === 0 ? (
                            <tr>
                                <td>
                                    Brak mechaników
                                </td>
                            </tr>
                        ) : (
                            mechanicy.map((m) => (
                                <MechanikRowAdmin key={m.id} m={m} usun={usunMechanik} />
                            ))
                        )}
                        </tbody>
                    </table>




                    <div className="pagination">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            {t("pagination.previous")}
                        </button>

                        <span>{t("pagination.page")} {page}</span>

                        <button
                            disabled={page * limit >= total}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            {t("pagination.next")}
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MechanicyListaAdmin;