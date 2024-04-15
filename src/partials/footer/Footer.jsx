import React, { Fragment, useState } from "react";
import { IoLogoFacebook, IoLogoInstagram, IoLogoLinkedin, IoLogoYoutube } from "react-icons/io5";
import { Link, Navigate } from 'react-router-dom';
import Logo from "../../components/logo/Logo";
import { withTranslation } from "react-i18next";
import { settingsData } from "../../store/reducers/settingsSlice";
import { useSelector } from "react-redux";
import { websettingsData } from "../../store/reducers/webSettings";

const Footer = ({ t }) => {

    const selectdata = useSelector(settingsData);

    const appdata = selectdata && selectdata.filter(item => item.type == "app_link");

    const appLink = appdata && appdata.length > 0 ? appdata[0].message : '';

    const appiosdata = selectdata && selectdata.filter(item => item.type == "ios_app_link");

    const appiosLink = appiosdata && appiosdata.length > 0 ? appiosdata[0].message : '';

    const websettingsdata = useSelector(websettingsData);

    // facebook link
    const facebook_link_footer = websettingsdata && websettingsdata.facebook_link_footer;

    // instagram link
    const instagram_link_footer = websettingsdata && websettingsdata.instagram_link_footer;

    // linkedin link
    const linkedin_link_footer = websettingsdata && websettingsdata.linkedin_link_footer;

    // youtube link
    const youtube_link_footer = websettingsdata && websettingsdata.youtube_link_footer;

    // footer logo
    const footer_logo = websettingsdata && websettingsdata.footer_logo;

    // company text
    const company_text = websettingsdata && websettingsdata.company_text;

    // address
    const address_text = websettingsdata && websettingsdata.address_text;

    // email
    const email_footer = websettingsdata && websettingsdata.email_footer;

    // phone number
    const phone_number_footer = websettingsdata && websettingsdata.phone_number_footer;

    // web link
    const web_link_footer = websettingsdata && websettingsdata.web_link_footer;

    // company name
    const company_name_footer = websettingsdata && websettingsdata.company_name_footer;


    //social media data
    const socialdata = [
        {
            id: 1,
            sodata: <IoLogoFacebook />,
            link: facebook_link_footer ? facebook_link_footer : null,
        },
        {
            id: 2,
            sodata: <IoLogoInstagram />,
            link: instagram_link_footer ? instagram_link_footer : null,
        },
        {
            id: 3,
            sodata: <IoLogoLinkedin />,
            link: linkedin_link_footer ? linkedin_link_footer : null,
        },
        {
            id: 4,
            sodata: <IoLogoYoutube />,
            link: youtube_link_footer ? youtube_link_footer : null,
        },
    ];

    return (
        <Fragment>
            <div className="footer_wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-lg-3  col-12 footer_left">
                            <div className="footer_logo">
                                <Logo image={footer_logo} />
                            </div>
                            <div className="footer_left_text">
                                <p>{company_text}</p>
                            </div>
                            <div className="two_images d-flex align-item-center flex-wrap">
                                {appLink ?
                                    <div className="playstore_img me-1">
                                        <Link onClick={() => window.open(appLink, '_blank')}>
                                            <img src={process.env.PUBLIC_URL + `/images/footer/playstore.svg`} alt="playstore" />
                                        </Link>
                                    </div>
                                    : null}
                                {appiosLink ?
                                    <div className="playstore_img iosimg">
                                        <Link onClick={() => window.open(appiosLink, '_blank')}>
                                            <img src={process.env.PUBLIC_URL + `/images/footer/appstore.svg`} alt="ios" />
                                        </Link>
                                    </div>
                                : null }
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3  col-12 footer_left_second">
                            <div className="footer_title">
                                <h4 className="footer_heading">{t("Policy")}</h4>
                            </div>
                            <ul className="footer_policy">
                                <li className="footer_list">
                                    <Link to="/privacy-policy">{t("Privacy Policy")}</Link>
                                </li>
                                <li className="footer_list">
                                    <Link to="/terms-conditions">{t("Terms and Conditions")}</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-6 col-lg-3  col-12 footer_right">
                            <div className="footer_title">
                                <h4 className="footer_heading">{t("Company")}</h4>
                            </div>
                            <ul className="footer_policy">
                                <li className="footer_list">
                                    <Link to="/about-us">{t("About Us")}</Link>
                                </li>
                                <li className="footer_list">
                                    <Link to="/contact-us">{t("Contact Us")}</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-6 col-lg-3 col-12 footer_right">
                            <div className="footer_title">
                                <h4 className="footer_heading">{t("Find Us Here")}</h4>
                            </div>
                            <ul className="footer_policy">
                                {address_text ?
                                    <li className="footer_list_address">{address_text}</li>
                                    : null}
                                {email_footer ?
                                    <li className="footer_list_email">
                                        <a href={`mailto:${email_footer}`}>{email_footer}</a>
                                    </li>
                                    : null}
                                {phone_number_footer ?
                                    <li className="footer_list_number">
                                        <a href={`tel:${phone_number_footer}`}>{phone_number_footer}</a>
                                    </li>
                                :null}
                            </ul>
                            <ul className="footer_social">
                                {socialdata.map((data) => (
                                    <li className="footer_social_list" key={data.id}>
                                        <a href={data.link} target="_blank">
                                            <i>{data.sodata}</i>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <hr />

                    <div className="footer_copyright text-center">
                        <p>
                            {t("Copyright")} © {new Date().getFullYear()}
                            {" "}{t("Made By")}{" "}
                            <a href={web_link_footer} target="_blank">
                                {company_name_footer}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default withTranslation()(Footer);
