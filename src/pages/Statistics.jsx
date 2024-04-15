import React, { useEffect, useRef, useState } from "react";
import SEO from "../components/SEO";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { toast } from "react-toastify";
import { withTranslation } from "react-i18next";
import { getUserProfilestatisticsApi, getUserStatisticsDataApi, updateUserDataInfo } from "../store/reducers/userSlice";
import { useSelector } from "react-redux";
import { UserCoinScoreApi, getusercoinsApi, setBadgesApi, getbattlestaticticsApi } from "../store/actions/campaign";
import { badgesData, LoadNewBadgesData } from "../store/reducers/badgesSlice";
import { Link } from "react-router-dom";

const Statistics = ({ t }) => {

    const userData = useSelector((state) => state.User);

    const Badges = useSelector(badgesData);

    const big_thing_status = Badges && Badges.data.big_thing.status;

    const big_thing_coin = Badges && Badges.data.big_thing.badge_reward;

    const elite_status = Badges && Badges.data.elite.status;

    const elite_coin = Badges && Badges.data.elite.badge_reward;

    const [battleStatisticsResult, setBattleStatisticsResult] = useState([]);

    // website link


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

    // get battleStatistics api call
    useEffect(() => {
        getbattlestaticticsApi("", "", "", "", (response) => {
            setBattleStatisticsResult(response.myreport)
        }, (error) => {
            console.log(error);
        })
    }, [])


    return (
        <React.Fragment>
            <SEO title={t("Statistics")} />
            <Breadcrumb title={t("Statistics")} content={t("Home")} contentTwo={t("Statistics")} />
            <div className="Profile__Sec">
                <div className="container px-1">
                    <div className="row botton_card_details">
                        {/* quiz details */}
                        <div className="col-md-6 col-12 ps-0">
                            <div className="quiz_details morphism">
                                <p className="quiz_details_title">{t("Quiz Details")}</p>
                                <ul className="quiz_details_inner">
                                    <li>
                                        {t("Rank")}
                                        <span className="badge badge-pill custom_badge">{userData.data && userData.data.userProfileStatics.all_time_rank}</span>
                                    </li>
                                    <li>
                                        {t("Score")}
                                        <span className="badge badge-pill custom_badge">{userData.data && userData.data.userProfileStatics.all_time_score}</span>
                                    </li>
                                    <li>
                                        {t("Coins")}
                                        <span className="badge badge-pill custom_badge">{userData.data && userData.data.userProfileStatics.coins}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* question details */}
                        <div className="col-md-6 col-12 pe-0">
                            <div className="questions_details morphism">
                                <p className="questions_details_title">{t("Questions Details")}</p>
                                <ul className="questions_details_inner">
                                    <li>
                                        {t("Attempted")}
                                        <span className="badge badge-pill custom_badge">{userData.data && (userData.data.userStatics.questions_answered ? userData.data.userStatics.questions_answered : "0")}</span>
                                    </li>
                                    <li>
                                        {t("Correct")}
                                        <span className="badge badge-pill custom_badge">{userData.data && (userData.data.userStatics.correct_answers ? userData.data.userStatics.correct_answers : "0")}</span>
                                    </li>
                                    <li>
                                        {t("Incorrect")}
                                        <span className="badge badge-pill custom_badge">
                                            {userData.data &&
                                                (parseInt(userData.data.userStatics.questions_answered) - parseInt(userData.data.userStatics.correct_answers) ? parseInt(userData.data.userStatics.questions_answered) - parseInt(userData.data.userStatics.correct_answers) : "0")}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/*battle statistics */}
                        <div className="col-md-6 col-12 ps-0">
                            <div className="quiz_details morphism">
                                <p className="quiz_details_title">{t("Battle Statistics")}</p>
                                <ul className="quiz_details_inner">
                                    {battleStatisticsResult.map((elem, _index) => {
                                        return (
                                            <>
                                                <li>
                                                    {t("Draw")}
                                                    <span className="badge badge-pill custom_badge">
                                                        {elem.Drawn}
                                                    </span>
                                                </li>
                                                <li>
                                                    {t("Won")}
                                                    <span className="badge badge-pill custom_badge">
                                                        {elem.Victories}
                                                    </span>
                                                </li>
                                                <li>
                                                    {t("Lost")}
                                                    <span className="badge badge-pill custom_badge">
                                                        {elem.Loose}
                                                    </span>
                                                </li>
                                            </>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                        {/* collected badges */}
                        <div className="col-md-6 col-12 pe-0">
                            <div className="questions_details morphism badges battle_statistics_badges ">
                                <Link to={"/badges"} className="questions_details_title statistics_badges">{t("Collected Badges")} <p className="mb-0 view_all">{t("View All")}</p></Link>
                                <ul className="questions_details_inner mb-0 pb-0">
                                        {Badges.data && [
                                            ...Object.values(Badges.data).filter((data) => data.status === "1")
                                        ].slice(0,4).map((data, index) => (
                                            <li className="col-md-3 justify-content-center" key={index}>
                                                <div className="badges_data" data-tooltip-id="my-tooltip" data-tooltip-content={`${data.badge_note}`}>
                                                    <div className="inner_image">
                                                        <span className='dummy_background_color'/>
                                                        <img src={data.badge_icon} alt="badges" />
                                                    </div>
                                                    <p className="mb-0 pb-0">{data.badge_label}</p>
                                                </div>
                                            </li>

                                        ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
export default withTranslation()(Statistics);