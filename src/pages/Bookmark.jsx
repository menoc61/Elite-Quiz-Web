import React, { useEffect, useRef, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import SEO from "../components/SEO";
import { FaRegTrashAlt } from "react-icons/fa";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { withTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { decryptAnswer, deleteBookmarkData } from "../utils";
import { getbookmarkApi, setbookmarkApi } from "../store/actions/campaign";
import { useSelector } from "react-redux";

const Bookmark = ({ t }) => {
    const [loading, setLoading] = useState(true);
    const [key, setKey] = useState("Quizzone");
    const [quizzoneQue, setQuizzoneQue] = useState([{correctAnswer:""}]);
    const [guessthewordQue, setGuesstheWordQue] = useState([{correctAnswer:""}]);
    const [audioquizQue, setAudioQuizQue] = useState([{correctAnswer:""}]);
    const [mathQue, setMathQuizQue] = useState([{correctAnswer:""}]);
    const [visible, setVisible] = useState(5);

    const userData = useSelector((state) => state.User);

    const showMoreItems = () => {
        setVisible((prevValue) => prevValue + 4);
    };

    // get correct answers from response data with decypt answers
     const getCorrectAnswer = (data, decryptedAnswer) => {
        switch (decryptedAnswer) {
            case "a":
                return data.optiona;
            case "b":
                return data.optionb;
            case "c":
                return data.optionc;
            case "d":
                return data.optiond;
            default:
                return data.optione;
        }
    };

    useEffect(() => {
        const quizzonetype = 1;
        const guessthewordtype = 3;
        const audioquiztype = 4;
        const mathquiztype = 5

        // quizzone
        getbookmarkApi(
            quizzonetype,
            (response) => {
                // Loadbookmarkdata(response.data)
                const questions = response.data.map((data) => {

                    const decryptedAnswer = decryptAnswer(data.answer, userData.data.firebase_id);

                    const correctAnswer = getCorrectAnswer(data, decryptedAnswer);

                    return {
                        ...data,
                        correctAnswer: correctAnswer,
                    };

                });

                setQuizzoneQue(questions);
                setLoading(false);
            },
            (error) => {
                console.log(error);
            }
        );

        // guess the word
        getbookmarkApi(
            guessthewordtype,
            (response) => {
                // Loadbookmarkdata(response.data)
                const questions = response.data.map((data) => {

                    return {
                      ...data,
                    };
                  });
                setGuesstheWordQue(questions);
                setLoading(false);
            },
            (error) => {
                console.log(error);
            }
        );

        // audio quiz
        getbookmarkApi(
            audioquiztype,
            (response) => {
                // Loadbookmarkdata(response.data)
                const questions = response.data.map((data) => {

                    const decryptedAnswer = decryptAnswer(data.answer, userData.data.firebase_id);

                    const correctAnswer = getCorrectAnswer(data, decryptedAnswer);

                    return {
                      ...data,
                        correctAnswer:correctAnswer
                    };
                  });
                setAudioQuizQue(questions);
                setLoading(false);
            },
            (error) => {
                console.log(error);
            }
        );

        // Latex and MAthJax only for Math Mania Feature
        function Latex({ children }) {
            const node = useRef(null);

            useEffect(() => {
                renderMath();
            }, [children]);

            const renderMath = () => {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, node.current]);
            };

            return <div ref={node}>{children}</div>;
        }

        // math quiz
        getbookmarkApi(
            mathquiztype,
            (response) => {
                const questions = response.data.map((data) => {

                    const decryptedAnswer = decryptAnswer(data.answer, userData.data.firebase_id);

                    // this for question
                    const questionText = data.question ? data.question.replace(/<[^>]+>/g, "").replace(/\&nbsp;/g, "").trim() : "";

                    const question = <Latex>{questionText}</Latex>;

                    // this for correct option answer
                    const correctAnswers = getCorrectAnswer(data, decryptedAnswer);

                    const optionsText = correctAnswers ? correctAnswers.replace(/<[^>]+>/g, "").replace(/\&nbsp;/g, "").trim() : "";

                    const newCorrectAnswer = <Latex>{optionsText}</Latex>

                    return {
                        ...data,
                        question: question,
                        correctAnswer:newCorrectAnswer
                    };
                });

                setMathQuizQue(questions);
                setLoading(false);
            },
            (error) => {
                console.log(error);
            }
        );
    }, []);

    // quizzone delete
    const quizzonedeleteBookmark = (question_id, bookmark_id) => {
    const quizzonetype = 1;
    const bookmark = "0";

        // quizzone
        setbookmarkApi(question_id,bookmark,quizzonetype,(response) => {
                const new_questions = quizzoneQue.filter((data) => {
                    return data.question_id !== question_id;
                });
                setQuizzoneQue(new_questions);
                toast.success(t("Question removed from Bookmark"));
                deleteBookmarkData(bookmark_id);
            },
            (error) => {
                const old_questions = quizzoneQue;
                setQuizzoneQue(old_questions);
                console.log(error);
            }
        );
    };

    // guess the word delete
    const guesstheworddeleteBookmark = (question_id, bookmark_id) => {
        const guessthewordtype = 3;
        const bookmark = "0";

        // quizzone
        setbookmarkApi(question_id,bookmark,guessthewordtype,(response) => {
                const new_questions = guessthewordQue.filter((data) => {
                    return data.question_id !== question_id;
                });
                setGuesstheWordQue(new_questions);
                toast.success(t("Question removed from Bookmark"));
                deleteBookmarkData(bookmark_id);
            },
            (error) => {
                const old_questions = guessthewordQue;
                setGuesstheWordQue(old_questions);
                console.log(error);
            }
        );
    };

    // audio quiz delete
    const AudioquizdeleteBookmark = (question_id, bookmark_id) => {
        const audioquiztype = 4;
        const bookmark = "0";

        // quizzone
        setbookmarkApi(question_id,bookmark,audioquiztype,(response) => {
                const new_questions = audioquizQue.filter((data) => {
                    return data.question_id !== question_id;
                });
                setAudioQuizQue(new_questions);
                toast.success(t("Question removed from Bookmark"));
                deleteBookmarkData(bookmark_id);
            },
            (error) => {
                const old_questions = audioquizQue;
                setAudioQuizQue(old_questions);
                console.log(error);
            }
        );
    };

    // math quiz delete
    const mathquizdeleteBookmark = (question_id, bookmark_id) => {
        const mathquiztype = 5;
        const bookmark = "0";

        // quizzone
        setbookmarkApi(question_id,bookmark,mathquiztype,(response) => {
                const new_questions = mathQue.filter((data) => {
                    return data.question_id !== question_id;
                });
                setMathQuizQue(new_questions);
                toast.success(t("Question removed from Bookmark"));
                deleteBookmarkData(bookmark_id);
            },
            (error) => {
                const old_questions = mathQue;
                setMathQuizQue(old_questions);
                console.log(error);
            }
        );
    };

    return (
        <React.Fragment>
            <SEO title={t("bookmark")} />
            <Breadcrumb title={t("bookmark")} content={t("Home")} contentTwo={t("bookmark")} />
            <div className="Bookmark">
                <div className="container bookmark-data">
                    <div className="row morphisam">
                        <Tabs id="fill-tab-example" activeKey={key} onSelect={(k) => setKey(k)} fill className="mb-3">
                            <Tab eventKey="Quizzone" title="Quizzone">
                                <>
                                    {loading ? (
                                        <div className="text-center ">
                                            <Skeleton count={5}/>
                                        </div>
                                    ) : quizzoneQue.length > 0 ? (

                                        quizzoneQue.slice(0, visible).map((question, key) => {
                                            return (
                                                <div className="outer__stage bookmark-box" key={key}>
                                                    <div className="three__stage">
                                                        <div className="number_stage">
                                                            <span>{key + 1}</span>
                                                        </div>
                                                        <div className="content_stage">
                                                            <p>{question.question}</p>
                                                            <span>
                                                                {/* {t("Answer")}: <span >{question.textAnswer ? question["option" + question.textAnswer] : t("Not Attempted")}</span> */}
                                                                {t("Answer")}:<span className="ps-2">{question && question.correctAnswer}</span>
                                                            </span>
                                                        </div>
                                                        <div className="delete__stage">
                                                            <button className="btn btn-primary" onClick={() => quizzonedeleteBookmark(question.question_id, question.id)}>
                                                                <FaRegTrashAlt />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <>
                                            <h4 className="text-center ">{t("No Data Found")}</h4>
                                            <div className="play__button">
                                                <Link to={"/"} className="btn btn-primary d-block">
                                                    {t("Back")}
                                                </Link>
                                            </div>
                                        </>
                                    )}

                                    {visible < quizzoneQue.length && (
                                        <div className="col-md-12 text-center">
                                            <Link to="#" id="load-more" className="btn primary-btn load-more-btn text-white" onClick={showMoreItems}>
                                                <span>{t("Load More")}</span>
                                            </Link>
                                        </div>
                                    )}
                                </>
                            </Tab>
                            <Tab eventKey="GuesstheWord" title="GuesstheWord">
                                <>
                                    {loading ? (
                                        <div className="text-center ">
                                            <Skeleton count={5}/>
                                        </div>
                                    ) : guessthewordQue.length > 0 ? (
                                        guessthewordQue.slice(0, visible).map((question, key) => {
                                            return (
                                                <div className="outer__stage bookmark-box" key={key}>
                                                    <div className="three__stage">
                                                        <div className="number_stage">
                                                            <span>{key + 1}</span>
                                                        </div>
                                                        <div className="content_stage">
                                                            <p>{question.question}</p>
                                                            <span>
                                                            {t("Answer")}: <span className="ps-2">{question && question.answer}</span>
                                                                {/* {t("Answer")}: <span >{question.textAnswer ? question["option" + question.textAnswer] : t("Not Attempted")}</span> */}
                                                            </span>
                                                        </div>
                                                        <div className="delete__stage">
                                                            <button className="btn btn-primary" onClick={() => guesstheworddeleteBookmark(question.question_id, question.id)}>
                                                                <FaRegTrashAlt />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <>
                                            <h4 className="text-center ">{t("No Data Found")}</h4>
                                            <div className="play__button">
                                                <Link to={"/"} className="btn btn-primary d-block">
                                                    {t("Back")}
                                                </Link>
                                            </div>
                                        </>
                                    )}

                                    {visible < guessthewordQue.length && (
                                        <div className="col-md-12 text-center">
                                            <Link to="#" id="load-more" className="btn primary-btn load-more-btn text-white" onClick={showMoreItems}>
                                                <span>{t("Load More")}</span>
                                            </Link>
                                        </div>
                                    )}
                                </>
                            </Tab>
                            <Tab eventKey="AudioQuestion" title="AudioQuestion">
                                <>
                                    {loading ? (
                                        <div className="text-center ">
                                            <Skeleton count={5}/>
                                        </div>
                                    ) : audioquizQue.length > 0 ? (
                                        audioquizQue.slice(0, visible).map((question, key) => {
                                            return (
                                                <div className="outer__stage bookmark-box" key={key}>
                                                    <div className="three__stage">
                                                        <div className="number_stage">
                                                            <span>{key + 1}</span>
                                                        </div>
                                                        <div className="content_stage">
                                                            <p>{question.question}</p>
                                                            <span>
                                                            {t("Answer")}: <span className="ps-2">{question && question.correctAnswer}</span>
                                                                {/* {t("Answer")}: <span >{question.textAnswer ? question["option" + question.textAnswer] : t("Not Attempted")}</span> */}
                                                            </span>
                                                        </div>
                                                        <div className="delete__stage">
                                                            <button className="btn btn-primary" onClick={() => AudioquizdeleteBookmark(question.question_id, question.id)}>
                                                                <FaRegTrashAlt />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <>
                                            <h4 className="text-center ">{t("No Data Found")}</h4>
                                            <div className="play__button">
                                                <Link to={"/"} className="btn btn-primary d-block">
                                                    {t("Back")}
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                     {visible < audioquizQue.length && (
                                        <div className="col-md-12 text-center">
                                            <Link to="#" id="load-more" className="btn primary-btn load-more-btn text-white" onClick={showMoreItems}>
                                                <span>{t("Load More")}</span>
                                            </Link>
                                        </div>
                                    )}
                                </>
                            </Tab>
                            <Tab eventKey="MathQuestion" title="MathQuestion">
                                <>
                                    {loading ? (
                                        <div className="text-center ">
                                            <Skeleton count={5}/>
                                        </div>
                                    ) : mathQue.length > 0 ? (
                                        mathQue.slice(0, visible).map((question, key) => {
                                            return (
                                                <div className="outer__stage bookmark-box" key={key}>
                                                    <div className="three__stage">
                                                        <div className="number_stage">
                                                            <span>{key + 1}</span>
                                                        </div>
                                                        <div className="content_stage">
                                                            <p>{question.question}</p>
                                                            <span>
                                                            {t("Answer")}: <span className="ps-2">{question && question.correctAnswer}</span>
                                                                {/* {t("Answer")}: <span >{question.textAnswer ? question["option" + question.textAnswer] : t("Not Attempted")}</span> */}
                                                            </span>
                                                        </div>
                                                        <div className="delete__stage">
                                                            <button className="btn btn-primary" onClick={() => mathquizdeleteBookmark(question.question_id, question.id)}>
                                                                <FaRegTrashAlt />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <>
                                            <h4 className="text-center ">{t("No Data Found")}</h4>
                                            <div className="play__button">
                                                <Link to={"/"} className="btn btn-primary d-block">
                                                    {t("Back")}
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                     {visible < mathQue.length && (
                                        <div className="col-md-12 text-center">
                                            <Link to="#" id="load-more" className="btn primary-btn load-more-btn text-white" onClick={showMoreItems}>
                                                <span>{t("Load More")}</span>
                                            </Link>
                                        </div>
                                    )}
                                </>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default withTranslation()(Bookmark);
