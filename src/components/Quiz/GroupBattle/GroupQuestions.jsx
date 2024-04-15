import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Timer from "../common/Timer";
import { decryptAnswer, calculateScore, calculateCoins, imgError } from "../../../utils";
import { toast } from "react-toastify";
import { Modal } from "antd";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { sysConfigdata } from "../../../store/reducers/settingsSlice";
import { getusercoinsApi, setBadgesApi, UserCoinScoreApi, UserStatisticsApi } from "../../../store/actions/campaign";
import { updateUserDataInfo } from "../../../store/reducers/userSlice";
import { groupbattledata, LoadGroupBattleData } from "../../../store/reducers/groupbattleSlice";
import rightClick from "../../../assets/audio/right.mp3";
import wrongClick from "../../../assets/audio/wrong.mp3";
import { badgesData, LoadNewBadgesData } from "../../../store/reducers/badgesSlice";
import FirebaseData from "../../../utils/firebase";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const GroupQuestions = ({ t, questions: data, timerSeconds, onOptionClick, onQuestionEnd }) => {
    const [questions, setQuestions] = useState(data);

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [score, setScore] = useState(0);

    const [waitforothers, setWaitforOthers] = useState(false);

    const [battleUserData, setBattleUserData] = useState([]);

    const child = useRef(null);

    const scroll = useRef(null);

    const navigate = useNavigate();

    // store data get
    const userData = useSelector((state) => state.User);

    const systemconfig = useSelector(sysConfigdata);

    const groupBattledata = useSelector(groupbattledata);

    const Badges = useSelector(badgesData);

    const { db } = FirebaseData();

    const clash_winner_status = Badges && Badges.data.clash_winner.status;

    const clash_winner_coin = Badges && Badges.data.clash_winner.badge_reward;

    const rightclick = new Audio(rightClick);

    let playerremove = useRef(false);

    const wrongclick = new Audio(wrongClick);

    const [answeredQuestions, setAnsweredQuestions] = useState({});

    const addAnsweredQuestion = (item) => {
        setAnsweredQuestions({ ...answeredQuestions, [item]: true });
    };

    setTimeout(() => {
        setQuestions(data);
    }, 500);

    //firestore adding answer in doc
    let battleRoomDocumentId = groupBattledata.roomID;

    // delete battle room
    const deleteBattleRoom = async (documentId) => {
        try {
            await db.collection("multiUserBattleRoom").doc(documentId).delete();
        } catch (error) {
            toast.error(error);
        }
    };

    // clash winner badge
    const groupAllBattledata = [
        { uid: groupBattledata.user1uid, point: groupBattledata.user1point },
        { uid: groupBattledata.user2uid, point: groupBattledata.user2point },
        { uid: groupBattledata.user3uid, point: groupBattledata.user3point },
        { uid: groupBattledata.user4uid, point: groupBattledata.user4point },
        // add more objects for additional users
    ];

    const clashWinnerBadge = () => {
        if (clash_winner_status === "0") {
            for (let i = 0; i < groupAllBattledata.length; i++) {
                const user = groupAllBattledata[i]; // get current user object
                if (userData.data.id === user.uid) { // check if current user object matches current user
                  let hasHighestScore = true; // assume current user has highest score
                  for (let j = 0; j < groupAllBattledata.length; j++) { // loop over all users except current user
                    if (i !== j) { // skip current user
                      if (user.point <= groupAllBattledata[j].point) { // check if current user's score is less than or equal to other user's score
                        hasHighestScore = false; // if not, set hasHighestScore to false
                        break; // exit inner loop since current user does not have highest score
                      }
                    }
                  }
                  if (hasHighestScore) { // if current user has highest score, set badge
                    setBadgesApi("clash_winner", () => {
                      LoadNewBadgesData("clash_winner", "1");
                        toast.success(t("You Won Clash Winner Badge"));
                        const status = 0;
                        UserCoinScoreApi(clash_winner_coin, null, null, (t("clash badge reward")), status, (response) => {
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
                  break; // exit outer loop since current user object has been found
                }
            }
        }
    }

    // next questions
    const setNextQuestion = () => {
        const nextQuestion = currentQuestion + 1;

        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
            child.current.resetTimer();
        } else {
            let result_score = score;

            let percentage = (100 * result_score) / questions.length;
            UserStatisticsApi(
                questions.length,
                result_score,
                questions[currentQuestion].category,
                percentage,
                (response) => {},
                (error) => {
                    console.log(error);
                }
            );
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
    const localStorageData = (user1name, user2name, user3name, user4name, user1image, user2image, user3image, user4image, user1uid, user2uid, user3uid, user4uid) => {
        LoadGroupBattleData("user1name", user1name);
        LoadGroupBattleData("user2name", user2name);
        LoadGroupBattleData("user3name", user3name);
        LoadGroupBattleData("user4name", user4name);
        LoadGroupBattleData("user1image", user1image);
        LoadGroupBattleData("user2image", user2image);
        LoadGroupBattleData("user3image", user3image);
        LoadGroupBattleData("user4image", user4image);
        LoadGroupBattleData("user1uid", user1uid);
        LoadGroupBattleData("user2uid", user2uid);
        LoadGroupBattleData("user3uid", user3uid);
        LoadGroupBattleData("user4uid", user4uid);
    };

    // submit answer
    const submitAnswer = (selected_option) => {
        let documentRef = db.collection("multiUserBattleRoom").doc(battleRoomDocumentId);

        documentRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    let battleroom = doc.data();

                    let user1ans = battleroom.user1.answers;

                    let user2ans = battleroom.user2.answers;

                    let user3ans = battleroom.user3.answers;

                    let user4ans = battleroom.user4.answers;

                    // answer update in document
                    if (userData.data.id === battleroom.user1.uid) {
                        // answer push
                        user1ans.push(selected_option);

                        db.collection("multiUserBattleRoom").doc(battleRoomDocumentId).update({
                            "user1.answers": user1ans,
                        });
                    } else if (userData.data.id === battleroom.user2.uid) {
                        // answer push
                        user2ans.push(selected_option);

                        db.collection("multiUserBattleRoom").doc(battleRoomDocumentId).update({
                            "user2.answers": user2ans,
                        });
                    } else if (userData.data.id === battleroom.user3.uid) {
                        // answer push
                        user3ans.push(selected_option);

                        db.collection("multiUserBattleRoom").doc(battleRoomDocumentId).update({
                            "user3.answers": user3ans,
                        });
                    } else if (userData.data.id === battleroom.user4.uid) {
                        // answer push
                        user4ans.push(selected_option);

                        db.collection("multiUserBattleRoom").doc(battleRoomDocumentId).update({
                            "user4.answers": user4ans,
                        });
                    }

                    setTimeout(() => {
                        setNextQuestion();
                    }, 1000);

                    // point
                    checkCorrectAnswers(selected_option);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // point check
    const checkCorrectAnswers = (option) => {
        let documentRef = db.collection("multiUserBattleRoom").doc(battleRoomDocumentId);

        documentRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    let battleroom = doc.data();

                    let user1name = battleroom.user1.name;

                    let user2name = battleroom.user2.name;

                    let user3name = battleroom.user3.name;

                    let user4name = battleroom.user4.name;

                    let user1image = battleroom.user1.profileUrl;

                    let user2image = battleroom.user2.profileUrl;

                    let user3image = battleroom.user3.profileUrl;

                    let user4image = battleroom.user4.profileUrl;

                    let user1correct = battleroom.user1.correctAnswers;

                    let user2correct = battleroom.user2.correctAnswers;

                    let user3correct = battleroom.user3.correctAnswers;

                    let user4correct = battleroom.user4.correctAnswers;

                    let user1uid = battleroom.user1.uid;

                    let user2uid = battleroom.user2.uid;

                    let user3uid = battleroom.user3.uid;

                    let user4uid = battleroom.user4.uid;

                    // store data in local storage to get in result screen
                    localStorageData(user1name, user2name, user3name, user4name, user1image, user2image, user3image, user4image, user1uid, user2uid, user3uid, user4uid);

                    if (userData.data.id === battleroom.user1.uid) {
                        let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData.data.firebase_id);
                        if (decryptedAnswer === option) {
                            // correctanswer push
                            db.collection("multiUserBattleRoom")
                                .doc(battleRoomDocumentId)
                                .update({
                                    "user1.correctAnswers": user1correct + 1,
                                });
                        }
                    } else if (userData.data.id === battleroom.user2.uid) {
                        let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData.data.firebase_id);
                        if (decryptedAnswer === option) {
                            // correctanswer push
                            db.collection("multiUserBattleRoom")
                                .doc(battleRoomDocumentId)
                                .update({
                                    "user2.correctAnswers": user2correct + 1,
                                });
                        }
                    } else if (userData.data.id === battleroom.user3.uid) {
                        let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData.data.firebase_id);
                        if (decryptedAnswer === option) {
                            // correctanswer push
                            db.collection("multiUserBattleRoom")
                                .doc(battleRoomDocumentId)
                                .update({
                                    "user3.correctAnswers": user3correct + 1,
                                });
                        }
                    } else if (userData.data.id === battleroom.user4.uid) {
                        let decryptedAnswer = decryptAnswer(questions[currentQuestion].answer, userData.data.firebase_id);
                        if (decryptedAnswer === option) {
                            // correctanswer push
                            db.collection("multiUserBattleRoom")
                                .doc(battleRoomDocumentId)
                                .update({
                                    "user4.correctAnswers": user4correct + 1,
                                });
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
        let documentRef = db.collection("multiUserBattleRoom").doc(battleRoomDocumentId);

        documentRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    let battleroom = doc.data();

                    let user1ans = battleroom.user1.answers;

                    let user2ans = battleroom.user2.answers;

                    let user3ans = battleroom.user3.answers;

                    let user4ans = battleroom.user4.answers;

                    if (userData.data.id === battleroom.user1.uid) {
                        user1ans.push(-1);

                        db.collection("multiUserBattleRoom").doc(battleRoomDocumentId).update({
                            "user1.answers": user1ans,
                        });
                    } else if (userData.data.id === battleroom.user2.uid) {
                        user2ans.push(-1);
                        db.collection("multiUserBattleRoom").doc(battleRoomDocumentId).update({
                            "user2.answers": user2ans,
                        });
                    } else if (userData.data.id === battleroom.user3.uid) {
                        user3ans.push(-1);
                        db.collection("multiUserBattleRoom").doc(battleRoomDocumentId).update({
                            "user3.answers": user3ans,
                        });
                    } else if (userData.data.id === battleroom.user4.uid) {
                        user4ans.push(-1);
                        db.collection("multiUserBattleRoom").doc(battleRoomDocumentId).update({
                            "user4.answers": user4ans,
                        });
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
        setNextQuestion();
    };

    //snapshot realtime data fetch
    useEffect(() => {
        let documentRef = db.collection("multiUserBattleRoom").doc(battleRoomDocumentId);
        let executed = false;
        let TotalUserLength = false;

        let unsubscribe = documentRef.onSnapshot(
            (doc) => {
                let navigatetoresult = true;

                let waiting = false;

                if (doc.exists) {
                    let battleroom = doc.data();

                    let user1 = battleroom.user1;

                    let user2 = battleroom.user2;

                    let user3 = battleroom.user3;

                    let user4 = battleroom.user4;

                    let entryFee = battleroom.entryFee;

                    LoadGroupBattleData("entryFee",entryFee)

                    // set answer in localstorage

                    let user1correctanswer = user1.correctAnswers;

                    LoadGroupBattleData("user1CorrectAnswer", user1correctanswer);

                    let user2correctanswer = user2.correctAnswers;

                    LoadGroupBattleData("user2CorrectAnswer", user2correctanswer);

                    let user3correctanswer = user3.correctAnswers;

                    LoadGroupBattleData("user3CorrectAnswer", user3correctanswer);

                    let user4correctanswer = user4.correctAnswers;

                    LoadGroupBattleData("user4CorrectAnswer", user4correctanswer);

                    let navigateUserData = [];

                    navigateUserData = [user1, user2, user3, user4];

                    if (userData.data.id === battleroom.user1.uid) {
                        setBattleUserData([user2, user3, user4]);
                    }

                    if (userData.data.id === battleroom.user2.uid) {
                        setBattleUserData([user1, user3, user4]);
                    }

                    if (userData.data.id === battleroom.user3.uid) {
                        setBattleUserData([user1, user2, user4]);
                    }

                    if (userData.data.id === battleroom.user4.uid) {
                        setBattleUserData([user1, user2, user3]);
                    }

                    // if user length is less than 1
                    const newUser = [user1, user2, user3, user4];

                    const usersWithNonEmptyUid = newUser.filter(elem => elem.uid !== '');

                    if (!TotalUserLength) {
                        TotalUserLength = true;
                        LoadGroupBattleData("totalusers", usersWithNonEmptyUid.length);
                      }

                    // here check if user enter the game coin deduct its first time check
                    if (!executed) {
                        executed = true;
                        newUser.forEach((obj) => {
                            if (userData.data.id === obj.uid && obj.uid !== "" && entryFee > 0) {
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

                    const newArray = newUser.filter((obj) => Object.keys(obj.uid).length > 0);

                    newUser.forEach((elem) => {
                        if (elem.obj === "") {
                            playerremove.current = true
                        }
                    })

                    if (newArray.length < 2) {
                        deleteBattleRoom(battleRoomDocumentId);
                        MySwal.fire({
                            title: t("Everyone has left the game"),
                            icon: "warning",
                            showCancelButton: false,
                            confirmButtonColor: "#ef5488",
                            cancelButtonColor: "#d33",
                            confirmButtonText: t("ok"),
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // in between battle if all user left the game then one user get all coins of other users
                                const winAmount = entryFee * groupBattledata.totalusers
                                newArray.forEach((obj) => {
                                    if (userData.data.id == obj.uid && entryFee > 0) {
                                        const status = 0;
                                        UserCoinScoreApi(winAmount, null, null, t("Won Battle"), status, (response) => {
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

                                navigate("/quiz-play");
                            }
                        });
                    }

                    //checking if every user has given all question's answer
                    navigateUserData.forEach((elem) => {
                        if (elem.uid != "") {
                            if (elem.answers.length < questions.length) {
                                navigatetoresult = false;
                            } else if (elem.uid == userData.data.id && elem.answers.length >= questions.length) {
                                child.current.pauseTimer();
                                waiting = true;
                            }
                        }
                    });

                    //user submitted answer and check other users answers length
                    if (waiting) {
                        setWaitforOthers(true);
                    }

                    //if  all user has submitted answers
                    if (navigatetoresult) {
                        onQuestionEnd();
                        clashWinnerBadge();
                        deleteBattleRoom(battleRoomDocumentId);
                    }
                }
            },
            (error) => {
                console.log("err", error);
            }
        );

        let alluserArray = [groupBattledata.user1uid, groupBattledata.user2uid, groupBattledata.user3uid, groupBattledata.user4uid]
        for (let i = 0; i < alluserArray.length; i++) {
            const elem = alluserArray[i];
            if (userData.data.id == elem && playerremove) {
                navigate("/quiz-play"); // Navigate to the desired page

                unsubscribe();
                // LoadGroupBattleData("roomid", "");
                break; // Break the loop after calling the cleanup function
            }
        }

        return () => {
            // Cleanup function
            unsubscribe();
            // LoadGroupBattleData("roomid", "");
        };

    }, [userData.data.id, playerremove]);


    useEffect(() => {
        checkCorrectAnswers();
    }, []);

    useEffect(() => {
        return () => {
            let documentRef = db.collection("multiUserBattleRoom").doc(battleRoomDocumentId);

             db.runTransaction(async (transaction) => {
                let doc = await transaction.get(documentRef);
                let battleroom = doc.data();

                        let user1uid = battleroom && battleroom.user1.uid;

                        let user2uid = battleroom && battleroom.user2.uid;

                        let user3uid = battleroom && battleroom.user3.uid;

                        let user4uid = battleroom && battleroom.user4.uid;


                        if (user1uid == userData.data.id) {

                            db.collection("multiUserBattleRoom").doc(battleRoomDocumentId).update({
                                "user1.name": "",
                                "user1.uid": "",
                                "user1.profileUrl": "",
                            });


                        } else if (user2uid == userData.data.id) {

                            db.collection("multiUserBattleRoom").doc(battleRoomDocumentId).update({
                                "user2.name": "",
                                "user2.uid": "",
                                "user2.profileUrl": "",
                            });

                        } else if (user3uid == userData.data.id) {

                            db.collection("multiUserBattleRoom").doc(battleRoomDocumentId).update({
                                "user3.name": "",
                                "user3.uid": "",
                                "user3.profileUrl": "",
                            });

                        } else if (user4uid == userData.data.id) {

                            db.collection("multiUserBattleRoom").doc(battleRoomDocumentId).update({
                                "user4.name": "",
                                "user4.uid": "",
                                "user4.profileUrl": "",
                            });

                        }
            });
        };

    }, []);

    return (
        <React.Fragment>
            <div className="questions battlequestion groupbattle" ref={scroll}>
                <div className="inner__headerdash groupPlay_header">
                    <div className="inner__headerdash_data">{questions && questions[0]["id"] !== "" ? <Timer ref={child} timerSeconds={timerSeconds} onTimerExpire={onTimerExpire} /> : ""}</div>

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

                <div className="user_data">
                    <div className="user_profile">
                        <img src={userData.data.profile} alt="wrteam" onError={imgError} />
                        <p className="mt-3">{userData.data.name ? userData.data.name : userData.data.email}</p>
                        <p className="correctAnswer">{groupBattledata.user1CorrectAnswer ? groupBattledata.user1CorrectAnswer : 0} / <span>{questions.length}</span></p>
                    </div>

                    {battleUserData?.map((data, index) =>
                        data.uid !== "" ? (
                            <>
                                <div className="opponent_image" key={index}>
                                    <img src={data.profileUrl} alt="wrteam" onError={imgError} />
                                    <p className="mt-3">{data.name ? data.name : "Waiting..."}</p>
                                    <p className="correctAnswer">{data.correctAnswers ? data.correctAnswers : 0} / <span>{questions.length}</span></p>
                                </div>
                            </>
                        ) : null
                    )}
                </div>

                {/* waiting popup */}

                <Modal closable={false} keyboard={false} centered visible={waitforothers} footer={null} className="custom_modal_notify retry-modal playwithfriend">
                    {waitforothers ? (
                        <>
                            <p>{t("Please Wait for others Players to Complete their Match")}</p>
                        </>
                    ) : (
                        ""
                    )}
                </Modal>
            </div>
        </React.Fragment>
    );
}

GroupQuestions.propTypes = {
    questions: PropTypes.array.isRequired,
    onOptionClick: PropTypes.func.isRequired,
};

export default withTranslation()(GroupQuestions);
