import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import SEO from "../components/SEO";
import { withTranslation } from "react-i18next";
import { useEffect } from "react";
import { sysConfigdata } from "../store/reducers/settingsSlice";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "../store/reducers/languageSlice";
import { Loadbadgedata } from "../store/reducers/badgesSlice";
import { setBadgesApi } from "../store/actions/campaign";
import { getUserBadgesApi } from "../utils/api";
import { websettingsData } from "../store/reducers/webSettings";
import { battleDataClear } from "../store/reducers/groupbattleSlice";


const Quizplay = ({ t }) => {
    const navigate = useNavigate();

    const systemconfig = useSelector(sysConfigdata);

    const languages = useSelector(selectCurrentLanguage);

    const websettingsdata = useSelector(websettingsData);

    // quiz feature image
    const quiz_zone_icon = websettingsdata && websettingsdata.quiz_zone_icon;
    const daily_quiz_icon = websettingsdata && websettingsdata.daily_quiz_icon;
    const true_false_icon = websettingsdata && websettingsdata.true_false_icon;
    const fun_learn_icon = websettingsdata && websettingsdata.fun_learn_icon;
    const self_challange_icon = websettingsdata && websettingsdata.self_challange_icon;
    const contest_play_icon = websettingsdata && websettingsdata.contest_play_icon;
    const one_one_battle_icon = websettingsdata && websettingsdata.one_one_battle_icon;
    const group_battle_icon = websettingsdata && websettingsdata.group_battle_icon;
    const audio_question_icon = websettingsdata && websettingsdata.audio_question_icon;
    const math_mania_icon = websettingsdata && websettingsdata.math_mania_icon;
    const exam_icon = websettingsdata && websettingsdata.exam_icon;
    const guess_the_word_icon = websettingsdata && websettingsdata.guess_the_word_icon;

    // data show
    const [data, setData] = useState([
        {
            id: 0,
            image: quiz_zone_icon,
            quizname: "Quiz Zone",
            url: "/quiz-zone",
            quizzonehide: "1",
        },
        {
            id: 1,
            image: daily_quiz_icon,
            quizname: "Daily Quiz",
            url: "/daily-quiz-dashboard",
            dailyquizhide: "1",
        },
        {
            id: 2,
            image: true_false_icon,
            quizname: "True & False",
            url: "/true-and-false-play",
            truefalsehide: "1",
        },

        {
            id: 3,
            image: fun_learn_icon,
            quizname: "Fun & Learn",
            url: "/fun-and-learn",
            funandlearnhide: "1",
        },
        {
            id: 5,
            image: self_challange_icon,
            quizname: "Self Challenge",
            url: "/self-learning",
            selfchallengehide: "1",
        },
        {
            id: 6,
            image: contest_play_icon,
            quizname: "Contest Play",
            url: "/contest-play",
            contestplayhide: "1",
        },
        {
            id: 7,
            image: one_one_battle_icon,
            quizname: "1 v/s 1 Battle",
            url: "/random-battle",
            battlequizhide: "1",
        },
        {
            id: 8,
            image: group_battle_icon,
            quizname: "Group Battle",
            url: "/group-battle",
            groupplayhide: "1",
        },
        {
            id: 9,
            image: audio_question_icon,
            quizname: "Audio Questions",
            url: "/audio-questions",
            audioQuestionshide: "1",
        },
        {
            id: 10,
            image: math_mania_icon,
            quizname: "Math Mania",
            url: "/math-mania",
            mathQuestionshide: "1",
        },
        {
            id: 11,
            image: exam_icon,
            quizname: "Exam",
            url: "/exam-module",
            examQuestionshide: "1",
        },
    ]);

    // redirect to page
    const redirectdata = (data) => {
        if (!data.disabled) {
            navigate(data.url);
        } else {
            toast.error(t("Coming Soon"));
        }
    };

    // hide from system settings
    const checkDisabled = () => {
        const modes = [
            {
                configProperty: "daily_quiz_mode",
                dataProperty: "dailyquizhide"
            },
            {
                configProperty: "contest_mode",
                dataProperty: "contestplayhide"
            },
            {
                configProperty: "true_false_mode",
                dataProperty:"truefalsehide"
            },
            {
                configProperty: "self_challenge_mode",
                dataProperty: "selfchallengehide"
            },
            {
                configProperty: "fun_n_learn_question",
                dataProperty: "funandlearnhide"
            },
            {
                configProperty: "guess_the_word_question",
                dataProperty: "guessthewordhide"
            },
            {
                configProperty: "battle_mode_one",
                dataProperty: "battlequizhide"
            },
            {
                configProperty: "battle_mode_group",
                dataProperty: "groupplayhide"
            },
            {
                configProperty: "audio_mode_question",
                dataProperty: "audioQuestionshide"
            },
            {
                configProperty: "maths_quiz_mode",
                dataProperty: "mathQuestionshide"
            },
            {
                configProperty: "exam_module",
                dataProperty:"examQuestionshide"
            },
        ];

        const newData = data.filter(item => {
            for (const mode of modes) {
                if (item[mode.dataProperty] === "1" && systemconfig[mode.configProperty] === "0") {
                    return false;
                }
            }
            return true;
        });

        setData(newData);
    };

    useEffect(() => {
        checkDisabled();
        // badges api call and load
        getUserBadgesApi().then((response) => {
            if (!response.error) {
                const badgesData = response.message;
                Loadbadgedata(badgesData);

                // streak badge which handling from backend
                setBadgesApi("streak", () => {}, (error) => {
                    console.log(error);
                });
            }
        });
    }, []);

    // this is only for guess the word based on english language only.
    useEffect(() => {
        if(systemconfig?.guess_the_word_question === "1"){
            if (languages.code === "en" || languages.code === "en-GB") {
                // Check if the quiz already exists in the data array
                const quizExists = data.some((quiz) => quiz.quizname === "Guess The Word");

                // If the quiz doesn't exist, add it to the data array
                if (!quizExists) {
                    setData((prevData) => [
                        ...prevData,
                        {
                            id: 4,
                            image: guess_the_word_icon,
                            quizname: "Guess The Word",
                            url: "/guess-the-word",
                            guessthewordhide: "1",
                        },
                    ]);
                }
            } else {
                // Remove "Guess The Word" quiz from the data array
                setData((prevData) => prevData.filter((quiz) => quiz.quizname !== "Guess The Word"));
            }
        }
    }, [languages.code]);

    useEffect(() => {
        // clear local storage poins
        battleDataClear()
    }, []);


    return (
        <React.Fragment>
            <SEO title={t("Quizplay")} />
            <div className="Quizzone">
                <div className="container">
                    <ul className="row justify-content-center">
                        {data.map((quiz) => (
                            <li onClick={() => redirectdata(quiz)} className="col-xl-2 col-lg-3 col-md-3 col-sm-6 col-6 small__div" key={quiz.id}>
                                <div className="inner__Quizzone">
                                    {quiz.disabled ? (
                                        <div className="card_disabled">
                                            <div className="card__icon">
                                                <img src={quiz.image} alt="icon" />
                                            </div>
                                            <div className="title__card">
                                                <h5 className="inner__title">{t(quiz.quizname)}</h5>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="card">
                                            <div className="card__icon">
                                                <img src={quiz.image} alt="icon" />
                                            </div>
                                            <div className="title__card">
                                                <h5 className="inner__title">{t(quiz.quizname)}</h5>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </React.Fragment>
    );
};
export default withTranslation()(Quizplay);
