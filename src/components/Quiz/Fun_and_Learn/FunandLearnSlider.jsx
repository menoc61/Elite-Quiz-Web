import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import { withTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import FunandLearnIntro from "./FunandLearnIntro";
import { t } from "i18next";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

SwiperCore.use([Navigation]);

const FunandLearnSlider = (data) => {

    const swiperOption = {
        loop: false,
        speed: 750,
        spaceBetween: 20,
        slidesPerView: 6,
        navigation: true,
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 3,
            },
            992: {
                slidesPerView: 4,
            },
            1200: {
                slidesPerView: 4,
            },
        },
        autoplay: false,
    };
    return (
        <React.Fragment>
            <div className="subcat__slider__context">
                <div className="container">
                    <div className="row">
                        <div className="quizplay-slider">
                            {data.funandlearningloading ? (
                                <div className="text-center">
                                    <Skeleton count={5}/>
                                </div>
                            ) : (
                                <>
                                    {data.data ? (
                                        <Swiper {...swiperOption} navigation={{
                                            prevEl: ".swiper-button-prev",
                                            nextEl: ".swiper-button-next",
                                          }}>
                                            {data.data.length > 0 &&
                                                data.data.map((Fundata, key) => {
                                                    return (
                                                        <SwiperSlide key={key}>
                                                            <FunandLearnIntro data={Fundata} url={data.url} funandlearn={Fundata.id} active={data.selected && data.selected.id == Fundata.id ? "active-one" : "unactive-one"}/>
                                                        </SwiperSlide>
                                                    );
                                                })}
                                        </Swiper>
                                        ) : (
                                            <div className="text-center mt-4 commonerror">
                                                <img src={process.env.PUBLIC_URL + "/images/error/error.svg"} title="wrteam" className="error_img"/>
                                                <p>{t("No Data found")}</p>
                                            </div>

                                    )}
                                </>
                            )}
                             {/* Previous Button */}
                             <div className="swiper-button-prev">
                                <GrFormPrevious />
                            </div>
                            {/* Next Button */}
                            <div className="swiper-button-next">
                                <GrFormNext />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
export default withTranslation()(FunandLearnSlider);
