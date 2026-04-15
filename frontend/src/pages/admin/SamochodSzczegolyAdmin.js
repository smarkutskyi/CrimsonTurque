import React, {useEffect, useState} from "react";
import TopBarClient from "../../components/client/TopBarClient";
import WizytaRowClient from "../../components/client/WizytaRowClient";
import Footer from "../../components/Footer";
import WizytaRowAdmin from "../../components/admin/WizytaRowAdmin";
import {useLocation, useNavigate} from "react-router-dom";
import TopBarAdmin from "../../components/admin/TopBarAdmin";
import {useTranslation} from "react-i18next";


const SamochodSzczegolyAdmin = () => {

    const id = useLocation().state;
    const navigate = useNavigate();
    const [samochod, setSamochod] = useState({});
    const [wizyty, setWizyty] = useState([]);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10
    const {t} = useTranslation();


    useEffect(() => {
        if (!id) return;
        pobierz();
    }, [id]);

    useEffect(() => {
        wizytyPobierz()
    }, [page]);

    const pobierz = async () => {

        try {

            const resSam = await fetch(`http://localhost:3001/crimsonTorque/samochod/admin/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });

            if (resSam.status === 403) {
                navigate("zaloguj");
            }
            if (!resSam.ok){
                throw Error("No samochod");
            }

            const dataSamochod = await resSam.json();

            setSamochod(dataSamochod);


        } catch (e) {
            console.log(e);
        }

    }


    const wizytyPobierz = async () => {
        const resWiz = await fetch(`http://localhost:3001/crimsonTorque/wizyta/admin/forCar/${id}?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }, credentials: "include"
        });

        if (resWiz.status === 401) {
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


            navigate("/admin/samochodyList");

        } catch (e) {
            console.error(e);
        }
    };



    return (
        <div>
            <TopBarAdmin/>
            <header>
                <h1>{t("samochod.details")}</h1>
            </header>

            <main>
                <section className="details-box">
                    <p><strong>ID:</strong> {id}</p>
                    <p><strong>{t("samochod.marka")}:</strong> {samochod.marka}</p>
                    <p><strong>Model:</strong> {samochod.model}</p>
                    <p><strong>{t("samochod.rokProdukcji")}:</strong> {samochod.rokProdukcji}</p>
                    <p><strong>{t("samochod.nrRejestracyjny")}:</strong> {samochod.numerRejestracyjny}</p>
                    <p><strong>VIN:</strong> {samochod.vin}</p>
                    <p><strong>{t("samochod.przebieg")}:</strong> {samochod.przebieg} km</p>
                    <p><strong>{t("samochod.kolor")}:</strong> {samochod.kolor}</p>

                    <div id="przyciski">
                        <button
                            id="edytuj"
                            className="submitBtn"
                            onClick={() => navigate("/admin/samochodEdit", { state: id })}
                        >
                            {t("wizyty.edytuj")}
                        </button>

                        <button
                            id="usun"
                            className="submitBtn"
                            onClick={() => usunSamochod(id)}
                        >
                            {t("wizyty.delete")}
                        </button>

                        <button
                            id="powrot"
                            className="submitBtn"
                            onClick={() => navigate(-1)}
                        >
                            {t("wizyty.back")}
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

export default SamochodSzczegolyAdmin;