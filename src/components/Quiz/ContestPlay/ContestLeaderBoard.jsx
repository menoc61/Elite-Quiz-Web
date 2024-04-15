import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { withTranslation } from "react-i18next";
import SEO from "../../SEO";
import Breadcrumb from "../../Breadcrumb/Breadcrumb";
import { toast } from "react-toastify";
import { ContestLeaderboardApi } from "../../../store/actions/campaign";
import { contestleaderboard } from "../../../store/reducers/tempDataSlice";
import { useSelector } from "react-redux";
import { imgError } from "../../../utils";

const ContestLeaderBoard = ({ t }) => {

  let getData = useSelector(contestleaderboard);

  const [leaderBoard, setLeaderBoard] = useState({
    myRank: "",
    data: "",
    total: "",
  });

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
            <img
              src={process.env.PUBLIC_URL + "/images/user.svg"}
              className="w-25"
              alt={row.name}
            ></img>
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



  useEffect(() => {
    ContestLeaderboardApi(getData.past_id, (response) => {
      setTableData(response, response.total);
    }, (error) => {
      toast.error("No Data Found")
      console.log(error)
    })
  }, []);

  const setTableData = (data, total) => {
    setLeaderBoard({ myRank: data.my_rank, data: data.data, total: total });
  };

  return (
    <React.Fragment>
      <SEO title={t("Contest LeaderBoard")} />
      <Breadcrumb title={t("Contest LeaderBoard")} content={t("Home")} contentTwo={t("Contest LeaderBoard")}/>

      <div className="LeaderBoard">
        <div className="container">
          <div className="row morphisam">
            <div className="table_content mt-3">
              <DataTable
                title=""
                columns={columns}
                data={leaderBoard && leaderBoard.data}
                pagination={false}
                highlightOnHover
                paginationServer
                paginationTotalRows={leaderBoard && leaderBoard.total}
                paginationComponentOptions={{
                  noRowsPerPage: true,
                }}
                className="dt-center"
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
                          <td className="innerrank all_com"><strong>{leaderBoard.myRank.user_rank}</strong></td>
                          <td className="profile all_com"><img src={leaderBoard.myRank.profile} alt="Profile" onError={imgError} /></td>
                          <td className="player all_com"><strong>{leaderBoard.myRank.name || leaderBoard.myRank.email}</strong></td>
                          <td className="score all_com"><strong>{leaderBoard.myRank.score}</strong></td>
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
export default withTranslation()(ContestLeaderBoard);
