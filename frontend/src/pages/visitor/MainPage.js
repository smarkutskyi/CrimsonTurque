
import React from "react";
import TopBarVisitor from "../../components/visitor/TopBarVisitor";
import Footer from "../../components/Footer";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const MainPage = () => {

    const navigate = useNavigate();

    const { t } = useTranslation();

    return (
        <div>

            <TopBarVisitor />

            <header className="hero">
                <div className="hero-text">
                    <h1>{t("main.hero.title")}</h1>
                    <p>{t("main.hero.subtitle")}</p>
                    <button className="hero-btn" onClick={() => navigate("/searchMechanik")}>{t("main.hero.cta")}
                    </button>
                </div>
                <div className="hero-image">
                    <img src="https://images.hdqwalls.com/download/lamborghini-countach-a-legacy-tv-1440x900.jpg" alt="Warsztat samochodowy"/>
                </div>
            </header>
            <main>
                <section className="how-it-works">
                    <h2>{t("main.how.title")}</h2>
                    <p className="how-desc">
                        {t("main.how.description")}
                    </p>

                    <div className="steps">
                        <div className="row-steps">
                            <div className="step-card">
                                <div className="step-number">1</div>
                                <img src="https://i.pinimg.com/1200x/51/83/1d/51831deee32b0a259faa6bdea3942168.jpg"
                                     alt="Konto"/>
                                <h3>{t("main.steps.step1.title")}</h3>
                                <p>
                                    {t("main.steps.step1.description")}
                                </p>
                            </div>

                            <div className="step-card">
                                <div className="step-number">2</div>
                                <img src="https://i.pinimg.com/1200x/49/c9/20/49c92016fa8728a021e22b9860ae2c73.jpg"
                                     alt="Samochód"/>
                                <h3>{t("main.steps.step2.title")}</h3>
                                <p>
                                    {t("main.steps.step2.description")}
                                </p>
                            </div>

                        </div>

                        <div className="step-card">
                            <div className="step-number">3</div>
                            <img src="https://i.pinimg.com/1200x/ff/a8/cd/ffa8cdcf6e14067b6fe746dc0fd66f76.jpg"
                                 alt="Wizyta"/>
                            <h3>{t("main.steps.step3.title")}</h3>
                            <p>
                                {t("main.steps.step3.description")}
                            </p>
                        </div>
                    </div>
                </section>


                <section className="features">
                    <h2>{t("main.features.title")}</h2>
                    <div className="feature-cards">
                        <div className="card">
                            <img src="https://i.pinimg.com/736x/0d/d3/cb/0dd3cb9ace2c521dccd0781bae46a33b.jpg"
                                 alt="Profesjonalne narzędzia"/>
                            <h3>{t("main.features.feature1.title")}</h3>
                            <p>{t("main.features.feature1.description")}</p>
                        </div>
                        <div className="card">
                            <img src="https://i.pinimg.com/736x/ed/75/7f/ed757f7b67b716facd211f1733965417.jpg"
                                 alt="Wykwalifikowani mechanicy"/>
                            <h3>{t("main.features.feature2.title")}</h3>
                            <p>{t("main.features.feature2.description")}</p>
                        </div>
                        <div className="card">
                            <img src="https://i.pinimg.com/736x/c1/1e/42/c11e42d26cd8648c9da9fa048e913952.jpg"
                                 alt="Szybka realizacja"/>
                            <h3>{t("main.features.feature3.title")}</h3>
                            <p>{t("main.features.feature1.description")}</p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer/>
        </div>
    );
}

export default MainPage;