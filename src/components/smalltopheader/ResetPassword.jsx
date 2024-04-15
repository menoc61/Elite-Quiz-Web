import React, { useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { withTranslation } from "react-i18next";
import SEO from "../SEO";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import FirebaseData from "../../utils/firebase";


const ResetPassword = ({ t }) => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const emailRef = useRef();

    const { auth } = FirebaseData();

    // auth password reset
    const passwordReset = async (email) => {
        let promise = await new Promise(function (resolve, reject) {
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    resolve(`Password Reset Email sent to ${email}`);
                })
                .catch((error) => {
                    reject(error);
                });
        });

        return promise;
    };

    // calling auth password reset
    const handlePasswordReset = (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        const email = emailRef.current.value;
        passwordReset(email)
            .then((msg) => {
                setMessage(msg);
                setLoading(false);
            })
            .catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
    };

    return (
        <React.Fragment>
            <SEO title={t("Reset Password")} />
            <Breadcrumb title={t("Reset Password")} content={t("Home")} contentTwo={t("Reset Password")}/>
            <div className="ResetPassword wrapper loginform">
                <div className="container glassmorcontain">
                    <div className="row morphisam">
                        <div className="col-md-6 col-12">
                            <div className="inner__login__img justify-content-center align-items-center d-flex">
                                <img src={process.env.PUBLIC_URL + "/images/login/login_img.svg"} alt="login" />
                            </div>
                        </div>
                        <div className="col-md-6 col-12 border-line position-relative">
                            <div className="inner__login__form outerline">
                                <h3 className="mb-4 text-uppercase ">{t("Trouble Logging In")}?</h3>
                                <p>{t("send link to get account")}</p>

                                <Form onSubmit={(e) => handlePasswordReset(e)}>
                                    <Form.Group className="mb-3 position-relative d-inline-block w-100" controlId="formBasicEmail">
                                        <Form.Control type="email" placeholder={t("Enter Your Email")} className="inputelem" ref={emailRef} required={true} />
                                        <span className="emailicon">
                                            <FaEnvelope />
                                        </span>
                                    </Form.Group>
                                    <Button variant="primary w-100 mb-3" type="submit" disabled={loading}>
                                        {loading ? t("Please Wait") : t("Send")}
                                    </Button>
                                    {message && <p>{message}</p>}
                                    <div className="sign__up">
                                        <p className="">
                                            {t("Already have an account")}
                                            <span>
                                                <Link to={"/login"}>{t("Back to Login")}</Link>
                                            </span>
                                        </p>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default withTranslation()(ResetPassword);
