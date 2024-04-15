import React, { useEffect, useState } from "react";
import { t } from "i18next";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import SEO from "../components/SEO";
import { getTrackerDataApi } from "../store/actions/campaign";
import { withTranslation } from "react-i18next";
import ReactPaginate from "react-paginate";
import Skeleton from "react-loading-skeleton";

const CoinHistory = () => {

    // state
    const [trackerData, setTrackerData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const dataPerPage = 10; // number of posts per page
    const pagesVisited = currentPage * dataPerPage;

     // handle page change
     const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    // tracker data
    useEffect(() => {
        getTrackerDataApi(
            "",
            "",
            (response) => {
                const trackerdata = response.data;
                setTrackerData(trackerdata);
                setIsLoading(false);
            },
            (error) => {
                console.log(error);
                setIsLoading(false);
            }
        );
    }, []);

    // render data of points based on status and welcome bonus with type check
    const renderPoints = (data) => {
        if (data.type === "welcomeBonus") {
            return <p className="plus">+{data.points}</p>;
        } else if (data.status === "0") {
            return <p className="plus">+{data.points}</p>;
        } else {
            return <p className="minus">{data.points}</p>;
        }
    };

    // render date in correct format
    const renderDate = (data) => {
        const getDateFormat = data.date.split("-");
        const newDateFormat = getDateFormat.reverse().join("-");
        return newDateFormat;
    }

    // slice the array to get the current posts
    const currentData = trackerData.slice(pagesVisited, pagesVisited + dataPerPage);

    return (
        <>
            <SEO title={t("Coin History")} />
            <Breadcrumb title={t("Coin History")} content={t("Home")} contentTwo={t("Coin History")} />
            <section className="coinhistory">
                <div className="container">
                    <div className="row morphisam">
                        {isLoading ? (
                            // Show skeleton loading when data is being fetched
                            <div className="col-12 ">
                                <Skeleton height={20} count={5} />
                            </div>
                        ) : (
                            // Show data if available
                            currentData.length > 0 ? (
                                currentData.map((data, index) => (
                                    <div className="col-md-6 col-12" key={index}>
                                        <div className="coin_data">
                                            <div className="inner_data">
                                                <div className="title">
                                                    <p>
                                                        <strong>{t(data.type)}</strong>
                                                    </p>
                                                    <span>{renderDate(data)}</span>
                                                </div>
                                                <div className="points">
                                                    {renderPoints(data)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Show "No data found" message if no data is available
                                <div className="col-12">
                                    <p className="text-center">{t("No Data Found")}</p>
                                </div>
                            )
                        )}
                        <ReactPaginate
                            previousLabel={t("previous")}
                            nextLabel={t("next")}
                            pageCount={Math.ceil(trackerData.length / dataPerPage)}
                            onPageChange={handlePageChange}
                            containerClassName={"pagination"}
                            previousLinkClassName={"pagination__link"}
                            nextLinkClassName={"pagination__link"}
                            disabledClassName={"pagination__link--disabled"}
                            activeClassName={"pagination__link--active"}
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

export default withTranslation()(CoinHistory);
