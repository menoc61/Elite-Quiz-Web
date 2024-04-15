import React, { Fragment } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
import { withTranslation } from "react-i18next";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import TimerSliderintro from "./TimerSliderintro";
import { sysConfigdata } from "../../../store/reducers/settingsSlice";
import { useSelector } from "react-redux";

SwiperCore.use([Navigation]);

const TimerSlider = ({ onClick, t, timeractiveIndex }) => {

  const systemconfig = useSelector(sysConfigdata);

  let self_challange_max_minutes = parseInt(systemconfig.self_challange_max_minutes);

  const limit = self_challange_max_minutes;

  let arr = [];

  for (let i = 0; i <= limit; i++){
    if (i % 3 == 0) {
      if (i != 0) {
        arr.push(i)
      }
    }
  }

  const swiperOption = {
    loop: false,
    speed: 750,
    spaceBetween: 20,
    slidesPerView: 15,
    navigation: true,
    breakpoints: {
      0: {
        slidesPerView: 2.5,
      },
      768: {
        slidesPerView: 4,
      },
      992: {
        slidesPerView: 4,
      },
      1200: {
        slidesPerView: 6,
      },
    },
    autoplay: false,
  };

  return (
    <Fragment>
      <div className="subcat__slider__context">
        <div className="container">
          <div className="row">

            {/* Select time period slider */}
            <div className="cat__Box">
              <div className="sub_cat_title">
                <p className="text-uppercase font-weight-bold font-smaller subcat__p">
                  {t("Select Time Period in Minutes")}
                </p>
              </div>
              <span className="right-line"></span>
            </div>

            <div className="quizplay-slider">
              <Swiper {...swiperOption}>
                {arr?.map((data, key) => {
                  return (
                    <SwiperSlide key={key} onClick={() => onClick(data)} className={timeractiveIndex === data ? "activeEle" : "unactiveEle"}>
                      <TimerSliderintro data={data} />
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default withTranslation()(TimerSlider);
