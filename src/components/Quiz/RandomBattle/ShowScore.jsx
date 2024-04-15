import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import "react-circular-progressbar/dist/styles.css";
import { useSelector } from "react-redux";
import { battleDataClear, groupbattledata } from "../../../store/reducers/groupbattleSlice";
import { imgError } from "../../../utils";
import { UserCoinScoreApi, getusercoinsApi, setBadgesApi, setbattlestaticticsApi } from "../../../store/actions/campaign";
import { badgesData, LoadNewBadgesData } from "../../../store/reducers/badgesSlice";
import { toast } from "react-toastify";
import { updateUserDataInfo } from "../../../store/reducers/userSlice";


const ShowScore = ({ t, onReviewAnswersClick, reviewAnswer }) => {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate("/");
    };

    const goBack = () => {
        navigate("/quiz-play");
    };

     // store data get
    const userData = useSelector((state) => state.User);

    const groupBattledata = useSelector(groupbattledata);

    const badgesdata = useSelector(badgesData);

    const quiz_warrior_status = badgesdata && badgesdata.data.quiz_warrior.status;

    const quiz_warrior_coin = badgesdata && badgesdata.data.quiz_warrior.badge_reward;

    let user1point = groupBattledata.user1point;
    let user2point = groupBattledata.user2point;
    let user1name = groupBattledata.user1name;
    let user2name = groupBattledata.user2name;
    let user1uid = groupBattledata.user1uid;
    let user2uid = groupBattledata.user2uid;
    let user1image = groupBattledata.user1image;
    let user2image = groupBattledata.user2image;
    let entryFee = groupBattledata.entryFee;

    // winner id
    const comparePointsAndRetrieveUserIDs = () => {
        if (user1point > user2point) {
            // user1point is greater than user2point
            return user1uid;
          } else if (user2point > user1point) {
            // user2point is greater than user1point
            return user2uid;
          } else {
            // user1point and user2point are equal
            return 0;
          }
    }

    // login user
    const user2IdGet = () => {
        if (userData.data.id == user1uid) {
            return user2uid;
        } else {
            return user1uid;
        }
    }

    let counter = 0;


    // quiz warrior badge
    const checkCondition = (userData, user1uid, user1point, user2point) => {
        if (userData.data.id === user1uid && user1point > user2point) {
            counter++;
            if (quiz_warrior_status === "0" && counter === 3) {
                setBadgesApi("quiz_warrior", () => {
                    LoadNewBadgesData("quiz_warrior", "1")
                    toast.success(t("You Won Quiz Warrior Badge"));
                    const status = 0;
                    UserCoinScoreApi(quiz_warrior_coin, null, null, (t("quiz warrior badge reward")), status, (response) => {
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

        } else if (userData.data.id === user2uid && user2point > user1point) {
            counter++;
            if (quiz_warrior_status === "0" && counter === 3) {
                setBadgesApi("quiz_warrior", () => {
                    LoadNewBadgesData("quiz_warrior", "1")
                    toast.success(t("You Won Quiz Warrior Badge"));
                    const status = 0;
                    UserCoinScoreApi(quiz_warrior_coin, null, null, (t("quiz warrior badge reward")), status, (response) => {
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
        } else {
            counter = 0;
        }
    };

    useEffect(() => {
        checkCondition(userData,user1uid,user1point,user2point);
    }, [])

    // set battle statistics api
    useEffect(() => {
        let compareBattledata = comparePointsAndRetrieveUserIDs();
        let user2uidData = user2IdGet();
        setbattlestaticticsApi(userData.data.id, user2uidData, compareBattledata, compareBattledata ? 0 : 1);
    }, []);

    const alluseranswer = [user1point, user2point];

    const alluid = [user1uid, user2uid];

    // find max number
    const max = Math.max(...alluseranswer);

    let maxIndices = [];

    for (let i = 0; i < alluseranswer.length; i++) {
        if (alluseranswer[i] === max) {
            maxIndices.push(i);
        }
    }

    // Find the user IDs of all users with the max number of correct answers
    const usersWithMax = [];
    for (const index of maxIndices) {
        usersWithMax.push(alluid[index]);
    }

    let winAmount = entryFee * (groupBattledata.totalusers / maxIndices.length);

    useEffect(() => {
        if (usersWithMax.includes(userData.data.id) && entryFee > 0) {
            // Winner logic
            const status = 0;
            UserCoinScoreApi(Math.floor(winAmount), null, null, t("Won Battle"), status, (response) => {
                getusercoinsApi((responseData) => {
                    updateUserDataInfo(responseData.data);
                }, (error) => {
                    console.log(error);
                });
            }, (error) => {
                console.log(error);
            });
        }
    },[])

    return (
        <React.Fragment>
            <div className="my-4 row d-flex align-items-center">
                {(() => {
                    if (userData.data.id == user1uid && user1point > user2point) {
                        return (
                            <div className="result_data">
                                <p>{t("Congratulations")}</p>
                                <h3>{t("Winner")}</h3>
                            </div>
                        );
                    } else if (userData.data.id == user1uid && user1point < user2point) {
                        return (
                            <div className="result_data">
                                <p>{t("Good luck next time")}</p>
                                <h3>{t("You Lose")}</h3>
                                {entryFee > 0 ? <p className="lost_coin">{t(`Unfortunately lost ${entryFee} coins`)}</p> : null}
                            </div>
                        );
                    } else if (userData.data.id == user2uid && user1point > user2point) {
                        return (
                            <div className="result_data">
                                <p>{t("Good luck next time")}</p>
                                <h3>{t("You Lose")}</h3>
                                {entryFee > 0 ? <p className="lost_coin">{t(`Unfortunately lost ${entryFee} coins`)}</p> : null}
                            </div>
                        );
                    } else if (userData.data.id == user2uid && user1point < user2point) {
                        return (
                            <div className="result_data">
                                <p>{t("Congratulations")}</p>
                                <h3>{t("Winner")}</h3>
                            </div>
                        );
                    } else if (user1point == user2point) {
                        return (
                            <div className="result_data">
                                <h3>{t("Tie")}</h3>
                            </div>
                        );
                    }
                })()}

                {(() => {
                    if (user1point > user2point) {
                        return (
                            <div className="user_data onevsone">
                                <div className="login_winner">
                                    <img src={user1image ? user1image : process.env.PUBLIC_URL + "/images/user.svg"} alt="user" className="showscore-userprofile" onError={imgError}/>
                                    <p>{user1name}</p>
                                    <p>{t("Winner")}</p>
                                    <p className="point_screen">{t("Score") }: {user1point}</p>
                                </div>

                                {/* vs */}
                                <div className="versus_screen">
                                    <img src={process.env.PUBLIC_URL + "/images/battle/vs.svg"} alt="versus" />
                                </div>

                                <div className="opponet_loser">
                                    <img src={user2image ? user2image : process.env.PUBLIC_URL + "/images/user.svg"} alt="user" className="showscore-userprofile" onError={imgError}/>
                                    <p>{user2name}</p>
                                    <p>{t("Loser")}</p>
                                    <p className="point_screen">{t("Score") }: {user2point}</p>
                                </div>
                            </div>
                        );
                    } else if (user1point < user2point) {
                        return (
                            <div className="user_data">
                                <div className="login_winner">
                                    <img src={user2image ? user2image : process.env.PUBLIC_URL + "/images/user.svg"} alt="user" className="showscore-userprofile" onError={imgError}/>
                                    <p>{user2name}</p>
                                    <p>{t("Winner")}</p>
                                    <p className="point_screen">{t("Score") }: {user2point}</p>
                                </div>

                                {/* vs */}
                                <div className="versus_screen">
                                    <img src={process.env.PUBLIC_URL + "/images/battle/vs.svg"} alt="versus" />
                                </div>

                                <div className="opponet_loser">
                                    <img src={user1image ? user1image : process.env.PUBLIC_URL + "/images/user.svg"} alt="user" className="showscore-userprofile" onError={imgError}/>
                                    <p>{user1name}</p>
                                    <p>{t("Loser")}</p>
                                    <p className="point_screen">{t("Score") }: {user1point}</p>
                                </div>
                            </div>
                        );
                    } else if (user1point == user2point) {
                        return (
                            <div className="user_data">
                                <div className="login_winner">
                                    <img src={user1image ? user1image : process.env.PUBLIC_URL + "/images/user.svg"} alt="user" className="showscore-userprofile" onError={imgError}/>
                                    <p>{user1name}</p>
                                    <p>{t("Tie")}</p>
                                    <p className="point_screen">{t("Score") }: {user1point}</p>
                                </div>

                                {/* vs */}
                                <div className="versus_screen">
                                    <img src={process.env.PUBLIC_URL + "/images/battle/vs.svg"} alt="versus" />
                                </div>

                                <div className="opponet_loser">
                                    <img src={user2image ? user2image : process.env.PUBLIC_URL + "/images/user.svg"} alt="user" className="showscore-userprofile" onError={imgError}/>
                                    <p>{user2name}</p>
                                    <p>{t("Tie")}</p>
                                    <p className="point_screen">{t("Score") }: {user2point}</p>
                                </div>
                            </div>
                        );
                    }
                })()}
            </div>

            <div className="dashoptions row text-center">
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
    coins: PropTypes.number.isRequired,
};
export default withTranslation()(ShowScore);
