import React from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Loadtempdata } from "../../../store/reducers/tempDataSlice";
const FunandLearnIntro = ({ data, active, t, url }) => {

  const handleSubcategory = (subdata) => {
    Loadtempdata(subdata);
  }

  return (
    <div className="subcatintro__sec">
      <Link to={{ pathname: url}} onClick={() => handleSubcategory(data)}>
        <div className={`card spandiv ${active}`}>
          <div className="card__name m-auto">
            <p className="text-center m-auto d-block">
              {data.title}
            </p>
            <p className="text-center m-auto d-block fun_learn_hide">
              {t("Questions")} : {data.no_of_que}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default withTranslation()(FunandLearnIntro);
