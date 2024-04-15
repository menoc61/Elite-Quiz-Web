import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { FaCheck, FaTimes } from "react-icons/fa";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "../../../utils/AnimatedProgressProvider";
import "react-circular-progressbar/dist/styles.css";
import { useSelector } from "react-redux";
import { sysConfigdata } from "../../../store/reducers/settingsSlice";
import { imgError } from "../../../utils";
import { getexamsetQuiz, selecttempdata } from "../../../store/reducers/tempDataSlice";
import { setExammoduleresultApi } from "../../../store/actions/campaign";

function ExamScore({ t, score, totalQuestions, coins, quizScore }) {
    const navigate = useNavigate();
    const percentage = (score * 100) / totalQuestions;
    const [perValue, setPerValue] = useState(0);

     // store data get
    const userData = useSelector((state) => state.User);

    const systemconfig = useSelector(sysConfigdata);

    let getData = useSelector(selecttempdata);

    const examsetquiz = useSelector(getexamsetQuiz);

    const goToHome = () => {
        navigate("/");
    };

    const goBack = () => {
        navigate("/quiz-play");
    };

    useEffect(() => {
         setExammoduleresultApi(Number(getData.id), examsetquiz.remianingtimer, examsetquiz.totalmarks,examsetquiz.statistics,1, "", (resposne) => {
            // console.log(resposne);
        }, (error) => {
            console.log(error);
        })
    },[])

    return (
        <React.Fragment>
            <div className="score-section  text-center bold">
                <h5 className="text-dark text-bold">{t("Exam Result")}</h5>
                <h4 >{getData.title}</h4>
            </div>
            <div className="my-4 row d-flex align-items-center justify-content-center">
                <div className="col-md-3 col-12 coin_score_screen score-section  text-center bold">
                    <div className="d-inline-block">
                        <AnimatedProgressProvider valueStart={0} valueEnd={percentage} duration={0.2} easingFunction={easeQuadInOut}>
                            {(value) => {
                                const roundedValue = Math.round(value);
                                setPerValue(roundedValue);
                                return (
                                    <CircularProgressbarWithChildren
                                        value={value}
                                        strokeWidth={5}
                                        styles={buildStyles({
                                            pathTransition: "none",
                                            textColor: "#ef5488",
                                            trailColor: '#f5f5f8',

                                            pathColor: percentage >= Number(systemconfig.maximum_coins_winning_percentage) ? "#15ad5a" : "#ef5488",
                                        })}
                                    >
                                        <img src={userData.data && userData.data.profile ? userData.data.profile : process.env.PUBLIC_URL + "/images/user.svg"} alt="user" className="showscore-userprofile" onError={imgError}/>
                                    </CircularProgressbarWithChildren>
                                );
                            }}
                        </AnimatedProgressProvider>
                    </div>
                </div>

            </div>
            <div className="my-4 align-items-center d-flex">
                <div className="col-4 col-md-5 right_wrong_screen text-end" title={t("Incorrect Answers")}>
                    <h1 className="score-badge bg-danger mb-0">
                        {/* {console.log("score",score,"totalquestions",totalQuestions)} */}
                        <FaTimes /> {totalQuestions - score + " / " + totalQuestions}
                    </h1>
                </div>
                <div className="col-4 col-md-2 right_wrong_screen text-center percent_value">
                    <h1 className="winlos percentage">{perValue}%</h1>
                </div>
                <div className="col-4 col-md-5 right_wrong_screen text-start" title={t("Correct Answers")}>
                    <div className="score-badge bg-success">
                        <FaCheck />
                        <span>&nbsp;&nbsp;{score + " / " + totalQuestions}</span>
                    </div>
                </div>
            </div>
            <div className="total_obtained_marks d-flex align-item-center justify-content-center">
                <p className="score-badge">{ examsetquiz.totalmarks + " / " + getData.total_marks }</p>
            </div>
            <div className="dashoptions row text-center">
                <div className="resettimer col-12 col-sm-6 col-md-2 custom-dash">
                    <button className="btn btn-primary" onClick={goBack}>
                        {t("Back")}
                    </button>
                </div>
                <div className="skip__questions col-12 col-sm-6 col-md-2 custom-dash">
                    <button className="btn btn-primary" onClick={goToHome}>
                        {t("Home")}
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
}

ExamScore.propTypes = {
    score: PropTypes.number.isRequired,
    totalQuestions: PropTypes.number.isRequired,
    quizScore: PropTypes.number.isRequired,
};
export default withTranslation()(ExamScore);
