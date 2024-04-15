import React, { useState } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { decryptAnswer } from "../../../utils";
import { useSelector } from "react-redux";
import { sysConfigdata } from "../../../store/reducers/settingsSlice";

function GuessthewordReviewAnswer({ questions, goBack, t }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);


   // store data get
  const userData = useSelector((state) => state.User);

  const systemconfig = useSelector(sysConfigdata);

  const previousQuestion = () => {
    const prevQuestion = currentQuestion - 1;
    if (prevQuestion >= 0) {
      if (prevQuestion > 0) {
        setDisablePrev(false);
      } else {
        setDisablePrev(true);
      }
      setDisableNext(false);
      setCurrentQuestion(prevQuestion);
    }
  };

  const nextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      if (nextQuestion + 1 === questions.length) {
        setDisableNext(true);
      } else {
        setDisableNext(false);
      }
      setDisablePrev(false);
      setCurrentQuestion(nextQuestion);
    }
  };

  const setAnswerStatusClass = (option) => {
    let decryptedAnswer = decryptAnswer(
      questions[currentQuestion].answer,
      userData.data.firebase_id
    );
    if (decryptedAnswer === option) {
      return "bg-success";
    } else if (questions[currentQuestion].selected_answer === option) {
      return "bg-danger";
    }
  };

  // decrypt answer
  let decryptedAnswer = decryptAnswer(
    questions[currentQuestion].answer,
    userData.data.firebase_id
  );
  
  return (
    <React.Fragment>
      <div className="text-center">
        <h4 className="">{t("Review Answers")}</h4>
      </div>
      <div className="inner__headerdash">
        <div className="total__out__leveldata coinsdata">
          <h5 className="inner__total-leveldata text-white">
            {currentQuestion + 1} | {questions.length}
          </h5>
        </div>

      </div>

      <div className="content__text">
        <p className="question-text">{questions[currentQuestion].question}</p>
      </div>

      {questions[currentQuestion].image ? (
        <div className="imagedash">
          <img src={questions[currentQuestion].image} alt="" />
        </div>
      ) : (
        ""
      )}

      {/* review answer show  */}
      <div className="row text-center text-dark">
        {(() => {
          if (questions[currentQuestion].selected_answer == decryptedAnswer) {
            return <div> {`correct answer : ${decryptedAnswer}`}</div>;
          } else {
            return (
              <>
                <div>{`Your Answer :${questions[currentQuestion].selected_answer}`}</div>
                <div> {`Correct Answer : ${decryptedAnswer}`}</div>
              </>
            );
          }
        })()}
      </div>

      <div className="row">
        {questions[currentQuestion].optiona ? (
          <div className="col-md-6 col-12">
            <div className="inner__questions">
              <button
                className={`btn button__ui w-100 ${setAnswerStatusClass("a")}`}
              >
                {questions[currentQuestion].optiona}
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        {questions[currentQuestion].optionb ? (
          <div className="col-md-6 col-12">
            <div className="inner__questions">
              <button
                className={`btn button__ui w-100 ${setAnswerStatusClass("b")}`}
              >
                {questions[currentQuestion].optionb}
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        {questions[currentQuestion].question_type === "1" ? (
          <>
            {questions[currentQuestion].optionc ? (
              <div className="col-md-6 col-12">
                <div className="inner__questions">
                  <button
                    className={`btn button__ui w-100 ${setAnswerStatusClass(
                      "c"
                    )}`}
                  >
                    {questions[currentQuestion].optionc}
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
            {questions[currentQuestion].optiond ? (
              <div className="col-md-6 col-12">
                <div className="inner__questions">
                  <button
                    className={`btn button__ui w-100 ${setAnswerStatusClass(
                      "d"
                    )}`}
                  >
                    {questions[currentQuestion].optiond}
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
            {systemconfig &&
            systemconfig.option_e_mode &&
            questions[currentQuestion].optione ? (
              <div className="row d-flex justify-content-center">
                <div className="col-md-6 col-12">
                  <div className="inner__questions">
                    <button
                      className={`btn button__ui w-100 ${setAnswerStatusClass(
                        "e"
                      )}`}
                    >
                      <div className="row">
                        <div className="col">
                          {questions[currentQuestion].optione}
                        </div>
                        {questions[currentQuestion].probability_e ? (
                          <div className="col text-end">
                            {questions[currentQuestion].probability_e}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
        {!questions[currentQuestion].selected_answer ? (
          <div className="text-end">
            <span>*{t("Not Attempted")}</span>
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="dashoptions">
        <div className="fifty__fifty">
          <button
            className="btn btn-primary"
            onClick={previousQuestion}
            disabled={disablePrev}
          >
            &lt;
          </button>
        </div>
        <div className="resettimer">
          <button className="btn btn-primary" onClick={goBack}>
            {t("Back")}
          </button>
        </div>
        <div className="skip__questions">
          <button className="btn btn-primary" onClick={nextQuestion} disabled={disableNext}>
            &gt;
          </button>
        </div>
      </div>
      <div className="text-center text-white">
        <small>
          {questions[currentQuestion].note ? (
            <p>{t("Note") + " : " + questions[currentQuestion].note}</p>
          ) : (
            ""
          )}
        </small>
      </div>
    </React.Fragment>
  );
}

GuessthewordReviewAnswer.propTypes = {
  questions: PropTypes.array.isRequired,
  goBack: PropTypes.func,
};

export default withTranslation()(GuessthewordReviewAnswer);
