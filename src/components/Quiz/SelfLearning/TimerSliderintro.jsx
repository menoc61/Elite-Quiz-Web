import React from "react";

const TimerSliderintro = (data) => {
  return (
    <div className="subcatintro__sec">
      <div className={`card spandiv `}>
        <div className="card__name m-auto">
          <p className="text-center m-auto d-block">
            {data.data}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimerSliderintro;
