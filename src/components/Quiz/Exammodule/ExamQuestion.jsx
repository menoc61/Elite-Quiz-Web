import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Timer from "../common/Timer";
import { Modal, Button } from "antd";
import { decryptAnswer, calculateScore, } from "../../../utils";
import { FaArrowsAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { sysConfigdata } from "../../../store/reducers/settingsSlice";
import { LoadexamCompletedata, Loadexamsetquiz, getexamQuestion, selecttempdata } from "../../../store/reducers/tempDataSlice";
import { setExammoduleresultApi } from "../../../store/actions/campaign";

function ExamQuestion({ t, questions: data, timerSeconds, onOptionClick, onQuestionEnd, customMinutes }) {
    const [questions, setQuestions] = useState(data);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const child = useRef(null);
    const scroll = useRef(null);
    const [disablePrev, setDisablePrev] = useState(true);
    const [disableNext, setDisableNext] = useState(false);
    const [update_questions, setUpdate_questions] = useState(data);
    const [notificationmodal, setNotificationModal] = useState(false);
    const [isClickedAnswer, setisClickedAnswer] = useState(false);


    const systemconfig = useSelector(sysConfigdata);

    const getData = useSelector(selecttempdata);

    const examquestion = useSelector(getexamQuestion);

    const NotRunScreen = useRef(false);

    // store data get
    const userData = useSelector((state) => state.User);

    const selecttempData = useSelector(selecttempdata);

    setTimeout(() => {
        setQuestions(data);
    }, 500);

    //disabled click on option
    const disabledQuestions = (questions) => {
        let isanswered;
        questions.map((question, index) => {
            isanswered = question.isAnswered;
            if (selecttempData.answer_again === "0" && isanswered === true) {
                setisClickedAnswer(true);
            }
        });
    };


    // button option answer check
    const handleAnswerOptionClick = (selected_option) => {
        let { id } = questions[currentQuestion];

        let update_questions = questions.map((data) => (data.id === id ? { ...data, selected_answer: selected_option, isAnswered: true } : data));

        setUpdate_questions(update_questions);

        disabledQuestions(update_questions);

        if (questions[currentQuestion].selected_answer) setQuestions(update_questions);

        onOptionClick(update_questions);
    };

    // option answer status check
    const setAnswerStatusClass = (option) => {
        if (questions[currentQuestion].isAnswered) {
            if (systemconfig && systemconfig.answer_mode === "1") {
            }
            if (questions[currentQuestion].selected_answer === option) {
                return "bg-theme";
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    // get statistics
    const getStatistics = (questions) => {
        const uniqueMarks = [...new Set(questions.map(question => question.marks))];
        let abc = '\"['
        uniqueMarks.forEach(mark => {
            const markQuestions = questions.filter(question => question.marks == mark);
            const correctAnswers = markQuestions.filter(question => question.selected_answer == decryptAnswer(question.answer, userData.data.firebase_id)).length;
            abc += `{'mark': ${mark.toString()},'correct_answer': ${correctAnswers.toString()},'incorrect': ${(markQuestions.length - correctAnswers).toString()}},`
        });

        abc += ']\"'
        return abc;
    };

    // new added for total question get and above is for server
    const newgetStatistics = (questions) => {
        const uniqueMarks = [...new Set(questions.map(question => question.marks))];
        const statistics = uniqueMarks.map(mark => {
          const markQuestions = questions.filter(question => question.marks === mark);
          const correctAnswers = markQuestions.filter(question => question.selected_answer === decryptAnswer(question.answer, userData.data.firebase_id)).length;
          return {
            mark: mark,
            correct_answer: correctAnswers,
            incorrect: markQuestions.length - correctAnswers
          };
        });

        return JSON.stringify(statistics);
      };


      // total questions get;
    const totalQuestions = (totaldata) => {
        let totalQuestions = 0;
        let parsingdata = JSON.parse(totaldata)
        parsingdata.forEach((markStatistics) => {
            totalQuestions += parseInt(markStatistics.correct_answer) + parseInt(markStatistics.incorrect);
        });
        return totalQuestions;
    };

    // total correct answer get;
    const totalQuestionsCorrect = (totaldata) => {
        let totalQuestioncorrect = 0;
        let parsingdata = JSON.parse(totaldata)
        parsingdata.forEach((markStatistics) => {
            totalQuestioncorrect += parseInt(markStatistics.correct_answer);
        });
        return totalQuestioncorrect;
    };

    // total correct answer get;
    const totalQuestionsInCorrect = (totaldata) => {
        let totalQuestionIncorrect = 0;
        let parsingdata = JSON.parse(totaldata)
        parsingdata.forEach((markStatistics) => {
            totalQuestionIncorrect += parseInt(markStatistics.incorrect);
        });
        return totalQuestionIncorrect;
    };

    // all complete data
    const allcompletedData = (totaldata) => {
        let newtotaldata = totalQuestions(totaldata);
        let newcorrect = totalQuestionsCorrect(totaldata);
        let newincorrect = totalQuestionsInCorrect(totaldata);
        LoadexamCompletedata(newtotaldata,newcorrect,newincorrect)
    }


    // total duration find of minute
    const durationMinutes = (minute) => {
        let durationInSeconds = minute * 60;
        let hours = Math.floor(durationInSeconds / 3600);
        let minutes = Math.floor(durationInSeconds / 60) % 60;
        let seconds = durationInSeconds % 60;

        if (seconds === 0) {
            seconds = 60;
            minutes--;
        }

        hours = hours.toString().padStart(2, '0');
        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');

        return (`${hours}:${minutes}:${seconds}`);

    }

    // total seconds find
    const totalsecondsFinds = () => {
        //duration exam
        const durationofExamTime = durationMinutes(Number(selecttempData.duration));

        const durationpart = durationofExamTime.split(":");

        const durationhours = parseInt(durationpart[0]);

        const durationminutes = parseInt(durationpart[1]);

        const durationseconds = parseInt(durationpart[2]);

        const totaldurationSeconds = (durationhours * 3600) + (durationminutes * 60) + durationseconds;

        //remaining timer
        const remainingTimeofTimer = child.current.getMinuteandSeconds();

        const parts = remainingTimeofTimer.split(":");

        const remaininghours = parseInt(parts[0]);

        const remainingminutes = parseInt(parts[1]);

        const remainingseconds = parseInt(parts[2]);

        const totalremianingseconds = (remaininghours * 3600) + (remainingminutes * 60) + (remainingseconds)

        const TotalTimerRemainingData = (totaldurationSeconds - totalremianingseconds);

        return TotalTimerRemainingData
    }


    // on submit events after questions over
    const onSubmit = async () => {
        NotRunScreen.current = true;
        let result_score = score;
        let totalMarks = 0;
        questions.map((data) => {
            let selectedAnswer = data.selected_answer;
            // console.log("selectedAnswer==>",selectedAnswer)
            let decryptedAnswer = decryptAnswer(data.answer, userData.data.firebase_id);

            // console.log("marks==>",marks)
            if (decryptedAnswer == selectedAnswer) {
                totalMarks += Number(data.marks);
                result_score++;
                setScore(result_score);

            }
        });

        // console.log(totalMarks)

        const markStatistics = getStatistics(questions);

        const totaldata = newgetStatistics(questions);

        allcompletedData(totaldata);

        const totalremainingtimer = totalsecondsFinds();

        Loadexamsetquiz(totalremainingtimer,markStatistics,totalMarks)

        onOptionClick(questions, result_score);

        let coins = null;
        let userScore = null;

        userScore = calculateScore(result_score, questions.length);

        onQuestionEnd(coins, userScore);

    };

    // time expire
    const onTimerExpire = () => {
        onSubmit();
    };

    // prevoius questions
    const previousQuestion = () => {
        const prevQuestion = currentQuestion - 1;
        if (prevQuestion >= 0) {
            if (prevQuestion > 0) {
                setDisablePrev(false);
            } else {
                setDisablePrev(true);
            }
            setDisableNext(false);
            setCurrentQuestion(prevQuestion);
        }
    };

    // next questions
    const nextQuestion = () => {
        // disable option check on next question
        update_questions.map((item) => {
            if (!item.isAnswered) setisClickedAnswer(false);
        });

        // next question
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            if (nextQuestion + 1 === questions.length) {
                setDisableNext(true);
            } else {
                setDisableNext(false);
            }
            setDisablePrev(false);
            setCurrentQuestion(nextQuestion);
        }
    };

    // pagination
    const handlePagination = (index) => {
        setCurrentQuestion(index);
    };


    // if user leave screen in between exam
    const leaveScreen = () => {
        const statistics = getStatistics(examquestion);
        const totaldata = newgetStatistics(examquestion);
        allcompletedData(totaldata);
        setExammoduleresultApi(
            Number(getData.id),
            1,
            0,
            statistics,
            1,
            [],
            (resposne) => {
            // console.log(resposne);
            },
            (error) => {
            console.log(error);
            }
        );
    }


    // if user left from question screen
    useEffect(() => {
        return () => {
            if (!NotRunScreen.current) {
                leaveScreen()
            }
        };
    }, []);


    return (
        <React.Fragment>
            <div className="questions examModule" ref={scroll}>
                <div className="inner__headerdash">
                    <div className="title text-center mb-3 d-flex justify-content-between align-items-center w-100">
                        <p className="text-dark">{selecttempData.title}</p>
                        <p className="text-dark">
                            {selecttempData.total_marks} {t("Marks")}
                        </p>
                    </div>
                    {questions && questions[0]['id'] !== '' ? <Timer ref={child} timerSeconds={timerSeconds} customMinutes={customMinutes} onTimerExpire={onTimerExpire} /> : ""}

                    <div className="total__out__leveldata">
                        <h5 className="text-white inner__total-leveldata">
                            {currentQuestion + 1} | {questions.length}
                        </h5>
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
                <div className="row">
                    {questions[currentQuestion].optiona ? (
                        <div className="col-md-6 col-12">
                            <div className="inner__questions">
                                <button className={`btn button__ui w-100 ${setAnswerStatusClass("a")}`} onClick={(e) => handleAnswerOptionClick("a")} disabled={isClickedAnswer}>
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
                                <button className={`btn button__ui w-100 ${setAnswerStatusClass("b")}`} onClick={(e) => handleAnswerOptionClick("b")} disabled={isClickedAnswer}>
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
                                        <button className={`btn button__ui w-100 ${setAnswerStatusClass("c")}`} onClick={(e) => handleAnswerOptionClick("c")} disabled={isClickedAnswer}>
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
                                        <button className={`btn button__ui w-100 ${setAnswerStatusClass("d")}`} onClick={(e) => handleAnswerOptionClick("d")} disabled={isClickedAnswer}>
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
                                            <button className={`btn button__ui w-100 ${setAnswerStatusClass("e")}`} onClick={(e) => handleAnswerOptionClick("e")} disabled={isClickedAnswer}>
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
                <div className="dashoptions">
                    <div className="fifty__fifty">
                        <button className="btn btn-primary" onClick={previousQuestion} disabled={disablePrev}>
                            &lt;
                        </button>
                    </div>

                    <div className="notification self-learning-pagination">
                        <Button className="notify_btn btn-primary" onClick={() => setNotificationModal(true)}>
                            <FaArrowsAlt />
                        </Button>

                        <Modal centered visible={notificationmodal} onOk={() => setNotificationModal(false)} onCancel={() => setNotificationModal(false)} footer={null} className="custom_modal_notify self-modal">
                            <div className="que_pagination">
                                {questions?.map((que_data, index) => {
                                    return (
                                        <div className="que_content" key={index}>
                                            <p className="d-none">{que_data.id}</p>

                                            <p className={`que_box ${update_questions && update_questions[index]?.isAnswered ? "bg-green" : "bg-dark"}`} onClick={() => handlePagination(index)}>
                                                {index + 1}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                            <hr />
                            <div className="resettimer">
                                <button className="btn btn-primary" onClick={onSubmit}>
                                    {t("Submit")}
                                </button>
                            </div>
                            <hr />
                            <p>{t("Color Code")}</p>
                            <div className="custom_checkbox d-flex flex-wrap align-items-center">
                                <input type="radio" name="" className="tick me-2" checked readOnly /> {t("Attended Question")}
                                <input type="radio" name="" className="untick ms-3 me-2" disabled readOnly /> {t("Un-Attempted")}
                            </div>
                        </Modal>
                    </div>
                    <div className="skip__questions">
                        <button className="btn btn-primary" onClick={nextQuestion} disabled={disableNext}>
                            &gt;
                        </button>
                    </div>
                </div>

                <div className="text-center text-white">
                    <small>{questions[currentQuestion].note ? <p>{t("Note") + " : " + questions[currentQuestion].note}</p> : ""}</small>
                </div>
            </div>
        </React.Fragment>
    );
}

ExamQuestion.propTypes = {
    questions: PropTypes.array.isRequired,
    onOptionClick: PropTypes.func.isRequired,
};

ExamQuestion.defaultProps = {
    showBookmark: true,
};

export default withTranslation()(ExamQuestion);
