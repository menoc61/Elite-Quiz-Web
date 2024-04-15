import Logo from "../logo/Logo";
import MobileMenus from "./sub-component/MobileMenus";

const Sidebar = ({ isActive, setIsActive, image }) => {
  return (
    <>
      <div
        className={` tpsideinfo tp-side-info-area ${
          isActive ? "tp-sidebar-opened" : ""
        }`}
      >
        <div className="mobile-menu-header">
          <div className="mobile-menu-logo">
            <Logo image={image} isActive={isActive} setIsActive={setIsActive} />
          </div>
          <div className="mobile-menu-close">
            <button className=" toggle" onClick={() => setIsActive(false)}>
              <i className="icon-top"></i>
              <i className="icon-bottom"></i>
            </button>
          </div>
        </div>

        <div className="mobile-menu mean-container d-block d-xl-none">
          <div className="mean-bar">
            <MobileMenus isActive={isActive} setIsActive={setIsActive } />
          </div>
        </div>
      </div>

      <div
        onClick={() => setIsActive(false)}
        className={`body-overlay ${isActive ? "opened" : ""}`}
      ></div>
    </>
  );
};

export default Sidebar;
