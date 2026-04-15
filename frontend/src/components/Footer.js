import React from "react";
import {useTranslation} from "react-i18next";

const Footer = () => {

    const {t} = useTranslation();

    return (
        <footer>
            <div className="footer-content">
                <p> 2025 CrimsonTorque. {t("footer")}</p>
                <div className="socials">
                    <a href="https://www.facebook.com/MercedesBenz/"><img
                        src="https://www.svgrepo.com/show/341807/facebook.svg" alt="Facebook"/></a>
                    <a href="https://www.instagram.com/mercedesbenz/"><img
                        src="https://www.svgrepo.com/show/353905/instagram-icon.svg" alt="Instagram"/></a>
                    <a href="https://x.com/MercedesBenz/with_replies"><img
                        src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/x-social-media-black-icon.svg"
                        alt="Twitter"/></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;