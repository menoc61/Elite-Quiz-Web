import React, { useEffect, useState } from 'react'
import { t } from 'i18next'
import { withTranslation } from 'react-i18next'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import SEO from '../components/SEO'
import { useSelector } from 'react-redux'
import { badgesData, LoadNewBadgesData } from '../store/reducers/badgesSlice'
import Skeleton from 'react-loading-skeleton'
import { UserCoinScoreApi, getusercoinsApi, setBadgesApi } from '../store/actions/campaign'
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip'
import { updateUserDataInfo } from '../store/reducers/userSlice'

const Badges = () => {

  const badgesdata = useSelector(badgesData);

  const power_elite_status = badgesdata && badgesdata.data.power_elite.status;

  const power_elite_coin = badgesdata && badgesdata.data.power_elite.badge_reward;

    // const [badges, setBadges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
       setIsLoading(false);
    }, []);

  // power elite badge
  useEffect(() => {
    const dataFiltered = Object.values(badgesdata.data).filter(badge => badge.status === '1');
    const dataFilteredLength = dataFiltered.length;
    if (power_elite_status === "0" && dataFilteredLength == 10) {
        setBadgesApi("power_elite", () => {
          LoadNewBadgesData("power_elite","1")
          toast.success(t("You Won Power Elite Badge"));
          const status = 0;
          UserCoinScoreApi(power_elite_coin, null, null, (t("power elite badge reward")), status, (response) => {
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
      }
  }, []);

  return (
    <>
        <SEO title={t("Badges")} />
          <Breadcrumb title={t("Badges")} content={t("Home")} contentTwo={t("Badges")} />
          <section className='badges'>
              <div className="container">
                  <div className="row">
                      {isLoading ? (
                          // Show skeleton loading when data is being fetched
                          <div className="col-12 ">
                              <Skeleton height={20} count={5} />
                          </div>
                      ) : (
                          // Show data if available
                          badgesdata.data && [
                            ...Object.values(badgesdata.data).filter((data) => data.status === "1"),
                            ...Object.values(badgesdata.data).filter((data) => data.status === "0"),
                          ].map((data, index) => (
                              <div className="col-md-4 col-12" key={index}>
                              <div className="badges_data" data-tooltip-id="my-tooltip" data-tooltip-content={`${data.badge_note}`}>
                                      <div className="inner_image">
                                          {data.status === "0" ?
                                            <span className='dummy_background' />
                                              :
                                            <span className='dummy_background_color'/>
                                          }
                                        <img src={data.badge_icon} alt="badges" />
                                        {/* <span className='counter_badge'>{data.badge_reward}</span> */}
                                      </div>
                                      <p>{data.badge_label}</p>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
        </div>
        <Tooltip id="my-tooltip" />
          </section>
    </>
  )
}

export default withTranslation()(Badges);