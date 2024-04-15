import React, { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import SEO from "../components/SEO";
import { FaRegCopy, FaTwitter, FaWhatsapp, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const Invite_friends = ({ t }) => {
    const [copyState, setCopyState] = useState(0);

    const userData = useSelector((state) => state.User);

    const clickToCopy = (event) => {
        event.preventDefault();
        if (navigator.clipboard !== undefined) {
            //Chrome
            navigator.clipboard.writeText(userData.data && userData.data.refer_code).then(
                function () {},
                function (err) {}
            );
        } else if (window.clipboardData) {
            // Internet Explorer
            window.clipboardData.setData("Text", userData.data && userData.data.refer_code);
        }

        setCopyState(1);
        setTimeout(() => {
            setCopyState(0);
        }, 1000);
    };
    return (
        <React.Fragment>
            <SEO title={t("Invite Friends")} />
            <Breadcrumb title={t("Invite Friends")} content={t("Home")} contentTwo={t("Invite Friends")} />
            <div className="Invite__friends">
                <div className="container">
                    <div className="row morphisam">
                        <div className="col-lg-6 col-md-12 col-12">
                            <div className="invite_friends_image">
                                <img src={process.env.PUBLIC_URL + `/images/refer-earn/refer-earn.svg`} alt="invite friends" />
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-12 border_line justify-content-center align-items-center d-flex flex-column text-center">
                            <div className="refer_earn_title">
                                <h3>
                                    <b> {t("Refer and Earn")}</b>
                                </h3>
                                <p>{t("Refer and Earn Text")}</p>
                                <h5>
                                    <b>{t("Your Referral Code")}</b>
                                </h5>
                            </div>
                            <div className="copy__referal">
                                <input type="text" name="refercode" id="referCode" className="rounded text-center refer-border" value="" placeholder={userData.data.refer_code} readOnly />
                                <button className="btn-primary">
                                    <span className="icon1">
                                        <Link
                                            to={""}
                                            onClick={(event) => {
                                                clickToCopy(event);
                                            }}
                                        >
                                            {" "}
                                            <i>
                                                <FaRegCopy />
                                            </i>
                                            &nbsp;{copyState ? t("Copied") : t("Tap to Copy")}
                                        </Link>
                                    </span>
                                </button>
                            </div>
                            <div className="invite__now">
                                <p>
                                    <b>{t("Invite Now")}:</b>
                                </p>
                                <ul className="social__icons">
                                    <li>
                                        <a href={"https://web.whatsapp.com/send?text=" + userData.data.refer_code} target="_blank" rel="noreferrer">
                                            <i>
                                                <FaWhatsapp />
                                            </i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href={"https://twitter.com/intent/tweet?text=" + userData.data.refer_code} target="_blank" rel="noreferrer">
                                            <i>
                                                <FaTwitter />
                                            </i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href={"http://www.facebook.com/sharer.php?u=" + window.location.protocol + "//" + window.location.hostname + "&quote=" + userData.data.refer_code} target="_blank" rel="noreferrer">
                                            <i>
                                                <FaFacebook />
                                            </i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
export default withTranslation()(Invite_friends);
