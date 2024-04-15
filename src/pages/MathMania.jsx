import React, { useState, useEffect } from "react";
import SEO from "../components/SEO";
import { toast } from "react-toastify";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { withTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { scrollhandler } from "../utils";
import excla from "../assets/images/exclamation.png";
import { t } from "i18next";
import { useSelector } from "react-redux";
import { categoriesApi, subcategoriesApi } from "../store/actions/campaign";
import { selectCurrentLanguage } from "../store/reducers/languageSlice";
import Mathmaniaslider from "../components/Quiz/Mathmania/Mathmaniaslider";
import { Loadtempdata } from "../store/reducers/tempDataSlice";
import { useNavigate } from 'react-router-dom';

const MathMania = () => {
    const [category, setCategory] = useState({ all: "", selected: "" });
    const [subCategory, setsubCategory] = useState({ all: "", selected: "" });
    const [loading, setLoading] = useState(true);
    const [subloading, setSubLoading] = useState(true);
    const selectcurrentLanguage = useSelector(selectCurrentLanguage);
    const navigate = useNavigate();

    const getAllData = () => {
        setCategory([]);
        setsubCategory([]);

        // categories api
        categoriesApi(5,(response) => {
          let categories = response.data;
                setCategory({ ...category, all: categories, selected: categories[0] });
            setLoading(false);
            setSubLoading(false);
                if (categories[0].no_of !== "0") {
                    // subcategory api
                    subcategoriesApi(categories[0].id,"",(response) => {
                      let subcategories = response.data;
                            if (!response.error && subcategories) {
                                setsubCategory({
                                    all: subcategories,
                                    selected: subcategories[0],
                                });
                                setSubLoading(false);
                            }
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

    //handle category
    const handleChangeCategory = (data) => {
        setCategory({ ...category, selected: data });
        setsubCategory([]);

        if (data.no_of !== "0") {
          setSubLoading(true);

            // subcategory api
            subcategoriesApi(data.id,"",(response) => {
                    let subcategories = response.data;
                    if (!response.error && subcategories) {
                        setsubCategory({ all: subcategories, selected: subcategories[0] });
                        setSubLoading(false);

                    } else {
                        toast.error(t("No Subcategories Found"));
                    }
                },
                (error) => {
                    console.log(error);
                }
            );
        }else {
          navigate({ pathname: "/math-mania-play" });
          Loadtempdata(data);
      }

        //mobile device scroll handle
        scrollhandler(500);
    };

    //truncate text
    const truncate = (txtlength) => (txtlength?.length > 17 ? `${txtlength.substring(0, 17)}...` : txtlength);

    useEffect(() => {
        getAllData();
    }, [selectcurrentLanguage]);

    return (
        <React.Fragment>
            <SEO title={t("Math Mania")} />
            <Breadcrumb title={t("Math Mania")} content={t("Home")} contentTwo={t("Math Mania")} />
            <div className="quizplay mb-5 Math Mania">
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
                                                            <p className="text-dark">{t("No Category Data Found")}</p>
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
                                <Mathmaniaslider data={subCategory.all} url={`/math-mania-play`} selected={subCategory.selected} subloading={subloading} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
export default withTranslation()(MathMania);
