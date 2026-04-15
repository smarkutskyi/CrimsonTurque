import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";

import Footer from "../../components/Footer";
import TopBarAdmin from "../../components/admin/TopBarAdmin";
import WizytaRowAdmin from "../../components/admin/WizytaRowAdmin";
import {useTranslation} from "react-i18next";


const MechanikSzczegolyAdmin = () => {

    const id = useLocation().state;
    const navigate = useNavigate();
    const [mechanik, setMechanik] = useState({});
    const [wizyty, setWizyty] = useState([]);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10
    const {t} = useTranslation();

    useEffect(() => {
        pobierz();
    }, []);

    useEffect(() => {
        wizytyPobierz();
    }, [page])

    const pobierz = async () => {
        try {
            const res = await fetch(`http://localhost:3001/crimsonTorque/mechanik/admin/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (res.status === 403) {
                navigate("/zaloguj");
                return;
            }

            if (!res.ok) {
                throw new Error("Błąd przy pobieraniu profilu");
            }

            const data = await res.json();
            setMechanik(data);

        } catch (e) {
            console.error(e);
        }
    };

    const wizytyPobierz = async () => {
        const resWiz = await fetch(`http://localhost:3001/crimsonTorque/wizyta/admin/forMechanik/${id}?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }, credentials: "include"
        });

        if (resWiz.status === 403) {
            navigate("zaloguj");
        }
        if (!resWiz.ok){
            throw Error("No samochod");
        }

        const data = await resWiz.json();

        setWizyty(data.wizyty);
        setTotal(data.total);

    }

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


            window.location.reload();

        } catch (e) {
            console.error(e);
            alert(e.message);
        }

    }
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

            navigate("/admin/mechanicyList");

        } catch (e) {
            console.error(e);
        }

    }



    return (
        <div className="page">

            <TopBarAdmin/>

            <header>
                <h1>{t("addMechanik.details")}</h1>
            </header>

            <main>
                <section className="details-box">
                    <p><strong>Id:</strong> {id}</p>

                    <p>
                        <strong>{t("addMechanik.firstName")}:</strong> {mechanik.imie}
                    </p>

                    <p>
                        <strong>{t("addMechanik.lastName")}:</strong> {mechanik.nazwisko}
                    </p>

                    <p>
                        <strong>Email:</strong> {mechanik.mail}
                    </p>

                    <p>
                        <strong>{t("addMechanik.password.label")}:</strong> {mechanik.haslo}
                    </p>

                    <p>
                        <strong>{t("addMechanik.phone")}:</strong> {mechanik.telefon}
                    </p>

                    <div className="detail-description">
                        <strong>{t("addMechanik.description.label")}:</strong>
                        <br/>
                        <span id="opis">{mechanik.opis}</span>
                    </div>

                    <div id="przyciski">
                        <button
                            id="edytuj"
                            className="submitBtn"
                            onClick={() => navigate("/admin/mechanikEdit", { state: mechanik.id })}
                        >
                            {t("wizyty.edytuj")}
                        </button>

                        <button
                            id="powrot"
                            className="submitBtn"
                            onClick={() => navigate(-1)}
                        >
                            {t("wizyty.back")}
                        </button>

                        <button
                            className="submitBtn"
                            onClick={() => usunMechanik(mechanik.id)}
                        >
                            {t("wizyty.delete")}
                        </button>
                    </div>
                </section>

                <section>
                    <h2>{t("wizyty.histori")}</h2>

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

            <Footer/>
        </div>
    );
}


export default MechanikSzczegolyAdmin