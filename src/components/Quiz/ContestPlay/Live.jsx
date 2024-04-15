import React, { Fragment, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { t } from "i18next";
import { withTranslation } from "react-i18next";

const Live = ({ data, onClick }) => {

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
                            data?.map((livedata, index) => {
                                return (
                                    <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12" key={index}>
                                        <div className="card">
                                            <div className="card-image">
                                                <img src={livedata.image} alt="wrteam" />
                                            </div>
                                            <div className="card-details">
                                                <div className="card-title">
                                                    <h3>{livedata.name}</h3>
                                                    <p>{livedata.description}</p>
                                                </div>

                                                <div className="card-footer">
                                                    <div className="upper-footer">
                                                        <div className="card-entry-fees">
                                                            <p>{t("Entry Fees")}</p>
                                                            <span>{livedata.entry}</span>
                                                        </div>
                                                        <div className="card-ends-on">
                                                            <p>{t("Ends On")}</p>
                                                            <span>{livedata.end_date}</span>
                                                        </div>
                                                    </div>

                                                    <div className="bottom-footer">
                                                        <div className="card-players">
                                                            <p>{t("players")}</p>
                                                            <span>{livedata.participants}</span>
                                                        </div>
                                                        <div className="card-btn-play">
                                                            <p className="btn btn-play" onClick={() => onClick(livedata.id,livedata.entry)}>
                                                                {t("Play")}
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
                                    <p>{t("No Live Contest")}</p>
                                </div>

                        )}
                    </>
                )}
            </div>
        </Fragment>
    );
};

export default withTranslation()(Live);
