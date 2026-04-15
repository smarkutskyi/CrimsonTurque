import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <main>
            <section className="details-box">
                <h2>404 – Nie znaleziono strony</h2>
                <p>Podany adres nie prowadzi do żadnej istniejącej strony.</p>

                <div id="przyciski">
                    <Link to="/">
                        <button className="submitBtn">Wróć</button>
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default NotFound;