import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Keyboard, Pagination, Navigation, Autoplay } from "swiper/core";
import { sliderApi } from "../../../store/actions/campaign";
import { selectCurrentLanguage } from "../../../store/reducers/languageSlice";
import { useSelector } from "react-redux";
import { t } from "i18next";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";
import "swiper/components/navigation/navigation.min.css";

SwiperCore.use([Keyboard, Pagination, Navigation, Autoplay]);

const IntroSlider = () => {
    const selectcurrentLanguage = useSelector(selectCurrentLanguage);
    const [sliders, setSliders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const newSliders = (id) => {
        sliderApi(
            id,
            (response) => {
                setSliders(response.data);
                setIsLoading(false);
            },
            (error) => {
                if (error == "102") {
                    setIsLoading(false);
                }
            }
        );
    };

    useEffect(() => {
        if (selectcurrentLanguage.id) {
            newSliders(selectcurrentLanguage.id);
        }
    }, [selectcurrentLanguage]);

    const swiperOption = {
        loop: true,
        speed: 1000,
        spaceBetween: 0,
        slidesPerView: 1,
        navigation: true,
        pagination:true,
        autoplay: false,
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 1,
            },
        },
    };

    return (
        <div className="intro-slider-wrap section">
            <div className="container">
                <Swiper effect="fade" className="mySwiper" {...swiperOption}>
                    {isLoading ? (
                        // Show skeleton loading when data is being fetched
                        <div className="col-12 loading_data">
                            <Skeleton height={20} count={22} />
                        </div>
                    ) : sliders.length > 0 ? (
                        sliders.map((data, key) => (
                            <SwiperSlide key={key}>
                                <div className="slide2">
                                    <div className="container position-relative px-0">
                                        <div className="row align-items-center">
                                            <div className="col-lg-8 col-12">
                                                <div className="outer__slide1__img">{data.image ? <img src={data.image} alt="slider" /> : <Skeleton height={400} count={5} />}</div>
                                            </div>
                                            <div className="col-lg-4 col-12 mb-4 `">
                                                <div className="slider__content">
                                                    <h3>{data && data.title}</h3>
                                                    <p className="mb-4">{data && data.description ? data.description : <Skeleton />}</p>
                                                </div>
                                                <Link to={"/quiz-play"} className="btn btn-primary slider1__btn me-2">
                                                    {t("Lets Play")}
                                                </Link>
                                                <Link to={"/contact-us"} className="btn slider1__btn2 text-white">
                                                    {t("Contact Us")}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))
                    ) : (
                        // Show "No data found" message if no data is available
                        <div className="col-12 no_data">
                            <p className="text-center">{t("No Data Found! Please Add Data From Admin Panel")}</p>
                        </div>
                    )}
                </Swiper>
            </div>
        </div>
    );
};

export default withTranslation()(IntroSlider);
