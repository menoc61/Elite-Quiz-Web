import React from "react";
import { withTranslation } from "react-i18next";
const FunandLearnSubIntro = ({ data, active, t }) => {
  return (
    <div className="subcatintro__sec">
      <div className={`card spandiv ${active}`}>
        <div className="card__name m-auto">
          <p className="text-center  m-auto d-block">
            {data.subcategory_name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(FunandLearnSubIntro);
