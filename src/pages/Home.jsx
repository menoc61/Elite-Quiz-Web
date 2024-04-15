import React, { Fragment, useEffect } from "react";
import SEO from "../components/SEO";
import ScrollToTop from "../components/ScrollToTop";
import { getAndUpdateBookmarkData, isLogin } from "../utils";
import { t } from "i18next";
import ChooseUS from "../components/home/Chooseus/ChooseUS";
import IntroSlider from "../components/home/IntroSlider/IntroSlider";
import Feature from "../components/home/feature/Feature";
import Process from "../components/home/process/Process";


const Home = () => {
    useEffect(() => {
        if (isLogin()) {
            getAndUpdateBookmarkData();
        }
    }, []);
    return (
        <Fragment>
            <SEO title={t("Home")} />
            <IntroSlider />
            <ChooseUS />
            <Feature />
            <Process/>
            <ScrollToTop />
        </Fragment>
    );
};

export default Home;
