import React, { useState, useEffect, useRef } from "react";
import { FaEnvelope, FaLock, FaCamera, FaMobileAlt, FaUserCircle, FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { withTranslation } from "react-i18next";
import { checkUserExist, register, updateProfileApi } from "../../store/reducers/userSlice";
import { useSelector } from "react-redux";
import SEO from "../SEO";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { imgError } from "../../utils";
import FirebaseData from "../../utils/firebase";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
import { profileImages } from "../../assets/json/profileImages";
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";

SwiperCore.use([Navigation]);

function Login({ t }) {
    const [loading, setLoading] = useState(false);

    const [newUserScreen, setNewUserScreen] = useState(false);

    const [showReferCode, setShowReferCode] = useState(false);

    const userData = useSelector((state) => state.User);

    const { auth, googleProvider, facebookprovider } = FirebaseData();

    const [profile, setProfile] = useState({
        name: "",
        mobile: "",
        email: "",
        profile: "",
        all_time_rank: "",
        all_time_score: "",
        coins: "",
        friends_code:""
    });

    const emailRef = useRef();

    const passwordRef = useRef();

    const navigate = useNavigate();

    // signin
    const signin = async (email, password) => {
        let promise = await new Promise(function (resolve, reject) {
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    resolve(userCredential);
                    // console.log("user credential",userCredential)
                })
                .catch((error) => {
                    reject(error);
                });
        });
        return promise;
    };

    //email signin
    const handleSignin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        try {
            let userdata = await signin(email, password);
            setProfile(userdata.user);
            setProfile((values) => ({ ...values, auth_type: "email" }));
            if (userdata.user.emailVerified) {
                checkUserExist(userdata.user.uid, (response) => {
                        let firebase_id = userdata.user.uid;
                        let phone = null;
                        let image_url = userdata.user.photoURL;
                        let name = null;
                        let fcm_id = null;
                        let friends_code = null;
                        register(firebase_id,"email",name,email,image_url,phone,fcm_id,friends_code,(success) => {
                            setNewUserScreen(false);
                            toast.success(t("Successfully Login"));
                            if (response.message === "131") {
                                //If new User then show the Update Profile Screen
                                setNewUserScreen(true);
                            } else {
                                navigate("/quiz-play");
                            }
                        }, (error) => {
                           toast.error(error)
                        });
                    setLoading(false);
                }, (error) => {
                    console.log("onerror",error);
                });
            } else {
                toast.error(t("Please Verify your Email First"));
                setLoading(false);
            }
        } catch (error) {
            if (error.code === "auth/user-not-found") {
                toast.error(t("User Not Found"));
            } else if (error.code === "auth/wrong-password") {
                toast.error(t("Password is wrong"));
            } else {
                toast.error(error.message);
            }
            setLoading(false);
        }
    };

    //google sign in
    const signInWithGoogle = async (e) => {
        e.preventDefault();
        await auth.signInWithPopup(googleProvider).then((response) => {
                setProfile(response.user);
                setProfile((values) => ({ ...values, auth_type: "gmail" }));
                let firebase_id = response.user.uid;
                let email = response.user.email;
                let phone = response.user.phoneNumber;
                let image_url = response.user.photoURL;
                let name = null;
                let fcm_id = null;
                let friends_code = null;
                register(firebase_id, "gmail", name, email, image_url, phone, fcm_id, friends_code, (success) => {
                    setLoading(false);
                    toast.success(t("Successfully Login"));
                    if (response.additionalUserInfo.isNewUser) {
                        //If new User then show the Update Profile Screen
                        setNewUserScreen(true);
                    } else {
                        navigate("/quiz-play");
                    }
                }, (error) => {
                    toast.error(t("Please Try again"));
                })
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
    };

    //facebook login
    const signInWithfacebook = async (e) => {
        e.preventDefault();
        await auth.signInWithPopup(facebookprovider).then((response) => {
                setProfile(response.user);
                setProfile((values) => ({ ...values, auth_type: "fb" }));

                    let firebase_id = response.user.uid;
                    let email = response.user.email;
                    let phone = response.user.phoneNumber;
                    let image_url = response.user.photoURL;
                    let name = null;
                    let fcm_id = null;
                    let friends_code = null;
                    register(firebase_id, "fb", name, email, image_url, phone, fcm_id, friends_code, (success) => {
                        setLoading(false);
                        toast.success(t("Successfully Login"));
                        if (response.additionalUserInfo.isNewUser) {
                            //If new User then show the Update Profile Screen
                            setNewUserScreen(true);
                        } else {
                            navigate("/quiz-play");
                        }
                    }, (error) =>
                        console.log("eror", error));
                        toast.error(error);

                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
    };

    // new user form submit
    const formSubmit = (e) => {
        e.preventDefault();
        let firebase_id = profile.uid;
        let email = profile.email;
        let phone = null;
        let image_url = profile.image ? profile.image : null;
        let name = profile.name;
        let fcm_id = null;
        let friends_code = profile.friends_code;
        let auth_type = profile.auth_type;
        register(firebase_id, auth_type, name, email, image_url, phone, fcm_id, friends_code,(success) => {
            navigate("/quiz-play");
        }, (error) => {
            toast.error(error);
        })
        if (profile.image) {
            updateProfileApi(profile.image)
        }
    };

    // handle image change
    const handleImageChange = (e) => {
        e.preventDefault();
        updateProfileApi(e.target.files[0])
    };

    // set input field data
    const handleChange = (event) => {
        const field_name = event.target.name;
        const field_value = event.target.value;
        setProfile((values) => ({ ...values, [field_name]: field_value }));
    };

    // refer code
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
            <SEO title={t("Login")} />
            <Breadcrumb title={t("Login")} content={t("Home")} contentTwo={t("Login")}/>
            <div className="loginform wrapper">
                {!newUserScreen ? (
                    <div className="container glassmorcontain">
                        <div className="row morphisam">
                            <div className="col-lg-6 col-md-12 col-12">
                                <div className="inner__login__img justify-content-center align-items-center d-flex">
                                    <img src={process.env.PUBLIC_URL + "/images/login/login_img.svg"} alt="login" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12 col-12 border-line position-relative">
                                <div className="inner__login__form outerline">
                                    <h3 className="mb-4 text-uppercase ">{t("Login")}</h3>
                                    <Form onSubmit={(e) => handleSignin(e)}>
                                        <Form.Group className="mb-3 position-relative d-inline-block w-100" controlId="formBasicEmail">
                                            <Form.Control type="email" placeholder={t("Enter Your Email")} className="inputelem" ref={emailRef} required={true} />
                                            <span className="emailicon">
                                                <FaEnvelope />
                                            </span>
                                        </Form.Group>
                                        <Form.Group className="position-relative d-inline-block w-100" controlId="formBasicPassword">
                                            <Form.Control type="password" placeholder={t("Enter Your Password")} className="inputelem" ref={passwordRef} required={true} />
                                            <span className="emailicon2">
                                                <FaLock />
                                            </span>
                                        </Form.Group>
                                        <div className="text-end text-small mb-3 resetpassword">
                                            <small>
                                                <Link to={"/reset-password"}>{t("Forgot Password")} ?</Link>
                                            </small>
                                        </div>
                                        <Button variant="primary w-100 mb-3" type="submit" disabled={loading}>
                                            {loading ? t("Please Wait") : t("Login")}
                                        </Button>
                                    </Form>
                                    <div className="social__icons">
                                        <ul>
                                            <li>
                                                <button className="social__icons" onClick={signInWithGoogle}>
                                                    <FcGoogle />
                                                </button>
                                            </li>
                                            {/* <li>
                                                <button className="social__icons facebook_icon" onClick={signInWithfacebook}>
                                                    <FaFacebookF />
                                                </button>
                                            </li> */}
                                            <li>
                                                <button className="social__icons" onClick={() => { navigate("/otp-verify");}}>
                                                    <FaMobileAlt />
                                                </button>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="sign__up">
                                        <p className="">
                                            {t("Dont have account")}&nbsp;
                                            <span>
                                                <Link to="/sign-up" replace>
                                                    {t("Sign Up")}
                                                </Link>
                                            </span>
                                        </p>
                                        <small className="text-center">
                                            {t("user agreement message")}&nbsp;
                                            <u>
                                                <Link className="main-color" to="/terms-conditions">
                                                    {t("Terms and Conditions")}
                                                </Link>
                                            </u>
                                            &nbsp;&nbsp;
                                            <u>
                                                <Link className="main-color" to="/privacy-policy">
                                                    {t("Privacy Policy")}
                                                </Link>
                                            </u>
                                        </small>
                                    </div>
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

                                                <Form.Group className="my-3 d-flex" controlId="formBasicCheckbox">
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
            </div>
        </React.Fragment>
    );
}
export default withTranslation()(Login);
