import React, {useEffect, useState} from "react";
import TopBarClient from "../../components/client/TopBarClient";
import Footer from "../../components/Footer";
import {useNavigate} from "react-router-dom";
import Wizyta from "../../components/client/Wizyta";
import {t} from "i18next";
import {useTranslation} from "react-i18next";

const WizytyClient = () => {

    const navigate = useNavigate();
    const [wizyty, setWizyty] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 5;
    const {t} = useTranslation();

    useEffect(() => {
        pobierzWizyty();
    }, [page]);

    const pobierzWizyty = async () => {

        try {
            const res = await fetch(`http://localhost:3001/crimsonTorque/wizyta/clientPage?page=${page}&limit=${limit}`, {
                credentials: "include"
            });

            if (res.status === 401) {
                navigate("/zaloguj");
                throw new Error("Nie zalogowany");
            }

            const json = await res.json();

            setWizyty(json.data);
            setTotal(json.total);

        } catch (e) {
            console.error(e);
        }
    }

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
                throw new Error("");
            }




            pobierzWizyty();

        } catch (e) {
            console.error(e);
            alert(e.message);
        }

    }


    
    return (
        <div className="page">
            <TopBarClient/>
            <header>
                <h1>{t("client.wizyty.moje")}</h1>
            </header>

            <main>
                <button className="submitBtn clientbtn" onClick={ () => navigate("/dodajWizyta")}>
                    {t("wizyty.add")}
                </button>


                {wizyty.map((w) => (
                    <Wizyta key={w.id} w={w} usun={usun} />
                ))}


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
            </main>

            <Footer/>

        </div>
    );
};


export default WizytyClient;