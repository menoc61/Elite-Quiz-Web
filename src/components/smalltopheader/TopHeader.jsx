import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from "antd";
import { FaRegBell } from "react-icons/fa";
import { withTranslation, useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {imgError, isLogin } from "../../utils";
import config from "../../utils/config";
import { useSelector } from "react-redux";
import { getUserProfilestatisticsApi, logout, updateUserDataInfo } from "../../store/reducers/userSlice";
import { getusercoinsApi, notificationApi } from "../../store/actions/campaign";
import { toast } from "react-toastify";
import { loadLanguages, selectCurrentLanguage, selectLanguages, setCurrentLanguage } from "../../store/reducers/languageSlice";
import { sysConfigdata } from "../../store/reducers/settingsSlice";
import FirebaseData from "../../utils/firebase";
import axios from "axios";
import { Tooltip } from "react-tooltip";
import CustomHoverDropdown from "../Common/CustomHoverDropdown";
import { IoExitOutline } from "react-icons/io5";

const MySwal = withReactContent(Swal);

const TopHeader = ({ t }) => {

    const { auth } = FirebaseData();

    const { i18n } = useTranslation();

    const languages = useSelector(selectLanguages);

    const selectcurrentLanguage = useSelector(selectCurrentLanguage);

    // store data get
    const userData = useSelector((state) => state.User);

    const systemconfig = useSelector(sysConfigdata);

    //passing route
    const navigate = useNavigate();

    //notification
    const [notificationmodal, setNotificationModal] = useState(false);

    const [notifications, setNotifications] = useState([]);

    const [guestlogout,setGuestLogout] = useState(false);

    const { menuOpen, handlers,menuOpenOne, handlersOne } = CustomHoverDropdown();

    // language change
    const languageChange = async (name, code, id) => {
        setCurrentLanguage(name, code, id);
        await i18n.changeLanguage(code);
    };

    //api render
    useEffect(() => {
        loadLanguages("", (response) => {
            if (selectcurrentLanguage.code == null) {
                let index = response.data.filter((data) => {
                    if (data.code == config.defaultLanguage) {
                        return { code: data.code, name: data.name, id: data.id };
                    }
                });
                setCurrentLanguage(index[0].language,index[0].code,index[0].id)

            }

        }, (error) => {
            toast.error(error)
        });

        if (isLogin()) {
            notificationApi(null, "DESC", 0, 10, (response) => {
                setNotifications(response.data);
            }, (error) => {

            })
        }
    }, []);

    // sign out
    const handleSignout = () => {
        MySwal.fire({
            title: t("Logout"),
            text: t("Are you sure"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef5488",
            cancelButtonColor: "#d33",
            confirmButtonText: t("Logout"),
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                auth.signOut();
                navigate("/");
            }
        });
    };

    // check user data for username
    let userName = "";

     const checkUserData = (userData) => {
        if (userData.data && userData.data.name != "") {
            return userName = userData.data.name;
        } else if (userData.data && userData.data.email != "") {
            return userName = userData.data.email;
        } else {
            return userName = userData.data.mobile;
        }
     }


    // if same id login in other brower then its logout from current session
    const TOKEN_EXPIRED = "129";

    //  session expire
    function handleLogout() {
        logout();
        auth.signOut();
        navigate("/");
    }

    // guest logout
    const guestLogout = (e) => {
        e.preventDefault();
        setGuestLogout(true)
        navigate("/login");
    }

    // profile image logout
    const profileGuest = (e) => {
        e.preventDefault();
        MySwal.fire({
            text: (t("To access this feature you need to Login!!")),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef5488",
            confirmButtonText: "Login",
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
                guestLogout(e);
            }
        });
    }

    // if same user login in other brower then its logout
    axios.interceptors.response.use(function (response) {
        if (response.data && response.data.message === TOKEN_EXPIRED) {
            MySwal.fire({
                text: (t("Your session has expired. Please log in again.")),
                icon: "warning",
                showCancelButton: false,
                confirmButtonColor: "#ef5488",
                confirmButtonText: "Logout",
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    handleLogout();
                }
            });
            return Promise.reject(new Error("Session expired"));
        } else if (response.status >= 400 && response.status < 500) {
            // Handle other client errors
            return Promise.reject(new Error("Client error"));
        } else if (response.status >= 500 && response.status < 600) {
            // Handle server errors
            return Promise.reject(new Error("Server error"));
        }
        // Return the response for further processing
        return response;
    });

    // notification tooltip leave on mouse
    const handleMouseLeave = () => {
        const tooltipElement = document.querySelector('[data-tooltip-id="custom-my-tooltip"]');
        if (tooltipElement) {
          tooltipElement.removeAttribute('data-tooltip-content');
        }
    };

    // notification tooltip enter on mouse
    const handleMouserEnter = () => {
        const tooltipElement = document.querySelector('[data-tooltip-id="custom-my-tooltip"]');
        if (tooltipElement) {
            tooltipElement.setAttribute('data-tooltip-content', `${ t("Notification") }`);
        }
    }


    return (
        <React.Fragment>
            <div className="small__top__header">
                <div className="row justify-content-between align-items-center">
                    <div className="col-md-6 col-12">
                        {systemconfig && systemconfig.language_mode === "1" ? (
                            <div className="dropdown__language">
                                <DropdownButton onMouseEnter={handlers.onMouseEnter}
                                    onMouseLeave={handlers.onMouseLeave}
                                    show={menuOpen}
                                    className="inner-language__dropdown" title={selectcurrentLanguage && selectcurrentLanguage.name ? selectcurrentLanguage.name : "Select Language"}>
                                    {/* {console.log("languages==>",languages)} */}
                                    {languages &&
                                        languages.map((data, _index) => {
                                            return (
                                                <Dropdown.Item onClick={() => languageChange(data.language,data.code,data.id)} key={data.id}>
                                                    {data.language}
                                                </Dropdown.Item>
                                            );
                                        })}
                                </DropdownButton>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>

                    <div className="col-md-6 col-12">
                        <div className="top_header_right">
                            <div className="login__sign__form">
                                {isLogin() && checkUserData(userData) ? (
                                    <DropdownButton onMouseEnter={handlersOne.onMouseEnter}
                                        onMouseLeave={handlersOne.onMouseLeave}
                                        show={menuOpenOne}
                                        id="dropdown-basic-button" title={`${t("hello")} ${userName}`} className="dropdown__login" >
                                        <Dropdown.Item onClick={() => navigate("/profile")}>{t("Profile")}</Dropdown.Item>
                                        <Dropdown.Item onClick={handleSignout} selected>
                                            {t("Logout")}
                                        </Dropdown.Item>
                                    </DropdownButton>
                                ) : (
                                        <div>
                                            {!guestlogout ?
                                                <div className="right_guest_profile">
                                                    <img className="profile_image" onClick={(e) => profileGuest(e)} src={process.env.PUBLIC_URL + `images/profileimages/6.svg`} alt="profile" />
                                                    <DropdownButton onMouseEnter={handlersOne.onMouseEnter}
                                                        onMouseLeave={handlersOne.onMouseLeave}
                                                        show={menuOpenOne}
                                                        id="dropdown-basic-button" title={`${t("Hello Guest")}`} className="dropdown__login" >
                                                        <Dropdown.Item onClick={() => navigate("/guest-profile")}>{t("Profile")}</Dropdown.Item>
                                                    </DropdownButton>
                                                    {/* <button className="btn btn-primary " onClick={(e) => profileGuest(e)}>{`${t("Hello Guest")}`}</button> */}
                                                    <button className="btn btn-primary custom_button_right ms-2" onClick={(e) => guestLogout(e)}><IoExitOutline/></button>
                                                </div>
                                                :
                                                <>
                                                <span>
                                                    <Link to={"/login"} className="login">
                                                        {t("Login")}
                                                    </Link>
                                                </span>
                                                <span>
                                                    <Link to={"/sign-up"} className="signup">
                                                        {t("Sign Up")}
                                                    </Link>
                                                </span>
                                                </>
                                            }
                                    </div>
                                )}
                            </div>
                            <div className="notification">
                                {isLogin() ? (
                                    <Button className="notify_btn btn-primary" onClick={() => setNotificationModal(true)} onMouseEnter={handleMouserEnter} onMouseLeave={handleMouseLeave} data-tooltip-id="custom-my-tooltip">
                                        <span className="notification_badges">{notifications ? notifications.length : "0"}</span><FaRegBell />
                                    </Button>
                                ) : (
                                    ""
                                )}
                                <Modal title={t("Notification")} centered visible={notificationmodal}  onOk={() => setNotificationModal(false)} onCancel={() => setNotificationModal(false)} footer={null} className="custom_modal_notify">
                                    {notifications.length ? (
                                        notifications.map((data, key) => {
                                            return (
                                                <div key={key} className="outer_noti">
                                                    <img className="noti_image" src={data.image ? data.image : process.env.PUBLIC_URL + "/images/user.svg"} alt="notication" id="image" onError={imgError}/>
                                                    <div className="noti_desc">
                                                        <p className="noti_title">{data.title}</p>
                                                        <p>{data.message}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <h5 className="text-center text-black-50">{t("No Data found")}</h5>
                                    )}
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Tooltip id="custom-my-tooltip" />
        </React.Fragment>
    );
};
export default withTranslation()(TopHeader);
