import React, { Fragment, useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import Live from "../components/Quiz/ContestPlay/Live";
import Past from "../components/Quiz/ContestPlay/Past";
import Upcoming from "../components/Quiz/ContestPlay/Upcoming";
import SEO from "../components/SEO";
import { t } from "i18next";
import { selectCurrentLanguage } from "../store/reducers/languageSlice";
import { ContestPlayApi } from "../store/actions/campaign";
import { LoadcontestLeaderboard, Loadtempdata } from "../store/reducers/tempDataSlice";

const ContestPlay = () => {
    //states
    const [livecontest, setLiveContest] = useState();

    const [pastcontest, setPastContest] = useState();

    const [upcoming, setUpComing] = useState();

    const navigate = useNavigate();

    const AllData = () => {
        ContestPlayApi(
            (response) => {
                let liveData = response.live_contest.data;
                setLiveContest(liveData);

                let pastData = response.past_contest.data;
                setPastContest(pastData);

                let upcomingData = response.upcoming_contest.data;
                setUpComing(upcomingData);
            },
            (error) => {
                console.log(error);
            }
        );
    };

    //live play btn
    const playBtn = (contestid,entrycoin) => {
        navigate({ pathname: "/contest-play-board" });
        let data = { contest_id: contestid,entry_coin: entrycoin};
        Loadtempdata(data);
    };

    //past leaderboard btn
    const LeaderBoard = (contest_id) => {
        navigate({ pathname: "/contest-leaderboard" });
        let data = { past_id: contest_id };
        LoadcontestLeaderboard(data);
    };

    useEffect(() => {
        AllData();
    }, [selectCurrentLanguage]);

    return (
        <Fragment>
            <SEO title={t("Contest Play")} />
            <Breadcrumb title={t("Contest Play")} content={t("Home")} contentTwo={t("Contest Play")} />
            <div className="contestPlay mb-5">
                <div className="container">
                    <div className="row morphisam mb-5">
                        <div className="col-md-12 col-12">
                            <div className="contest_tab_contest">
                                <Tabs defaultActiveKey="live" id="fill-tab-example" className="mb-3" fill>
                                    <Tab eventKey="past" title={t("Past")}>
                                        <Past data={pastcontest} onClick={LeaderBoard} />
                                    </Tab>
                                    <Tab eventKey="live" title={t("Live")}>
                                        <Live data={livecontest} onClick={playBtn} />
                                    </Tab>
                                    <Tab eventKey="upcoming" title={t("Upcoming")}>
                                        <Upcoming data={upcoming} />
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ContestPlay;
