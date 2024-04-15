import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import SubCatIntro from "../subcat/SubCatIntro";
import { withTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { t } from "i18next";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

SwiperCore.use([Navigation]);

const SubCatslider = (data) => {

    const swiperOption = {
        loop: false,
        speed: 750,
        spaceBetween: 10,
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
                        <div className="cat__Box">
                            <span className="left-line"></span>
                            <div className="sub_cat_title">
                                <h6 className="text-uppercase font-weight-bold font-smaller subcat__p">{t("sub categories")}</h6>
                            </div>
                            <span className="right-line"></span>
                        </div>

                        <div className="quizplay-slider">
                            {data.subloading ? (
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
                                                data.data.map((subcat, key) => {
                                                    return (
                                                        <SwiperSlide key={key} onClick={() => data.onClick(subcat)}>
                                                            <SubCatIntro data={subcat} active={data.selected && data.selected.id === subcat.id ? "active-one" : "unactive-one"} />
                                                        </SwiperSlide>
                                                    );
                                                })}
                                        </Swiper>
                                        ) : (
                                            <div className="text-center mt-4 commonerror">
                                                <img src={process.env.PUBLIC_URL + "/images/error/error.svg"} title="wrteam" className="error_img"/>
                                                <p>{t("No Subcategories Data Found")}</p>
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
export default withTranslation()(SubCatslider);
