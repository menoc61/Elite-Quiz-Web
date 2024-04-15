import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Breadcrumb = ({ title, content, contentTwo }) => {
    return (
        <React.Fragment>
            <div className="breadcrumb__wrapper">
               
                    <div className="row">
                        <div className="Breadcrumb">
                            <div className="page-title">
                                <h1 className="title">{title}</h1>
                            </div>
                            <div className="breadcrumb__inner">
                                <ul className="breadcrumb justify-content-center">
                                    <li className="parent__link">
                                        <Link to={"/"}>{content}</Link>
                                    </li>
                                    <li className="current">{contentTwo}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

            </div>
        </React.Fragment>
    );
};

Breadcrumb.propTypes = {
    title: PropTypes.string,
    content: PropTypes.string,
    contentTwo: PropTypes.string,
};

export default Breadcrumb;
