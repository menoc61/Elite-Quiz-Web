import { useEffect } from "react";
import { useLocation } from "react-router-dom";


const NavScrollTop = (props) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return props.children;
};

export default NavScrollTop;