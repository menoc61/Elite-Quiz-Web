import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import "react-circular-progressbar/dist/styles.css";
import { useSelector } from "react-redux";
import { battleDataClear, groupbattledata } from "../../../store/reducers/groupbattleSlice";
import { imgError } from "../../../utils";
import { UserCoinScoreApi, getusercoinsApi } from "../../../store/actions/campaign";
import { updateUserDataInfo } from "../../../store/reducers/userSlice";

function GroupBattleScore({ t}) {
    const navigate = useNavigate();

     // store data get
     const userData = useSelector((state) => state.User);

    const groupBattledata = useSelector(groupbattledata);

    const goToHome = () => {
        navigate("/");
    };

    const goBack = () => {
        navigate("/quiz-play");
    };

    // fetch data from local storage
    let user1correctanswer = groupBattledata.user1CorrectAnswer;
    let user2correctanswer = groupBattledata.user2CorrectAnswer;
    let user3correctanswer = groupBattledata.user3CorrectAnswer;
    let user4correctanswer = groupBattledata.user4CorrectAnswer;

    let user1name = groupBattledata.user1name;
    let user2name = groupBattledata.user2name;
    let user3name = groupBattledata.user3name;
    let user4name = groupBattledata.user4name;

    let user1uid = groupBattledata.user1uid;
    let user2uid = groupBattledata.user2uid;
    let user3uid = groupBattledata.user3uid;
    let user4uid = groupBattledata.user4uid;

    let user1image = groupBattledata.user1image;
    let user2image = groupBattledata.user2image;
    let user3image = groupBattledata.user3image;
    let user4image = groupBattledata.user4image;

    let entryFee = groupBattledata.entryFee;

    // user data
    const alluseranswer = [user1correctanswer, user2correctanswer, user3correctanswer, user4correctanswer];

    const alluid = [user1uid, user2uid, user3uid, user4uid];

    const alluserimage = [user1image, user2image, user3image, user4image];

    const allusername = [user1name, user2name, user3name, user4name];


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

    // max user index
    const index = alluseranswer.indexOf(max);

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
    }, []);


    // all data store in array object
    let allData = [
        {
            uid: user1uid,
            image: user1image,
            name: user1name,
            correctAnswer: user1correctanswer,
        },
        {
            uid: user2uid,
            image: user2image,
            name: user2name,
            correctAnswer: user2correctanswer,
        },
        {
            uid: user3uid,
            image: user3image,
            name: user3name,
            correctAnswer: user3correctanswer,
        },
        {
            uid: user4uid,
            image: user4image,
            name: user4name,
            correctAnswer: user4correctanswer,
        },
    ];

    // all data store in array object
    let tieData = [
        {
            uid: user1uid,
            image: user1image,
            name: user1name,
            correctAnswer: user1correctanswer,
        },
        {
            uid: user2uid,
            image: user2image,
            name: user2name,
            correctAnswer: user2correctanswer,
        },
        {
            uid: user3uid,
            image: user3image,
            name: user3name,
            correctAnswer: user3correctanswer,
        },
        {
            uid: user4uid,
            image: user4image,
            name: user4name,
            correctAnswer: user4correctanswer,
        },
    ];

    // filter to remove winner from all data
    let i = -1;
    let j;
    allData.filter((obj) => {
        i = i + 1;
        if (obj.correctAnswer == max) {
            j = i;
        }
    });

    allData.splice(j, 1);

    // check duplicate array for tie

    let tieuser = [];
    let tieloser = [];

    tieData.forEach((str) => {
        if (str.correctAnswer == max) {
            tieuser.push(str);
        } else {
            tieloser.push(str);
        }
    });


    return (
        <React.Fragment>
            <div className="my-4 row d-flex align-items-center">
                {(() => {
                    if (maxIndices.length == 1) {
                        if (userData.data.id == alluid[index]) {
                            return (
                                <div className="result_data">
                                    <p>{t("Congratulations")}</p>
                                    <h3>{t("Winner")}</h3>
                                </div>
                            );
                        } else {
                            return (
                                <div className="result_data">
                                    <p>{t("Good luck next time")}</p>
                                    <h3>{t("You Lose")}</h3>
                                </div>
                            );
                        }
                    } else if (maxIndices.length >= 2) {
                        return (
                            <div className="result_data">
                                <h3>{t("Tie")}</h3>
                            </div>
                        );
                    }
                })()}

                <div className="user_data group_battle">
                    {(() => {
                        if (maxIndices.length == 1) {
                            return (
                                <>
                                    {/* winner */}
                                    <div className="login_winner">
                                        <img src={alluserimage[index]} alt="user" className="showscore-userprofile" onError={(e) => imgError(e)} />
                                        <p>{allusername[index]}</p>
                                        <p className="point_screen group_result_point">{alluseranswer[index]}</p>
                                        {/* <p>{t("Winner")}</p> */}
                                    </div>

                                    {/* loser */}
                                    <div className="opponet_loser group_battle_loser">
                                        {allData.map((elem, i) =>
                                            elem.uid != "" ? (
                                                <>
                                                    <div className="group_data">
                                                        <img src={elem.image} alt="user" className="showscore-userprofile" onError={imgError} />
                                                        <p>{elem.name}</p>
                                                        <p className="point_screen group_result_point">{elem.correctAnswer}</p>
                                                        {/* <p>{t("Loser")}</p> */}
                                                    </div>
                                                </>
                                            ) : null
                                        )}
                                    </div>
                                </>
                            );
                        } else {

                            let tiesuserData = tieuser.map((elem, i) => (
                                <>
                                    <div className="group_data">
                                        <img src={elem.image} alt="user" className="showscore-userprofile" onError={imgError} />
                                        <p>{elem.name}</p>
                                        <p className="point_screen group_result_point">{elem.correctAnswer}</p>
                                    </div>
                                </>
                            ))

                            let tiesloserData = tieloser.map((elem, i) =>
                            elem.uid != "" ? (
                                <>
                                    <div className="group_data">
                                        <img src={elem.image} alt="user" className="showscore-userprofile" onError={imgError} />
                                        <p>{elem.name}</p>
                                        <p className="point_screen group_result_point">{elem.correctAnswer}</p>
                                        <p>{t("Loser")}</p>
                                    </div>

                                </>
                            ) : null
                            );

                            let alluserData = [...new Set([...tiesuserData, ...tiesloserData])];

                            return (alluserData);
                        }
                    })()}
                </div>
            </div>

            <div className="dashoptions row text-center">
                <div className="skip__questions col-12 col-sm-6 col-md-2 custom-dash">
                    <button className="btn btn-primary" onClick={goToHome}>
                        {t("Home")}
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
}

GroupBattleScore.propTypes = {
    coins: PropTypes.number.isRequired,
};
export default withTranslation()(GroupBattleScore);
