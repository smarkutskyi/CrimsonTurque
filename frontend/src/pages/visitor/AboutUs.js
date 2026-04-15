import React from "react";
import TopBarVisitor from "../../components/visitor/TopBarVisitor";
import Footer from "../../components/Footer";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const AboutUs = () => {

    const {t} = useTranslation();

    const navigate = useNavigate();

    return (
        <div>
            <TopBarVisitor />

            <header>
                <h1>{t("about.title")}</h1>
            </header>

            <main>
                <section className="about-row about-left">
                    <div className="about-text">
                        <h2>{t("about.section1.heading")}</h2>
                        <p className="text-large">{t("about.section1.text")}</p>
                    </div>

                    <div className="about-image">
                        <img
                            src="https://i.pinimg.com/1200x/1b/24/43/1b2443f4eb1a38c84cbed2132f06e25f.jpg"
                            alt="photoAbout"
                        />
                    </div>
                </section>

                <section className="about-row about-right">
                    <div className="about-image">
                        <img
                            src="https://i.pinimg.com/736x/9f/4f/2a/9f4f2af4ae8708b283bd329ddaa23349.jpg"
                            alt="photoAbout"
                        />
                    </div>

                    <div className="about-text">
                        <h2>{t("about.section2.heading")}</h2>
                        <p className="text-large">{t("about.section2.text")}</p>
                    </div>
                </section>

                <section className="about-cta">
                    <h2>{t("about.section3.heading")}</h2>
                    <p className="text-large">{t("about.section3.text")}</p>

                    <div id="przyciski">
                        <button
                            className="submitBtn"
                            onClick={() => navigate("/rejestracja")}
                        >
                            {t("about.section3.cta")}
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutUs;