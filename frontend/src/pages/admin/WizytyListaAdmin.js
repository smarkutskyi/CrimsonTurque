import TopBarAdmin from "../../components/admin/TopBarAdmin";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import WizytaRowAdmin from "../../components/admin/WizytaRowAdmin";
import Footer from "../../components/Footer";
import {useTranslation} from "react-i18next";

const WizytyListaAdmin = () => {
    const navigate = useNavigate();


    const [wizyty, setWizyty] = useState([]);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;
    const {t} = useTranslation();


    const pobierz = async (pageNumber = page) => {
        try {
            const res = await fetch(
                `http://localhost:3001/crimsonTorque/wizyta/allForAdmin?page=${pageNumber}&limit=${limit}`,
                { credentials: "include", method: "GET" }
            );

            if (res.status === 403) {
                navigate("/zaloguj");
                return;
            }

            if (!res.ok) throw new Error(res.statusText);

            const data = await res.json();
            console.log(data);
            setWizyty(data.wizyty);
            setTotal(data.total);
        } catch (e) {
            console.error(e);
        }
    };

    const usun = async (id) => {

        const potwierdz = window.confirm(
            t("wizyty.usun")
        );
        if (!potwierdz) return;


        try {
            const res = await fetch(`http://localhost:3001/crimsonTorque/wizyta/admin/${id}`, {
                method: "DELETE",
                credentials: "include"
            });



            if (res.status === 403) {
                navigate("/zaloguj");
                return;
            }

            if (!res.ok){
                throw new Error("");
            }


            pobierz(page);

        } catch (e) {
            console.error(e);
            alert(e.message);
        }

    }


    useEffect(() => {
        pobierz(page);
    }, [page]);

    return (
        <div>
            <TopBarAdmin />

            <header>
                <h1>{t("wizyty.lista")}</h1>
            </header>

            <main>
                <section>

                    <button
                        id="submitBtn1"
                        className="submitBtn"
                        onClick={() => navigate("/admin/wizytaDodaj")}
                    >
                        {t("wizyty.add")}
                    </button>

                    <table className="tabela">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>{t("wizyty.car")}</th>
                            <th>{t("wizyty.mechanik")}</th>
                            <th>{t("wizyty.startDate")}</th>
                            <th>{t("wizyty.status")}</th>
                            <th>{t("akcje")}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {wizyty.length === 0 ? (
                            <tr>
                                <td>
                                    Brak wizyt
                                </td>
                            </tr>
                        ) : (
                            wizyty.map((w) => <WizytaRowAdmin key={w.id} w={w} usun={usun} />)
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

            <Footer />
        </div>
    );
};

export default WizytyListaAdmin;
