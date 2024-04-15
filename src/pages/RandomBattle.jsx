import React, { Fragment, useEffect, useRef, useState } from "react";
import { withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import SEO from "../components/SEO";
import { imgError } from "../utils";
import { Form, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import Timer from "../components/Quiz/common/Timer";
import { Modal, Tabs } from "antd";
import { useSelector } from "react-redux";
import { settingsData, sysConfigdata } from "../store/reducers/settingsSlice";
import { categoriesApi, getusercoinsApi, UserCoinScoreApi } from "../store/actions/campaign";
import { selectCurrentLanguage } from "../store/reducers/languageSlice";
import { updateUserDataInfo } from "../store/reducers/userSlice";
import { groupbattledata, LoadGroupBattleData } from "../store/reducers/groupbattleSlice";
import { Loadtempdata, playwithFrienddata } from "../store/reducers/tempDataSlice";
import FirebaseData from "../utils/firebase";

const RandomBattle = ({ t }) => {
    // store data get
    const userData = useSelector((state) => state.User);

    const selectcurrentLanguage = useSelector(selectCurrentLanguage);

    const groupBattledata = useSelector(groupbattledata);

    const systemconfig = useSelector(sysConfigdata);

    const [category, setCategory] = useState({
        all: "",
        selected: "",
    });

    const selectdata = useSelector(settingsData);

    const random_battle_entry_coin = selectdata && selectdata.filter(item => item.type == "random_battle_entry_coin");

    const [loading, setLoading] = useState(true);

    const [showbattle, setShowBattle] = useState(false);

    const [retrymodal, setretryModal] = useState(false);

    const [showTimer, setShowTimer] = useState(false);

    const [oldtimer, setOldTimer] = useState(false);

    // userdata
    const [userdata, setUserdata] = useState({
        userName: "",
        profile: "",
    });

    const coninsUpdate = userData && Number(userData.data.coins);

    const child = useRef(null);

    const navigate = useNavigate();

    const { db,firebase } = FirebaseData();

    let languageid = selectcurrentLanguage.id;

    let category_selected = systemconfig && systemconfig.battle_random_category_mode == "1" ? category.selected : "";

    let username = userData.data.name || userData.data.email || userData.data.mobile;

    let userprofile = userData.data.profile ? userData.data.profile : "";

    let useruid = userData.data.id;

    // coins
    let entrycoins = random_battle_entry_coin && Number(random_battle_entry_coin[0].message);

    let timerseconds = parseInt(systemconfig.quiz_zone_duration);

    // get category data
    const getAllData = () => {
        categoriesApi(1,(response) => {
                let categoires = response.data;
                setCategory({
                    ...category,
                    all: categoires,
                    selected: categoires[0].id,
                });
                setLoading(false);
            },
            (error) => {
                console.log(error);
            }
        );
    };

    // select category
    const handleSelectCategory = (e) => {
        const index = e.target.selectedIndex;
        const el = e.target.childNodes[index];
        let cat_id = el.getAttribute("id");
        setCategory({ ...category, selected: cat_id });
    };

    // database collection
    const createBattleRoom = async (categoryId, name, profileUrl, uid, roomCode, roomType, entryFee, questionlanguageId) => {
        try {
            let documentreference = db.collection("battleRoom").add({
                categoryId: categoryId,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: uid,
                entryFee: entryFee ? entryFee : 0,
                languageId: questionlanguageId,
                readyToPlay: false,
                roomCode: roomCode ? roomCode : "",
                user1: {
                    answers: [],
                    name: name,
                    points: 0,
                    profileUrl: profileUrl,
                    uid: uid,
                    correctAnswers: 0,
                },
                user2: {
                    answers: [],
                    name: "",
                    points: 0,
                    profileUrl: "",
                    uid: "",
                    correctAnswers: 0,
                },
            });

            return await documentreference;
        } catch (error) {
            toast.error(error);
        }
    };

    // delete battle room
    const deleteBattleRoom = async (documentId) => {
        try {
            await db.collection("battleRoom").doc(documentId).delete();
        } catch (error) {
            toast.error(error);
        }
    };

    // find room
    const searchBattleRoom = async (languageId, categoryId) => {
        try {
            let userfind = await db.collection("battleRoom").where("languageId", "==", languageId).where("categoryId", "==", categoryId).where("roomCode", "==", "").where("user2.uid", "==", "").get();

            let userfinddata = userfind.docs;

            let index = userfinddata.findIndex((elem) => {
                return elem.data().createdBy == useruid;
            });

            if (index !== -1) {
                deleteBattleRoom(userfinddata[index].id);
                userfinddata.splice(userfinddata.length, index);
            }

            return userfinddata;
        } catch (err) {
            toast.error("Error getting document", err);
            console.log(err);
        }
    };

    // join battle room
    const joinBattleRoom = async (name, profileUrl, uid, battleRoomDocumentId) => {
        try {
            let documentRef = (await db.collection("battleRoom").doc(battleRoomDocumentId).get()).ref;

            return db.runTransaction(async (transaction) => {
                let document = await transaction.get(documentRef);

                let userdetails = document.data();


                let user2 = userdetails.user2;

                LoadGroupBattleData("totalusers", 2);

                if (user2.uid === "") {
                    transaction.update(documentRef, {
                        "user2.name": name,
                        "user2.uid": uid,
                        "user2.profileUrl": profileUrl,
                    });

                    return false;
                }



                return true;
            });
        } catch (error) {
            toast.error(error);
            console.log(error);
        }
    };

    // waiting seconds before match start
    const seconduserfound = () => {
        let roomid = groupBattledata.roomID;

        navigate({ pathname: "/random-play" });

        let data = {
            category_id: category_selected,
            room_id: roomid,
            destroy_match: "0",
        };

        Loadtempdata(data);
    };

    // // redirect question screen
    const TimerScreen = () => {
        setOldTimer(false);
        setShowTimer(true);
        // readytoplaytimer.current.startTimer();
    };

    // time expire
    const onTimerExpire = () => {
        let roomid = groupBattledata.roomID;
        deleteBattleRoom(roomid);
        setretryModal(true);
    };

    // subsscribebattle room
    const subscribeToBattleRoom = (battleRoomDocumentId) => {
        let documentRef = db.collection("battleRoom").doc(battleRoomDocumentId);

        documentRef.onSnapshot(
            { includeMetadataChanges: true },
            (doc) => {
                if (doc.exists) {
                    let battleroom = doc.data();

                    let userNotfound = battleroom.user2.uid;

                    if (userNotfound !== "") {
                        setShowBattle(true);
                        TimerScreen();
                    } else {
                        setOldTimer(true);
                    }

                    // for user1
                    if (userData.data.id === battleroom.user1.uid) {
                        setUserdata({ ...userdata, userName: battleroom.user2.name, profile: battleroom.user2.profileUrl });
                    } else {
                        setUserdata({ ...userdata, userName: battleroom.user1.name, profile: battleroom.user1.profileUrl });
                    }
                }
            },
            (error) => {
                console.log("err", error);
            }
        );
    };

    // snapshot listner
    useEffect(() => {
        subscribeToBattleRoom();
    }, []);

    //create room for battle
    const createRoom = async () => {
        // battleroom joiing state

        if (coninsUpdate === "0" && coninsUpdate < 0) {
            setShowBattle(false);
            return;
        }

        // coins deduction
        if (userData.data.coins < entrycoins) {
            toast.error(t("You dont have enough coins"));
            return false;
        }

        let roomCode = "";

        let data = await createBattleRoom(category_selected, username, userprofile, useruid, roomCode, "public", entrycoins, languageid);

        return data.id;
    };

    // search room
    const searchRoom = async () => {
        if (coninsUpdate === "0" && coninsUpdate < 0) {
            setShowBattle(false);
            return;
        }

        // coins deduction
        if (userData.data.coins < entrycoins) {
            toast.error(t("You dont have enough coins"));
            return false;
        }

        try {
            let documents = await searchBattleRoom(languageid, category_selected, username, userprofile, useruid);

            let roomdocid;

            if (documents.length !== 0) {
                let room = documents[Math.floor(Math.random() * documents.length)];

                roomdocid = room.id;

                let searchAgain = await joinBattleRoom(username, userprofile, useruid, roomdocid);
                if (searchAgain) {
                    searchRoom(languageid, category_selected, username, userprofile, useruid);
                } else {
                    subscribeToBattleRoom(roomdocid);
                }
            } else {
                roomdocid = await createRoom();
                // createRoom();
            }
            setShowBattle(true);
            subscribeToBattleRoom(roomdocid);
            LoadGroupBattleData("roomid", roomdocid);
        } catch (error) {
            toast.error(error);
            console.log(error);
        }
    };

    // retry play
    const retryPlay = () => {
        setretryModal(false);
        child.current.resetTimer();
        searchRoom();
    };

    const PlaywithFriend = () => {
        navigate({ pathname: "/play-with-friend-battle" });
        let data = {
            category_id: category_selected,
            language_id: languageid,
        };
        playwithFrienddata(data);
    };

    useEffect(() => {
        getAllData();
    }, [selectCurrentLanguage]);

    const onBackScreen = () => {
        navigate("/quiz-play")
    }

    return (
        <Fragment>
            <SEO title={t("1 vs 1 Battle")} />
            <Breadcrumb title={t("1 vs 1 Battle")} content={t("Home")} contentTwo={t("1 vs 1 Battle")} />
            <div className="SelfLearning battlequiz mb-5">
                <div className="container">
                    <div className="row morphisam">
                        {/* battle screen */}
                        {showbattle ? (
                            <div className="col-md-8 col-12 mx-auto">
                                <div className="randomplayer">
                                    <div className="main_screen">
                                        <div className="timer text-center">
                                            {oldtimer ? <Timer ref={child} timerSeconds={timerseconds} onTimerExpire={onTimerExpire} /> : ""}

                                            {showTimer ? (
                                                <>
                                                    <Timer ref={child} timerSeconds={3} onTimerExpire={seconduserfound} />
                                                    <p className="text-dark">{t("Lets Get Started")}</p>
                                                </>
                                            ) : (
                                                ""
                                            )}
                                        </div>

                                        <div className="inner_Screen onevsonescreen">
                                            <div className="user_profile">
                                                <img src={userData.data.profile} alt="wrteam" onError={imgError} />
                                                <p className="mt-3 text-dark">{userData.data.name || userData.data.email || userData.data.mobile}</p>
                                            </div>
                                            <div className="vs_image">
                                                <img src={process.env.PUBLIC_URL + "/images/battle/vs.svg"} alt="versus" />
                                            </div>
                                            <div className="opponent_image">
                                                <img src={typeof userdata.profile === "undefined" ? "" : userdata.profile} alt="wrteam" onError={imgError} />
                                                <p className="mt-3 text-dark">{typeof userdata.userName === "undefined" ? "waiting..." : userdata.userName}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="col-md-5 col-lg-6 col-12">
                                    <div className="left_content">
                                        <img src={process.env.PUBLIC_URL + "/images/battle/1vs1battle.svg"} alt="wrteam" className="onevsoneimg" />
                                    </div>
                                </div>
                                <div className="col-md-7 col-lg-6 col-12">
                                    <div className="left-sec right_content">
                                        <h3 className=" mb-3">{t("Random Battle")}</h3>
                                        <hr />
                                        <div className="two_header_content d-flex flex-wrap align-items-center mb-3 mt-4">
                                            <div className="random_fees ">
                                                <p>
                                                    {t("Entry Fees")}{" "}
                                                    <span>
                                                        {entrycoins} {""}
                                                    </span>
                                                    {t("Coins")}
                                                </p>
                                            </div>
                                            <div className="random_current_coins">
                                                <p>
                                                    {t("Current Coins")} : {coninsUpdate}
                                                </p>
                                            </div>
                                        </div>

                                        {(() => {
                                            if (systemconfig && systemconfig.battle_random_category_mode == "1") {
                                                return (
                                                    <div className="bottom__cat__box">
                                                        <Form.Select aria-label="Default select example" size="lg" className="selectform" onChange={(e) => handleSelectCategory(e)}>
                                                            {loading ? (
                                                                <option>{t("Loading...")}</option>
                                                            ) : (
                                                                <>
                                                                    {category.all ? (
                                                                        category.all.map((cat_data, key) => {
                                                                            // console.log("",cat_data)
                                                                            const { category_name } = cat_data;
                                                                            return (
                                                                                <option key={key} value={cat_data.key} id={cat_data.id} no_of={cat_data.no_of}>
                                                                                    {category_name}
                                                                                </option>
                                                                            );
                                                                        })
                                                                        ) : (
                                                                            <option>{t("No Category Data Found")}</option>
                                                                    )}
                                                                </>
                                                            )}
                                                        </Form.Select>
                                                    </div>
                                                );
                                            }
                                        })()}

                                        <div className="random_play">
                                            <button type="submit" className="btn btn-primary" onClick={() => searchRoom()}>
                                                {t("Lets Play")}
                                            </button>
                                        </div>
                                    </div>

                                    {/* play with friends */}
                                    <div className="friend_list">
                                        <h5 className=" mt-5">{t("Play With Friend")}</h5>
                                        <hr />
                                        <button className="btn btn-primary" onClick={() => PlaywithFriend(true)}>
                                            {t("Play With Friend")}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* retry modal */}
            <Modal centered  maskClosable={false} visible={retrymodal} onOk={() => setretryModal(false)} onCancel={() => { onBackScreen(); setretryModal(false) }} footer={null} className="custom_modal_notify retry-modal">
                {retrymodal ? (
                    <>
                        <div className="nouser d-flex justify-content-center align-items-center flex-column">
                            <h5 className=" text-center">
                                {t("Opponent not found")} <br></br>
                                {t("Try Again Later!")}
                            </h5>
                            <button className="btn btn-primary mt-2" onClick={() => retryPlay()}>
                                {t("Retry")}
                            </button>
                        </div>
                    </>
                ) : (
                    ""
                )}
            </Modal>
        </Fragment>
    );
};

export default withTranslation()(RandomBattle);
