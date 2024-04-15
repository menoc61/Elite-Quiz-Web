import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Loadtempdata } from "../../../store/reducers/tempDataSlice";

const Mathmaniaintro = ({ data, active, url, }) => {

  const subdataload = (alldata) => {
    Loadtempdata(alldata);
  }

  return (
    <div className="subcatintro__sec">
    <Link to={{ pathname: url}} onClick={() => subdataload(data)}>
      <div className={`card spandiv ${active}`}>
        <div className="card__name m-auto">
          <p className="text-center m-auto d-block">
            {data.subcategory_name}
          </p>
        </div>
      </div>
    </Link>
  </div>
  );
};

export default withTranslation()(Mathmaniaintro);
