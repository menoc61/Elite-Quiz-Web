import React, { lazy, Suspense, useEffect, useState } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import NavScrollTop from "./components/NavScrollTop";
import language from "./utils/language";
import { settingsLoaded, sysConfigdata, systemconfigApi } from "./store/reducers/settingsSlice";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Router from "./routes/Router";
import TopHeader from "./components/smalltopheader/TopHeader";
import Header from "./partials/header/Header";
import Footer from "./partials/footer/Footer";
import { RiseLoader } from "react-spinners";
import { selectCurrentLanguage } from "./store/reducers/languageSlice";
import { LoadWebSettingsDataApi, websettingsData } from "./store/reducers/webSettings";

// import AdSense from "./components/adsense/Adsense";

// CSS File Here
import "antd/dist/antd.min.css";
import "./assets/css/fonts/fonts.css";
import "./assets/css/vendor/animate.css";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import 'react-tooltip/dist/react-tooltip.css'
import "./assets/css/bootstrap.min.css";
import "./assets/scss/style.scss";


// Maintenance Mode
const Maintainance = lazy(() => import("./pages/Maintainance"));

const App = () => {
    const { i18n } = useTranslation();

    const [redirect, setRedirect] = useState(false);

    const [LoadData, setLoadData] = useState(false);

    const selectcurrentLanguage = useSelector(selectCurrentLanguage);

    // all settings data
    useEffect(() => {
        // load data in redux
        settingsLoaded("");

        LoadWebSettingsDataApi(
            (response) => {
                setLoadData(true);
            },
            () => {}
        );

        systemconfigApi(
            (success) => {},
            (error) => {
                console.log(error);
            }
        );

        i18n.changeLanguage(selectcurrentLanguage.code);
    }, []);

    // Maintainance Mode
    const getsysData = useSelector(sysConfigdata);

    useEffect(() => {
        if (getsysData && getsysData.app_maintenance === "1") {
            setRedirect(true);
        } else {
            setRedirect(false);
        }
    }, [getsysData.app_maintenance]);

    const websettingsdata = useSelector(websettingsData);

    const rtl_support = websettingsdata && websettingsdata.rtl_support;


    // rtl
    useEffect(() => {
        if (rtl_support === "1") {
        document.documentElement.dir = "rtl";
        } else {
        document.documentElement.dir = "ltr";
        }
    }, [rtl_support]);

    // loader
    const loaderstyles = {
        loader: {
          textAlign: "center",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        },
        img: {
          maxWidth: "100%",
          maxHeight: "100%",
        },
    };


    return (
        <I18nextProvider i18n={language}>
            <ToastContainer theme="colored" />
            {LoadData ? (
                <>
                    {/* <AdSense /> */}
                    <TopHeader />
                    <Header />
                    <NavScrollTop>
                        {redirect ? (
                            <Routes>
                                <Route path="*" exact={true} element={<Maintainance />} />
                            </Routes>
                        ) : (
                            <Suspense
                                fallback={
                                    <div className="loader" style={loaderstyles.loader}>
                                        <RiseLoader color="#ef5488" className="inner_loader" style={loaderstyles.img}/>
                                    </div>
                                }
                            >
                                <Router />
                            </Suspense>
                        )}
                    </NavScrollTop>
                    <Footer />
                </>
            ) : (
                <div className="loader" style={loaderstyles.loader}>
                    <RiseLoader color="#ef5488" className="inner_loader" style={loaderstyles.img}/>
                </div>
            )}
        </I18nextProvider>
    );
};
export default App;
