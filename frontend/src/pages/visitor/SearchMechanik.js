import React, {useEffect, useState} from "react";
import Footer from "../../components/Footer";
import TopBarVisitor from "../../components/visitor/TopBarVisitor";
import SearchResultMechanikVisitor from "../../components/visitor/SearchResultMechanikVisitor";
import {useTranslation} from "react-i18next";





const SearchMechanik = () => {
    const [imie, setImie] = useState("");
    const [nazwisko, setNazwisko] = useState("");
    const [lista, setLista] = useState([]);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 5;

    const {t} = useTranslation();

    async function searchSubmit() {
        setPage(1);
        fetchMechanicy(1);

    }


    useEffect(() => {
        fetchMechanicy(page);
    }, [page]);

    const fetchMechanicy = async (pageNumber = page) => {
        try {
            const res = await fetch(
                `http://localhost:3001/crimsonTorque/mechanik/search` +
                `?imie=${encodeURIComponent(imie)}` +
                `&nazwisko=${encodeURIComponent(nazwisko)}` +
                `&page=${pageNumber}&limit=${limit}`
            );

            if (!res.ok) {
                throw new Error("Błąd wyszukiwania");
            }

            const json = await res.json();

            setLista(Array.isArray(json.data) ? json.data : []);
            setTotal(typeof json.total === "number" ? json.total : 0);
        } catch (err) {
            console.error(err.message);
            setLista([]);
        }

    };


    return(
        <div className="page">
            <TopBarVisitor />

            <header>
                <h1>{t("searchMechanic.title")}</h1>
            </header>

            <main>
                <section className="search-box">
                    <form className="search-form">
                        <div className="field">
                            <label htmlFor="imie">{t("searchMechanic.fields.firstName.label")}</label>
                            <input
                                id="imie"
                                value={imie}
                                onChange={(e) => setImie(e.target.value)}
                                type="text"
                                placeholder="Jan"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="nazwisko">{t("searchMechanic.fields.lastName.label")}</label>
                            <input
                                id="nazwisko"
                                value={nazwisko}
                                onChange={(e) => setNazwisko(e.target.value)}
                                type="text"
                                placeholder="Kowalski"
                            />
                        </div>
                    </form>

                    <button
                        type="button"
                        className="submitBtn search-btn"
                        onClick={searchSubmit}
                    >
                        {t("searchMechanic.button")}
                    </button>
                </section>

                <div className="mechanik-results">
                    {lista.map((m) => (
                        <SearchResultMechanikVisitor key={Math.random()} m={m} />
                    ))}
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

            <Footer />
        </div>
        );
};

export default SearchMechanik;