import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Samochod from "../../components/client/Samochod";
import TopBarClient from "../../components/client/TopBarClient";
import Footer from "../../components/Footer";
import {useTranslation} from "react-i18next";


const SamochodyClient = () => {

    const navigate = useNavigate();
    const [samochody, setSamochody] = React.useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 9;
    const {t} = useTranslation();
    const pobierz = async () => {


        try {

            const res = await fetch(`http://localhost:3001/crimsonTorque/samochod/allForClientLista?page=${page}&limit=${limit}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (res.status === 401) navigate("/zaloguj");
            if (!res.ok) throw new Error("Błąd przy pobieraniu wizyt");

            const data = await res.json();
            setSamochody(data.samochody);
            setTotal(data.total);


        } catch (e) {
            console.error(e);
        }


    }


    useEffect(() => {
        pobierz();
    }, [page])

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


            pobierz();

        } catch (e) {
            console.error(e);
        }
    };



    return (
        <div className="page">

            <TopBarClient/>

            <header>
                <h1>{t("client.samochody.moje")}</h1>
            </header>

            <main>
                <div className="cars-grid">

                    {samochody.map((s) => (<Samochod key={s.id} s={s} usun={usunSamochod} />))}

                </div>


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


export default SamochodyClient;