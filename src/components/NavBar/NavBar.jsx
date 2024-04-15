import React from "react";
import { FaAngleDown } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { withTranslation } from "react-i18next";
const NavBar = ({ t }) => {

    const location = useLocation();

    const isActive = (to) => {
      return location.pathname === to;
    };

    return (
        <nav className="site-main-menu">
            <ul>
                <li>
                    <NavLink to={"/"} className={isActive("/") ? "navbar__link--active" : ""}>
                        <span className="menu-text">{t("Home")}</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"/quiz-play"} className={isActive("/quiz-play") ? "navbar__link--active" : ""}>
                        <span className="menu-text">{t("Quiz Play")}</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"/bookmark"} className={isActive("/bookmark") ? "navbar__link--active" : ""}>
                        <span className="menu-text">{t("bookmark")}</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"/invite-friends"} className={isActive("/invite-friends") ? "navbar__link--active" : ""}>
                        <span className="menu-text">{t("Invite Friends")}</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"/instruction"} className={isActive("/instruction") ? "navbar__link--active" : ""}>
                        <span className="menu-text">{t("Instruction")}</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to={"/leaderboard"} className={isActive("/leaderboard") ? "navbar__link--active" : ""}>
                        <span className="menu-text">{t("LeaderBoard")}</span>
                    </NavLink>
                </li>
                <li className="has-children">
                    <NavLink to="#">
                        <span className="menu-text">{t("More")}</span>
                    </NavLink>
                    <span className="menu-toggle">
                        <i className="">
                            <FaAngleDown />
                        </i>
                    </span>
                    <ul className="sub-menu">
                        <li>
                            <NavLink to={"/contact-us"} className={isActive("/contact-us") ? "navbar__link--active" : ""}>
                                <span className="menu-text">{t("Contact Us")}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={"/about-us"} className={isActive("/about-us") ? "navbar__link--active" : ""}>
                                <span className="menu-text">{t("About Us")}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={"/terms-conditions"} className={isActive("/terms-conditions") ? "navbar__link--active" : ""}>
                                <span className="menu-text">{t("Terms and Conditions")}</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={"/privacy-policy"} className={isActive("/privacy-policy") ? "navbar__link--active" : ""}>
                                <span className="menu-text">{t("Privacy Policy")}</span>
                            </NavLink>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    );
};

export default withTranslation()(NavBar);
