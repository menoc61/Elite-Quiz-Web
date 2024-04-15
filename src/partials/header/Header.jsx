import { Fragment, useState, useEffect } from "react";
import Logo from "../../components/logo/Logo";
import NavBar from "../../components/NavBar/NavBar";
import { useSelector } from "react-redux";
import { websettingsData } from "../../store/reducers/webSettings";
import Sidebar from "../../components/NavBar/Sidebar";


const Header = () => {
    const [isActive, setIsActive] = useState(false);


    const [scroll, setScroll] = useState(0);
    const [headerTop, setHeaderTop] = useState(0);
    const [stickylogo, setStickyLogo] = useState(false);

    // logo
    const websettingsdata = useSelector(websettingsData);

    useEffect(() => {
        const header = document.querySelector(".header-section");
        setHeaderTop(header.offsetTop);
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleScroll = () => {
        setScroll(window.scrollY)
        if (window.scrollY > 20) {
            setStickyLogo(true)
        }else {
            setStickyLogo(false)
        }
    };

    // sticky logo
    const stickylogoimage = websettingsdata && websettingsdata.sticky_header_logo;

    // logo
    const logoimage = websettingsdata && websettingsdata.header_logo;


    return (
        <Fragment>
            <div className={`header-section header-transparent sticky-header section ${scroll > headerTop ? "is-sticky" : ""}`}>
                <div className="header-inner">
                    <div className="container position-relative">
                        <div className="row justify-content-between align-items-center">
                            <div className="col-xl-2 col-auto order-0">
                                {stickylogo ?
                                    <Logo image={stickylogoimage} isActive={isActive} setIsActive={setIsActive}/>
                                    :
                                    <Logo image={logoimage} isActive={isActive} setIsActive={setIsActive}/>
                                }
                            </div>
                            <div className="col-auto col-xl d-flex align-items-center justify-content-xl-center justify-content-end order-2 order-xl-1">
                                <div className="menu-column-area d-none d-xl-block position-static">
                                    <NavBar />
                                </div>

                                <div className="header-mobile-menu-toggle d-xl-none ml-sm-2">
                                     <button
                                        onClick={() => setIsActive(true)}
                                        className="tp-menu-toggle toggle"
                                        >
                                        <i className="icon-top"></i>
                                        <i className="icon-middle"></i>
                                        <i className="icon-bottom"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* side bar start */}
                <Sidebar isActive={isActive} setIsActive={setIsActive} image={logoimage}/>
            {/* side bar end */}
        </Fragment>
    );
};

export default Header;
