import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SEO from "../../SEO";
import Breadcrumb from "../../Breadcrumb/Breadcrumb";
import { toast } from "react-toastify";
import { withTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { LoadExamQuestion, selecttempdata } from "../../../store/reducers/tempDataSlice";
import { getexamModuleQuestionsApi } from "../../../store/actions/campaign";
import ExamQuestion from "./ExamQuestion";
import ExamScore from "./ExamScore";

const ExamModulePlay = ({ t }) => {

  let getData = useSelector(selecttempdata);

  const navigate = useNavigate();

  const TIMER_SECONDS = Number(getData.duration);

  const [questions, setQuestions] = useState([{ id: "" }]);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    if (!showScore && getData) {
      getNewQuestions(getData.id);
    }
  }, []);

   // store data get
   const userData = useSelector((state) => state.User);

  const getNewQuestions = (id) => {
    getexamModuleQuestionsApi(id,(response) => {
      let questions = response.data.map((data) => {
        return {
          ...data,
          selected_answer: "",
          isAnswered: false,
        };
      });
      setQuestions(questions);
      LoadExamQuestion(questions)
      setShowScore(false);
      setScore(0);
    }, (error) => {
      toast.error(t("No Questions Found"));
      navigate("/quiz-play");
      console.log(error);
    })
  };

  const handleAnswerOptionClick = (questions, score) => {
    setQuestions(questions);
    setScore(score);
  };

  const onQuestionEnd = (coins, quizScore) => {
    setShowScore(true);
    setCoins(coins);
    setQuizScore(quizScore);
  };


  return (
    <React.Fragment>
      <SEO title={t("Exam Module")} />
      <Breadcrumb
        title={t("Exam Module")}
        content={t("Home")}
        contentTwo={t("Exam Module")}
      />
      <div className="dashboard selflearnig-play">
        <div className="container">
          <div className="row ">
            <div className="morphisam">
              <div className="whitebackground pt-3">
                {(() => {
                  if (showScore) {
                    return (
                      <ExamScore
                        score={score}
                        totalQuestions={questions.length}
                        coins={coins}
                        quizScore={quizScore}
                        showQuestions={true}
                      />
                    );
                  } else {
                    return questions && questions.length >= 0 ? (
                      <ExamQuestion
                        questions={questions}
                        timerSeconds={TIMER_SECONDS}
                        customMinutes={true}
                        onOptionClick={handleAnswerOptionClick}
                        onQuestionEnd={onQuestionEnd}
                        showQuestions={true}
                      />
                    ) : (
                      <div className="text-center text-white">
                        <p>{"No Questions Found"}</p>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          </div>
          <span className="circleglass__after"></span>
        </div>
      </div>
    </React.Fragment>
  );
};
export default withTranslation()(ExamModulePlay);
