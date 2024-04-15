import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Lifelines from "../common/Lifelines";
import { withTranslation } from "react-i18next";
import Timer from "../common/Timer";
import { decryptAnswer, calculateScore, calculateCoins, } from "../../../utils";
import { useSelector } from "react-redux";
import { sysConfigdata } from "../../../store/reducers/settingsSlice";
import { ContestLeaderboardApi, getusercoinsApi, setBadgesApi, setcontestleaderboardApi, UserCoinScoreApi, UserStatisticsApi } from "../../../store/actions/campaign";
import { contestleaderboard, selecttempdata } from "../../../store/reducers/tempDataSlice";
import { updateUserDataInfo } from "../../../store/reducers/userSlice";
import rightClick from "../../../assets/audio/right.mp3";
import wrongClick from "../../../assets/audio/wrong.mp3";
import { badgesData, LoadNewBadgesData } from "../../../store/reducers/badgesSlice";

const ContestPlayQuestions = ({ t, questions: data, timerSeconds, onOptionClick, onQuestionEnd, showLifeLine, showBookmark, showQuestions }) => {
    const [questions, setQuestions] = useState(data);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const child = useRef(null);
    const scroll = useRef(null);
    let getData = useSelector(selecttempdata);

    const systemconfig = useSelector(sysConfigdata);

    setTimeout(() => {
        setQuestions(data);
    }, 500);

     // store data get
    const userData = useSelector((state) => state.User);

    let getContestData = useSelector(contestleaderboard);

    const rightclick = new Audio(rightClick);

    const wrongclick = new Audio(wrongClick);

    const Badges = useSelector(badgesData);

    const most_wanted_winner_status = Badges && Badges.data.most_wanted_winner.status;

    const most_wanted_winner_coin = Badges && Badges.data.most_wanted_winner.badge_reward;

    const [answeredQuestions, setAnsweredQuestions] = useState({});

    const [contestBadge, setContestBadges] = useState([]);

    const addAnsweredQuestion = (item) => {
        setAnsweredQuestions({ ...answeredQuestions, [item]: true });
    };

    const mostWantedWinner = () => {
        if (most_wanted_winner_status === "0" && contestBadge.user_rank === "1") {
            setBadgesApi("most_wanted_winner", () => {
                LoadNewBadgesData("most_wanted_winner","1")
                toast.success(t("You Won Most Wanted Winner Badge"));
                const status = 0;
                UserCoinScoreApi(most_wanted_winner_coin, null, null, (t("most wanted badge reward")), status, (response) => {
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
                UserStatisticsApi(questions.length, result_score, questions[currentQuestion].category, percentage, (response) => {

                }, (error) => {
                    console.log(error);
                });

                userScore = calculateScore(result_score, questions.length);
                let status = "0";
                if (percentage >= Number(systemconfig.maximum_coins_winning_percentage)) {
                    coins = calculateCoins(score, questions.length);
                    UserCoinScoreApi(coins, userScore, null, "ContestPlay Quiz Win", status, (response) => {
                        updateUserDataInfo(response.data)
                      }, (error) => {
                        console.log(error);
                      })
                } else {
                    UserCoinScoreApi(null, userScore, null, "ContestPlay Quiz Win", status, (response) => {
                        updateUserDataInfo(response.data)
                      }, (error) => {
                        console.log(error);
                      })
                }
            onQuestionEnd(coins, userScore);
            UserCoinScoreApi("-" + getData.entry_coin,null,null,"ContestPlay Quiz Win",status,(response) => {
                updateUserDataInfo(response.data);
            },
            (error) => {
                console.log(error);
            }
            );
            mostWantedWinner();
            let newScore = JSON.stringify(userScore);
            let correctAnswer = JSON.stringify(result_score);
            setcontestleaderboardApi(getData.contest_id, questions.length, correctAnswer, newScore, (response) => {
            }, (error) => {
                console.log(error);
            });
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

    const handleFiftyFifty = () => {
        let update_questions = [...questions];
        if (update_questions[currentQuestion].question_type === "2") {
            toast.error(t("This Lifeline is not allowed"));
            return false;
        }
        let all_option = ["optiona", "optionb", "optionc", "optiond", "optione"];

        //Identify the correct answer option and add that to visible option array
        let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData.data.firebase_id);
        let index = all_option.indexOf("option" + decryptedAnswer);
        let visible_option = [all_option[index]];

        //delete correct option from all option array
        all_option.splice(index, 1);

        //Remove Options that are empty
        all_option.map((data, key) => {
            if (questions[currentQuestion][data] === "") {
                all_option.splice(key, 1);
            }
            return data;
        });

        //Generate random key to select the second option from all option array
        let random_number = Math.floor(Math.random() * all_option.length);

        visible_option.push(all_option[random_number]);

        //delete that option from all option array
        all_option.splice(random_number, 1);

        //at the end delete option from the current question that are available in all options
        all_option = all_option.map((data) => {
            delete update_questions[currentQuestion][data];
            return data;
        });

        setQuestions(update_questions);
        return true;
    };

    function generate(max, thecount) {
        let r = [];
        let currsum = 0;
        for (let i = 0; i < thecount - 1; i++) {
            r[i] = randombetween(1, max - (thecount - i - 1) - currsum);
            currsum += r[i];
        }
        r[thecount - 1] = max - currsum;
        return r;
    }

    function randombetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const handleAudiencePoll = () => {
        let update_questions = [...questions];
        let { answer, optione, question_type } = update_questions[currentQuestion];
        let decryptedAnswer = decryptAnswer(answer, userData.data.firebase_id);
        let all_option = [];
        if (question_type === "2") {
            all_option = ["a", "b"];
        } else {
            all_option = ["a", "b", "c", "d"];
            if (optione !== "") {
                all_option.push("e");
            }
        }

        //Generate Random % for all the options
        let numbers = generate(100, all_option.length);

        //Get the Maximum number and assign that number to correct number
        let maximum = Math.max(...numbers);
        update_questions[currentQuestion]["probability_" + [decryptedAnswer]] = maximum + " %";

        //Remove correct option and maximum number from the array
        all_option.splice(all_option.indexOf(decryptedAnswer), 1);
        numbers.splice(numbers.indexOf(maximum), 1);

        //apply map function and assign the remaining numbers to incorrect options
        all_option = all_option.map((data, key) => {
            update_questions[currentQuestion]["probability_" + [data]] = numbers[key] + " %";
            return data;
        });
        setQuestions(update_questions);
    };

    const handleSkipQuestion = () => {
        setNextQuestion();
    };

    const onTimerExpire = () => {
        setNextQuestion();
    };

    const handleTimerReset = () => {
        child.current.resetTimer();
    };

    useEffect(() => {
        ContestLeaderboardApi(getContestData.past_id, (response) => {
            setContestBadges(response.my_rank);
        }, (error) => {
            console.log(error)
        });
    }, []);

    return (
        <React.Fragment>
            <div className="questions contestque" ref={scroll}>
                <div className="inner__headerdash ">


                    {questions && questions[0]["id"] !== "" ? <Timer ref={child} timerSeconds={timerSeconds} onTimerExpire={onTimerExpire} /> : ""}

                    <div className="total__out__leveldata">
                        <h5 className="text-white inner__total-leveldata">
                            {currentQuestion + 1} | {questions.length}
                        </h5>
                    </div>

                    {/* <div className=" p-2 pb-0">
                        {showBookmark ? <Bookmark id={questions[currentQuestion].id} isBookmarked={questions[currentQuestion].isBookmarked ? questions[currentQuestion].isBookmarked : false} onClick={handleBookmarkClick} /> : ""}
                    </div> */}
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
                {showLifeLine ? (
                    <Lifelines
                        handleFiftFifty={handleFiftyFifty}
                        handleAudiencePoll={handleAudiencePoll}
                        handleResetTime={handleTimerReset}
                        handleSkipQuestion={handleSkipQuestion}
                        showFiftyFifty={questions[currentQuestion]["question_type"] == 2 ? false : true}
                        audiencepoll={questions[currentQuestion]["question_type"] == 2 ? false : true}
                    />
                ) : (
                    ""
                )}
            </div>
        </React.Fragment>
    );
}

ContestPlayQuestions.propTypes = {
    questions: PropTypes.array.isRequired,
    onOptionClick: PropTypes.func.isRequired,
};

ContestPlayQuestions.defaultProps = {
    showLifeLine: true,
    showBookmark: true,
};

export default withTranslation()(ContestPlayQuestions);
