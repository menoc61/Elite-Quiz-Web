import React from "react";
import { withTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import SEO from "../components/SEO";
import { settingsData } from "../store/reducers/settingsSlice";
import { useSelector } from "react-redux";
import purify from "dompurify";

const TermAndConditions = ({ t }) => {

    const selectdata = useSelector(settingsData);

    const appdata = selectdata.filter(item => item.type === "terms_conditions");

    const data = appdata[0].message;

    return (
        <React.Fragment>
            <SEO title={t("Terms and Conditions")} />
            <Breadcrumb title={t("Terms and Conditions")} content={t("Home")} contentTwo={t("Terms and Conditions")} />
            <div className="Instruction">
                <div className="container">
                    <div className="row morphisam">
                        {data ? (
                            <div className="col-12 " dangerouslySetInnerHTML={{ __html:purify.sanitize(data)}}></div>
                        ) : (
                            <div className="text-center text-white">
                                <Skeleton count={5}/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
export default withTranslation()(TermAndConditions);
