import React, { useEffect, useState } from "react";
import SEO from "../components/SEO";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { Select } from "antd";
import DataTable from "react-data-table-component";
import { withTranslation } from "react-i18next";
import { DailyLeaderBoardApi, GlobleLeaderBoardApi, MonthlyLeaderBoardApi } from "../store/actions/campaign";
import { imgError } from "../utils";

const { Option } = Select;
const LeaderBoard = ({ t }) => {
    const [leaderBoard, setLeaderBoard] = useState({my_rank: "",other_users_rank: "",total:""});

    const [category, setCategory] = useState("Daily");
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);

    const columns = [
        {
            name: t("Rank"),
            selector: (row) => {
                const value = row.user_rank;
                return typeof value === 'string' ? parseInt(value, 10) : value;
            },
            sortable: true,
        },
        {
            name: t("Profile"),
            selector: (row) =>
                row.profile ? (
                    <div className="leaderboard-profile">
                        <img src={row.profile} className="w-100" alt={row.name} onError={imgError}></img>
                    </div>
                ) : (
                    <div className="leaderboard-profile">
                        <img src={process.env.PUBLIC_URL + "/images/user.svg"} className="w-25" alt={row.name}></img>
                    </div>
                ),
            sortable: true,
        },
        {
            name: t("Player"),
            selector: (row) => `${row.name}`,
            sortable: true,
        },
        {
            name: t("Score"),
            selector: (row) => `${row.score}`,
        },
    ];

    const getDailyLeaderBoard = (offset, limit) => {
        DailyLeaderBoardApi(
            offset,
            limit,
            (response) => {

                setTableData(response.data.my_rank, response.data.other_users_rank,response.total);
            },
            (error) => {
                console.log(error);
            }
        );
    };

    const getMonthlyLeaderBoard = (offset, limit) => {
        MonthlyLeaderBoardApi(
            offset,
            limit,
            (response) => {
                setTableData(response.data.my_rank, response.data.other_users_rank,response.total);
            },
            (error) => {
                console.log(error);
            }
        );
    };

    const getGlobleLeaderBoard = (offset, limit) => {
        GlobleLeaderBoardApi(
            offset,
            limit,
            (response) => {
                setTableData(response.data.my_rank, response.data.other_users_rank,response.total
                    );
            },
            (error) => {
                console.log(error);
            }
        );
    };

    const fetchData = (category, limit, offset) => {
        limit = limit ? limit : 10;
        offset = offset ? offset : 0;
        if (category === "Daily") {
            getDailyLeaderBoard(offset, limit);
        } else if (category === "Monthly") {
            getMonthlyLeaderBoard(offset, limit);
        } else {
            getGlobleLeaderBoard(offset, limit);
        }
    };

    const setTableData = (myRank, otherusers_rank,allData) => {
        setLeaderBoard({ my_rank: myRank, other_users_rank: otherusers_rank,total:allData });
    };

    const handleCategoryChange = (category) => {
        setCategory(category);
        setLimit(10);
        setOffset(0);
        fetchData(category, limit, offset);
    };

    const changePage = (page) => {
        let offset = limit * page - limit;
        fetchData(category, limit, offset);
    };

    useEffect(() => {
        getDailyLeaderBoard(0, 10);
    }, []);

    return (
        <React.Fragment>
            <SEO title={t("LeaderBoard")} />
            <Breadcrumb title={t("LeaderBoard")} content={t("Home")} contentTwo={t("LeaderBoard")} />

            <div className="LeaderBoard">
                <div className="container">
                    <div className="row morphisam">
                        <div className="col-md-4 col-12 d-flex align-items-center">
                            <h5>{t("LeaderBoard")}</h5>
                        </div>
                        <div className="col-md-8 col-12">
                            <div className="row">
                                <div className="two_content_data">
                                    <div className="sorting_area">
                                        {/* <span>{t("Sort")} :</span> */}
                                        <Select defaultValue="Daily" className="selectvalue" onChange={handleCategoryChange}>
                                            <Option value="Daily">{t("Daily")}</Option>
                                            <Option value="Monthly">{t("Monthly")}</Option>
                                            <Option value="Global">{t("Global")}</Option>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="table_content mt-3">
                            <ul className="first_three_data row">
                                <div className="col-lg-4 col-md-4 col-12">
                                    {/* third winner */}
                                    {leaderBoard.other_users_rank &&
                                        leaderBoard.other_users_rank.slice(2, 3).map((data, index) => {
                                            return (
                                                <>
                                                    <li className="third_data" key={index}>
                                                        <div className="Leaf_img">
                                                            <img className="leftleaf" src={process.env.PUBLIC_URL + "/images/leaderboard/smallleftleaf.svg"} alt="leaf" />
                                                            <img className="data_profile" src={data.profile} alt="third" onError={imgError} />
                                                            <img className="rightleaf" src={process.env.PUBLIC_URL + "/images/leaderboard/smallrightleaf.svg"} alt="leaf" />
                                                        </div>

                                                        <h5 className="data_nam">{data.name}</h5>
                                                        <p className="data_score">{data.score}</p>
                                                        <span className="data_rank">3</span>
                                                    </li>
                                                </>
                                            );
                                        })}
                                </div>

                                <div className="col-lg-4 col-md-4 col-12">
                                    {/* first winner */}
                                    {leaderBoard.other_users_rank &&
                                        leaderBoard.other_users_rank.slice(0, 1).map((data, index) => {
                                            return (
                                                <>
                                                    <li className="first_data" key={index}>
                                                        <img className="crown" src={process.env.PUBLIC_URL + "/images/leaderboard/crown.svg"} alt="" />
                                                        <div className="Leaf_img">
                                                            <img className="leftleaf" src={process.env.PUBLIC_URL + "/images/leaderboard/bigleafleft.svg"} alt="leaf" />
                                                            <img className="data_profile" src={data.profile} alt="first" onError={imgError} />
                                                            <img className="rightleaf" src={process.env.PUBLIC_URL + "/images/leaderboard/bigrightleaf.svg"} alt="leaf" />
                                                        </div>
                                                        <h5 className="data_nam">{data.name}</h5>
                                                        <p className="data_score">{data.score}</p>
                                                        <span className="data_rank">1</span>
                                                    </li>
                                                </>
                                            );
                                        })}
                                </div>
                                <div className="col-lg-4 col-md-4 col-12">
                                    {/* second winner */}
                                    {leaderBoard.other_users_rank &&
                                        leaderBoard.other_users_rank.slice(1, 2).map((data, index) => {
                                            return (
                                                <>
                                                    <li className="second_data" key={index}>
                                                        <div className="Leaf_img">
                                                            <img className="leftleaf" src={process.env.PUBLIC_URL + "/images/leaderboard/smallleftleaf.svg"} alt="leaf" />
                                                            <img className="data_profile" src={data.profile} alt="second" onError={imgError} />
                                                            <img className="rightleaf" src={process.env.PUBLIC_URL + "/images/leaderboard/smallrightleaf.svg"} alt="leaf" />
                                                        </div>
                                                        <h5 className="data_nam">{data.name}</h5>
                                                        <p className="data_score">{data.score}</p>
                                                        <span className="data_rank">2</span>
                                                    </li>
                                                </>
                                            );
                                        })}
                                </div>
                            </ul>

                            <DataTable
                                title=""
                                columns={columns}
                                data={leaderBoard && leaderBoard.other_users_rank}
                                pagination
                                highlightOnHover
                                paginationServer
                                paginationTotalRows={leaderBoard && leaderBoard.total}
                                paginationPerPage={limit}
                                paginationComponentOptions={{
                                    noRowsPerPage: true,
                                }}
                                className="dt-center"
                                onChangePage={(page) => changePage(page)}
                            />
                            {/* my rank show */}
                            <table className="my_rank_bottom">
                                <thead>
                                    <tr>
                                        <th>{t("My Rank")} </th>
                                        <th>{t("Profile")}</th>
                                        <th>{t("Player")}</th>
                                        <th>{t("Score")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="innerrank all_com"><strong>{leaderBoard.my_rank.user_rank}</strong></td>
                                        <td className="profile all_com"><img src={leaderBoard.my_rank.profile} alt="Profile" onError={imgError} /></td>
                                        <td className="player all_com"><strong>{leaderBoard.my_rank.name || leaderBoard.my_rank.email}</strong></td>
                                        <td className="score all_com"><strong>{leaderBoard.my_rank.score}</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
export default withTranslation()(LeaderBoard);
