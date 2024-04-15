import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Bookmark from "../../Common/Bookmark";
import { withTranslation } from "react-i18next";
import Timer from "../common/Timer";
import { decryptAnswer, calculateScore, calculateCoins } from "../../../utils";
import { useSelector } from "react-redux";
import { sysConfigdata } from "../../../store/reducers/settingsSlice";
import { getusercoinsApi, setBadgesApi, setQuizCategoriesApi, UserCoinScoreApi, UserStatisticsApi } from "../../../store/actions/campaign";
import { updateUserDataInfo } from "../../../store/reducers/userSlice";
import { selecttempdata } from "../../../store/reducers/tempDataSlice";
import rightClick from "../../../assets/audio/right.mp3";
import wrongClick from "../../../assets/audio/wrong.mp3";
import { badgesData, LoadNewBadgesData } from "../../../store/reducers/badgesSlice";

const FunandLearnQuestions = ({ t, questions: data, timerSeconds, onOptionClick, onQuestionEnd, showBookmark, showQuestions }) => {
    const [questions, setQuestions] = useState(data);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const child = useRef(null);
    const scroll = useRef(null);

    const systemconfig = useSelector(sysConfigdata);

    // store data get
    const userData = useSelector((state) => state.User);

    const Badges  = useSelector(badgesData);

    const flashback_status = Badges && Badges.data.flashback.status;

    const flashback_coin = Badges && Badges.data.flashback.badge_reward;

    let getData = useSelector(selecttempdata);

    setTimeout(() => {
        setQuestions(data);
    }, 500);

    const rightclick = new Audio(rightClick);

    const wrongclick = new Audio(wrongClick);

    const [answeredQuestions, setAnsweredQuestions] = useState({});

    const addAnsweredQuestion = (item) => {
        setAnsweredQuestions({ ...answeredQuestions, [item]: true });
    };


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
                UserCoinScoreApi(coins,userScore,null,"Fun and Play Quiz Win",status,(response) => {
                        updateUserDataInfo(response.data);
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            } else {
                UserCoinScoreApi(null,userScore,null,"Fun and Play Quiz Win",status,(response) => {
                        updateUserDataInfo(response.data);
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            }

            onQuestionEnd(coins, userScore);
            // set quiz categories api
            if (getData.is_play === "0") {
                setQuizCategoriesApi(2, getData.category, getData.subcategory, getData.id, (success) => {

                }, (error) => {
                    console.log(error);
                })
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

            let seconds = child.current.getTimerSeconds();

            let update_questions = questions.map((data) => {
                return data.id === id ? { ...data, selected_answer: selected_option, isAnswered: true,timer_seconds:seconds } : data;
            });
            checktotalQuestion(update_questions)
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

    const onTimerExpire = () => {
        setNextQuestion();
    };

    // flashback badge logic
    const checktotalQuestion = (update_question) => {
        if (questions.length < 5) {
            return;
        };
        const allTimerSeconds = update_question.map(quizDataObj => quizDataObj.timer_seconds).filter(timerSeconds => timerSeconds <= 8);
        if (flashback_status === "0" && (allTimerSeconds.length == 5)) {
            setBadgesApi("flashback", () => {
                LoadNewBadgesData("flashback","1")
                toast.success(t("You Won Flashback Badge"));
                const status = 0;
                UserCoinScoreApi(flashback_coin, null, null, (t("flashback badge reward")), status, (response) => {
                    getusercoinsApi((responseData) => {
                        updateUserDataInfo(responseData.data)
                    }, (error) => {
                        console.log(error);
                    });
                    }, (error) => {
                    console.log(error);
                    }
                )
            }, (error) => {
                console.log(error);
            });
        }
    }

    return (
        <React.Fragment>
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

FunandLearnQuestions.propTypes = {
    questions: PropTypes.array.isRequired,
    onOptionClick: PropTypes.func.isRequired,
};

FunandLearnQuestions.defaultProps = {
    showBookmark: true,
};

export default withTranslation()(FunandLearnQuestions);
