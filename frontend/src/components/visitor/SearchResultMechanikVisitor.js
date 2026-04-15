import React from "react";
import {useTranslation} from "react-i18next";

const SearchResultMechanikVisitor = ({m}) => {

    const {t} = useTranslation();

    return (
        <section className="mechanik-card">
            <h2>{m.imie} {m.nazwisko}</h2>
            <p><strong>{t("addMechanik.phone")}:</strong> {m.telefon}</p>
            <p className="mechanik-desc">
                {m.opis}
            </p>
        </section>
    );
}


export default SearchResultMechanikVisitor;