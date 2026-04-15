import {useEffect, useState} from "react";
import diagram from "../database_diagram.png";
import {useTranslation} from "react-i18next";


const MainAdmin = () => {

    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const {t} = useTranslation();

    useEffect(() => {
        sprawdzanie();
    }, [])

    const sprawdzanie = async () => {


        try {
            const res = await fetch("http://localhost:3001/crimsonTorque/auth/meAdmin", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });

            if (res.status === 200) {
                setAuthorized(true);
                setLoading(false);
            } else {
                setAuthorized(false);
                setLoading(false);
                console.log(res.status);
            }
        } catch (e) {
            setAuthorized(false);
        }
    }

    if (loading) return <div>Ładowanie...</div>;
    if (!authorized) return <div>Brak uprawnień!</div>;


    return (
        <div>
            <header>
                <h1>Panel administratora systemu</h1>
            </header>

            <main>

                <img
                    src={diagram}
                    alt="Struktura bazy danych"
                    className="admin-image"
                />


                <div className="admin-btn">
                    <button className="nav-btn" onClick="location.href='samochod_lista.html'">Samochód</button>
                    <button className="nav-btn" onClick="location.href='wizyta_lista.html'">Wizyta</button>
                    <button className="nav-btn" onClick="location.href='mechanik_lista.html'">Mechanik</button>
                </div>


                <section className="admin-dashboard">


                    <div className="admin-warning">
                        <h2>Uwaga – zależności w bazie danych</h2>

                        <ul>
                            <li>
                                Jeśli <strong>usuniesz wszystkie wizyty</strong> danego samochodu,
                                użytkownik straci połączenie z tym samochodem i samochód
                                nie będzie powiązany z żadnym mechanikiem.
                            </li>

                            <li>
                                Jeśli <strong>usuniesz samochód</strong>,
                                zostaną jednocześnie usunięte
                                <strong> wszystkie wizyty</strong> powiązane z tym samochodem.
                            </li>

                            <li>
                                Jeśli <strong>usuniesz mechanika</strong>,
                                zostaną jednocześnie usunięte
                                <strong> wszystkie samochody oraz wizyty</strong>
                                powiązane z tym mechanikiem.
                            </li>
                        </ul>
                    </div>

                </section>

            </main>
        </div>
    );
}


export default MainAdmin;