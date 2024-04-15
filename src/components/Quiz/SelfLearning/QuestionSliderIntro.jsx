import React from "react";

const QuestionSliderIntro = ({ data }) => {

  return (
    <div className="subcatintro__sec">
      <div className={`card spandiv `}>
        <div className="card__name m-auto">
          <p className="text-center m-auto d-block" >{data.questions }</p>
        </div>
      </div>
    </div>
  );
};

export default QuestionSliderIntro;
