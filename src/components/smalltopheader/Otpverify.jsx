import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import { withTranslation } from "react-i18next";
import { Form } from "react-bootstrap";
import { FaCamera, FaMobileAlt, FaUserCircle } from "react-icons/fa";
import config from "../../utils/config.js";
import "react-phone-input-2/lib/style.css";
import { register, updateProfileApi } from "../../store/reducers/userSlice";
import SEO from "../SEO";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { imgError } from "../../utils";
import FirebaseData from "../../utils/firebase.js";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
import { profileImages } from "../../assets/json/profileImages";
import { useSelector } from "react-redux";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";

SwiperCore.use([Navigation]);


const Otpverify = ({ t }) => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [confirmResult, setConfirmResult] = useState("");
    const [verficationCode, setVerificationCode] = useState("");
    const [isSend, setIsSend] = useState(false);
    const [newUserScreen, setNewUserScreen] = useState(false);
    const [showReferCode, setShowReferCode] = useState(false);
    const [profile, setProfile] = useState({ name: "", mobile: "", email: "", profile: "", all_time_rank: "", all_time_score: "", coins: "",friends_code:"" });
    const [load, setLoad] = useState(false);
    const navigate = useNavigate();

    const { auth, firebase } = FirebaseData();
    const userData = useSelector((state) => state.User);

    // window recaptcha
    useEffect(() => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
            size: "invisible",
            // other options
        });
        return () => {
            window.recaptchaVerifier.clear();
        };
    }, []);

    // Load the libphonenumber library
    const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

    // Validate a phone number
    const validatePhoneNumber = (phone_number) => {
    try {
        const parsedNumber = phoneUtil.parse(phone_number);
        return phoneUtil.isValidNumber(parsedNumber);
    } catch (err) {
        return false;
    }
    };

    // otp sigin with phone number
    const onSubmit = (e) => {
        e.preventDefault();
        setLoad(true);
        let phone_number = "+" + phoneNumber;
        if (validatePhoneNumber(phone_number)) {
            const appVerifier = window.recaptchaVerifier;
            auth.signInWithPhoneNumber(phone_number, appVerifier)
                .then((response) => {
                    // success
                    setIsSend(true);
                    setLoad(false);
                    setConfirmResult(response);
                })
                .catch((error) => {
                    window.recaptchaVerifier.render().then(function (widgetId) {
                        window.recaptchaVerifier.reset(widgetId);
                    });
                    toast.error(error.message);
                    setLoad(false);
                });
        } else {
            setLoad(false);
            toast.error(t("Please Enter correct Mobile Number with Country Code"));
        }
    };

    // resend otp
    const resendOtp = (e) => {
        e.preventDefault();
        setLoad(true);
        let phone_number = "+" + phoneNumber;
        const appVerifier = window.recaptchaVerifier;
        auth.signInWithPhoneNumber(phone_number, appVerifier)
            .then((response) => {
                setIsSend(true);
                setLoad(false);
                setConfirmResult(response);
                toast.success(t("OTP has been sent"));
            })
            .catch((error) => {
                window.recaptchaVerifier.render().then(function (widgetId) {
                    window.recaptchaVerifier.reset(widgetId);
                });
                toast.error(error.message);
                setLoad(false);
            });
    };

    // verify code
    const handleVerifyCode = (e) => {
        e.preventDefault();
        setLoad(true);
        confirmResult
            .confirm(verficationCode)
            .then((response) => {
                setLoad(false);
                setProfile(response.user);
                let firebase_id = response.user.uid;
                let phone = response.user.phoneNumber;
                let image_url = response.user.photoURL;
                let email = response.user.email;
                let name = response.user.displayName;
                let fcm_id = null;
                let friends_code = null;
                register(firebase_id, "mobile", name, email, image_url, phone, fcm_id, friends_code, (success) => {
                    toast.success(t("Successfully Verified"))
                    if (response.additionalUserInfo.isNewUser) {
                        //If new User then show the Update Profile Screen
                        setNewUserScreen(true);
                    } else {
                        navigate("/quiz-play");
                    }
                }, (error) => {
                    toast.error(t("Error") + " :" + error);
                })

            })
            .catch((error) => {
                setLoad(false);
                window.recaptchaVerifier.render().then(function (widgetId) {
                    window.recaptchaVerifier.reset(widgetId);
                });
                toast.error(t("Error") + " :" + error.message);
            });
    };

    // change phone number
    const onChangePhoneNumber = (e) => {
        e.preventDefault();
        setVerificationCode("");
        setConfirmResult(null);
        setIsSend(false);
    };

    // on submit otp send
    const formSubmit = (e) => {
        e.preventDefault();
        let firebase_id = profile.uid;
        let email = profile.email;
        let phone = profile.phoneNumber;
        let image_url = profile.photoURL;
        let name = profile.name;
        let fcm_id = null;
        let friends_code = profile.friends_code;
        register(firebase_id, "mobile", name, email, image_url, phone, fcm_id, friends_code, (success) => {
            toast.success(t("Successfully Login"));
            navigate("/quiz-play");
        }, (error) => {
            toast.error(t("Please Try again"));
        })
    };

    // on change image
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

    // field data
    const handleChange = (event) => {
        const field_name = event.target.name;
        const field_value = event.target.value;
        setProfile((values) => ({ ...values, [field_name]: field_value }));
    };

    // change refer code
    const changeReferCodeCheckbox = () => {
        let state = !showReferCode;
        setShowReferCode(state);
    };

    const swiperOption = {
        loop: false,
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

    return (
        <React.Fragment>
            <SEO title={t("Otp Verify")} />
            <Breadcrumb title={t("Otp Verify")} content={t("Home")} contentTwo={t("Otp Verify")}/>
            <div className="otpverify wrapper loginform">
                {!newUserScreen ? (
                    <div className="container glassmorcontain">
                        <div className="row morphisam">
                            <div className="col-md-6 col-12">
                                <div className="inner__login__img justify-content-center align-items-center d-flex">
                                    <img src={process.env.PUBLIC_URL + "/images/login/otp_img.svg"} alt="otp" />
                                </div>
                            </div>
                            <div className="col-md-6 col-12 border-line position-relative">
                                <div className="inner__login__form outerline">
                                    <h3 className="mb-4 text-uppercase text-start">{t("Otp Verification")}</h3>

                                    {!isSend ? (
                                        <form className="form text-start" onSubmit={onSubmit}>
                                            <div>
                                                <label htmlFor="number" className="mb-2">
                                                    {t("Please Enter mobile number")} :
                                                </label>
                                                <PhoneInput
                                                    value={phoneNumber}
                                                    country={config.DefaultCountrySelectedInMobile}
                                                    countryCodeEditable={false}
                                                    autoFocus={true}
                                                    onChange={(phone) => setPhoneNumber(phone)}
                                                    className="mb-3 position-relative d-inline-block w-100 form-control"
                                                />
                                                <div className="send-button">
                                                    <button className="btn btn-primary" type="submit">
                                                        {!load ? t("Request OTP") : t("Please Wait")}
                                                    </button>
                                                    <Link className="btn btn-dark backlogin" to={"/login"} type="button">
                                                        {t("Back to Login")}
                                                    </Link>
                                                </div>
                                            </div>
                                        </form>
                                    ) : null}
                                    {isSend ? (
                                        <form className="form text-start" onSubmit={handleVerifyCode}>
                                            <div className="form">
                                                <label htmlFor="code" className=" mb-3">
                                                    {t("Enter your OTP")} :
                                                </label>
                                                <input type="number" placeholder={t("Enter your OTP")} onChange={(e) => setVerificationCode(e.target.value)} className="form-control p-3" required />
                                                <div className="text-end">
                                                    <u>
                                                        <Link className="main-color" to="#" onClick={resendOtp}>
                                                            {t("Resend OTP")}
                                                        </Link>
                                                    </u>
                                                </div>
                                                <div className="btn-group">
                                                    <div className="verify-code">
                                                        <button className="btn btn-primary" type="submit">
                                                            {!load ? t("Submit") : t("Please Wait")}
                                                        </button>
                                                    </div>
                                                    <div className="back-button">
                                                        <button type="button" className="btn btn-dark" onClick={onChangePhoneNumber}>
                                                            {t("Back")}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="Profile__Sec">
                        <div className="container">
                            <div className="row morphism p-5">
                                <form onSubmit={formSubmit}>
                                    <div className="row">
                                        <div className="col-xl-5 col-lg-5 col-md-12 col-12 ">
                                            <div className="row card main__profile d-flex justify-content-center align-items-center">
                                                <div className="prop__image">
                                                    <img src={userData.data && userData.data.profile ? userData.data.profile : process.env.PUBLIC_URL + "/images/user.svg"} alt="profile" id="user_profile" onError={imgError}/>
                                                    <div className="select__profile">
                                                        <input type="file" name="profile" id="file" onChange={handleImageChange} />
                                                        <label htmlFor="file">
                                                            {" "}
                                                            <em>
                                                                <FaCamera />
                                                            </em>
                                                        </label>
                                                        <input type="text" className="form-control" placeholder="Upload File" id="file1" name="myfile" disabled hidden />
                                                    </div>
                                                    </div>
                                                    {/* dummy image */}
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
                                        <div className="col-xl-7 col-lg-7 col-md-12 col-12 border-line">
                                            <div className="card p-4 bottom__card_sec">
                                                <div className="col-md-12 col-12">
                                                    <label htmlFor="fullName">
                                                        <input type="text" name="name" id="fullName" placeholder={t("Enter Your Name")} defaultValue={profile.name} onChange={handleChange} required />
                                                        <i>
                                                            <FaUserCircle />
                                                        </i>
                                                    </label>
                                                </div>

                                                <Form.Group className="my-3  d-flex" controlId="formBasicCheckbox">
                                                    <Form.Check type="checkbox" id="have_refer_code" label="Do you have Refer Code ?" onChange={changeReferCodeCheckbox} value={"code"} name="code" />
                                                </Form.Group>

                                                {showReferCode ? (
                                                    <div className="col-md-12 col-12">
                                                        <label htmlFor="mobilenumber">
                                                            <input type="text" name="friends_code" id="friends_code" placeholder={t("Refer Code")} defaultValue={profile.friends_code} onChange={handleChange} required />
                                                            <i>
                                                            <AiOutlineUsergroupAdd />
                                                            </i>
                                                        </label>
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                                <button className="btn btn-primary text-uppercase" type="submit" value="submit" name="submit" id="mc-embedded-subscribe">
                                                    {t("Submit")}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
                <div id="recaptcha-container"></div>
            </div>
        </React.Fragment>
    );
};

export default withTranslation()(Otpverify);
