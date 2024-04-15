import React from "react";
import { useSelector } from "react-redux";
import { websettingsData } from "../../../store/reducers/webSettings";

const Feature = () => {
    const websettingsdata = useSelector(websettingsData);
    return (
        <>
            <section className="quiz_features bg-white py-5">
                <div className="container">
                    <div className="row">
                        <div className="title">
                            <h2>
                                <span class="left"></span>
                                {websettingsdata && websettingsdata.section2_heading }
                                <span class="right"></span>
                            </h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-6 col-12">
                            <div className="feature_right pb-4">
                                <img src={websettingsdata && websettingsdata.section2_cover_image } />
                            </div>
                        </div>
                        <div className="col-xl-6 col-12">
                            <div className="feature_box">
                                <div className="feature-box wow fadeInLeft animated">
                                    <div className="inner_feature">
                                        <div className="feature-title">
                                            <p>{websettingsdata && websettingsdata.section2_title_desc_title1 }</p>
                                        </div>
                                        <div className="feature_desc">
                                            <p>{websettingsdata && websettingsdata.section2_title_desc_desc1 }</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="feature-box wow fadeInLeft animated">
                                    <div className="inner_feature">
                                        <div className="feature-title">
                                            <p>{websettingsdata && websettingsdata.section2_title_desc_title2 }</p>
                                        </div>
                                        <div className="feature_desc">
                                            <p>{websettingsdata && websettingsdata.section2_title_desc_desc2 }</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="feature-box wow fadeInRight animated">
                                    <div className="inner_feature">
                                        <div className="feature-title">
                                            <p>{websettingsdata && websettingsdata.section2_title_desc_title3 }</p>
                                        </div>
                                        <div className="feature_desc">
                                            <p>{websettingsdata && websettingsdata.section2_title_desc_desc3 }</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="feature-box wow fadeInRight animated">
                                    <div className="inner_feature">
                                        <div className="feature-title">
                                            <p>{websettingsdata && websettingsdata.section2_title_desc_title4 }</p>
                                        </div>
                                        <div className="feature_desc">
                                            <p>{websettingsdata && websettingsdata.section2_title_desc_desc4 }</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};

export default Feature;
