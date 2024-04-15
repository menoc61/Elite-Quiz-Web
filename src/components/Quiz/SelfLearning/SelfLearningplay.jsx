import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SEO from "../../SEO";
import Breadcrumb from "../../Breadcrumb/Breadcrumb";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ShowScore from "../common/ShowScore";
import ReviewAnswer from "../common/ReviewAnswer";
import { withTranslation } from "react-i18next";
import config from "../../../utils/config.js";
import { getBookmarkData } from "../../../utils";
import SelfLearningQuestions from "./SelfLearningQuestions";
import { useSelector } from "react-redux";
import { selecttempdata } from "../../../store/reducers/tempDataSlice";
import { selfQuestionsApi, UserCoinScoreApi } from "../../../store/actions/campaign";
import { updateUserDataInfo } from "../../../store/reducers/userSlice";
import { settingsData } from "../../../store/reducers/settingsSlice";
const MySwal = withReactContent(Swal);


const SelfLearningplay = ({ t }) => {

  let getData = useSelector(selecttempdata);

  const selectdata = useSelector(settingsData);

  const review_answers_deduct_coin = selectdata && selectdata.filter(item => item.type == "review_answers_deduct_coin");

  const navigate = useNavigate();

  const TIMER_SECONDS = getData && getData.timer;

  const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [reviewAnswers, setReviewAnswers] = useState(false);
  const [coins, setCoins] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    if (!showScore && getData) {
      getNewQuestions(getData.category_id, getData.subcategory_id, getData.limit);
    }
  }, []);

   // store data get
   const userData = useSelector((state) => state.User);

  const getNewQuestions = (category_id, subcategory_id, limit) => {
    selfQuestionsApi(category_id, subcategory_id, limit, (response) => {
      let bookmark = getBookmarkData();
      let questions_ids = Object.keys(bookmark).map((index) => {
        return bookmark[index].question_id;
      });

      let questions = response.data.map((data) => {
        let isBookmark = false;
        if (questions_ids.indexOf(data.id) >= 0) {
          isBookmark = true;
        } else {
          isBookmark = false;
        }
        return {
          ...data,
          isBookmarked: isBookmark,
          selected_answer: "",
          isAnswered: false,
        };
      });
      setQuestions(questions);
      setShowScore(false);
      setReviewAnswers(false);
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

  const playAgain = () => {
    if (showScore && data) {
      getNewQuestions(data.category, data.subcategory, level);
    }
  };

  const nextLevel = () => {
    if (showScore && data) {
      let temp_level = level + 1;
      setLevel(temp_level);
      getNewQuestions(data.category, data.subcategory, temp_level);
    }
  };

  const handleReviewAnswers = () => {
    MySwal.fire({
      title: t("Are you sure"),
      text:
        review_answers_deduct_coin && Number(review_answers_deduct_coin[0].message) +
        " " +
        t("Coins will be deducted from your account"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef5488",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Continue"),
      cancelButtonText: t("Cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        let coins = review_answers_deduct_coin && Number(review_answers_deduct_coin[0].message);
        if (userData.data.coins < coins) {
          toast.error(t("You Don't have enough coins"));
          return false;
        }
        let status = 1;
        UserCoinScoreApi("-" + coins, null, null, "SelfLearning Review Answer", status, (response) => {
          setReviewAnswers(true);
          setShowScore(false);
          updateUserDataInfo(response.data)
        }, (error) => {
          Swal.fire(t("OOps"), t("Please Try again"), "error");
          console.log(error);
        })
      }
    });
  };

  const handleReviewAnswerBack = () => {
    setShowScore(true);
    setReviewAnswers(false);
  };

  return (
    <React.Fragment>
      <SEO title={t("Self Learning")} />
      <Breadcrumb
        title={t("Self Learning")}
        content={t("Home")}
        contentTwo={t("Self Learning")}
      />
      <div className="dashboard selflearnig-play">
        <div className="container">
          <div className="row ">
            <div className="morphisam">
              <div className="whitebackground pt-3">
                {(() => {
                  if (showScore) {
                    return (
                      <ShowScore
                        score={score}
                        totalQuestions={questions.length}
                        onPlayAgainClick={playAgain}
                        onReviewAnswersClick={handleReviewAnswers}
                        onNextLevelClick={nextLevel}
                        coins={coins}
                        quizScore={quizScore}
                        showQuestions={true}
                        reviewAnswer={true}
                        playAgain={false}
                      />
                    );
                  } else if (reviewAnswers) {
                    return (
                      <ReviewAnswer
                        reportquestions={true}
                        questions={questions}
                        goBack={handleReviewAnswerBack}
                      />
                    );
                  } else {
                    return questions && questions.length >= 0 ? (
                      <SelfLearningQuestions
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
export default withTranslation()(SelfLearningplay);
