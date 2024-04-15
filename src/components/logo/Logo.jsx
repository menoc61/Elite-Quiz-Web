import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

const Logo = ({ image,setIsActive }) => {
    return (
        <div className="header-logo">
            <Link to="/" onClick={() => setIsActive(false)}>
                <img className="dark-logo" src={image} alt=" Logo" />
            </Link>
        </div>
    );
};

Logo.propTypes = {
    image: PropTypes.string,
};

export default Logo;
