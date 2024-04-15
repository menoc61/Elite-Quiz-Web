import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Bookmark from "../../Common/Bookmark";
import { withTranslation } from "react-i18next";
import Timer from "../common/Timer";
import { decryptAnswer, calculateScore, calculateCoins, getAndUpdateBookmarkData, deleteBookmarkByQuestionID } from "../../../utils";
import { useSelector } from "react-redux";
import { settingsData, sysConfigdata } from "../../../store/reducers/settingsSlice";
import { getusercoinsApi, setBadgesApi, setbookmarkApi, setQuizCategoriesApi, UserCoinScoreApi, UserStatisticsApi } from "../../../store/actions/campaign";
import { updateUserDataInfo } from "../../../store/reducers/userSlice";
import { selecttempdata } from "../../../store/reducers/tempDataSlice";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { IoArrowBack } from "react-icons/io5";
import rightClick from "../../../assets/audio/right.mp3";
import wrongClick from "../../../assets/audio/wrong.mp3";
import { badgesData, LoadNewBadgesData } from "../../../store/reducers/badgesSlice";

const GuessthewordQuestions = ({ t, questions: data, timerSeconds, onOptionClick, onQuestionEnd, showBookmark, showQuestions }) => {
    const [questions, setQuestions] = useState(data);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const child = useRef(null);
    const scroll = useRef(null);

    // start of logic guess the word
    const [random, setRandom] = useState();
    const [input, setInput] = useState(null);
    const [loading, setLoading] = useState(true);

    const rightclick = new Audio(rightClick);

    const wrongclick = new Audio(wrongClick);

    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        }
    }, [loading]);

    // store data get
    const userData = useSelector((state) => state.User);

    const systemconfig = useSelector(sysConfigdata);

    const selectdata = useSelector(settingsData);

    const guess_the_word_max_winning_coin = selectdata && selectdata.filter(item => item.type == "guess_the_word_max_winning_coin");

    let getData = useSelector(selecttempdata);

    const Badges  = useSelector(badgesData);

    const super_sonic_status = Badges && Badges.data.super_sonic.status;

    const super_sonic_coin = Badges && Badges.data.super_sonic.badge_reward;

    const random_battle_entry_coin = selectdata && selectdata.filter(item => item.type == "random_battle_entry_coin");

    const btndisabled = false;

    const navigate = useNavigate();

    const answer = questions[currentQuestion].answer ? decryptAnswer(questions[currentQuestion].answer, userData.data.firebase_id) : "";

    const redirect = () => {
        navigate("/");
    };

    //suffle answer
    const shuffle = (arr) => {
        for (let i = arr.length - 1; i > 0; i--) {
            let temp = arr[i];
            let j = Math.floor(Math.random() * (i + 1));
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    };

    useEffect(() => {
        setRandom(shuffle(answer.toUpperCase().replace(/\s/g, "").split("").map((val, i) => {
                    return { value: val, ansIndex: i };
                })
            )
        );

        setInput(answer.toUpperCase().replace(/\s/g, "").split("").map(() => {
                return { value: "", index: null };
            })
        );
    }, [answer]);

    //array to string convert
    const arrtostr = () => {
        let str = input.map((obj) => {
            return obj.value;
        });
        let newstr = str.join("");
        return newstr;
    };

    //focus input
    const useActiveElement = () => {
        const [active, setActive] = useState(document.activeElement);
        const handleFocusIn = (e) => {
            setActive(document.activeElement);
        };
        useEffect(() => {
            document.addEventListener("focusin", handleFocusIn);
            return () => {
                document.removeEventListener("focusin", handleFocusIn);
            };
        }, []);
        return active;
    };

    //focus states and input states
    const focusedElement = useActiveElement();
    // console.log("hello",focusedElement)
    const [actIndex, setActIndex] = useState(0);
    const [news, setNew] = useState(false);
    const [hintDisabled, setHintDisabled] = useState(0);
    const coninsUpdate = userData && userData.data.coins;


    //focus useeffect
    useEffect(() => {
        if (focusedElement) {
            focusedElement.value;
            const val = parseInt(focusedElement.getAttribute("data-index"));
            if (!isNaN(val) && val !== null) {
                setActIndex(val);
            }
        }
    }, [focusedElement]);

    useEffect(() => {
        if (actIndex < 0) {
            setActIndex(0);
        }
        if (actIndex > answer.length) {
            setActIndex(answer.length - 1);
        }
        if (document.querySelector(`[data-index="${actIndex}"]`) != null) {
            document.querySelector(`[data-index="${actIndex}"]`).focus();
        }
    }, [actIndex]);

    // input field data
    const inputfield = () => {
        setNew((prevState) => false);
    };

    // button data
    const buttonAnswer = (e, item, btnId) => {
        if (input === null) {
            return;
        }
        let newVal = input;
        if (newVal[actIndex].value !== "") {
            document.getElementById(`btn-${newVal[actIndex].index}`).disabled = false;
        }
        newVal[actIndex].value = item;

        newVal[actIndex].index = btnId;
        document.getElementById(`btn-${btnId}`).disabled = true;
        const index = actIndex;
        setActIndex(index + 1);
        setInput((prevState) => [...newVal]);
        setNew((prevState) => true);
    };

    //backinput clear
    const backinputclear = (e) => {
        e.preventDefault();
        let newVal = input;
        if (news) {
            newVal[actIndex - 1].value = "";
            document.getElementById(`btn-${newVal[actIndex - 1].index}`).disabled = false;
            setNew((prevState) => false);
            newVal[actIndex - 1].value = "";
        } else {
            document.getElementById(`btn-${newVal[actIndex].index}`).disabled = false;
            newVal[actIndex].value = "";
        }
        setActIndex((prevState) => prevState - 1);
        setInput((prevState) => [...newVal]);
    };

    //random number for hint
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    // handle hints
    const handleHints = (e) => {
        if (coninsUpdate === "0") {
            toast.error(t("you dont have enough coins"));
            return;
        }

        let enabledBtnId = new Array();
        random.map((item, i) => {
            if (document.getElementById(`input-${i}`).value === "") {
                enabledBtnId.push(i);
            }
        });
        let ind = null;
        if (enabledBtnId.length != 0) {
            ind = shuffle(enabledBtnId)[0];
        }
        random.map((val, i) => {
            if (val.ansIndex == ind) {
                if (!document.getElementById(`btn-${i}`).disabled) {
                    val.ansIndex, document.getElementById(`btn-${i}`).innerText;
                    let newVal = input;
                    newVal[val.ansIndex].value = document.getElementById(`btn-${i}`).innerText;
                    newVal[val.ansIndex].index = i;
                    const index = val.ansIndex;
                    document.getElementById(`btn-${i}`).disabled = true;
                    setActIndex(index + 1);
                    setInput((prevState) => [...newVal]);
                    setNew((prevState) => true);

                    // button disabled
                    setHintDisabled(hintDisabled + 1);
                    e.currentTarget.disabled = hintDisabled >= 1 ? true : false;
                    let coins = guess_the_word_max_winning_coin && Number(guess_the_word_max_winning_coin[0].message);
                    if (userData.data.coins < coins) {
                        toast.error(t("You Don't have enough coins"));
                        return false;
                    }
                    let status = 1;
                    UserCoinScoreApi("-" + coins,null,null,"Used Guesstheword Hint",status,(response) => {
                            updateUserDataInfo(response.data);
                        },
                        (error) => {
                            Swal.fire(t("OOps"), t("Please Try again"), "error");
                            console.log(error);
                        }
                    );
                }
            }
        });
    };

    //clear all input
    const clearallInput = () => {
        let v = input;
        v = v.map((obj) => {
            if (obj.index !== null) {
                document.getElementById(`btn-${obj.index}`).disabled = false;
            }
            return { ...obj, value: "" };
        });
        setInput((prevState) => v);
        setActIndex(0);
    };

    //check answer on submit
    const handleSubmit = () => {
        let inputstr = arrtostr();
        setHintDisabled(0);
        document.getElementById("hntBtn").disabled = false;
        clearallInput();
        guessthewordCheck(inputstr);
    };



    // end of logic guess the word

    setTimeout(() => {
        setQuestions(data);
    }, 500);

    const setNextQuestion = () => {
        const nextQuestion = currentQuestion + 1;

        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
            child.current.resetTimer();
            clearallInput();
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
                UserCoinScoreApi(coins,userScore,null,"GuesstheWord Quiz Win",status,(response) => {
                        updateUserDataInfo(response.data);
                    },
                    (error) => {
                        console.log(error);
                    }
                );
            } else {
                UserCoinScoreApi(null,userScore,null,"GuesstheWord Quiz Win",status,(response) => {
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
                    setQuizCategoriesApi(3,getData.maincat_id,getData.id,"",(success) => {},
                        (error) => {
                            console.log(error);
                        }
                    );
                } else {
                    setQuizCategoriesApi(3,getData.id,"","",(success) => {},
                        (error) => {
                            console.log(error);
                        }
                    );
                }
            }
        }
    };

    //guesstheword answer click
    const guessthewordCheck = (selected_option) => {
        let { id, answer } = questions[currentQuestion];

        let decryptedAnswer = decryptAnswer(answer, userData.data.firebase_id).toUpperCase().replaceAll(/\s/g, "");
        let result_score = score;

        if (decryptedAnswer == selected_option) {
            result_score++;
            setScore(result_score);
            rightclick.play();
            toast.success("Correct Answer");
        } else {
            wrongclick.play();
            toast.error("Incorrect Answer");
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
    };

    const handleBookmarkClick = (question_id, isBookmarked) => {
        let type = 3;
        let bookmark = "0";

        if (isBookmarked) bookmark = "1";
        else bookmark = "0";
        return setbookmarkApi(
            question_id,
            bookmark,
            type,
            (response) => {
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

    // super sonic badge logic
    const checktotalQuestion = (update_question) => {
        if (questions.length < 5) {
            return;
        };
        const allTimerSeconds = update_question.map(quizDataObj => quizDataObj.timer_seconds).filter(timerSeconds => timerSeconds <= 20);
        if (super_sonic_status === "0" && (allTimerSeconds.length == 5)) {
            setBadgesApi("super_sonic", () => {
                LoadNewBadgesData("super_sonic","1")
                toast.success(t("You Won Super Sonic Badge"));
                const status = 0;
                UserCoinScoreApi(super_sonic_coin, null, null, (t("super sonic badge reward")), status, (response) => {
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
        <>
            <div className="questions guessthewordque" ref={scroll}>
                <div className="inner__headerdash">
                    <div className="total__out__leveldata">
                        <h5 className="inner__total-leveldata">
                            {currentQuestion + 1} | {questions.length}
                        </h5>
                    </div>

                    <div className="inner__headerdash">{questions && questions[0]["id"] !== "" ? <Timer ref={child} timerSeconds={timerSeconds} onTimerExpire={onTimerExpire} /> : ""}</div>

                    <div className=" p-2 pb-0">
                        {showBookmark ? <Bookmark id={questions[currentQuestion].id} isBookmarked={questions[currentQuestion].isBookmarked ? questions[currentQuestion].isBookmarked : false} onClick={handleBookmarkClick} /> : ""}
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

                {loading ? (
                    <div className="text-center">
                        <Skeleton count={5} />
                    </div>
                ) : (
                    <>
                        {/* {showAnswers ? ( */}
                            <div className="guess_the_word_comp">
                                <div className="total_coins">
                                    <div className="inner_coins">
                                        <p>{coninsUpdate}</p>
                                    </div>
                                </div>
                                <span className="input_box mt-5">
                                    {random &&
                                        random.map((data, index) => {
                                            return <input key={index} data-index={index} type="text" value={input[index].value} id={`input-${index}`} onClick={() => inputfield()} className="custom_input" readOnly />;
                                        })}
                                </span>
                                <div className="col-md-12 col-12 button_area my-4">
                                    <ul>
                                        {random ? (
                                            random.map((item, i) => {
                                                return (
                                                    <li key={i}>
                                                        <button className="btn btn-primary buttondata" id={`btn-${i}`} onClick={(e) => buttonAnswer(e, item.value, i)}>
                                                            {item.value}
                                                        </button>
                                                    </li>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center">
                                                <Skeleton count={5} />
                                            </div>
                                        )}
                                    </ul>
                                </div>
                                <div className="bottom_button mb-4">
                                    <div className="clear_input">
                                        <button className="btn btn-primary" onClick={(e) => backinputclear(e)}>
                                            <IoArrowBack />
                                        </button>
                                    </div>
                                    <div className="hint_button">
                                        <button id="hntBtn" className="btn btn-primary" disabled={btndisabled ? true : false} onClick={(e) => handleHints(e)}>
                                            {t("Hint")}
                                        </button>
                                    </div>
                                    <div className="submit_button">
                                        <button className="btn btn-primary" onClick={() => handleSubmit()}>
                                            {t("Submit")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        {/* ) : (
                            <div className="text-center text-white">
                                <div className="setNoFound">
                                    <p>{t("Please Add Data No Data Found")}</p>

                                    <button className="btn nobtn" onClick={redirect}>
                                        {"Back"}
                                    </button>
                                </div>
                            </div>
                        )} */}
                    </>
                )}
            </div>
        </>
    );
}

GuessthewordQuestions.propTypes = {
    questions: PropTypes.array.isRequired,
    onOptionClick: PropTypes.func.isRequired,
};

GuessthewordQuestions.defaultProps = {
    showBookmark: true,
};

export default withTranslation()(GuessthewordQuestions);
