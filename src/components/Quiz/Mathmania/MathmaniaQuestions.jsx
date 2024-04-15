import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Bookmark from "../../Common/Bookmark";
import { withTranslation } from "react-i18next";
import Timer from "../common/Timer";
import { decryptAnswer, calculateScore, calculateCoins, getAndUpdateBookmarkData, deleteBookmarkByQuestionID } from "../../../utils";
import { useSelector } from "react-redux";
import { sysConfigdata } from "../../../store/reducers/settingsSlice";
import { setbookmarkApi, setQuizCategoriesApi, UserCoinScoreApi, UserStatisticsApi } from "../../../store/actions/campaign";
import { updateUserDataInfo } from "../../../store/reducers/userSlice";
import { selecttempdata } from "../../../store/reducers/tempDataSlice";
import rightClick from "../../../assets/audio/right.mp3";
import wrongClick from "../../../assets/audio/wrong.mp3";

const MathmaniaQuestions = ({ t, questions: data, timerSeconds, onOptionClick, onQuestionEnd, showBookmark, showQuestions }) => {
    const [questions, setQuestions] = useState(data);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const child = useRef(null);
    const scroll = useRef(null);

    const systemconfig = useSelector(sysConfigdata);

    // store data get
    const userData = useSelector((state) => state.User);

    let getData = useSelector(selecttempdata);

    const rightclick = new Audio(rightClick);

    const wrongclick = new Audio(wrongClick);

    const [answeredQuestions, setAnsweredQuestions] = useState({});

    const addAnsweredQuestion = (item) => {
        setAnsweredQuestions({ ...answeredQuestions, [item]: true });
    };

    setTimeout(() => {
        setQuestions(data);
    }, 500);

    const setNextQuestion = () => {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
            child.current.resetTimer();
        } else {
            let coins = null;
            let userScore = null;

            let result_score = score;
            let percentage = (100 * result_score) / questions.length;
            UserStatisticsApi(questions.length,result_score,questions[currentQuestion].category,percentage,(response) => {},
                (error) => {
                    console.log(error);
                }
            );
            userScore = calculateScore(result_score, questions.length);
            // console.log("userscore",userScore)
            let status = "0";
            if (percentage >= Number(systemconfig.maximum_coins_winning_percentage)) {
                coins = calculateCoins(score, questions.length);
                UserCoinScoreApi(coins,userScore,null,"MathMania Quiz Win",status,(response) => {
                        updateUserDataInfo(response.data);
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            } else {
                UserCoinScoreApi(null,userScore,null,"MathMania Quiz Win",status,(response) => {
                        updateUserDataInfo(response.data);
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            }

            onQuestionEnd(coins, userScore);
             // set quiz categories
            if (getData.is_play === "0") {
                if (getData.maincat_id && getData.id) {
                    setQuizCategoriesApi(5, getData.maincat_id, getData.id, "", (success) => {

                    }, (error) => {
                        console.log(error);
                    })
                } else {
                    setQuizCategoriesApi(5, getData.id, "", "", (success) => {

                    }, (error) => {
                        console.log(error);
                    })
                }
            }

        }
    };

    // button option answer check
    const handleAnswerOptionClick = (selected_option) => {


        if (!answeredQuestions.hasOwnProperty(currentQuestion)) {
            addAnsweredQuestion(currentQuestion);
            let { id, answer } = questions[currentQuestion];

            let decryptedAnswer = decryptAnswer(answer, userData.data.firebase_id);
            let result_score = score;
            if (decryptedAnswer === selected_option) {
                result_score++;
                setScore(result_score);
                rightclick.play();
            } else {
                wrongclick.play();
            }
            let update_questions = questions.map((data) => {
                return data.id === id ? { ...data, selected_answer: selected_option, isAnswered: true } : data;
            });
            setQuestions(update_questions);
            setTimeout(() => {
                setNextQuestion();
            }, 1000);
            onOptionClick(update_questions, result_score);
        }
    };


    // option answer status check
    const setAnswerStatusClass = (option) => {
        if (questions[currentQuestion].isAnswered) {
            if (systemconfig && systemconfig.answer_mode === "1") {
                let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData.data.firebase_id);
                if (decryptedAnswer === option) {
                    return "bg-success";
                } else if (questions[currentQuestion].selected_answer === option) {
                    return "bg-danger";
                }
            } else if (questions[currentQuestion].selected_answer === option) {
                return "bg-dark";
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    const handleBookmarkClick = (question_id, isBookmarked) => {
        let type = 5;
        let bookmark = "0";

        if (isBookmarked) bookmark = "1";
        else bookmark = "0";

        return setbookmarkApi(question_id,bookmark,type,(response) => {
                if (response.error) {
                    toast.error(t("Cannot Remove Question from Bookmark"));
                    return false;
                } else {
                    if (isBookmarked) {
                        getAndUpdateBookmarkData(type);
                    } else {
                        deleteBookmarkByQuestionID(question_id);
                    }
                    return true;
                }
            },
            (error) => {
                console.error(error);
            }
        );
    };

    const onTimerExpire = () => {
        setNextQuestion();
    };


    return (
        <React.Fragment>
            <div className="text-end p-2 pb-0">
                {showBookmark ? <Bookmark id={questions[currentQuestion].id} isBookmarked={questions[currentQuestion].isBookmarked ? questions[currentQuestion].isBookmarked : false} onClick={handleBookmarkClick} /> : ""}
            </div>
            <div className="questions" ref={scroll}>
                <div className="inner__headerdash">
                    {showQuestions ? (
                        <div className="leveldata">
                            <h5 className="inner-level__data ">
                                {t("level")} : {questions[currentQuestion].level}
                            </h5>
                        </div>
                    ) : (
                        ""
                    )}

                    <div className="inner__headerdash">{questions && questions[0]["id"] !== "" ? <Timer ref={child} timerSeconds={timerSeconds} onTimerExpire={onTimerExpire} /> : ""}</div>

                    <div>
                        <div className="total__out__leveldata">
                            <h5 className=" inner__total-leveldata">
                                {currentQuestion + 1} | {questions.length}
                            </h5>
                        </div>
                    </div>
                </div>

                <div className="content__text">
                    <p className="question-text pt-4">{questions[currentQuestion].question}</p>
                </div>

                {questions[currentQuestion].image ? (
                    <div className="imagedash">
                        <img src={questions[currentQuestion].image} alt="" />
                    </div>
                ) : (
                    ""
                )}

                {/* options */}
                <div className="row">
                    {questions[currentQuestion].optiona ? (
                        <div className="col-md-6 col-12">
                            <div className="inner__questions">
                                <button className={`btn button__ui w-100 ${setAnswerStatusClass("a")}`} onClick={(e) => handleAnswerOptionClick("a")}>
                                    <div className="row">
                                        <div className="col">{questions[currentQuestion].optiona}</div>
                                        {questions[currentQuestion].probability_a ? <div className="col text-end">{questions[currentQuestion].probability_a}</div> : ""}
                                    </div>
                                </button>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                    {questions[currentQuestion].optionb ? (
                        <div className="col-md-6 col-12">
                            <div className="inner__questions">
                                <button className={`btn button__ui w-100 ${setAnswerStatusClass("b")}`} onClick={(e) => handleAnswerOptionClick("b")}>
                                    <div className="row">
                                        <div className="col">{questions[currentQuestion].optionb}</div>
                                        {questions[currentQuestion].probability_b ? <div className="col text-end">{questions[currentQuestion].probability_b}</div> : ""}
                                    </div>
                                </button>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                    {questions[currentQuestion].question_type === "1" ? (
                        <>
                            {questions[currentQuestion].optionc ? (
                                <div className="col-md-6 col-12">
                                    <div className="inner__questions">
                                        <button className={`btn button__ui w-100 ${setAnswerStatusClass("c")}`} onClick={(e) => handleAnswerOptionClick("c")}>
                                            <div className="row">
                                                <div className="col">{questions[currentQuestion].optionc}</div>
                                                {questions[currentQuestion].probability_c ? <div className="col text-end">{questions[currentQuestion].probability_c}</div> : ""}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            {questions[currentQuestion].optiond ? (
                                <div className="col-md-6 col-12">
                                    <div className="inner__questions">
                                        <button className={`btn button__ui w-100 ${setAnswerStatusClass("d")}`} onClick={(e) => handleAnswerOptionClick("d")}>
                                            <div className="row">
                                                <div className="col">{questions[currentQuestion].optiond}</div>
                                                {questions[currentQuestion].probability_d ? <div className="col text-end">{questions[currentQuestion].probability_d}</div> : ""}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            {systemconfig && systemconfig.option_e_mode && questions[currentQuestion].optione ? (
                                <div className="row d-flex justify-content-center mob_resp_e">
                                    <div className="col-md-6 col-12">
                                        <div className="inner__questions">
                                            <button className={`btn button__ui w-100 ${setAnswerStatusClass("e")}`} onClick={(e) => handleAnswerOptionClick("e")}>
                                                <div className="row">
                                                    <div className="col">{questions[currentQuestion].optione}</div>
                                                    {questions[currentQuestion].probability_e ? (
                                                        <div className="col" style={{ textAlign: "right" }}>
                                                            {questions[currentQuestion].probability_e}
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                        </>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </React.Fragment>
    );
}

MathmaniaQuestions.propTypes = {
    questions: PropTypes.array.isRequired,
    onOptionClick: PropTypes.func.isRequired,
};

MathmaniaQuestions.defaultProps = {
    showBookmark: true,
};

export default withTranslation()(MathmaniaQuestions);
