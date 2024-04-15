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

function ShowScore({ t, score, totalQuestions, onPlayAgainClick, onReviewAnswersClick, onNextLevelClick, coins, quizScore, currentLevel, maxLevel, reviewAnswer, playAgain, nextlevel }) {
    const navigate = useNavigate();
    const percentage = (score * 100) / totalQuestions;
    const [perValue, setPerValue] = useState(0);

     // store data get
    const userData = useSelector((state) => state.User);

    const systemconfig = useSelector(sysConfigdata);

    const goToHome = () => {
        navigate("/");
    };

    const goBack = () => {
        navigate("/quiz-play");
    };

    return (
        <React.Fragment>
            <div className="score-section  text-center bold">
                {percentage >= Number(systemconfig.maximum_coins_winning_percentage) ? (
                    <>
                        <h4 className="winlos">
                            <b>{t("Winner")}</b>
                        </h4>
                        <h5 >{t("Congratulations")}</h5>
                    </>
                ) : (
                    <>
                        <h4 className="winlos">
                            <b>{t("Defeat")}</b>
                        </h4>
                        <h5 >{t("Better Luck Next Time")}</h5>
                    </>
                )}
            </div>
            <div className="my-4 row d-flex align-items-center">
                <div className="col-md-5 col-4 coin_score_screen  ">
                    <h4 className=" score-circle-title">{t("Coins")}</h4>
                    <div className="score-circle ml-auto">
                        <CircularProgressbarWithChildren value={0} strokeWidth={5} styles={buildStyles({trailColor: '#f8c7d8'})}>
                            <h4 className=" mb-0">{coins ? coins : "0"}</h4>
                        </CircularProgressbarWithChildren>
                    </div>
                </div>

                <div className="col-md-2 col-4 coin_score_screen score-section  text-center bold">
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

                <div className="col-md-5 col-4 coin_score_screen  ">
                    <h4 className=" score-circle-title">{t("Score")}</h4>
                    <div className="score-circle">
                        <CircularProgressbarWithChildren value={0} strokeWidth={5} styles={buildStyles({trailColor: '#f8c7d8'})}>
                            <h4 className=" mb-0">{quizScore ? quizScore : "0"}</h4>
                        </CircularProgressbarWithChildren>
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
            <div className="dashoptions row text-center">
                {percentage >= Number(systemconfig.maximum_coins_winning_percentage) && maxLevel !== String(currentLevel) ? (
                    nextlevel ? (
                        <div className="fifty__fifty col-12 col-sm-6 col-md-2 custom-dash">
                            <button className="btn btn-primary" onClick={onNextLevelClick}>
                                {t("Next Level")}
                            </button>
                        </div>
                    ) : (
                        ""
                    )
                ) : playAgain ? (
                    <div className="fifty__fifty col-12 col-sm-6 col-md-2 custom-dash">
                        <button className="btn btn-primary" onClick={onPlayAgainClick}>
                            {t("Play Again")}
                        </button>
                    </div>
                ) : (
                    ""
                )}

                {reviewAnswer ? (
                    <div className="audience__poll col-12 col-sm-6 col-md-2 custom-dash">
                        <button className="btn btn-primary" onClick={onReviewAnswersClick}>
                            {t("Review Answers")}
                        </button>
                    </div>
                ) : (
                    ""
                )}
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

ShowScore.propTypes = {
    score: PropTypes.number.isRequired,
    totalQuestions: PropTypes.number.isRequired,
    // coins: PropTypes.number.isRequired,
    quizScore: PropTypes.number.isRequired,
    // onPlayAgainClick: PropTypes.func.isRequired,
    // onReviewAnswersClick: PropTypes.func.isRequired,
    // onNextLevelClick: PropTypes.func.isRequired,
};
export default withTranslation()(ShowScore);
