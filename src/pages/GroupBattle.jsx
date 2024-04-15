import React, { Fragment, useEffect, useState, useRef } from "react";
import { withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import SEO from "../components/SEO";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from 'react-router-dom';
import { Modal, Tabs } from "antd";
import { FacebookIcon, FacebookShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { categoriesApi, createMultiRoomApi, getusercoinsApi, UserCoinScoreApi } from "../store/actions/campaign";
import { selectCurrentLanguage } from "../store/reducers/languageSlice";
import { updateUserDataInfo } from "../store/reducers/userSlice";
import { settingsData, sysConfigdata } from "../store/reducers/settingsSlice";
import { battleDataClear, groupbattledata, LoadGroupBattleData } from "../store/reducers/groupbattleSlice";
import { Loadtempdata } from "../store/reducers/tempDataSlice";
import {imgError} from "../utils/index";
import { websettingsData } from "../store/reducers/webSettings";
import FirebaseData from "../utils/firebase";

const GroupBattle = ({ t }) => {
    const MySwal = withReactContent(Swal);

    // store data get
    const userData = useSelector((state) => state.User);

    const systemconfig = useSelector(sysConfigdata);

    const groupBattledata = useSelector(groupbattledata);

    const websettingsdata = useSelector(websettingsData);

    const selectdata = useSelector(settingsData);

    const appdata = selectdata && selectdata.filter(item => item.type == "app_name");

    // website link
    const web_link_footer = websettingsdata && websettingsdata.web_link_footer;

    const appName = appdata && appdata.length > 0 ? appdata[0].message : '';

    const [battleUserData, setBattleUserData] = useState([]);

    const TabPane = Tabs.TabPane;

    const [category, setCategory] = useState({
        all: "",
        selected: "",
    });

    let playerremove = useRef(false);

    const [loading, setLoading] = useState(true);

    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const [shouldGenerateRoomCode, setShouldGenerateRoomCode] = useState(false);

    const [selectedCoins, setSelectedCoins] = useState({ all: "", selected: "" });

    const [playwithfriends, setPlaywithfriends] = useState(false);

    const [joinuserpopup, setJoinUserPopup] = useState(false);

    const [inputCode, setInputCode] = useState("");

    const [showStart, setShowStart] = useState(false);

    const [dociddelete, setDocidDelete] = useState(false);

    const [createdByroom, setCreatedByRoom] = useState();

    const { db,firebase } = FirebaseData();

    const inputRef = useRef();

    const navigate = useNavigate();

    let category_selected = category.selected;

    let username = userData.data.name || userData.data.email || userData.data.mobile;

    let userprofile = userData.data.profile ? userData.data.profile : "";

    let useruid = userData.data.id;

    let usercoins = userData && userData.data.coins;

    let selectedcoins = Number(selectedCoins.selected);

    let inputText = useRef(null);

    let roomiddata = groupBattledata.roomID;

    let owner = useRef({
        readyplay: null,
        ownerID: null,
        roomid:null,
    });

    // language mode

    // get category data
    const getAllData = () => {
        categoriesApi(
            1,
            (response) => {
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

    // database collection
    const createBattleRoom = async (categoryId, name, profileUrl, uid, roomCode, roomType, entryFee) => {
        try {
            let documentreference = db.collection("multiUserBattleRoom").add({
                categoryId: categoryId,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: uid,
                entryFee: entryFee ? entryFee : 0,
                readyToPlay: false,
                roomCode: roomCode ? roomCode : "",
                user1: {
                    answers: [],
                    correctAnswers: 0,
                    name: name,
                    profileUrl: profileUrl,
                    uid: uid,
                },
                user2: {
                    answers: [],
                    correctAnswers: 0,
                    name: "",
                    profileUrl: "",
                    uid: "",
                },
                user3: {
                    answers: [],
                    correctAnswers: 0,
                    name: "",
                    profileUrl: "",
                    uid: "",
                },
                user4: {
                    answers: [],
                    correctAnswers: 0,
                    name: "",
                    profileUrl: "",
                    uid: "",
                },
            });

            // created id by user to check for result screen
            LoadGroupBattleData("createdby", uid);
            setShowStart(true);

            return await documentreference;
        } catch (error) {
            toast.error(error);
        }
    };

    // delete battle room
    const deleteBattleRoom = async (documentId) => {
        try {
            await db.collection("multiUserBattleRoom").doc(documentId).delete();
        } catch (error) {
            toast.error(error);
        }
    };

    // find room
    const searchBattleRoom = async (categoryId) => {
        try {
            let userfind = await db.collection("multiUserBattleRoom").where("categoryId", "==", categoryId).where("roomCode", "==", "").where("user2.uid", "==", "").get();

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
        }
    };

    // search room
    const searchRoom = async () => {
        let inputCoincheck = inputText.current.value;
        let usercoins = userData.data.coins

        if (Number(inputCoincheck) > Number(usercoins)) {
            toast.error(t("you dont have enough coins"));
            return;
        }

        try {
            let documents = await searchBattleRoom(category_selected);

            let roomdocid;

            if (documents.length !== 0) {
                let room = documents;

                roomdocid = room.id;
            } else {
                roomdocid = await createRoom();
            }

            LoadGroupBattleData("roomid", roomdocid);
        } catch (error) {
            toast.error(error);
            console.log(error);
        }
    };

    // redirect question screen
    const questionScreen = (roomCode, roomid) => {
        navigate("/group-play");
        let data = {
            roomCode: roomCode,
            roomid: roomid,
        };
        Loadtempdata(data);
    };



    // room code generator
    const randomFixedInteger = (length) => {
        return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)).toString();
    };

    //create room for battle
    const createRoom = async () => {
        // battleroom joiing state
        if (usercoins < 0 || usercoins === "0") {
            toast.error(t("you dont have enough coins"));
            return;
        }

        let roomCode = "";

        //genarate room code
        roomCode = randomFixedInteger(6);

        setShouldGenerateRoomCode(roomCode);

        LoadGroupBattleData("roomCode", roomCode);

        // pass room code in sql database for fetching questions
        createRoommulti(roomCode);

        let data = await createBattleRoom(systemconfig.battle_group_category_mode == "1" ? category_selected : "", username, userprofile, useruid, roomCode, "public", selectedcoins);
        // popup user found with friend
        setPlaywithfriends(true);

        return data.id;
    };

    // joinroom
    const joinRoom = async (name, profile, usernameid, roomcode, coin) => {
        try {
            if (!roomcode) {
                setIsButtonClicked(false);
                setJoinUserPopup(false);
                toast.error(t("please enter a room code"));
            } else {
                let result = await joinBattleRoomFrd(name, profile, usernameid, roomcode, coin);
                if (typeof result === "undefined") {
                    setIsButtonClicked(false);
                    setJoinUserPopup(false);
                    toast.error(t("room code is not valid"));
                } else {
                    setJoinUserPopup(true);
                    LoadGroupBattleData("roomid", result.id);
                }
            }
        } catch (e) {
            console.log("error", e);
        }
    };

    // get userroom
    const getMultiUserBattleRoom = async (roomcode) => {
        try {
            let typeBattle = await db.collection("multiUserBattleRoom").where("roomCode", "==", roomcode).get();
            return typeBattle;
        } catch (e) {
            console.log("error", e);
        }
    };

    // joinBattleRoomFrd
    const joinBattleRoomFrd = async (name, profile, usernameid, roomcode, coin) => {
        try {
            // check roomcode is valid or not
            let mulituserbattle = await getMultiUserBattleRoom(roomcode);

            // // game started code
            if (mulituserbattle.docs[0].data().readyToPlay) {
                toast.success("Game Started");
            }

            // // not enough coins
            if (mulituserbattle.docs[0].data().entryFee > coin) {
                toast.error(t("Not enough coins"));
                return;
            }

            //user2 update
            let docRef = mulituserbattle.docs[0].ref;

            return db.runTransaction(async (transaction) => {
                let doc = await transaction.get(docRef);

                if (!doc.exists) {
                    toast.error("Document does not exist!");
                }

                let userdetails = doc.data();

                let user2 = userdetails.user2;

                let user3 = userdetails.user3;

                let user4 = userdetails.user4;

                if (user2.uid === "") {
                    transaction.update(docRef, {
                        "user2.name": name,
                        "user2.uid": usernameid,
                        "user2.profileUrl": profile,
                    });

                } else if (user3.uid === "") {
                    transaction.update(docRef, {
                        "user3.name": name,
                        "user3.uid": usernameid,
                        "user3.profileUrl": profile,
                    });

                } else if (user4.uid === "") {
                    transaction.update(docRef, {
                        "user4.name": name,
                        "user4.uid": usernameid,
                        "user4.profileUrl": profile,
                    });

                } else {
                    toast.error(t("room is full"));
                }

                return doc;
            });

            //
        } catch (e) {
            console.log("error", e);
        }
    };

    // coins data
    const coinsdata = [
        { id: "1", num: "5" },
        { id: "2", num: "10" },
        { id: "3", num: "15" },
        { id: "4", num: "20" },
    ];

    // selected coins data
    const selectedCoinsdata = (data) => {
        setSelectedCoins({ ...selectedCoins, selected: data.num });
        inputText.current.value = "";
    };

    // inputfeild data
    const handlechange = (e) => {
        setInputCode(e.target.value);
    };

    // start button
    const startGame = (e) => {
        let roomid = groupBattledata.roomID;

        let docRef = db.collection("multiUserBattleRoom").doc(roomid);

        return db.runTransaction(async (transaction) => {
            let doc = await transaction.get(docRef);
            if (!doc.exists) {
                toast.error("Document does not exist!");
            }

            let userdetails = doc.data();

            let user2 = userdetails.user2;

            let user3 = userdetails.user3;

            let user4 = userdetails.user4;

            if (user2.uid !== "" || user3.uid !== "" || user4.uid !== "") {
                transaction.update(docRef, {
                    readyToPlay: true,
                });
            } else {
                toast.error(t("Player is not join yet"));
            }

            return doc;
        });
    };

    // get id from localstorage for start button
    let createdby = groupBattledata.createdBy;

    // select category
    const handleSelectCategory = (e) => {
        const index = e.target.selectedIndex;
        const el = e.target.childNodes[index];
        let cat_id = el.getAttribute("id");
        setCategory({ ...category, selected: cat_id });
    };

    // pass room code in sql database for fetching questions
    const createRoommulti = (roomCode) => {
        createMultiRoomApi(
            roomCode,
            "public",
            category_selected ? category_selected : "",
            "10",
            (resposne) => {},
            (error) => {
                console.log(error);
            }
        );
    };

    useEffect(() => {
        let documentRef = db.collection("multiUserBattleRoom").doc(roomiddata);
        // console.log("document",documentRef)
        let unsubscribe = documentRef.onSnapshot(
            { includeMetadataChanges: true },
            (doc) => {
                if (doc.exists) {
                    let battleroom = doc.data();

                    // state set doc id
                    setDocidDelete(doc.id);

                    let roomid = doc.id;

                    let user1 = battleroom.user1;

                    let user2 = battleroom.user2;

                    let user3 = battleroom.user3;

                    let user4 = battleroom.user4;

                    let user1uid = battleroom.user1.uid;

                    let user2uid = battleroom.user2.uid;

                    let user3uid = battleroom.user3.uid;

                    let user4uid = battleroom.user4.uid;

                    let readytoplay = battleroom.readyToPlay;

                    // filter user data

                    // if user id is equal to login id then remove id
                    if (userData.data.id === user1uid) {
                        setBattleUserData([user2, user3, user4]);
                    }

                    if (userData.data.id === user2uid) {
                        setBattleUserData([user1, user3, user4]);
                    }

                    if (userData.data.id === user3uid) {
                        setBattleUserData([user1, user2, user4]);
                    }

                    if (userData.data.id === user4uid) {
                        setBattleUserData([user1, user2, user3]);
                    }

                    // check ready to play
                    let check = battleroom.readyToPlay;

                    //room code
                    let roomCode = battleroom.roomCode;

                    // question screen
                    if (check) {
                        questionScreen(roomCode, roomid);
                    }

                    let createdby = battleroom.createdBy;


                    // state popup of create and join room
                    if (useruid == createdby) {
                        setJoinUserPopup(false);
                        setPlaywithfriends(true);
                    } else {
                        setJoinUserPopup(true);
                        setPlaywithfriends(false);
                    }

                    // LoadGroupBattleData("createdby", createdby);

                    owner.current.ownerID = createdby;

                    owner.current.readyplay = readytoplay;

                    // delete room by owner on click cancel button
                    setCreatedByRoom(createdby);


                    if (user2uid === "") {
                        owner.current.ownerID = null;
                        setJoinUserPopup(false);
                    }

                    const newUser = [user1, user2, user3, user4];

                    newUser.forEach((elem) => {
                        if (elem.obj === "") {
                            playerremove.current = true
                        }
                    })

                } else {
                    if (owner.current.readyplay == false && owner.current.ownerID !== null) {
                        if (useruid !== owner.current.ownerID) {
                            MySwal.fire({
                                text: t("Room is deleted by owner"),
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    navigate("/quiz-play");
                                    return false;
                                }
                            });
                        }
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

    }, [groupBattledata,userData.data.id, playerremove]);


    // oncancel creater room popup delete room
    const onCancelbuttondeleteBattleRoom = async (documentId) => {
        let documentRef = db.collection("multiUserBattleRoom").doc(documentId);

        documentRef.onSnapshot(
            { includeMetadataChanges: true },
            (doc) => {
                if (doc.exists) {
                    let battleroom = doc.data();

                    let roomid = doc.id;

                    let createdby = battleroom.createdBy;

                    if (useruid == createdby) {
                        MySwal.fire({
                            text: t("Room is deleted"),
                        });
                        deleteBattleRoom(roomid);
                        battleDataClear()
                    }
                }
            },
            (error) => {
                console.log("err", error);
            }
        );
    };

    // on cancel join user button
  const onCanceljoinButton = async (roomId) => {
  try {
    setJoinUserPopup(false);
    const documentRef = db.collection("multiUserBattleRoom").doc(roomId);
    const battleroomSnapshot = await documentRef.get();

    if (battleroomSnapshot.exists) {
      const battleroom = battleroomSnapshot.data();
      const { user2, user3, user4 } = battleroom;
      const { uid: user2uid } = user2;
      const { uid: user3uid } = user3;
      const { uid: user4uid } = user4;

      if (user2uid === useruid) {
        await documentRef.update({
          "user2.name": "",
          "user2.uid": "",
          "user2.profileUrl": ""
        });
      } else if (user3uid === useruid) {
        await documentRef.update({
          "user3.name": "",
          "user3.uid": "",
          "user3.profileUrl": ""
        });
      } else if (user4uid === useruid) {
        await documentRef.update({
          "user4.name": "",
          "user4.uid": "",
          "user4.profileUrl": ""
        });
      }
    }

    navigate("/quiz-play");
  } catch (error) {
    console.log("Error:", error);
  }
};


    useEffect(() => {
        setSelectedCoins({ ...selectedCoins, selected: coinsdata[0].num });
        // pass room code in sql database for fetching questions
        createRoommulti();
    }, []);

    useEffect(() => {
        getAllData();
    }, [selectCurrentLanguage]);

    const handleJoinButtonClick = () => {
        setIsButtonClicked(true);
        joinRoom(username, userprofile, useruid, inputCode, usercoins);
      };

    return (
        <Fragment>
            <SEO title={t("Group Battle")} />
            <Breadcrumb title={t("Group Battle")} content={t("Home")} contentTwo={t("Group Battle")} />
            <div className="SelfLearning battlequiz mb-5">
                <div className="container">
                    <div className="row morphisam">
                        {/* battle screen */}
                        <div className="col-md-6  col-xl-5 col-xxl-6 col-12">
                            <img src={process.env.PUBLIC_URL + "/images/battle/groupbattle.svg"} alt="1vs1" className="onevsoneimg pb-3" />
                        </div>
                        <div className="col-md-6  col-xl-7 col-xxl-6 col-12 ">
                            <Tabs defaultActiveKey="1">
                                <TabPane tab={t("Create")} key="1">
                                    {/* category select */}
                                    {(() => {
                                        if (systemconfig.battle_group_category_mode == "1") {
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

                                    <div className="inner_content d-flex align-items-center flex-wrap">
                                        <ul className="coins_deduct d-flex ps-0 align-items-center flex-wrap my-3">
                                            {coinsdata.map((data, idx) => {
                                                return (
                                                    <li key={idx} className="list-unstyled me-5" onClick={(e) => selectedCoinsdata(data)}>
                                                        <button className={`btn btn-primary ${data.num == selectedcoins ? "active-one" : "unactive-one"}`}>{data.num}</button>
                                                        <img src={process.env.PUBLIC_URL + "/images/battle/coin.svg"} alt="coin" />
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                        <div className="input_coins">
                                            <input type="number" placeholder="00" min="0" onChange={(e) => setSelectedCoins({ ...selectedCoins, selected: e.target.value })} ref={inputText} />
                                        </div>
                                    </div>

                                    {/* coins */}
                                    <div className="total_coins my-4 ml-0">
                                        <h5 className=" text-center ">
                                            {t("Current Coins")} : {userData.data.coins < 0 ? 0 : userData.data.coins}
                                        </h5>
                                    </div>

                                    {/* create room */}
                                    <div className="create_room">
                                        <button className="btn btn-primary" onClick={() => searchRoom()}>
                                            {t("Create Room")}
                                        </button>
                                    </div>
                                </TabPane>
                                <TabPane tab={t("Join")} key="2">
                                    <h5 className=" mb-4">{t("Enter room code here")}</h5>
                                    <div className="join_room_code">
                                        <input type="number" placeholder={t("Enter Code")} onChange={(e) => handlechange(e)} className="join_input" min="0" ref={inputRef} />
                                    </div>
                                    <div className="join_btn mt-4">
                                        <button className="btn btn-primary" onClick={handleJoinButtonClick} disabled={isButtonClicked}>
                                            {" "}
                                            {t("Join Room")}
                                        </button>
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>

            {/* play with friends modal */}

            {/* created popup */}
            <Modal
                centered
                maskClosable={false}
                keyboard={false}
                visible={playwithfriends}
                onOk={() => setPlaywithfriends(false)}
                onCancel={() => {
                    setPlaywithfriends(false);
                    onCancelbuttondeleteBattleRoom(dociddelete);
                }}
                footer={null}
                className="custom_modal_notify retry-modal playwithfriend"
            >
                {playwithfriends ? (
                    <>
                        <div className="randomplayer">
                            <div className="main_screen">
                                <div className="room_code_screen">
                                    <h3>
                                        {t("Room code")} : {shouldGenerateRoomCode}
                                    </h3>
                                    <p>{t("Share this room code to friends and ask them to join")}</p>
                                </div>

                                <div className="share">
                                    <FacebookShareButton
                                        className="me-2"
                                        url={`${web_link_footer}`}
                                        quote={`Hello,Join a group battle in ${appName}. Go to Group Battle in Quiz Play and join using the code : ${shouldGenerateRoomCode}`}
                                    >
                                        <FacebookIcon size="30" round="true" />
                                    </FacebookShareButton>
                                    <WhatsappShareButton url={`${web_link_footer}`} title={`Hello,Join a group battle in ${appName}. Go to Group Battle in Quiz Play and join using the code : ${shouldGenerateRoomCode}`}>
                                        <WhatsappIcon size="30" round="true" />
                                    </WhatsappShareButton>
                                </div>

                                <div className="inner_Screen">
                                    <div className="user_profile">
                                        <img src={userData.data.profile} alt="wrteam" onError={imgError} />
                                        <p className="mt-3">{userData.data.name || userData.data.email || userData.data.mobile}</p>
                                    </div>

                                    {battleUserData?.map((data, index) => {
                                        return (
                                            <>
                                                <div className="vs_image">
                                                    <img src={process.env.PUBLIC_URL + "/images/battle/vs.svg"} alt="versus" height={100} width={50} />
                                                </div>
                                                <div className="opponent_image" key={index}>
                                                    <img src={data.profileUrl} alt="wrteam" onError={imgError} />
                                                    <p className="mt-3">{data.name ? data.name : "Waiting..."}</p>
                                                </div>
                                            </>
                                        );
                                    })}
                                </div>

                                {(() => {
                                    if (userData.data.id == createdby) {
                                        return (
                                            <>
                                                {showStart ? (
                                                    <div className="start_game">
                                                        <button className="btn btn-primary" onClick={(e) => startGame(e)}>
                                                            {t("Start Game")}
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </>
                                        );
                                    }
                                })()}
                            </div>
                        </div>
                    </>
                ) : (
                    ""
                )}
            </Modal>

            {/* join user popup */}
            {joinuserpopup ? (
                <Modal
                    centered
                    maskClosable={false}
                    keyboard={false}
                    visible={joinuserpopup}
                    onOk={() => setJoinUserPopup(false)}
                    onCancel={() => {
                        setJoinUserPopup(false);
                        onCanceljoinButton(roomiddata);
                    }}
                    footer={null}
                    className="custom_modal_notify retry-modal playwithfriend"
                >
                    <>
                        <div className="randomplayer">
                            <div className="main_screen">
                                <div className="inner_Screen">
                                    <div className="user_profile">
                                        <img src={userData.data.profile} alt="wrteam" onError={imgError} />
                                        <p className="mt-3">{userData.data.name || userData.data.email || userData.data.mobile}</p>
                                    </div>
                                    {battleUserData?.map((data, index) => {
                                        return (
                                            <>
                                                <div className="vs_image">
                                                    <img src={process.env.PUBLIC_URL + "/images/battle/vs.svg"} alt="versus" height={100} width={50} />
                                                </div>
                                                <div className="opponent_image" key={index}>
                                                    <img src={data.profileUrl} alt="wrteam" onError={imgError} />
                                                    <p className="mt-3">{data.name ? data.name : "Waiting..."}</p>
                                                </div>
                                            </>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                </Modal>
            ) : (
                ""
            )}
        </Fragment>
    );
};

export default withTranslation()(GroupBattle);
