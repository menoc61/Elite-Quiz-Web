import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SEO from "../../SEO";
import Breadcrumb from "../../Breadcrumb/Breadcrumb";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ShowScore from "./../common/ShowScore";
import { withTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { getBookmarkData } from "../../../utils";
import { useSelector } from "react-redux";
import { selecttempdata } from "../../../store/reducers/tempDataSlice";
import { getmathQuestionsApi, UserCoinScoreApi } from "../../../store/actions/campaign";
import { updateUserDataInfo } from "../../../store/reducers/userSlice";
import MathmaniaQuestions from "./MathmaniaQuestions";
import Mathmaniareviewanswer from "./Mathmaniareviewanswer";
import { settingsData } from "../../../store/reducers/settingsSlice";

const MySwal = withReactContent(Swal);

const MathmaniaPlay = ({ t }) => {
    let getData = useSelector(selecttempdata);

    const selectdata = useSelector(settingsData);

    const review_answers_deduct_coin = selectdata && selectdata.filter(item => item.type == "review_answers_deduct_coin");

    const navigate = useNavigate();

    const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);

    const [showScore, setShowScore] = useState(false);

    const [score, setScore] = useState(0);

    const [reviewAnswers, setReviewAnswers] = useState(false);

    const [quizScore, setQuizScore] = useState(0);

    // store data get

    const userData = useSelector((state) => state.User);

    const maths_quiz_seconds = selectdata && selectdata.filter(item => item.type == "maths_quiz_seconds");

    const timerseconds = Number(maths_quiz_seconds[0].message);

    const TIMER_SECONDS = timerseconds;

    useEffect(() => {
        if (getData) {
            if (getData.subcategory_name) {
              getNewQuestions("subcategory", getData.id);
            } else {
              getNewQuestions("category", getData.id);
            }
          }
    }, []);

    //use Mathjax to remove unused data from data
    function Latex({ children }) {
        const node = useRef(null);

        useEffect(() => {
            renderMath();
        }, [children]);

        const renderMath = () => {
            window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, node.current]);
        };

        return <div ref={node}>{children}</div>;
    }

    const getNewQuestions = (type, type_id) => {
        getmathQuestionsApi(type, type_id, (response) => {
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

                    let questionText = data.question ? data.question.replace(/<[^>]+>/g, "").replace(/\&nbsp;/g, "").trim() : "";

                    let question = <Latex>{questionText}</Latex>;

                    let options = {
                        optiona: data.optiona ?(
                            <Latex>
                                {data.optiona.replace(/<[^>]+>/g, "").replace(/\&nbsp;/g, "").trim()}
                            </Latex>
                        ): null,
                        optionb: data.optionb ? (
                            <Latex>
                                {data.optionb.replace(/<[^>]+>/g, "").replace(/\&nbsp;/g, "").trim()}
                            </Latex>
                        ): null,
                        optionc: data.optionc ? (
                            <Latex>
                                { data.optionc.replace(/<[^>]+>/g, "").replace(/\&nbsp;/g, "").trim()}
                            </Latex>
                        ): null,
                        optiond: data.optiond ? (
                            <Latex>
                                {data.optiond.replace(/<[^>]+>/g, "").replace(/\&nbsp;/g, "").trim()}
                            </Latex>
                        ): null,
                        optione: data.optione ? (
                            <Latex>
                                {data.optione.replace(/<[^>]+>/g, "").replace(/\&nbsp;/g, "").trim()}
                            </Latex>
                        ) : null,
                    };

                    return {
                        ...data,
                        ...options,
                        question: question,
                        isBookmarked: isBookmark,
                        selected_answer: "",
                        isAnswered: false,
                    };
                });

                setQuestions(questions);
                setShowScore(false);
                setReviewAnswers(false);
                setScore(0);
            },
            (error) => {
                toast.error(t("No Questions Found"));
                navigate("/quiz-play");
                console.log(error);
            }
        );
    };

    const handleAnswerOptionClick = (questions, score) => {
        setQuestions(questions);
        setScore(score);
    };

    const onQuestionEnd = (coins, quizScore) => {
        setShowScore(true);
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
                UserCoinScoreApi("-" + coins,null,null,"MathMania Review Answer",status,(response) => {
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

    const handleReviewAnswerBack = () => {
        setShowScore(true);
        setReviewAnswers(false);
    };

    const playAgain = () => {
        if (showScore && getData) {
            if (getData) {
                if (getData.subcategoryid) {
                    getNewQuestions("subcategory", getData.subcategoryid);
                } else {
                    getNewQuestions("category", getData.category_id);
                }
            }
        }
    };

    return (
        <React.Fragment>
            <SEO title={t("MathmaniaPlay")} />
            <Breadcrumb title={t("MathmaniaPlay")} content={t("Home")} contentTwo={t("MathmaniaPlay")} />
            <div className="funandlearnplay MathmaniaPlay dashboard">
                <div className="container">
                    <div className="row ">
                        <div className="morphisam">
                            <div className="whitebackground pt-3">
                                {(() => {
                                    if (showScore) {
                                        return (
                                            <ShowScore
                                                score={score}
                                                totalQuestions={questions.length}
                                                onPlayAgainClick={playAgain}
                                                onReviewAnswersClick={handleReviewAnswers}
                                                quizScore={quizScore}
                                                showQuestions={true}
                                                reviewAnswer={true}
                                                playAgain={false}
                                                nextlevel={false}
                                            />
                                        );
                                    } else if (reviewAnswers) {
                                        return <Mathmaniareviewanswer reportquestions={false} questions={questions} goBack={handleReviewAnswerBack} />;
                                    } else {
                                        return questions && questions.length > 0 ? (
                                            <MathmaniaQuestions questions={questions} timerSeconds={TIMER_SECONDS} onOptionClick={handleAnswerOptionClick} onQuestionEnd={onQuestionEnd} showQuestions={false} />
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
export default withTranslation()(MathmaniaPlay);
