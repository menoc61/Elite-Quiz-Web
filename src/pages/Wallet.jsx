import React, { useEffect, useState } from "react";
import SEO from "../components/SEO";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { withTranslation } from "react-i18next";
import { t } from "i18next";
import { Tab, Tabs } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal } from "antd";
import Skeleton from "react-loading-skeleton";
import { UserCoinScoreApi, getPaymentApi, getusercoinsApi, setPaymentApi } from "../store/actions/campaign";
import { updateUserDataInfo } from "../store/reducers/userSlice";
import { RiPaypalFill } from "react-icons/ri";
import { SiPaytm } from "react-icons/si";
import { FaStripe } from "react-icons/fa";
import { settingsData } from "../store/reducers/settingsSlice";

const Wallet = () => {
    // payment modal
    const [modal, setModal] = useState(false);

    const [paymentDailog, setPaymentDailog] = useState(false);

    const [paytmId, setPaytmId] = useState(false);

    const [stripeID, setStripeID] = useState(false);

    const [inputId, setInputId] = useState([]);

    const [walletvalue, setWalletValue] = useState("");

    const [redeemInput, setRedeemInput] = useState(0);

    const [paymentData, setPaymentData] = useState([]);

    const [totalCoinUsed, setTotalCoinUsed] = useState();

    const [loading, setLoading] = useState(true);

    const [amount, setAmount] = useState(0);

    const selectdata = useSelector(settingsData);

    // per coin
    const per_coin_data = selectdata && selectdata.filter(item => item.type == "per_coin");

    const per_coin = per_coin_data && per_coin_data.length > 0 ? per_coin_data[0].message : '';

    // per amount
    const coin_amount_data = selectdata && selectdata.filter(item => item.type == "coin_amount");

    const coin_amount = coin_amount_data && coin_amount_data.length > 0 ? coin_amount_data[0].message : '';

    // minimun coin for request
    const coin_limit_data = selectdata && selectdata.filter(item => item.type == "coin_limit");

    const coin_limit = coin_limit_data && coin_limit_data.length > 0 ? coin_limit_data[0].message : '';

    // store data get
    const userData = useSelector((state) => state.User);

    // here math.max use for check negative value if negative then it set 0
    const usercoins = Math.max(Number(userData.data && userData.data.userProfileStatics.coins), 0);

    // payment sign
    const currency_symbol = selectdata && selectdata.filter(item => item.type == "currency_symbol");

    // user coins
    useEffect(() => {
        let data = usercoins;
        let newData = ((data / Number(per_coin)) * Number(coin_amount));
        // here if newData is negative then it set 0
        if (newData < 0) {
            newData = 0;
        }
        setWalletValue(newData);
    }, []);

    // inputcoinused (reverse process based input value data passed)
    const inputCoinUsed = () => {
        let inputCoin = redeemInput ? redeemInput : walletvalue;
        let totalCoinUsed = ((inputCoin * Number(per_coin)) / Number(coin_amount));
        setTotalCoinUsed(totalCoinUsed)
    }

    // minimum value
    const minimumValue = () => {
        const minimumvalue = Number(coin_limit);
        const percoin = Number(per_coin);
        const totalvalue = (minimumvalue / percoin);
        return totalvalue;
    }

    // reedem button
    const redeemNow = (e) => {
        e.preventDefault();
        inputCoinUsed();
        if (Number(redeemInput) < minimumValue()) {
            setModal(false);
            toast.error(t(`Minimum redeemable amount is $${minimumValue()}`));
            return;
        } else if (Number(redeemInput) > walletvalue) {
            setModal(false);
            toast.error(t(`You cannot redeem more than your wallet balance`));
            return;
        } else {
            setModal(true);
        }
    };

    // payment type
    const paymentModal = (e, type) => {
        e.preventDefault();
        if (type === "paypal") {
            setPaymentDailog(true)
            setModal(false)
        } else if (type === "paytm") {
            setPaytmId(true);
            setModal(false)
        } else if (type === "stripe") {
            setStripeID(true);
            setModal(false)
        }
    };

    // input data
    const handleMerchantIdChange = (event) => {
        setInputId(event.target.value);
    };

    // cancel button
    const onCancelbutton = () => {
        setInputId(0);
    };

    // make request
    const makeRequest = (event, type) => {

        event.preventDefault();
        // if input field is empty
        if (inputId == "") {
            toast.error("please fill your id");
            return;
        }
        // payment type check and set payment api call with coin update api
        if (type === "paypal") {
            setPaymentApi("paypal", `["${inputId}"]`, redeemInput, totalCoinUsed, "Redeem Request", (response) => {
                setModal(false);
                setPaymentDailog(false);
                const status = 1;
                UserCoinScoreApi(-redeemInput, null, null, "payment request", status, (response) => {
                    getusercoinsApi((responseData) => {
                        updateUserDataInfo(responseData.data)
                    }, (error) => {
                        console.log(error);
                    });
                    }, (error) => {
                        console.log(error);
                    })
                }, (error) => {
                setModal(false);
                if (error == 127) {
                    toast.error(t("You have already made a payment request. Please wait for 48 hours after you made the previous request."))
                }
            });
        } else if (type === "paytm") {
            setPaymentApi("paytm", `["${inputId}"]`, reedem_and_walletValue, totalCoinUsed, "Redeem Request", (response) => {
                setModal(false);
                setPaytmId(false);
                const status = 1;
                UserCoinScoreApi(-redeemInput, null, null, "payment request", status, (response) => {
                    getusercoinsApi((responseData) => {
                        updateUserDataInfo(responseData.data)
                    }, (error) => {
                        console.log(error);
                    });
                    }, (error) => {
                        console.log(error);
                    })
                }, (error) => {
                setModal(false);
                if (error == 127) {
                    toast.error(t("You have already made a payment request. Please wait for 48 hours after you made the previous request."))
                }
            });
        } else if (type === "stripe") {
            setPaymentApi("stripe", `["${inputId}"]`, reedem_and_walletValue, totalCoinUsed, "Redeem Request", (response) => {
                setModal(false);
                setStripeID(false);
                const status = 1;
                    UserCoinScoreApi(-redeemInput, null, null, "payment request", status, (response) => {
                        getusercoinsApi((responseData) => {
                            updateUserDataInfo(responseData.data)
                        }, (error) => {
                            console.log(error);
                        });
                    }, (error) => {
                        console.log(error);
                    })
                }, (error) => {
                setModal(false);
                if (error == 127) {
                   toast.error(t("You have already made a payment request. Please wait for 48 hours after you made the previous request."))
               }
            });
        }
    };

    // get payment api fetch
    useEffect(() => {
        getPaymentApi("", "", (response) => {
            const resposneData = response.data;
            setPaymentData(resposneData);
            // summation of amount from array of status 1 (status 1 is completed) to show in total amount
            const totalAmount = resposneData.reduce((accumulator, currentObject) => {
                if (currentObject.status === "1") {
                  const paymentAmount = parseFloat(currentObject.payment_amount);
                  return accumulator + paymentAmount;
                }
                return accumulator;
            }, 0);
            setAmount(totalAmount);
            setLoading(false)
        }, (error) => {
            setLoading(false)
        })
    }, []);

    // status data
    const statusData = (status) => {
        if (status == "0") {
            return "pending"
        } else if (status == "1") {
            return "completed"
        } else if (status == "2") {
            return "invalid details"
        }
    };

    // date format
    const dataFormat = (date) => {
        const dateString = date.substring(0, 10);
        const dateArray = dateString.split("-");
        const reversedDateArray = dateArray.reverse();
        const newDateStr = reversedDateArray.join("-");
        return newDateStr;
    }

    // input value of redeem amount
    const handleInputchange = (event) => {
        event.preventDefault();
        let targetValue = event.target.value;
        setRedeemInput(Number(targetValue));

    }

    // return value of popup coins
    const modalCoinValue = () => {
        const divisionResult = redeemInput / minimumValue()
        const centsValue = Math.floor(divisionResult * 100);
        return centsValue;
    }

    // update wallet value of input by default input value and selected value
    useEffect(() => {
        setRedeemInput(walletvalue);
    },[walletvalue])



    return (
        <>
            <SEO title={t("Wallet")} />
            <Breadcrumb title={t("Wallet")} content={t("Home")} contentTwo={t("Wallet")} />
            <section className="wallet my-5">
                <div className="container">
                    <div className="row morphisam">
                        <div className="col-md-6 col-12">
                            <div className="image mb-4">
                                <img src={process.env.PUBLIC_URL + "/images/wallet/paymentrequest.svg"} alt="wallet" />
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                            <Tabs defaultActiveKey={t("Request")} id="fill-tab-example" className="mb-3" fill>
                                <Tab eventKey="Request" title={t("Request")}>
                                    <div className="request_data pt-3">
                                        <h4 className="redem_amount">{t("Redeemable Amount")}</h4>
                                        <div className="inner_symbol">
                                            <span className="currency_symbol">{currency_symbol[0]?.message}</span>
                                            <input type="number" className="price" defaultValue={`${walletvalue}`} onChange={(event) => handleInputchange(event)} min={0}/>
                                        </div>
                                        <h5 className="total_coins_title pt-3">{t("Total Coins")}</h5>
                                        <p className="total_coin"><img className="me-1" src={process.env.PUBLIC_URL + "/images/battle/coin.svg"} alt="coin" />{usercoins}</p>
                                        <button className="btn btn-primary" onClick={(e) => redeemNow(e)}>
                                            {t("Redeem Now")}
                                        </button>
                                        <hr />
                                        <p className="notes">{t("Notes")}:-</p>
                                        <ul>
                                            <li className="notes_data">{t("Payout will take 3 - 5 working days")}</li>
                                        </ul>
                                    </div>
                                </Tab>
                                <Tab eventKey="Transaction" title={t("Transaction")}>
                                    <div className="total_earnings">
                                        <p>{t("Total Earnings")} : {currency_symbol[0]?.message}{amount}</p>
                                    </div>
                                    {loading ? (
                                        <div className="text-center">
                                            <Skeleton count={5} />
                                        </div>
                                    ) : (
                                            <>
                                                {paymentData.length > 0 ? (paymentData.map((data, index) => (
                                                    <div className="reedem_request" key={index}>
                                                        <div className="redeem">
                                                            <p className="redeem_txt">{t("Redeem Request")}</p>
                                                            <p className="redeem_price">${data.payment_amount}</p>
                                                        </div>
                                                        <div className="payment_adderess">
                                                            <p className="payment_type">{data.payment_type} &#9679; {dataFormat(data.date) }</p>
                                                            <p className="payment_status">{statusData(data.status)}</p>
                                                        </div>
                                                    </div>
                                                ))) : (
                                                    <>
                                                        <div className="text-center">
                                                            <img src={process.env.PUBLIC_URL + "/images/error/error.svg"} title="wrteam" className="error_img"/>
                                                            <p className="text-dark">{t("No Data Found")}</p>
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )
                                    }
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </section>

            {/* payment icon payout modal */}
            <Modal maskClosable={false} title={t("Wallet")} centered visible={modal} onOk={() => setModal(false)} onCancel={(e) => { setModal(false); onCancelbutton(e)}} footer={null}>
                <h4>{t("Redeemable Amount")} ${redeemInput}</h4>
                <p>{modalCoinValue()} {t("Coins will be deducted")}</p>
                <hr className="hr"/>
                <p>{t("Select payout option")}</p>
                <ul className="payment_icon ps-0">
                    <li><i onClick={(e) => paymentModal(e, "paypal")}><RiPaypalFill/></i></li>
                    <li><i onClick={(e) => paymentModal(e, "paytm")}><SiPaytm/></i></li>
                    <li><i onClick={(e) => paymentModal(e, "stripe")}><FaStripe/></i></li>
                </ul>
            </Modal>

            {/* paypal modal */}
            <Modal maskClosable={false} title={t("Wallet")} centered visible={paymentDailog} onOk={() => setPaymentDailog(false)} onCancel={() => { setPaymentDailog(false); onCancelbutton()}} footer={null}>
                <h3>{t("Payout Method")} - {t("PayPal")}</h3>
                <div className="input_data">
                    <input type="text" placeholder="enter paypal id" value={inputId} onChange={(event) => handleMerchantIdChange(event)} />
                </div>
                <div className="make_payment mt-3">
                    <button className="btn btn-primary" onClick={(event) => makeRequest(event,"paypal")}>{t("Make Request")}</button>
                </div>
            </Modal>

            {/* paytm modal */}
            <Modal maskClosable={false} title={t("Wallet")} centered visible={paytmId} onOk={() => setPaytmId(false)} onCancel={() => { setPaytmId(false); onCancelbutton()} } footer={null}>
                <h3>{t("Payout Method")} - {t("Paytm")}</h3>
                <div className="input_data">
                    <input type="text" placeholder="enter mobile number" value={inputId} onChange={(event) => handleMerchantIdChange(event)} />
                </div>
                <div className="make_payment mt-3">
                    <button className="btn btn-primary" onClick={(event) => makeRequest(event,"paytm")}>{t("Make Request")}</button>
                </div>
            </Modal>

            {/* stripe modal */}
            <Modal maskClosable={false} title={t("Wallet")} centered visible={stripeID} onOk={() => setStripeID(false)} onCancel={() => { setStripeID(false);  onCancelbutton()}} footer={null}>
                <h3>{t("Payout Method")} - {t("Stripe")}</h3>
                <div className="input_data">
                    <input type="text" placeholder="enter upi id" value={inputId} onChange={(event) => handleMerchantIdChange(event)} />
                </div>
                <div className="make_payment mt-3">
                    <button className="btn btn-primary" onClick={(event) => makeRequest(event,"stripe")}>{t("Make Request")}</button>
                </div>
            </Modal>
        </>
    );
};

export default withTranslation()(Wallet);
