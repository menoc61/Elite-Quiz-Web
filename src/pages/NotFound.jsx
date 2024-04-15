import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { FaArrowLeft } from "react-icons/fa";
import { withTranslation } from "react-i18next";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";

const NotFound = ({ t }) => {
    return (
        <React.Fragment>
            <SEO title={t("404")} />
            <Breadcrumb title={t("404")} content={t("Home")} contentTwo={t("404")} />
            <div className="error_page morphisam">
                <div className="image_error">
                    <img src={process.env.PUBLIC_URL + `/images/404/404.svg`} alt="404" />
                </div>
                <div className="title_error">
                    <h1>{t("Oops, looks like the page is lost")}</h1>
                </div>
                <div className="title_para">
                    <p>{t("This is not a fault, just an accident that was not intentional")}</p>
                </div>
                <div className="error_button">
                    <Link to={"/"} className="btn btn-primary">
                        <i>
                            <FaArrowLeft />
                        </i>{" "}
                        {t("Back")}
                    </Link>
                </div>
            </div>
        </React.Fragment>
    );
};

export default withTranslation()(NotFound);
