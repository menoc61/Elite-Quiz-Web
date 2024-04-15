import React, { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import SEO from "../components/SEO";
import { withTranslation } from "react-i18next";
import ShowScore from "../components/Quiz/common/ShowScore";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import Skeleton from "react-loading-skeleton";
import Question from "../components/Quiz/common/Question";
import ReviewAnswer from "../components/Quiz/common/ReviewAnswer";
import { getBookmarkData } from "../utils";
import { settingsData, sysConfigdata } from "../store/reducers/settingsSlice";
import { useSelector } from "react-redux";
import { trueandfalsequestionsApi, UserCoinScoreApi } from "../store/actions/campaign";
import { updateUserDataInfo } from "../store/reducers/userSlice";
import config from "../utils/config";

const MySwal = withReactContent(Swal);

const TrueandFalsePlay = ({ t }) => {
    //questions
    const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);

    //show score
    const [showScore, setShowScore] = useState(false);

    //score
    const [score, setScore] = useState(0);

    //reviewanswer
    const [reviewAnswers, setReviewAnswers] = useState(false);

    //coins
    const [coins, setCoins] = useState(0);

    //quizscore
    const [quizScore, setQuizScore] = useState(0);

    //location
    const navigate = useNavigate();

    const systemconfig = useSelector(sysConfigdata);

    const selectdata = useSelector(settingsData);

  const review_answers_deduct_coin = selectdata && selectdata.filter(item => item.type == "review_answers_deduct_coin");

    const userData = useSelector((state) => state.User);

    const TIMER_SECONDS = parseInt(systemconfig.quiz_zone_duration);

    useEffect(() => {
        if (!showScore) {
            getTrueandFalseQuestions();
        }
    }, []);

    //api
    const getTrueandFalseQuestions = () => {
        trueandfalsequestionsApi(2,10,(response) => {
                if (response.data && !response.data.error) {
                    let bookmark = getBookmarkData();
                    let questions_ids = Object.keys(bookmark).map((index) => {
                        return bookmark[index].question_id;
                    });
                    let questions = response.data.map((data) => {
                        let isBookmark = false;
                        if (questions_ids.indexOf(data.id) >= 0) {
                            isBookmark = true;
                        } else {
                            isBookmark = false;
                        }
                        return {
                            ...data,
                            isBookmarked: isBookmark,
                            selected_answer: "",
                            isAnswered: false,
                        };
                    });
                    setQuestions(questions);
                    setShowScore(false);
                    setReviewAnswers(false);
                    setScore(0);
                }
            },
            (error) => {
                console.log(error);
                toast.error(t("No Questions Found"));
                navigate("/quiz-play");
            }
        );
    };

    //answer option click
    const handleAnswerOptionClick = (questions, score) => {
        setQuestions(questions);
        setScore(score);
    };

    const handleReviewAnswerBack = () => {
        setShowScore(true);
        setReviewAnswers(false);
      };

    const onQuestionEnd = (coins, quizScore) => {
        setShowScore(true);
        setCoins(coins);
        setQuizScore(quizScore);
    };

    const handleReviewAnswers = () => {
        MySwal.fire({
            title: t("Are you sure"),
            text: review_answers_deduct_coin && Number(review_answers_deduct_coin[0].message) + " " + t("Coins will be deducted from your account"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef5488",
            cancelButtonColor: "#d33",
            confirmButtonText: t("Continue"),
            cancelButtonText: t("Cancel"),
        }).then((result) => {
            if (result.isConfirmed) {
                let coins = review_answers_deduct_coin && Number(review_answers_deduct_coin[0].message);
                if (userData.data.coins < coins) {
                    toast.error(t("You Don't have enough coins"));
                    return false;
                }
                let status = 1;
                UserCoinScoreApi(
                    "-" + coins,
                    null,
                    null,
                    "True & False Review Answer",
                    status,
                    (response) => {
                        setReviewAnswers(true);
                        setShowScore(false);
                        updateUserDataInfo(response.data);
                    },
                    (error) => {
                        Swal.fire(t("OOps"), t("Please Try again"), "error");
                        console.log(error);
                    }
                );
            }
        });
    };

    return (
        <React.Fragment>
            <SEO title={t("True and False")} />
            <Breadcrumb title={t("True & False")} content={t("Home")} contentTwo={t("True & False")} />
            <div className="true_and_false dashboard">
                <div className="container">
                    <div className="row ">
                        <div className="morphisam">
                            <div className="whitebackground pt-3">
                                {(() => {
                                    if (showScore) {
                                        return (
                                            <ShowScore score={score} totalQuestions={questions.length} coins={coins} quizScore={quizScore} reviewAnswer={true} playAgain={false} nextlevel={false} onReviewAnswersClick={handleReviewAnswers} />
                                        );
                                    } else if (reviewAnswers) {
                                        return <ReviewAnswer reportquestions={false} questions={questions} reviewlevel={false} goBack={handleReviewAnswerBack}/>;
                                    } else {
                                        return questions && questions.length >= 1 ? (
                                            <Question
                                                questions={questions}
                                                timerSeconds={TIMER_SECONDS}
                                                onOptionClick={handleAnswerOptionClick}
                                                onQuestionEnd={onQuestionEnd}
                                                showLifeLine={false}
                                                showQuestions={false}
                                                showBookmark={false}
                                            />
                                        ) : (
                                            <div className="text-center text-white">
                                                <Skeleton count={5}/>
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                        </div>
                    </div>
                    <span className="circleglass__after"></span>
                </div>
            </div>
        </React.Fragment>
    );
};

export default withTranslation()(TrueandFalsePlay);
