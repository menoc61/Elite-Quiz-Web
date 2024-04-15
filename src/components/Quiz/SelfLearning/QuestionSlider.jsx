import React, { Fragment } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
import { withTranslation } from "react-i18next";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import QuestionSliderIntro from "./QuestionSliderIntro";

SwiperCore.use([Navigation]);

const QuestionSlider = ({quetions, t,onClick,activeIndex}) => {


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
            {/* Select number of questions */}
            <div className="cat__Box">
              <div className="sub_cat_title">
                <p className="text-uppercase font-weight-bold font-smaller subcat__p">
                  {t("Select Number of Questions")}
                </p>
              </div>
              <span className="right-line"></span>
            </div>

            <div className="quizplay-slider">
              <Swiper {...swiperOption}>
                {quetions?.map((data, key) => {
                  return (
                    <SwiperSlide key={key} onClick={() => onClick(data.questions)} className={activeIndex === data.questions ? "activeEle" : "unactiveEle"}>
                      <QuestionSliderIntro data={data} />
                    </SwiperSlide>
                  );
                })}

              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default withTranslation()(QuestionSlider);
