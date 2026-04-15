import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import TopBarAdmin from "../../components/admin/TopBarAdmin";
import SamochodRowAdmin from "../../components/admin/SamochodyRowAdmin";
import Footer from "../../components/Footer";
import {useTranslation} from "react-i18next";


const SamochodyListaAdmin = () => {

    const navigate = useNavigate();

    const [samochody, setSamochody] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;
    const {t} = useTranslation();

    const pobierz = async (pageNumber = page) => {
        try {
            const res = await fetch(
                `http://localhost:3001/crimsonTorque/samochod/admin/all?page=${pageNumber}&limit=${limit}`,
                { credentials: "include", method: "GET" }
            );

            if (res.status === 403) {
                navigate("/zaloguj");
                return;
            }

            if (!res.ok) throw new Error(res.statusText);

            const data = await res.json();
            console.log(data);
            setSamochody(data.samochody);
            setTotal(data.total);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        pobierz(page);
    }, [page]);


    const usunSamochod = async (id) => {
        const potwierdz = window.confirm(
            t("usunAdmin")
        );

        if (!potwierdz) return;

        try {
            const res = await fetch(`http://localhost:3001/crimsonTorque/samochod/admin/${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (res.status === 403) {
                navigate("/zaloguj");
                return;
            }

            if (!res.ok) {
                throw new Error("Błąd przy usuwaniu samochodu");
            }


            pobierz(page);

        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <TopBarAdmin />

            <header>
                <h1>{t("samochod.lista")}</h1>
            </header>

            <main>
                <section>

                    <button
                        id="submitBtn1"
                        className="submitBtn"
                        onClick={() => navigate("/admin/samochodDodaj")}
                    >
                        {t("samochod.dodaj")}
                    </button>

                    <table className="tabela">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>{t("samochod.marka")}</th>
                            <th>Model</th>
                            <th>{t("samochod.nrRejestracyjny")}</th>
                            <th>{t("samochod.rokProdukcji")}</th>
                            <th>{t("akcje")}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {samochody.length === 0 ? (
                            <tr>
                                <td>
                                    Brak samochodów
                                </td>
                            </tr>
                        ) : (
                            samochody.map((s) => <SamochodRowAdmin key={s.id} s={s} usun={usunSamochod} />)
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


export default SamochodyListaAdmin;
