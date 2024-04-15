import React, { Fragment, useEffect, useState,useRef } from "react";
import { Tab, Tabs } from "react-bootstrap";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import SEO from "../components/SEO";
import { withTranslation } from "react-i18next";
import { selectCurrentLanguage } from "../store/reducers/languageSlice";
import { getexamModuleApi, setExammoduleresultApi } from "../store/actions/campaign";
import Skeleton from "react-loading-skeleton";
import { examCompletedata, Loadtempdata, selecttempdata } from "../store/reducers/tempDataSlice";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import config from "../utils/config";

const ExamModule = ({ t }) => {
    const [key, setKey] = useState("Today");

    const [loading, setLoading] = useState(true);

    const [todayData, setTodaydata] = useState([]);

    const [completeData, setCompleteData] = useState([]);

    const [popupCompleteData, setPopupCompleteData] = useState([]);

    const [notificationmodal, setNotificationModal] = useState(false);

    const [ExamCompleteModal, setExamCompleteModalModal] = useState(false);

    const examKeyRef = useRef(null);

    const [examData, setExamData] = useState("");

    const [isChecked, setIsChecked] = useState(false);

    const selecttempData = useSelector(selecttempdata);

    const allQuestionData = useSelector(examCompletedata);

    const navigate = useNavigate();

    //all data render
    const getAllData = () => {
        setLoading(true);

        // today data get
        getexamModuleApi(1, 0, 10, (response) => {
            let todayallData = response.data;
            setLoading(false);
            const filteredArray = todayallData.filter(obj => obj.exam_status !== '3');
            setTodaydata(filteredArray);

        }, (error) => {
            console.log(error);
            setLoading(false);
        });

        // completed data get
        getexamModuleApi(2, 0, 10, (response) => {
            let completeallData = response.data;

            setCompleteData(completeallData);
            setLoading(false);
        }, (error) => {
            // console.log(error);
            setLoading(false);
        });
    };

    useEffect(() => {
        getAllData();
    }, [selectCurrentLanguage]);

    // questions screen
    const QuestionScreen = (data) => {
        setExamData(data.exam_key)
        Loadtempdata(data);
        setNotificationModal(true)
    }

    // popup handle validation
    const handleSubmit = (e) => {
        e.preventDefault();
        // Compare the input value with the API data
        if (examData && examData == examKeyRef.current.value) {
          if (isChecked) {
            navigate("/exam-module-play")
          } else {
            toast.error(t('Please agree to the exam rules'));
          }
        } else {
            toast.error(t('Invalid exam key'));
        }

        setExammoduleresultApi(Number(selecttempData.id), "", "","",1, "", (resposne) => {
            // console.log(resposne);
        }, (error) => {
            console.log(error);
        })
    };

    // duration minute
    const durationMinutes = (minute) => {
        let durationInSeconds = minute * 60;
        let hours = Math.floor(durationInSeconds / 3600);
        let minutes = Math.floor((durationInSeconds % 3600) / 60);
        let seconds = durationInSeconds % 60;
        return (`${hours}:${minutes}:${seconds} hh:mm:ss`);
    }

    // duration seconds in minutes and hours
    const durationsecondstominutes = (minute) => {
        let hours = Math.floor(minute / 3600);
        let minutes = Math.floor((minute % 3600) / 60);
        let seconds = minute % 60;
        return (`${hours}:${minutes}:${seconds} hh:mm:ss`);
    }

    // complete popup data
    const Completepopup = (e, data) => {
        e.preventDefault();
        setExamCompleteModalModal(true)

        // Convert data object to array of key-value pairs
        const dataEntries = Object.entries(data);

        // Convert statistics property to array of objects
        const newdata = dataEntries.reduce((acc, [key, value]) => {
            if (key === "statistics") {
                value = value.replace(/'/g, '"');
                value = value.replace(/,\s*]/, ']');
                value = JSON.parse(value);
            }
            return { ...acc, [key]: value };
        }, {});

        setPopupCompleteData([newdata]);
    }

    return (
        <Fragment>
            <SEO title={t("Exam")} />
            <Breadcrumb title={t("Exam")} content={t("Home")} contentTwo={t("Exam")} />
            <div className="SelfLearning ExamModule mb-5">
                <div className="container">
                    <div className="row  morphisam mb-5">
                        <div className="col-md-6 col-12">
                            <div className="exam_image">
                                <img src={process.env.PUBLIC_URL + "/images/exam/today.svg"} alt="image" />
                            </div>
                        </div>
                        <div className="col-md-6 col-12 mx-auto my-5 my-md-0">
                            <Tabs id="fill-tab-example" activeKey={key} onSelect={(k) => setKey(k)} fill className="mb-3">
                                <Tab eventKey="Today" title={t("Today")}>
                                    <>
                                        {loading ? (
                                            <div className="text-center">
                                                <Skeleton count={5} />
                                            </div>
                                        ) : todayData.length > 0 ? (
                                                todayData.map((data, index) => {
                                                    const duration = durationMinutes(data.duration);
                                                    const parts = data.date.split("-");
                                                    const newDateStr = parts.reverse().join("-");
                                                return (
                                                    <>
                                                        <div className="today_box" key={index} onClick={() => QuestionScreen(data)}>
                                                            <div className="today_upper">
                                                                <div className="today_title">
                                                                    <p>{data.title}</p>
                                                                </div>
                                                                <div className="today_mark">
                                                                    <p>{data.total_marks} {t("Marks")}</p>
                                                                </div>
                                                            </div>
                                                            <div className="today_bottom">
                                                                <div className="today_title">
                                                                    <p>{newDateStr}</p>
                                                                </div>
                                                                <div className="today_hours">
                                                                    <p>{duration }</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                );
                                            })
                                        ) : (
                                            <div className="error_content">
                                                <img src={process.env.PUBLIC_URL + "/images/error/error.svg"} title="wrteam" className="error_img"/>
                                                <h6 className="text-center ">{t("No exam for today")}</h6>
                                            </div>
                                        )}
                                    </>
                                </Tab>
                                <Tab eventKey="Completed" title={t("Completed")}>
                                    <>
                                        {loading ? (
                                            <div className="text-center">
                                                <Skeleton count={5} />
                                            </div>
                                        ) : completeData.length > 0 ? (
                                                completeData.map((data, index) => {
                                                    const partscom = data.date.split("-");
                                                    const newDateStrcom = partscom.reverse().join("-");
                                                return (
                                                    <>
                                                        <div className="today_box" key={index} onClick={(e) => Completepopup(e,data)}>
                                                            <div className="today_upper">
                                                                <div className="today_title">
                                                                    <p>{data.title}</p>
                                                                </div>
                                                                <div className="today_mark">
                                                                    <p>{data.total_marks} {t("Marks")}</p>
                                                                </div>
                                                            </div>
                                                            <div className="today_bottom">
                                                                <div className="today_title">
                                                                    <p>{newDateStrcom}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                );
                                            })
                                            ) : (
                                                <div className="error_content">
                                                    <img src={process.env.PUBLIC_URL + "/images/error/error.svg"} title="wrteam" className="error_img"/>
                                                    <h6 className="text-center ">{t("Have not completed any exam yet")}</h6>
                                                </div>
                                        )}
                                    </>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
            <Modal centered visible={notificationmodal} onOk={() => setNotificationModal(false)} onCancel={() => setNotificationModal(false)} footer={null} className="custom_modal_notify self-modal">
                <div className="custom_checkbox d-flex flex-wrap align-items-center mt-4">
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <input type="number" className="form-control" placeholder="Enter exam key" required min="0" ref={examKeyRef} defaultValue={config.demo ? "1234" : ""}/>
                        <hr />
                        <p className="text-center">{t("Exam Rules")}</p>
                        <ul>
                            <li>{t("I will not copy and give this exam with honesty")}</li>
                            <li>{t("If you lock your phone then exam will complete automatically")}</li>
                            <li>{t("If you minimize application or open other application and don't come back to application with in 5 seconds then exam will complete automatically")}</li>
                            <li>{t("Screen recording is prohibited")}</li>
                            <li>{t("In Android screenshot capturing is prohibited")}</li>
                            <li>{t("In ios, if you take screenshot then rules will violate and it will inform to examinator")}</li>
                        </ul>
                        <hr />
                        <div className="d-flex align-items-center justify-content-center">
                            <label className=" d-flex align-items-center text-center justify-content-center">
                            <input type="checkbox" onChange={(e) => setIsChecked(e.target.checked)} className="me-2"/>
                                {t("i agree with exam rules")}
                            </label>
                        </div>
                        <div className="text-center mt-2">
                            <button type="submit" className="btn btn-primary">{t("Submit")}</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* complete data */}
            <Modal centered visible={ExamCompleteModal} onOk={() => setExamCompleteModalModal(false)} onCancel={() => setExamCompleteModalModal(false)} footer={null} className="exammodal custom_modal_notify self-modal">
                <div className="custom_checkbox completeDataModal mt-4">
                    <div className="result_title">
                        <h3>{t("Exam Result")}</h3>
                    </div>
                    <div className="result_marks_data">
                        {popupCompleteData && popupCompleteData.map((data, index) => {
                            const duration = durationMinutes(data.duration);
                            const totalduration = durationsecondstominutes(data.total_duration);
                            return (
                                <div key={index}>
                                    <div className="inner_data">
                                        <p>{t("Obtained Marks")} :</p> <span className="result_Data">{data.obtained_marks + "/" + data.total_marks}</span>
                                    </div>
                                    <div className="inner_data">
                                        <p>{t("Exam Duration")} :</p> <span className="result_Data">{duration}</span>
                                    </div>
                                    <div className="inner_data">
                                        <p>{t("Completed In")} :</p> <span className="result_Data">{totalduration}</span>
                                    </div>
                                </div>
                            )


                        })}

                    </div>
                    <hr />
                    <div className="total_questions mb-4">
                        <h6>{t("Total Questions")}</h6>
                        <div className="inner_total_data">
                            <div className="inner_questions">
                                <div>
                                    <p>{t("Total")}<br />{t("Questions") }</p>
                                </div>
                                <div className="bottom_data">
                                    <span className="inner_total">{allQuestionData && allQuestionData.totalQuestions }</span>
                                </div>
                            </div>
                            <div className="correct_inner_questions">
                                <div>
                                    <p>{t("Correct")}<br />{t("Questions") }</p>
                                </div>
                                <div className="bottom_data_two">
                                    <span className="inner_total">{allQuestionData && allQuestionData.Correctanswer }</span>
                                </div>
                            </div>
                            <div className="incorrect_inner_questions">
                                <div>
                                    <p>{t("Incorrect")}<br />{t("Questions") }</p>
                                </div>
                                <div className="bottom_data_three">
                                    <span className="inner_total">{allQuestionData && allQuestionData.InCorrectanswer }</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="total_questions">
                        {popupCompleteData && popupCompleteData.map((data, index) => {
                            return (
                                data.statistics.map((elem, index) => {
                                    return (
                                        <div key={index}>
                                            <h6>{elem.mark}{" "}{t("Mark Questions")}</h6>
                                            <div className="inner_total_data mb-4">
                                                <div className="inner_questions">
                                                    <div>
                                                        <p>{t("Total")}<br />{t("Questions") }</p>
                                                    </div>
                                                    <div className="bottom_data">
                                                        <span className="inner_total">{elem.correct_answer + elem.incorrect}</span>
                                                    </div>
                                                </div>
                                                <div className="correct_inner_questions">
                                                    <div>
                                                        <p>{t("Correct")}<br />{t("Questions") }</p>
                                                    </div>
                                                    <div className="bottom_data_two">
                                                        <span className="inner_total">{elem.correct_answer }</span>
                                                    </div>
                                                </div>
                                                <div className="incorrect_inner_questions">
                                                    <div>
                                                        <p>{t("Incorrect")}<br />{t("Questions") }</p>
                                                    </div>
                                                    <div className="bottom_data_three">
                                                        <span className="inner_total">{elem.incorrect }</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )

                        })}

                    </div>
                </div>
            </Modal>
        </Fragment>

    );
};

export default withTranslation()(ExamModule);
