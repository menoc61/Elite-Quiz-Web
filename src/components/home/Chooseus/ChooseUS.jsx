import React from 'react'
import { websettingsData } from '../../../store/reducers/webSettings'
import { useSelector } from 'react-redux'

const ChooseUS = () => {

const websettingsdata = useSelector(websettingsData);


  return (
    <section className='chooseus py-5'>
        <div className="container">
            <div className="row">
                <div className="title">
                      <h2>
                          <span className="left"></span>{websettingsdata && websettingsdata.section1_heading }<span className="right"></span>
                      </h2>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-12">
                    <div className="why-choose-one__inner">
                        <div className="col-xl-4 col-12">
                            <ul className='tab-buttons clearfix list-unstyled'>
                                <li className='tab-btn wow fadeInLeft animated'>{websettingsdata && websettingsdata.section1_title1 }</li>
                                <li className='tab-btn wow fadeInLeft animated'>{websettingsdata && websettingsdata.section1_title2 }</li>
                                <li className='tab-btn wow fadeInLeft animated'>{websettingsdata && websettingsdata.section1_title3 }</li>
                            </ul>
                        </div>
                        <div className="col-xl-8 col-12">
                            <div className="tabs-content">
                                <div className="tabs-content__inner">
                                    <div className="tabs-content__inner-bg" style={{ backgroundImage: `url(${websettingsdata && websettingsdata.section1_cover_image})` }}>

                                    </div>
                                    <div className="tabs-content__list clearfix">
                                    <ul className="clearfix">
                                        <li className='wow fadeInRight animated'>
                                            <div className="inner text-center">
                                                <div className="icon-box">
                                                    <img src={websettingsdata && websettingsdata.section1_image_title_image1}/>
                                                </div>
                                                <h4>
                                                    <p>{websettingsdata && websettingsdata.section1_image_title_title1 }
                                                    </p>
                                                </h4>
                                            </div>
                                        </li>

                                        <li className='mt30 wow fadeInRight animated'>
                                            <div className="inner text-center">
                                                <div className="icon-box">
                                                <img src={websettingsdata && websettingsdata.section1_image_title_image2}/>
                                                </div>
                                                    <h4>
                                                        <p>{websettingsdata && websettingsdata.section1_image_title_title2 }
                                                        </p>
                                                    </h4>
                                            </div>
                                        </li>

                                        <li className='wow fadeInRight animated'>
                                            <div className="inner text-center">
                                                <div className="icon-box">
                                                <img src={websettingsdata && websettingsdata.section1_image_title_image3}/>
                                                </div>
                                                    <h4>
                                                        <p>{websettingsdata && websettingsdata.section1_image_title_title3 }
                                                        </p>
                                                    </h4>
                                            </div>
                                        </li>

                                        <li  className='mt30 wow fadeInRight animated'>
                                            <div className="inner text-center">
                                                <div className="icon-box">
                                                <img src={websettingsdata && websettingsdata.section1_image_title_image4}/>
                                                </div>
                                                    <h4>
                                                        <p>{websettingsdata && websettingsdata.section1_image_title_title4 }
                                                        </p>
                                                    </h4>
                                            </div>
                                        </li>
                                    </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default ChooseUS