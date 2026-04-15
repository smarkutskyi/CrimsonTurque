import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import WizytaRowClient from "../../components/client/WizytaRowClient";
import TopBarClient from "../../components/client/TopBarClient";
import Footer from "../../components/Footer";
import {t} from "i18next";
import {useTranslation} from "react-i18next";


const SamochodySzczegolyClient = () => {
    const id = useLocation().state;
    const navigate = useNavigate();
    const [samochod, setSamochod] = useState({});
    const [wizyty, setWizyty] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;
    const {t} = useTranslation();


    useEffect(() => {
        if (!id) return;
        pobierz();
    }, [id]);

    useEffect(() => {
        pobierzWizyty();
    }, [page])

    const pobierzWizyty = async () => {
        try {


            const resWiz = await fetch(`http://localhost:3001/crimsonTorque/wizyta/forSzczegolySamochodClient/${id}?page=${page}&limit=${limit}`, {
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

            const dataWizyta = await resWiz.json();

            setWizyty(dataWizyta.wizyty);
            setTotal(dataWizyta.total);


        } catch (e) {
            console.log(e);
        }
    }

    const pobierz = async () => {

        try {

            const resSam = await fetch(`http://localhost:3001/crimsonTorque/samochod/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });

            if (resSam.status === 401) {
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

    const usunSamochod = async (id) => {
        const potwierdz = window.confirm(
            t("samochod.usun") + t("client.samochody.delete")
        );


        if (!potwierdz) return;

        try {
            const res = await fetch(`http://localhost:3001/crimsonTorque/samochod/${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (res.status === 401) {
                navigate("/zaloguj");
                return;
            }

            if (!res.ok) {
                throw new Error("Błąd przy usuwaniu samochodu");
            }


            navigate("/samochody")


        } catch (e) {
            console.error(e);
        }
    };



    return (
        <div>
            <TopBarClient/>
            <header>
                <h1>{t("samochod.details")}</h1>
            </header>

            <main>
                <section className="details-box">
                    <p><strong>{t("samochod.marka")}:</strong> {samochod.marka}</p>
                    <p><strong>Model:</strong> {samochod.model}</p>
                    <p><strong>{t("samochod.rokProdukcji")}:</strong> {samochod.rokProdukcji}</p>
                    <p><strong>{t("samochod.nrRejestracyjny")}:</strong> {samochod.numerRejestracyjny}</p>
                    <p><strong>VIN:</strong> {samochod.vin}</p>
                    <p><strong>{t("samochod.przebieg")}:</strong> {samochod.przebieg} km</p>
                    <p><strong>{t("samochod.kolor")}:</strong> {samochod.kolor}</p>

                    <div id="przyciski">
                        <button id="edytuj" className="submitBtn"
                                onClick={() => navigate("/editSamochod", {state: id})}>{t("wizyty.edytuj")}
                        </button>
                        <button id="usun" className="submitBtn" onClick={() => usunSamochod(id)}>{t("wizyty.delete")}
                        </button>
                        <button id="powrot" className="submitBtn" onClick={() => navigate(-1)}>{t("wizyty.back")}
                        </button>
                    </div>
                </section>

                <section>
                    <h2>{t("wizyty.histori")}</h2>

                    {wizyty.length === 0 ? (
                        <p>Brak wizyt</p>
                    ) : (
                        <table className="tabela">
                            <thead>
                            <tr>
                            <th>{t("wizyty.startDate")}</th>
                                <th>{t("wizyty.status")}</th>
                                <th>{t("wizyty.koszt")}</th>
                                <th>{t("akcje")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {wizyty.map(w => (
                                <WizytaRowClient key={w.id} w={w} navigate={navigate} />
                            ))}
                            </tbody>
                        </table>
                    )}

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

export default SamochodySzczegolyClient;