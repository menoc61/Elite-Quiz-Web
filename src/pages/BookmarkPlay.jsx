import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Skeleton from "react-loading-skeleton";
import SEO from "../components/SEO";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { toast } from "react-toastify";
import Question from "../components/Quiz/common/Question";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { sysConfigdata } from "../store/reducers/settingsSlice";
import { getbookmarkApi } from "../store/actions/campaign";

const BookmarkPlay = ({ t }) => {
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);

    const [showBackButton, setShowBackButton] = useState(false);

    const systemconfig = useSelector(sysConfigdata);

    const TIMER_SECONDS = parseInt(systemconfig.quiz_zone_duration);

    useEffect(() => {
        getNewQuestions();
    }, []);

    // bookmark api
    const getNewQuestions = () => {
        getbookmarkApi(
            1,
            (response) => {
                let questions = response.data.map((data) => ({
                    ...data,
                    isBookmarked: false,
                    selected_answer: "",
                    isAnswered: false,
                }));
                setQuestions(questions);
                if (questions.length === 0) {
                    toast.error(t("No Data Found"));
                    navigate("/");
                }
            },
            (error) => {
                toast.error(t("No Questions Found"));
                console.log(error);
            }
        );
    };

    //answer option click
    const handleAnswerOptionClick = (questions, score) => {
        setQuestions(questions);
    };

    //back button question end
    const onQuestionEnd = () => {
        setShowBackButton(true);
    };

    //go back button
    const goBack = () => {
        navigate("/bookmark");
    };

    return (
        <React.Fragment>
            <SEO title={t("DashboardPlay")} />
            <Breadcrumb title={t("BookmarkPlay")} content={t("Home")} contentTwo={t("BookmarkPlay")} />
            <div className="dashboard">
                <div className="container">
                    <div className="row morphisam">
                        <div className="whitebackground">
                            {(() => {
                                if (showBackButton) {
                                    return (
                                        <div className="dashoptions">
                                            <div className="resettimer">
                                                <button className="btn" onClick={goBack}>
                                                    {t("Back")}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return questions && questions.length > 0 ? (
                                        <Question questions={questions} timerSeconds={TIMER_SECONDS} onOptionClick={handleAnswerOptionClick} onQuestionEnd={onQuestionEnd} showLifeLine={false} showBookmark={false} />
                                    ) : (
                                        <div className="text-center text-white">
                                            <Skeleton count={5}/>
                                        </div>
                                    );
                                }
                            })()}
                        </div>
                    </div>
                    <span className="circleglass__after"></span>
                </div>
            </div>
        </React.Fragment>
    );
};
export default withTranslation()(BookmarkPlay);
