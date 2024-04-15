import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { FaCamera, FaEnvelope, FaEnvelopeOpenText, FaMobileAlt, FaPhoneAlt, FaRegBookmark, FaSignOutAlt, FaTrashAlt, FaUserCircle } from "react-icons/fa";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { withTranslation } from "react-i18next";
import config from "../utils/config";
import { getUserProfilestatisticsApi, getUserStatisticsDataApi, logout, updateProfileApi, updateProfileDataApi, updateUserDataInfo } from "../store/reducers/userSlice";
import { useSelector } from "react-redux";
import { UserCoinScoreApi, deleteuserAccountApi, getusercoinsApi, setBadgesApi } from "../store/actions/campaign";
import { imgError } from "../utils";
import { BsCoin, BsFillBookmarkCheckFill } from "react-icons/bs";
import { badgesData, LoadNewBadgesData } from "../store/reducers/badgesSlice";
import { AiOutlinePieChart, AiOutlineShareAlt } from "react-icons/ai";
import { Modal } from "antd";
import { FacebookIcon, FacebookShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";
import { websettingsData } from "../store/reducers/webSettings";
import FirebaseData from "../utils/firebase";
import { IoWalletOutline } from "react-icons/io5";
import { profileImages } from "../assets/json/profileImages";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";


const MySwal = withReactContent(Swal);

SwiperCore.use([Navigation]);

const Profile = ({ t }) => {
    const navigate = useNavigate();

    const [AppModal, setAppModal] = useState(false);

    const userData = useSelector((state) => state.User);

    const websettingsdata = useSelector(websettingsData);

    const [profile, setProfile] = useState({ name: "" });

    const Badges = useSelector(badgesData);

    const { auth } = FirebaseData();

    const big_thing_status = Badges && Badges.data.big_thing.status;

    const big_thing_coin = Badges && Badges.data.big_thing.badge_reward;

    const sharing_caring_status = Badges && Badges.data.sharing_caring.status;

    const sharing_caring_coin = Badges && Badges.data.sharing_caring.badge_reward;

    const elite_status = Badges && Badges.data.elite.status;

    const elite_coin = Badges && Badges.data.elite.badge_reward;

    // website link

    const web_link_footer = websettingsdata && websettingsdata.web_link_footer;

    const clickCount = useRef(0);

    // user profile data get and statics
    useEffect(() => {
        getUserProfilestatisticsApi(
            userData.data.id,
            (success) => {},
            (error) => {
                toast.error(error);
            }
        );

        getUserStatisticsDataApi(
            (success) => {},
            (error) => {
                // toast.error(error);
            }
        );
    }, []);

    // dummy profile update
    const dummyProfileImage = (e) => {
        e.preventDefault();
        const fileName = e.target.getAttribute('data-file');
        const url = `${window.location.origin}/images/profileimages/${fileName}`;
        fetch(url).then(async response => {
            const contentType = response.headers.get('content-type')
            const blob = await response.blob()
            const file = new File([blob], fileName, { contentType })
            // access file here
            updateProfileApi(
                file,
                (success) => {
                    toast.success("successfully updated");
                },
                (error) => {
                    toast.error(error);
                }
            );
        })
      }

    // onchange name and mobile
    const handleChange = (event) => {
        const field_name = event.target.name;
        const field_value = event.target.value;
        if (field_name === "mobile" && event.target.value.length > 16) {
            event.target.value = field_value.slice(0, event.target.maxLength);
            return false;
        }
        setProfile((values) => ({ ...values, [field_name]: field_value }));
    };

    // update name and mobile
    const formSubmit = (e) => {
        e.preventDefault();
        if (!config.demo) {
            updateProfileDataApi(
                "",
                profile.name ? profile.name : userData.data.name,
                profile.mobile ? profile.mobile : userData.data.mobile,
                (success) => {
                    toast.success("successfully updated");
                },
                (error) => {
                    toast.error(error);
                }
            );
        } else {
            toast.error(t("Profile update is not allowed in demo version."));
        }
    };

    // update profile image
    const handleImageChange = (e) => {
        e.preventDefault();
        if (!config.demo) {
            updateProfileApi(
                e.target.files[0],
                (success) => {
                    toast.success("successfully updated");
                },
                (error) => {
                    toast.error(error);
                }
            );
        } else {
            toast.error(t("Profile update is not allowed in demo version."));
        }
    };

    // sign out
    const handleSignout = (e) => {
        e.preventDefault();
        MySwal.fire({
            title: t("Logout"),
            text: t("Are you sure"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef5488",
            cancelButtonColor: "#d33",
            confirmButtonText: t("Logout"),
            cancelButtonText: t("Cancel"),
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                auth.signOut();
                navigate("/");
            }
        });
    };

    // delete user account
    const deleteAccountClick = (e) => {
        e.preventDefault();
        MySwal.fire({
            title: t("Are you sure"),
            text: t("You won't be able to revert this"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef5488",
            cancelButtonColor: "#d33",
            confirmButtonText: t("Yes delete it"),
            cancelButtonText: t("Cancel"),
        }).then((result) => {
            if (result.isConfirmed) {
                deleteuserAccountApi(
                    (success) => {
                        Swal.fire(t("Deleted"), t("Data has been deleted"), "success");
                        // Current signed-in user to delete
                        const firebaseUser = auth.currentUser;
                        firebaseUser.delete().then(() => {
                            // User deleted.
                        }).catch((error) => {
                            console.log(error)
                        });
                        logout();
                        auth.signOut();
                        navigate("/");
                    },
                    (error) => {
                        if (config.demo) {
                            Swal.fire(t("OOps"), t("Not allowed in demo version"));
                        } else {
                            Swal.fire(t("OOps"), t("Please Try again"), "error");
                        }
                    }
                );
            }
        });
    };

    // one big think badges
    useEffect(() => {
        let totalQuestion = userData.data && userData.data.userStatics.correct_answers;
        if (big_thing_status === "0" && (totalQuestion == 5000)) {
            setBadgesApi("big_thing", () => {
                LoadNewBadgesData("big_thing", "1")
                toast.success(t("You Won One Big Thing Badge"));
                const status = 0;
                UserCoinScoreApi(big_thing_coin, null, null, (t("big thing badge reward")), status, (response) => {
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
        };
    }, []);

    // elite badge
    useEffect(() => {
        let totalUserCoins = userData.data && userData.data.userProfileStatics.coins;
        if (elite_status === "0" && (totalUserCoins == 5000)) {
            setBadgesApi("elite", () => {
                LoadNewBadgesData("elite", "1")
                toast.success(t("You Won Elite Badge"));
                const status = 0;
                UserCoinScoreApi(elite_coin, null, null, (t("elite badge reward")), status, (response) => {
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
        };
    }, []);

    // share social media and sharing caring badge
    const shareAppButton = (e) => {
        e.preventDefault();
        setAppModal(true);
        clickCount.current++
        if (sharing_caring_status === "0" && clickCount.current == 50) {
            setBadgesApi("sharing_caring", () => {
                LoadNewBadgesData("sharing_caring", "1")
                toast.success(t("You Won Sharing Caring Badge"));
                const status = 0;
                UserCoinScoreApi(sharing_caring_coin, null, null, (t("sharing caring badge reward")), status, (response) => {
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
        };
    }

    const swiperOption = {
        loop: true,
        speed: 750,
        spaceBetween: 20,
        slidesPerView: 4,
        navigation: false,
        breakpoints: {
            0: {
                slidesPerView: 4.5,
            },

            768: {
                slidesPerView: 4.5,
            },

            992: {
                slidesPerView: 4.5,
            },
            1200: {
                slidesPerView: 5.5,
            },
        },
        autoplay: false,
    };

    return (
        <React.Fragment>
            <SEO title={t("Profile")} />
            <Breadcrumb title={t("Profile")} content={t("Home")} contentTwo={t("Profile")} />
            <div className="Profile__Sec">
                <div className="container px-1">
                    <div className="morphism">
                        <form onSubmit={formSubmit}>
                            <div className="row pro-card position-relative">
                                <div className="col-xl-5 col-lg-4 col-md-12 col-12 ">
                                    <div className="row card main__profile d-flex justify-content-center align-items-center">
                                        <div className="prop__image justify-content-center">
                                            <img src={userData.data && userData.data.profile ? userData.data.profile : process.env.PUBLIC_URL + "/images/user.svg"} alt="profile" id="user_profile" onError={imgError} />
                                            <div className="select__profile">
                                                <input type="file" name="profile" id="file" onChange={handleImageChange} />
                                                <label htmlFor="file">
                                                    {" "}
                                                    <em>
                                                        <FaCamera />
                                                    </em>
                                                </label>
                                                <input type="text" className="form-control" placeholder={t("Upload File")} id="file1" name="myfile" disabled hidden />
                                            </div>
                                        </div>
                                        <div className="prop__title justify-content-center">
                                            <h3>{userData.data && userData.data.name}</h3>
                                        </div>
                                        {userData.data && userData.data.mobile ? (
                                            <div className="mobile__number justify-content-center">
                                                <span>
                                                    <i>
                                                        <FaPhoneAlt />
                                                    </i>
                                                    <p>{userData.data.mobile}</p>
                                                </span>
                                            </div>
                                        ) : (
                                            ""
                                        )}

                                        {userData.data && userData.data.email ? (
                                            <div className="email__id justify-content-center">
                                                <span>
                                                    <i>
                                                        <FaEnvelope />
                                                    </i>
                                                    <p>{userData.data.email}</p>
                                                </span>
                                            </div>
                                        ) : (
                                            ""
                                        )}

                                        <p className="mb-0 d-flex justify-content-center">OR</p>
                                        {/* dummy image slider */}
                                        <div className="dummy_image_slider">
                                            <div className="d-flex select_profile justify-content-center">
                                                <h6 className="pt-2">{t("Select Profile Photo")}</h6>
                                            </div>
                                            <Swiper {...swiperOption}>
                                                {profileImages && profileImages.map((elem, key) => {
                                                    return (
                                                        <SwiperSlide key={key}>
                                                            <div className="pt-2 image_section">
                                                                <img src={process.env.PUBLIC_URL + elem.img} alt="profile" onClick={(e) => dummyProfileImage(e)} data-file={elem.img.split('/').pop()}/>
                                                            </div>
                                                        </SwiperSlide>
                                                    );
                                                })}
                                            </Swiper>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-7 col-lg-8 col-md-12 col-12 border-line">
                                    <div className="card p-4 bottom__card_sec">
                                        <div className="row">
                                            <div className="col-md-6 col-12">
                                                <label htmlFor="fullName">
                                                    <input type="text" name="name" id="fullName" placeholder={t("Enter Your Name")} defaultValue={userData.data && userData.data.name} onChange={handleChange} required />
                                                    <i className="custom-icon">
                                                        <FaUserCircle />
                                                    </i>
                                                </label>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <label htmlFor="mobilenumber">
                                                    <input
                                                        type="number"
                                                        name="mobile"
                                                        id="mobilenumber"
                                                        className="mobile"
                                                        placeholder={t("Enter Your Mobile Number")}
                                                        defaultValue={userData.data && userData.data.mobile}
                                                        onChange={handleChange}
                                                        min="0"
                                                        onWheel={(event) => event.currentTarget.blur()}
                                                    />
                                                    <i className="custom-icon">
                                                        <FaMobileAlt />
                                                    </i>
                                                </label>
                                            </div>
                                        </div>
                                        <button className="btn btn-primary text-uppercase mt-4" type="submit" value="submit" name="submit" id="mc-embedded-subscribe">
                                            {t("Update")}
                                        </button>

                                        <div className="bottom__profile_card">
                                            <div className="row">
                                                <div className="col-md-6 col-12">
                                                    <div className="bookmark__content common_content">
                                                        <NavLink to={"/bookmark"} className="w-100 d-block">
                                                            <span>{t("bookmark")}</span>
                                                            <i className="custom-icon">
                                                                <FaRegBookmark />
                                                            </i>
                                                        </NavLink>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="Invite_friends__content common_content">
                                                        <NavLink to={"/invite-friends"} className="w-100 d-block">
                                                            <span>{t("Invite Friends")}</span>
                                                            <i className="custom-icon">
                                                                <FaEnvelopeOpenText />
                                                            </i>
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 col-12">
                                                    <div className="tracker_data common_content">
                                                        <NavLink to="/coin-history" className="w-100 d-block">
                                                            <span>{t("Coin History")}</span>
                                                            <i className="custom-icon">
                                                                <BsCoin />
                                                            </i>
                                                        </NavLink>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="badges common_content">
                                                        <NavLink to="/badges" className="w-100 d-block">
                                                            <span>{t("Badges")}</span>
                                                            <i className="custom-icon">
                                                                <BsFillBookmarkCheckFill />
                                                            </i>
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 col-12">
                                                    <div className="share_app common_content">
                                                        <NavLink className="w-100 d-block" onClick={(e) => shareAppButton(e)}>
                                                            <span>{t("Share App")}</span>
                                                            <i className="custom-icon">
                                                                <AiOutlineShareAlt />
                                                            </i>
                                                        </NavLink>

                                                        <Modal title={t("Share App")} maskClosable={false} centered visible={AppModal} onOk={() => setAppModal(false)} onCancel={() => setAppModal(false)} footer={null}>
                                                            <FacebookShareButton
                                                                className="me-2"
                                                                url={`${web_link_footer}`}
                                                                quote={t("checkout our web and enjoy quiz")}
                                                            >
                                                                <FacebookIcon size="30" round="true" />
                                                            </FacebookShareButton>
                                                            <WhatsappShareButton url={`${web_link_footer}`} title={t("checkout our web and enjoy quiz")}>
                                                                <WhatsappIcon size="30" round="true" />
                                                            </WhatsappShareButton>
                                                        </Modal>

                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="statistics common_content">
                                                        <NavLink to="/statistics" className="w-100 d-block">
                                                            <span>{t("Statistics")}</span>
                                                            <i className="custom-icon">
                                                                <AiOutlinePieChart />
                                                            </i>
                                                        </NavLink>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="row">
                                                <div className="col-md-6 col-12">
                                                    <div className="wallet common_content">
                                                        <NavLink to="/wallet" className="w-100 d-block">
                                                            <span>{t("Wallet")}</span>
                                                            <i className="custom-icon">
                                                                <IoWalletOutline />
                                                            </i>
                                                        </NavLink>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="Delete_account__content common_content">
                                                        <NavLink to={""} className="w-100 d-block" onClick={deleteAccountClick}>
                                                            <span>{t("Delete Account")}</span>
                                                            <i className="custom-icon">
                                                                <FaTrashAlt />
                                                            </i>
                                                        </NavLink>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="Logout__content common_content">
                                                        <NavLink to={""} onClick={handleSignout} className="w-100 d-block">
                                                            <span>{t("Logout")}</span>
                                                            <i className="custom-icon">
                                                                <FaSignOutAlt />
                                                            </i>
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </React.Fragment>
    );
};
export default withTranslation()(Profile);