import React, { Fragment, useState, useEffect } from "react";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import SEO from "../components/SEO";
import { withTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import excla from "../assets/images/exclamation.png";
import { useNavigate } from 'react-router-dom';
import AudioQuestionsSlider from "../components/Quiz/AudioQuestions/AudioQuestionsSlider";
import { selectCurrentLanguage } from "../store/reducers/languageSlice";
import { categoriesApi, subcategoriesApi } from "../store/actions/campaign";
import { Loadtempdata } from "../store/reducers/tempDataSlice";

const AudioQuestions = ({ t }) => {
    const [loading, setLoading] = useState(true);
    const [subloading, setSubLoading] = useState(true);
    const [category, setCategory] = useState({ all: "", selected: "" });
    const [subCategory, setsubCategory] = useState({ all: "", selected: "" });
    const navigate = useNavigate();

    const getAllData = () => {
        setCategory([]);

        categoriesApi(4,
            (response) => {
                let categories = response.data;
                setCategory({ ...category, all: categories, selected: categories[0] });
                setLoading(false);
                setSubLoading(false);
                if (categories[0].no_of != "0") {
                    subcategoriesApi(categories[0].id, "", (response) => {
                        let subcategories = response.data;
                        setsubCategory({
                            all: subcategories,
                            selected:subcategories[0]
                        })
                        setSubLoading(false);
                        },
                        (error) => {
                            console.log(error);
                        }
                    );
                }
            },
            (error) => {
                console.log(error);
                toast.error(t("No Data found"));
            }
        );
    };

    const handleChangeCategory = (data) => {
        setCategory({ ...category, selected: data });
        setsubCategory([])
        setLoading(false);

        if (data.no_of != "0") {
            subcategoriesApi(data.id, "", (response) => {
                let subcategories = response.data;
                setsubCategory({
                    all: subcategories,
                    selected:subcategories[0]
                })
                },
                (error) => {
                    console.log(error);
                }
            );
        } else if (data.no_of_que === "0") {
            setsubCategory("");
            toast.error(t("No Subcategories Data Found"));
        } else {
            navigate({ pathname: "/audio-questions-play" });
            Loadtempdata(data);
        }
    };

    const truncate = (txtlength) => (txtlength?.length > 17 ? `${txtlength.substring(0, 17)}...` : txtlength);

    useEffect(() => {
        getAllData();
    }, [selectCurrentLanguage]);

    return (
        <Fragment>
            <SEO title={t("Audio Questions")} />
            <Breadcrumb title={t("Audio Questions")} content={t("Home")} contentTwo={t("Audio Questions")} />
            <div className="Guesstheword AudioQuestion mb-5">
                <div className="container">
                    <div className="row morphisam mb-5">
                        <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-12 col-12">
                            <div className="left-sec">
                                {/* left category sec*/}
                                <div className="bottom__left">
                                    <div className="cat__Box">
                                        <span className="left-line"></span>
                                        <h3 className="quizplay__title text-uppercase font-weight-bold">{t("Categories")}</h3>
                                        <span className="right-line"></span>
                                    </div>
                                    <div className="bottom__cat__box">
                                        <ul className="inner__Cat__box">
                                            {loading ? (
                                                <div className="text-center">
                                                    <Skeleton count={5}/>
                                                </div>
                                            ) : (
                                                <>
                                                    {category.all ? (
                                                        category.all.map((data, key) => {
                                                            return (
                                                                <li className="d-flex" key={key} onClick={(e) => handleChangeCategory(data)}>
                                                                    <div className={`w-100 button ${category.selected && category.selected.id === data.id ? "active-one" : "unactive-one"}`}>
                                                                        <span className="Box__icon">
                                                                            <img src={data.image ? data.image : `${excla}`} alt="image" />
                                                                        </span>
                                                                        <p className="Box__text">{truncate(data.category_name)}</p>
                                                                    </div>
                                                                </li>
                                                            );
                                                        })
                                                    ) : (
                                                        <div className="text-center">
                                                            <p>{t("No Category Data Found")}</p>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* sub category middle sec */}
                        <div className="col-xxl-9 col-xl-8 col-lg-8 col-md-12 col-12">
                            <div className="right-sec">
                                <AudioQuestionsSlider data={subCategory.all} selected={subCategory.selected} url={`/audio-questions-play`} Questionsloader={subloading} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default withTranslation()(AudioQuestions);
