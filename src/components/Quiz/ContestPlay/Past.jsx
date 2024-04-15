import React, { Fragment, useEffect, useState } from "react";
import { t } from "i18next";
import { withTranslation } from "react-i18next";
import Skeleton from 'react-loading-skeleton';

const Past = ({ data, onClick }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    }, [loading]);

    return (
        <Fragment>
            <div className="row">
                {loading ? (
                    <div className="text-center">
                        <Skeleton count={5}/>
                    </div>
                ) : (
                    <>
                        {data ? (
                            data?.map((pastData, index) => {
                                return (
                                    <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12" key={index}>
                                        <div className="card">
                                            <div className="card-image">
                                                <img src={pastData.image} alt="wrteam" />
                                            </div>
                                            <div className="card-details">
                                                <div className="card-title">
                                                    <h3>{pastData.name}</h3>
                                                    <p>{pastData.description}</p>
                                                </div>

                                                <div className="card-footer">
                                                    <div className="upper-footer">
                                                        <div className="card-entry-fees">
                                                            <p>{t("Entry Fees")}</p>
                                                            <span>{pastData.entry}</span>
                                                        </div>
                                                        <div className="card-ends-on">
                                                            <p>{t("Ends On")}</p>
                                                            <span>{pastData.end_date}</span>
                                                        </div>
                                                    </div>

                                                    <div className="bottom-footer">
                                                        <div className="card-players">
                                                            <p>{t("players")}</p>
                                                            <span>{pastData.participants}</span>
                                                        </div>
                                                        <div className="card-btn-play">
                                                            <p className="btn btn-play" onClick={() => onClick(pastData.id)}>
                                                                {t("Leaderboard")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                            ) : (
                                <div className="text-center mt-4 commonerror">
                                    <img src={process.env.PUBLIC_URL + "/images/error/error.svg"} title="wrteam" className="error_img"/>
                                    <p>{t("No Past Contest")}</p>
                                </div>

                        )}
                    </>
                )}
            </div>
        </Fragment>
    );
};

export default withTranslation()(Past);
