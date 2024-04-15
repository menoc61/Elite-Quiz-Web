import React, { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import SEO from "../../SEO";
import Breadcrumb from "../../Breadcrumb/Breadcrumb";
import { toast } from "react-toastify";
import { withTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import GroupQuestions from "../GroupBattle/GroupQuestions";
import GroupBattleScore from "./GroupBattleScore";
import { QuestionsByRoomIdApi } from "../../../store/actions/campaign";
import { selecttempdata } from "../../../store/reducers/tempDataSlice";
import { useSelector } from "react-redux";
import { settingsData } from "../../../store/reducers/settingsSlice";

const GroupPlay = ({ t }) => {

  const navigate = useNavigate();

  const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);

  const [showScore, setShowScore] = useState(false);

  const [score, setScore] = useState(0);

  const [quizScore, setQuizScore] = useState(0);

  const [coins, setCoins] = useState(0);

  let getData = useSelector(selecttempdata);

  const selectdata = useSelector(settingsData);

  const random_battle_seconds = selectdata && selectdata.filter(item => item.type == "random_battle_seconds");

  const TIMER_SECONDS = Number(random_battle_seconds[0].message);

  useEffect(() => {
    if (getData) {
      getNewQuestions(getData.roomCode);
    }
  }, []);

  const getNewQuestions = (match_id) => {
    QuestionsByRoomIdApi(match_id, (response) => {
      let questions = response.data.map((data) => {
        return {
          ...data,
          selected_answer: "",
          isAnswered: false,
        };
      });
      setQuestions(questions);
      setShowScore(false);
      setScore(0);
    }, (error) => {
      toast.error(t("No Questions Found"));
      navigate("/quiz-play");
      console.log(error)
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
      <SEO title={t("Group Battle")} />
      <Breadcrumb
        title={t("Group Battle")}
        content={t("Home")}
        contentTwo={t("Group Battle")}
      />
      <div className="funandlearnplay dashboard battlerandom">
        <div className="container">
          <div className="row ">
            <div className="morphisam">
              <div className="whitebackground pt-3">
                <>
                  {(() => {
                    if (showScore) {
                      return (
                        <GroupBattleScore
                          score={score}
                          totalQuestions={questions.length}
                          quizScore={quizScore}
                          playAgain={false}
                          coins={coins}
                        />
                      );
                    }else {
                      return questions && questions.length > 0 && questions[0].id !== "" ? (
                        <GroupQuestions
                          questions={questions}
                          timerSeconds={TIMER_SECONDS}
                          onOptionClick={handleAnswerOptionClick}
                          onQuestionEnd={onQuestionEnd}
                        />
                      ) : (
                        <div className="text-center text-white">
                          <Skeleton count={5}/>
                        </div>
                      );
                    }
                  })()}
                </>
              </div>
            </div>
          </div>
          <span className="circleglass__after"></span>
        </div>
      </div>
    </React.Fragment>
  );
};
export default withTranslation()(GroupPlay);
