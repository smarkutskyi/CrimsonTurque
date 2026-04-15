import React from "react";
import Footer from "../../components/Footer";
import TopBarVisitor from "../../components/visitor/TopBarVisitor";
import {useTranslation} from "react-i18next";

const Contact = () => {
    const {t} = useTranslation();

    return (
        <div>
            <TopBarVisitor/>

            <h1>{t("contact.title")}</h1>

            <header>
                <p className="header-subtitle">{t("contact.subtitle")}</p>
            </header>

            <main>
                <section className="contact-wrapper">
                    <div className="contact-info">
                        <h2>{t("contact.info.heading")}</h2>

                        <div className="contact-item">
                            <img src="https://www.svgrepo.com/show/418962/buildings-home-house.svg"
                                 alt={t("contact.info.address.imageAlt")}/>
                            <div>
                                <strong>{t("contact.info.address.label")}</strong>
                                <p>{t("contact.info.address.value")}</p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <img src="https://www.svgrepo.com/show/533283/phone-call.svg"
                                 alt={t("contact.info.phone.imageAlt")}/>
                            <div>
                                <strong>{t("contact.info.phone.label")}</strong>
                                <p>{t("contact.info.phone.value")}</p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <img src="https://www.svgrepo.com/show/501173/email.svg"
                                 alt={t("contact.info.email.imageAlt")}/>
                            <div>
                                <strong>{t("contact.info.email.label")}</strong>
                                <p>{t("contact.info.email.value")}</p>
                            </div>
                        </div>

                        <div className="contact-hours">
                            <strong>{t("contact.info.hours.label")}</strong>
                            <p>{t("contact.info.hours.weekday")}</p>
                            <p>{t("contact.info.hours.weekend")}</p>
                        </div>
                    </div>

                    <div className="contact-form-box">
                        <form>
                            <div className="field">
                                <label htmlFor="imNz">{t("contact.form.name.label")}</label>
                                <input
                                    id="imNz"
                                    type="text"
                                    placeholder={t("contact.form.name.placeholder")}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="email">{t("contact.form.email.label")}</label>
                                <input
                                    id="email"
                                    type="text"
                                    placeholder={t("contact.form.email.placeholder")}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="temat">{t("contact.form.subject.label")}</label>
                                <input
                                    id="temat"
                                    type="text"
                                    placeholder={t("contact.form.subject.placeholder")}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="opismail">{t("contact.form.message.label")}</label>
                                <textarea
                                    id="opismail"
                                    placeholder={t("contact.form.message.placeholder")}
                                />
                            </div>

                            <button className="submitBtn contact-btn">
                                {t("contact.form.submit")}
                            </button>
                        </form>
                    </div>
                </section>
            </main>

            <Footer/>
        </div>
    );
};

export default Contact;