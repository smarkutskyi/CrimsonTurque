
import React, {useEffect, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import TopBarClient from "../../components/client/TopBarClient";
import Footer from "../../components/Footer";
import {useTranslation} from "react-i18next";


const WizytySzczegolyClient = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const id = location.state;
    const [wizyta, setWizyta] = useState({});

    const {t} = useTranslation();


    useEffect( () => {
        const szczeoly = async () => {
            try {

                const res = await fetch(`http://localhost:3001/crimsonTorque/wizyta/${id}`, {
                    method: "GET",
                    credentials: "include"
                });

                if (res.status === 401) {
                    navigate("/zaloguj");
                }

                if (res.status === 404){
                    throw new Error(res.statusText);
                }


                const data = await res.json();

                


                setWizyta(data);


            } catch (e) {
                console.error(e);
            }
        }

        szczeoly();
    }, []);

    const [dataRoz, czasRoz] = wizyta.czasRozpoczecia ? wizyta.czasRozpoczecia.split("T") : ["Brak", ""];
    const [dataZak, czasZak] = wizyta.czasZakonczenia ? wizyta.czasZakonczenia.split("T") : ["Brak", ""];


    const usun = async (id) => {

        const potwierdz = window.confirm(
            t("wizyty.usun") + t("client.wizyty.delete")
        );


        if (!potwierdz) return;

        try {
            const res = await fetch(`http://localhost:3001/crimsonTorque/wizyta/${id}`, {
                method: "DELETE",
                credentials: "include"
            });



            if (res.status === 401) {
                navigate("/zaloguj");
                return;
            }

            if (!res.ok){
                throw new Error(res.statusText);
            }


            navigate("/wizyty");

        } catch (e) {
            console.error(e);
            alert(e.message);
        }

    }





    return (<div>
        <TopBarClient/>
        <header>
            <h1>{t("wizyty.details")}</h1>
        </header>


        <main>
            <section className="details-box">
                <p>
                    <strong>{t("wizyty.car")}:</strong>
                    <button
                        className="szczegoly-btn"
                        onClick={() => navigate("/szczegolySamochod", { state: wizyta.samochod_id })}
                    >
                        {wizyta.marka} {wizyta.model}
                    </button>
                </p>

                <p>
                    <strong>{t("wizyty.czasRoz")}:</strong> {dataRoz} {czasRoz.slice(0,5)}
                </p>

                <p>
                    <strong>{t("wizyty.czasZak")}:</strong> {dataZak} {czasZak.slice(0,5)}
                </p>

                <p>
                    <strong>{t("wizyty.status")}:</strong>
                    {wizyta.status ? t("wizytaStatus.zakonczona") : t("wizytaStatus.zaplanowana")}
                </p>

                <p>
                    <strong>{t("wizyty.koszt")}:</strong> {wizyta.koszt} zł
                </p>

                <div className="detail-description">
                    <strong>{t("wizyty.opis")}:</strong>
                    <br/>
                    <span id="opis">{wizyta.opis}</span>
                </div>
                <div id="przyciski">
                    <button
                        id="edytuj"
                        className="submitBtn"
                        onClick={() => navigate("/editWizyta", { state: wizyta.id })}
                    >
                        {t("wizyty.edytuj")}
                    </button>
                    <button
                        id="usun"
                        className="submitBtn"
                        onClick={() => usun(wizyta.id)}
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
        </main>

        <Footer/>
    </div>);


}


export default WizytySzczegolyClient;