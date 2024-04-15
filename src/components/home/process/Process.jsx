import React from 'react'
import line from "../../../assets/images/line.svg"
import { websettingsData } from '../../../store/reducers/webSettings'
import { useSelector } from 'react-redux'

const Process = () => {
    const websettingsdata = useSelector(websettingsData);
  return (
    <section className="work-process-one">
            <div className="shape1"></div>
          <div className="shape2">
              <img src={line} alt="#" />
          </div>
            <div className="container">
                    <div className="row">
                        <div className="title">
                            <h2>
                                <span class="left"></span>
                                {websettingsdata && websettingsdata.section3_heading }
                                <span class="right"></span>
                            </h2>
                        </div>
                    </div>
                <div className="row filter-layout masonary-layout" >

                    <div className="col-xl-3 col-lg-3 col-md-6 wow fadeInLeft animated" >
                        <div className="work-process-one__single">
                            <div className="work-process-one__single-icon">
                                <div className="inner">
                                  <img src={websettingsdata && websettingsdata.section3_title_image_desc_image1 } className='image'/>
                                </div>
                                <div className="count-box counted"></div>
                            </div>

                            <div className="work-process-one__single-content text-center">
                                <h2><a href="arbor-management.html">{websettingsdata && websettingsdata.section3_title_image_desc_title1 }</a></h2>
                                <p>{websettingsdata && websettingsdata.section3_title_image_desc_desc1 }</p>

                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-3 col-md-6 wow fadeInLeft animated" >
                        <div className="work-process-one__single style2 mt100">
                            <div className="work-process-one__single-icon">
                                <div className="inner">
                                <img src={websettingsdata && websettingsdata.section3_title_image_desc_image2 } />
                                </div>
                                <div className="count-box counted"></div>
                            </div>

                            <div className="work-process-one__single-content text-center">
                                <h2><a href="arbor-management.html">{websettingsdata && websettingsdata.section3_title_image_desc_title2 }
                                    </a></h2>
                                <p>{websettingsdata && websettingsdata.section3_title_image_desc_desc2 }</p>

                            </div>
                        </div>
                    </div>

                    <div className="col-xl-3 col-lg-3 col-md-6 wow fadeInRight animated" >
                        <div className="work-process-one__single mt50">
                            <div className="work-process-one__single-icon">
                                <div className="inner">
                                <img src={websettingsdata && websettingsdata.section3_title_image_desc_image3 } />
                                </div>
                                <div className="count-box counted"></div>
                            </div>

                            <div className="work-process-one__single-content text-center">
                                <h2><a href="arbor-management.html">{websettingsdata && websettingsdata.section3_title_image_desc_title3 }</a></h2>
                                <p>{websettingsdata && websettingsdata.section3_title_image_desc_desc3 }</p>

                            </div>
                        </div>
                    </div>



                    <div className="col-xl-3 col-lg-3 col-md-6 wow fadeInRight animated" >
                        <div className="work-process-one__single style2">
                            <div className="work-process-one__single-icon">
                                <div className="inner">
                                <img src={websettingsdata && websettingsdata.section3_title_image_desc_image4 } />
                                </div>
                                <div className="count-box counted"></div>
                            </div>

                            <div className="work-process-one__single-content text-center">
                                <h2><a href="arbor-management.html">{websettingsdata && websettingsdata.section3_title_image_desc_title4 }</a></h2>
                                <p>{websettingsdata && websettingsdata.section3_title_image_desc_desc4 }</p>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
  )
}

export default Process