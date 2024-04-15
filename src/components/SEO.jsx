import PropTypes from "prop-types";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { settingsData } from "../store/reducers/settingsSlice.js";
import { websettingsData } from "../store/reducers/webSettings.js";

const SEO = ({ title }) => {

    const selectdata = useSelector(settingsData);

    // app name
    const appdata = selectdata && selectdata.filter(item => item.type == "app_name");

    const appName = appdata && appdata.length > 0 ? appdata[0].message : '';

    // logo
    const websettingsdata = useSelector(websettingsData);

    // favicon
    const faviconimage = websettingsdata && websettingsdata.faviconimage;

    // description
    const description = websettingsdata && websettingsdata.description;

    // meta keywords
    const metakeywords = websettingsdata && websettingsdata.metakeywords;

    return (
        <Helmet>
            <meta charSet="utf-8" />
            <link rel="icon" href={faviconimage} />
            <title>{appName + " | " + title}</title>
            <meta name="robots" content="INDEX,FOLLOW" />
            <meta name="description" content={description} />
            <meta name="keywords" content={metakeywords}></meta>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <meta property="og:title" content={appName + " | " + title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
        </Helmet>
    );
};

SEO.propTypes = {
    title: PropTypes.string,
};

export default SEO;
