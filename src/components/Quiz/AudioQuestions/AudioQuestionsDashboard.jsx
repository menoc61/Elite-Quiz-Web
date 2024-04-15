import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Bookmark from "../../Common/Bookmark";
import { withTranslation } from "react-i18next";
import Timer from "../common/Timer";
import { decryptAnswer, calculateScore, calculateCoins, getAndUpdateBookmarkData, deleteBookmarkByQuestionID } from "../../../utils";
import { useSelector } from "react-redux";
import { sysConfigdata } from "../../../store/reducers/settingsSlice";
import {  setbookmarkApi, setQuizCategoriesApi, UserCoinScoreApi, UserStatisticsApi } from "../../../store/actions/campaign";
import { updateUserDataInfo } from "../../../store/reducers/userSlice";
import { selecttempdata } from "../../../store/reducers/tempDataSlice";
import rightClick from "../../../assets/audio/right.mp3";
import wrongClick from "../../../assets/audio/wrong.mp3";

const AudioQuestionsDashboard = ({ t, questions: data, timerSeconds, onOptionClick, onQuestionEnd, showBookmark, showQuestions }) => {
    const [questions, setQuestions] = useState(data);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [totalTimerAudio, setTotalTimerAudio] = useState();
    const [currentTimeaudio, setCurrentTimeaudio] = useState(0);
    const [showAnswers, setShowAnswers] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [timerhide, setTimerhide] = useState(false);

    const child = useRef(null);
    const scroll = useRef(null);
    const audioRef = useRef(null);

    // store data get
    const userData = useSelector((state) => state.User);

    let getData = useSelector(selecttempdata);

    const systemconfig = useSelector(sysConfigdata);

    const rightclick = new Audio(rightClick);

    const wrongclick = new Audio(wrongClick);

     const [answeredQuestions, setAnsweredQuestions] = useState({});

    const addAnsweredQuestion = (item) => {
        setAnsweredQuestions({ ...answeredQuestions, [item]: true });
    };

    // show answer button
    const ShowAnswersbtn = () => {
        // answershow
        setShowAnswers(true);
        // show button hide
        setHidden(true);
        // timer start
        setTimerhide(true);
    };

    // total audio timer value
    const onLoadedMetadata = () => {
        setTotalTimerAudio(parseInt(audioRef.current.duration));
    };

    // current audio timer value
    const handleTimeUpdate = () => {
        setCurrentTimeaudio(parseInt(audioRef.current.currentTime));
        // check audio condition

        // console.log("currentTimeaudio==>", currentTimeaudio, "totalTimerAudio==>", totalTimerAudio - 1);
        if (currentTimeaudio == totalTimerAudio - 1) {
            ShowAnswersbtn();
        }
    };

    setTimeout(() => {
        setQuestions(data);
    }, 500);

    const setNextQuestion = () => {
        setShowAnswers(false);
        setHidden(false);
        setTimerhide(false);
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
            let status = "0";
            if (percentage >= Number(systemconfig.maximum_coins_winning_percentage)) {
                coins = calculateCoins(score, questions.length);
                UserCoinScoreApi(coins,userScore,null,"Audio Quiz Win",status,(response) => {
                        updateUserDataInfo(response.data);
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            } else {
                UserCoinScoreApi(null,userScore,null,"Audio Quiz Win",status,(response) => {
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
                    setQuizCategoriesApi(4, getData.maincat_id, getData.id, "", (success) => {

                    }, (error) => {
                        console.log(error);
                    })
                } else {
                    setQuizCategoriesApi(4, getData.id, "", "", (success) => {

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
        let type = 4;
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
        ShowAnswersbtn();
    };

    return (
        <React.Fragment>
            <div className="text-end p-2 pb-0">
                {showBookmark ? <Bookmark id={questions[currentQuestion].id} isBookmarked={questions[currentQuestion].isBookmarked ? questions[currentQuestion].isBookmarked : false} onClick={handleBookmarkClick} /> : ""}
            </div>
            <div className="questions audioQuestiondashboard" ref={scroll}>
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

                    {timerhide ? <div className="inner__headerdash">{questions && questions[0]["id"] !== "" ? <Timer ref={child} timerSeconds={timerSeconds} onTimerExpire={onTimerExpire} /> : ""}</div> : ""}

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

                {/* Audio Questions Player */}
                <div className="audio_player text-center pb-5">
                    <audio src={questions[currentQuestion].audio} controls autoPlay controlsList="nodownload noplaybackrate" id="audio" ref={audioRef} onLoadedMetadata={onLoadedMetadata} onTimeUpdate={handleTimeUpdate} />
                </div>

                {/* options */}
                <div className="row">
                    {questions[currentQuestion].optiona ? (
                        <div className="col-md-6 col-12">
                            <div className="inner__questions">
                                {showAnswers ? (
                                    <button className={`btn button__ui w-100 ${setAnswerStatusClass("a")}`} onClick={(e) => handleAnswerOptionClick("a")}>
                                        <div className="row">
                                            <div className="col">{questions[currentQuestion].optiona}</div>
                                            {questions[currentQuestion].probability_a ? <div className="col text-end">{questions[currentQuestion].probability_a}</div> : ""}
                                        </div>
                                    </button>
                                ) : (
                                    "—"
                                )}
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                    {questions[currentQuestion].optionb ? (
                        <div className="col-md-6 col-12">
                            <div className="inner__questions">
                                {showAnswers ? (
                                    <button className={`btn button__ui w-100 ${setAnswerStatusClass("b")}`} onClick={(e) => handleAnswerOptionClick("b")}>
                                        <div className="row">
                                            <div className="col">{questions[currentQuestion].optionb}</div>
                                            {questions[currentQuestion].probability_b ? <div className="col text-end">{questions[currentQuestion].probability_b}</div> : ""}
                                        </div>
                                    </button>
                                ) : (
                                    "—"
                                )}
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
                                        {showAnswers ? (
                                            <button className={`btn button__ui w-100 ${setAnswerStatusClass("c")}`} onClick={(e) => handleAnswerOptionClick("c")}>
                                                <div className="row">
                                                    <div className="col">{questions[currentQuestion].optionc}</div>
                                                    {questions[currentQuestion].probability_c ? <div className="col text-end">{questions[currentQuestion].probability_c}</div> : ""}
                                                </div>
                                            </button>
                                        ) : (
                                            "—"
                                        )}
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            {questions[currentQuestion].optiond ? (
                                <div className="col-md-6 col-12">
                                    <div className="inner__questions">
                                        {showAnswers ? (
                                            <button className={`btn button__ui w-100 ${setAnswerStatusClass("d")}`} onClick={(e) => handleAnswerOptionClick("d")}>
                                                <div className="row">
                                                    <div className="col">{questions[currentQuestion].optiond}</div>
                                                    {questions[currentQuestion].probability_d ? <div className="col text-end">{questions[currentQuestion].probability_d}</div> : ""}
                                                </div>
                                            </button>
                                        ) : (
                                            "—"
                                        )}
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            {systemconfig && systemconfig.option_e_mode && questions[currentQuestion].optione ? (
                                <div className="row d-flex justify-content-center mob_resp_e">
                                    <div className="col-md-6 col-12">
                                        <div className="inner__questions">
                                            {showAnswers ? (
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
                                            ) : (
                                                "—"
                                            )}
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

                {/* show answers button */}
                <div className="show_btn_answers">
                    <button className={`btn btn-primary d-flex mx-auto my-5 ${hidden ? "hideShowbutton" : ""}`} onClick={ShowAnswersbtn}>
                        {t("Show Answers")}
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
}

AudioQuestionsDashboard.propTypes = {
    questions: PropTypes.array.isRequired,
    onOptionClick: PropTypes.func.isRequired,
};

AudioQuestionsDashboard.defaultProps = {
    showBookmark: true,
};

export default withTranslation()(AudioQuestionsDashboard);
