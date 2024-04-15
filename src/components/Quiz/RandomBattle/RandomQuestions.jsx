import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Timer from "../common/Timer";
import config from "../../../utils/config";
import { decryptAnswer, calculateScore, calculateCoins } from "../../../utils";
import { useSelector } from "react-redux";
import { settingsData, sysConfigdata } from "../../../store/reducers/settingsSlice";
import { getusercoinsApi, setBadgesApi, UserCoinScoreApi, UserStatisticsApi } from "../../../store/actions/campaign";
import { updateUserDataInfo } from "../../../store/reducers/userSlice";
import { groupbattledata, LoadGroupBattleData } from "../../../store/reducers/groupbattleSlice";
import rightClick from "../../../assets/audio/right.mp3";
import wrongClick from "../../../assets/audio/wrong.mp3";
import { toast } from "react-toastify";
import { badgesData, LoadNewBadgesData } from "../../../store/reducers/badgesSlice";
import FirebaseData from "../../../utils/firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const RandomQuestions = ({ t, questions: data, timerSeconds, onOptionClick, onQuestionEnd }) => {

    const [questions, setQuestions] = useState(data);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [Opponentdata, setOpponentdata] = useState({
        userName: "",
        profile: "",
        points: "",
    });

    const [userLogindata, setLogindata] = useState({
        userName: "",
        profile: "",
        points: "",
    });

    const navigate = useNavigate();

    const user1timer = useRef(null);

    const user2timer = useRef(null);

    const scroll = useRef(null);

    const { db } = FirebaseData();

     // store data get
    const userData = useSelector((state) => state.User);

    const systemconfig = useSelector(sysConfigdata);

    const groupBattledata = useSelector(groupbattledata);

    const selectdata = useSelector(settingsData);

    const random_battle_seconds = selectdata && selectdata.filter(item => item.type == "random_battle_seconds");

    const TIMER_SECONDS = Number(random_battle_seconds[0].message);

    const Badges = useSelector(badgesData);

    const combat_winner_status = Badges && Badges.data.combat_winner.status;

    const combat_winner_coin = Badges && Badges.data.combat_winner.badge_reward;

    const ultimate_status = Badges && Badges.data.ultimate_player.status;

    const ultimate_player_coin = Badges && Badges.data.ultimate_player.badge_reward;

    const rightclick = new Audio(rightClick);

    const wrongclick = new Audio(wrongClick);

    const [answeredQuestions, setAnsweredQuestions] = useState({});

    const addAnsweredQuestion = (item) => {
        setAnsweredQuestions({ ...answeredQuestions, [item]: true });
    };

    //firestore adding answer in doc
    let battleRoomDocumentId = groupBattledata.roomID;

    // delete battle room
    const deleteBattleRoom = async (documentId) => {
        try {
            await db.collection("battleRoom").doc(documentId).delete();
        } catch (error) {
            toast.error(error);
        }
    };

    // combat winner
    const combatWinner = () => {
        if (combat_winner_status === "0") {
            // console.log("hello",user1uid,userData.data.id, user1point, user2point)
            if (groupBattledata.user1uid === userData.data.id && groupBattledata.user1point > groupBattledata.user2point) {
                setBadgesApi("combat_winner", () => {
                    LoadNewBadgesData("combat_winner", "1")
                    toast.success(t("You Won Combat Winner Badge"));
                    const status = 0;
                    UserCoinScoreApi(combat_winner_coin, null, null, (t("combat badge reward")), status, (response) => {
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
            } else if (userData.data.id === groupBattledata.user2uid && groupBattledata.user1point < groupBattledata.user2point) {
                setBadgesApi("combat_winner", () => {
                    LoadNewBadgesData("combat_winner", "1")
                    toast.success(t("You Won Combat Winner Badge"));
                    const status = 0;
                    UserCoinScoreApi(combat_winner_coin, null, null, (t("combat badge reward")), status, (response) => {
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

    }

     //if user's points is same as highest points
     const ultimatePlayer = () => {
        const badgeEarnPoints = (config.randomBattleoneToTwoSeconds + config.battlecorrectanswer) * questions.length;
        const currentUserPoint = (groupBattledata.user1uid === userData.data.id) ? groupBattledata.user1point : groupBattledata.user2point;
        if (currentUserPoint === badgeEarnPoints && ultimate_status === "0") {
            setBadgesApi("ultimate_player", () => {
                LoadNewBadgesData("ultimate_player","1")
                toast.success(t("You Won Ultimate Player Badge"));
                const status = 0;
                UserCoinScoreApi(ultimate_player_coin, null, null, (t("ultimate badge reward")), status, (response) => {
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

    // next questions
    const setNextQuestion = () => {
        const nextQuestion = currentQuestion + 1;

        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
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
            onQuestionEnd(coins, userScore);
            combatWinner();
            ultimatePlayer();
            deleteBattleRoom(battleRoomDocumentId);
        }
    };

    // button option answer check
    const handleAnswerOptionClick = async (selected_option) => {


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

            submitAnswer(selected_option);

            onOptionClick(update_questions, result_score);
        }
    };


    // storing dataa of points in localstorage
    const localStorageData = (user1name, user2name, user1uid, user2uid, user1image, user2image) => {
        LoadGroupBattleData("user1name",user1name)
        LoadGroupBattleData("user2name",user2name)
        LoadGroupBattleData("user1image",user1image)
        LoadGroupBattleData("user2image",user2image)
        LoadGroupBattleData("user1uid",user1uid)
        LoadGroupBattleData("user2uid",user2uid)

    };

    const localStoragePoint = (user1point, user2point) => {
        LoadGroupBattleData("user1point", user1point)
        LoadGroupBattleData("user2point",user2point)
    };

    // submit answer
    const submitAnswer = (selected_option) => {
        let documentRef = db.collection("battleRoom").doc(battleRoomDocumentId);

        documentRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    let battleroom = doc.data();

                    let user1ans = battleroom.user1.answers;

                    let user2ans = battleroom.user2.answers;

                    // answer update in document
                    if (userData.data.id === battleroom.user1.uid) {
                        // answer push
                        user1ans.push(selected_option);

                        db.collection("battleRoom").doc(battleRoomDocumentId).update({
                            "user1.answers": user1ans,
                        });
                    } else {
                        // answer push
                        user2ans.push(selected_option);

                        db.collection("battleRoom").doc(battleRoomDocumentId).update({
                            "user2.answers": user2ans,
                        });
                    }

                    // anseerCheck
                    answercheckSnapshot();

                    // point
                    checkpoints(selected_option);

                    // check correct answer
                    checkCorrectAnswers(selected_option)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // point check
    const checkpoints = (option) => {
        let documentRef = db.collection("battleRoom").doc(battleRoomDocumentId);

        documentRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    let battleroom = doc.data();

                    let totalseconds = TIMER_SECONDS;

                    let seconds = user1timer.current.getTimerSeconds();

                    let finalScore = totalseconds - seconds;

                    let user1name = battleroom.user1.name;

                    let user2name = battleroom.user2.name;

                    let user1point = battleroom.user1.points;

                    let user2point = battleroom.user2.points;

                    let user1uid = battleroom.user1.uid;

                    let user2uid = battleroom.user2.uid;

                    let user1image = battleroom.user1.profileUrl;

                    let user2image = battleroom.user2.profileUrl;

                    // store data in local storage to get in result screen
                    localStorageData(user1name, user2name, user1uid, user2uid, user1image, user2image);

                    if (userData.data.id === battleroom.user1.uid) {
                        let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData.data.firebase_id);
                        if (decryptedAnswer === option) {
                            // point push
                            if (finalScore < 2) {
                                let totalpush = config.randomBattleoneToTwoSeconds + config.battlecorrectanswer;

                                db.collection("battleRoom")
                                    .doc(battleRoomDocumentId)
                                    .update({
                                        "user1.points": totalpush + user1point,
                                    });
                            } else if (finalScore === 3 || finalScore === 4) {
                                let totalpush = config.randomBattlethreeToFourSeconds + config.battlecorrectanswer;

                                db.collection("battleRoom")
                                    .doc(battleRoomDocumentId)
                                    .update({
                                        "user1.points": totalpush + user1point,
                                    });
                            } else {
                                let totalpush = config.battlecorrectanswer;

                                db.collection("battleRoom")
                                    .doc(battleRoomDocumentId)
                                    .update({
                                        "user1.points": totalpush + user1point,
                                    });
                            }
                        }
                    } else {
                        let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData.data.firebase_id);
                        if (decryptedAnswer === option) {
                            // point push
                            if (finalScore < 2) {
                                let totalpush = config.randomBattleoneToTwoSeconds + config.battlecorrectanswer;

                                db.collection("battleRoom")
                                    .doc(battleRoomDocumentId)
                                    .update({
                                        "user2.points": totalpush + user2point,
                                    });
                            } else if (finalScore === 3 || finalScore === 4) {
                                let totalpush = config.randomBattlethreeToFourSeconds + config.battlecorrectanswer;

                                db.collection("battleRoom")
                                    .doc(battleRoomDocumentId)
                                    .update({
                                        "user2.points": totalpush + user2point,
                                    });
                            } else {
                                let totalpush = config.battlecorrectanswer;

                                db.collection("battleRoom")
                                    .doc(battleRoomDocumentId)
                                    .update({
                                        "user2.points": totalpush + user2point,
                                    });
                            }
                        }
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
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

    // on timer expire
    const onTimerExpire = () => {
        let documentRef = db.collection("battleRoom").doc(battleRoomDocumentId);

        documentRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    let battleroom = doc.data();

                    let user1ans = battleroom.user1.answers;

                    let user2ans = battleroom.user2.answers;

                    if (userData.data.id === battleroom.user1.uid) {
                        user1ans.push(-1);

                        db.collection("battleRoom").doc(battleRoomDocumentId).update({
                            "user1.answers": user1ans,
                        });
                    } else {
                        user2ans.push(-1);
                        db.collection("battleRoom").doc(battleRoomDocumentId).update({
                            "user2.answers": user2ans,
                        });
                    }

                    // anseerCheck
                    answercheckSnapshot()
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // answercheck snapshot
    const answercheckSnapshot = () => {
        let documentRef = db.collection("battleRoom").doc(battleRoomDocumentId);

        documentRef.onSnapshot(
            (doc) => {

                if (doc.exists) {
                    let battleroom = doc.data();

                    let useroneAnswerLength = battleroom.user1.answers.length;

                    let usertwoAnswerLength = battleroom.user2.answers.length;

                    let entryFee = battleroom.entryFee;

                    if (useroneAnswerLength != 0 || usertwoAnswerLength != 0) {
                        if (useroneAnswerLength === usertwoAnswerLength) {
                            setTimeout(() => {
                                setNextQuestion();
                            },1000)
                            if (user1timer.current !== null && user2timer.current !== null) {
                                user1timer.current.resetTimer();
                                user2timer.current.resetTimer();
                            }
                        } else if (useroneAnswerLength > usertwoAnswerLength) {
                            if (userData.data.id === battleroom.user1.uid) {
                                if (user1timer.current !== null) {
                                    user1timer.current.pauseTimer();
                                }
                            } else {
                                if (user2timer.current !== null) {
                                    user2timer.current.pauseTimer();
                                }

                            }
                        } else if (useroneAnswerLength < usertwoAnswerLength) {
                            if (userData.data.id === battleroom.user2.uid) {
                                if (user1timer.current !== null) {
                                    user1timer.current.pauseTimer();
                                }
                            } else {
                                if (user2timer.current !== null) {
                                    user2timer.current.pauseTimer();
                                }
                            }
                        }
                    }
                }
            },
            (error) => {
                console.log("err", error);
            }
        );
    }

     // point check
     const checkCorrectAnswers = (option) => {
        let documentRef = db.collection("battleRoom").doc(battleRoomDocumentId);

        documentRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    let battleroom = doc.data();

                    let user1name = battleroom.user1.name;

                    let user2name = battleroom.user2.name;

                    let user1image = battleroom.user1.profileUrl;

                    let user2image = battleroom.user2.profileUrl;

                    let user1correct = battleroom.user1.correctAnswers;

                    let user2correct = battleroom.user2.correctAnswers;

                    let user1uid = battleroom.user1.uid;

                    let user2uid = battleroom.user2.uid;


                    // store data in local storage to get in result screen
                    LoadGroupBattleData("user1name",user1name)
                    LoadGroupBattleData("user2name",user2name)
                    LoadGroupBattleData("user1image",user1image)
                    LoadGroupBattleData("user2image",user2image)
                    LoadGroupBattleData("user1uid",user1uid)
                    LoadGroupBattleData("user2uid",user2uid)

                    if (userData.data.id === battleroom.user1.uid) {
                        let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData.data.firebase_id);
                        if (decryptedAnswer === option) {
                            // correctanswer push
                            db.collection("battleRoom")
                                .doc(battleRoomDocumentId)
                                .update({
                                    "user1.correctAnswers": user1correct + 1,
                                });
                        }
                    } else if (userData.data.id === battleroom.user2.uid) {
                        let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData.data.firebase_id);
                        if (decryptedAnswer === option) {
                            // correctanswer push
                            db.collection("battleRoom")
                                .doc(battleRoomDocumentId)
                                .update({
                                    "user2.correctAnswers": user2correct + 1,
                                });
                        }
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };


    //answerlength check
    const SnapshotData = () => {

        let documentRef = db.collection("battleRoom").doc(battleRoomDocumentId);
        let executed = false;
        let TotalUserLength = false;

        documentRef.onSnapshot(
            (doc) => {

                let navigatetoresult = true;

                if (doc.exists) {
                    let battleroom = doc.data();

                    let user1point = battleroom.user1.points;

                    let entryFee = battleroom.entryFee;

                    LoadGroupBattleData("entryFee",entryFee)

                    let user2point = battleroom.user2.points;

                    let userone = battleroom.user1

                    let usertwo = battleroom.user2

                    let user1uid = battleroom.user1.uid

                    let user2uid = battleroom.user2.uid

                    let user1correctanswer = userone.correctAnswers;

                    LoadGroupBattleData("user1CorrectAnswer", user1correctanswer);

                    let user2correctanswer = usertwo.correctAnswers;

                    LoadGroupBattleData("user2CorrectAnswer", user2correctanswer);

                    // for user get data
                    if (userData.data.id === battleroom.user1.uid) {
                        setOpponentdata({ ...battleroom, userName: battleroom.user2.name, profile: battleroom.user2.profileUrl, points: battleroom.user2.points });
                        setLogindata({ ...battleroom, userName: battleroom.user1.name, profile: battleroom.user1.profileUrl, points: battleroom.user1.points });
                    } else {
                        setOpponentdata({ ...battleroom, userName: battleroom.user1.name, profile: battleroom.user1.profileUrl, points: battleroom.user1.points });
                        setLogindata({ ...battleroom, userName: battleroom.user2.name, profile: battleroom.user2.profileUrl, points: battleroom.user2.points });
                    }

                    // point update in localstorage
                    localStoragePoint(user1point, user2point);

                    let navigateUserData = [];

                    navigateUserData = [userone, usertwo];

                    // if user length is less than 1
                    const newUser = [userone, usertwo];

                    const usersWithNonEmptyUid = newUser.filter(elem => elem.uid !== '');

                    if (!TotalUserLength) {
                        TotalUserLength = true;
                        LoadGroupBattleData("totalusers", usersWithNonEmptyUid.length);
                      }

                    // here check if user enter the game coin deduct its first time check
                    if (!executed) {
                        executed = true;
                        newUser.forEach((obj) => {
                            if (userData.data.id === obj.uid && obj.uid !== "" && battleroom.entryFee > 0) {
                                const status = 1;
                                UserCoinScoreApi("-" + battleroom.entryFee, null, null, t("Played Battle"), status, (response) => {
                                    getusercoinsApi((responseData) => {
                                        updateUserDataInfo(responseData.data);
                                    }, (error) => {
                                        console.log(error);
                                    });
                                }, (error) => {
                                    console.log(error);
                                });
                            }
                        });
                    }

                    const usersuid = [user1uid, user2uid];

                    const newArray = newUser.filter((obj) => Object.keys(obj.uid).length > 0);

                    // console.log("newarray",newArray,newArray.length,usersuid.includes(userData.data.id))

                    if (usersuid.includes(userData.data.id) && newArray.length < 2) {
                        MySwal.fire({
                            title: t("Opponent has left the game!"),
                            icon: "warning",
                            showCancelButton: false,
                            confirmButtonColor: "#ef5488",
                            cancelButtonColor: "#d33",
                            confirmButtonText: t("ok"),
                        }).then((result) => {
                            if (result.isConfirmed) {
                                navigate("/quiz-play");
                                deleteBattleRoom(battleRoomDocumentId);

                            }
                        });

                    }

                    //checking if every user has given all question's answer
                    navigateUserData.forEach((elem) => {
                        if (elem.uid != "") {
                            // console.log("answer",elem.answers.length, questions.length)
                            if (elem.answers.length < questions.length) {
                                navigatetoresult = false;
                            }
                        }
                    });

                    if (navigatetoresult) {
                        // end screen
                        onQuestionEnd();
                        deleteBattleRoom(battleRoomDocumentId);
                    }

                } else {
                    if (navigatetoresult && questions.length < currentQuestion) {
                        navigate("/")
                    } else {
                        onQuestionEnd();

                    }
                }
            },
            (error) => {
                console.log("err", error);
            }
        );
    };

    useEffect(() => {
        checkCorrectAnswers();
    }, []);

    useEffect(() => {
        SnapshotData();
        answercheckSnapshot()
        checkpoints();

        return () => {

            let documentRef = db.collection("battleRoom").doc(battleRoomDocumentId);

            documentRef.onSnapshot(
                (doc) => {
                    if (doc.exists) {
                        let battleroom = doc.data();

                        let user1uid = battleroom && battleroom.user1.uid;

                        let user2uid = battleroom && battleroom.user2.uid;

                        let roomid = doc.id;

                        if (user1uid == userData.data.id) {
                            db.collection("battleRoom").doc(roomid).update({
                                "user1.name": "",
                                "user1.uid": "",
                                "user1.profileUrl": "",
                            });
                        } else if (user2uid == userData.data.id) {
                            db.collection("battleRoom").doc(roomid).update({
                                "user2.name": "",
                                "user2.uid": "",
                                "user2.profileUrl": "",
                            });
                        }


                        navigate("/quiz-play");
                        deleteBattleRoom(roomid);
                    }
                },
                (error) => {
                    console.log("err", error);
                }
            );
        };
    }, []);


    return (
        <React.Fragment>
            {/*  */}
            <div className="questions battlequestion" ref={scroll}>
                <div className="inner__headerdash">
                    <div>
                        <div className="total__out__leveldata">
                            <h5 className="text-white inner__total-leveldata">
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

                {/* user1 */}
                <div className="user_data onevsone">
                    <div className="user_one mb-4">
                        {/* timer */}
                        <div className="inner__headerdash">{questions && questions[0]["id"] !== "" ? <Timer ref={user1timer} timerSeconds={timerSeconds} onTimerExpire={onTimerExpire} /> : ""}</div>
                        {/* userinfo */}
                        <div className="inner_user_data onevsonedetails">
                            <div className="username">
                                <p>{userLogindata.userName}</p>
                            </div>
                            <div className="userpoints">
                                <p className="correctAnswer correctAnswer1">
                                    {groupBattledata.user1CorrectAnswer ? groupBattledata.user1CorrectAnswer : 0} / <span>{questions.length}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="user_two mb-4">
                        {/* timer */}
                        <div className="inner__headerdash">{questions && questions[0]["id"] !== "" ? <Timer ref={user2timer} timerSeconds={timerSeconds} onTimerExpire={() => {}} /> : ""}</div>
                        {/* userinfo */}
                        <div className="inner_user_data">
                            <div className="username">
                                <p>{Opponentdata.userName}</p>
                            </div>
                            <div className="userpoints">
                                <p className="correctAnswer correctAnswer1">
                                    {groupBattledata.user2CorrectAnswer ? groupBattledata.user2CorrectAnswer : 0} / <span>{questions.length}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

RandomQuestions.propTypes = {
    questions: PropTypes.array.isRequired,
    onOptionClick: PropTypes.func.isRequired,
};


export default withTranslation()(RandomQuestions);
