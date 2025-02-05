import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SEO from "../SEO";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ShowScore from "./common/ShowScore";
import Question from "./common/Question";
import ReviewAnswer from "./common/ReviewAnswer";
import { withTranslation } from "react-i18next";
import { getBookmarkData } from "../../utils";
import { useSelector } from "react-redux";
import { settingsData, sysConfigdata } from "../../store/reducers/settingsSlice";
import { QuestionsApi, UserCoinScoreApi } from "../../store/actions/campaign";
import { selecttempdata } from "../../store/reducers/tempDataSlice";
import { updateUserDataInfo, updateUserDatainfo } from "../../store/reducers/userSlice";
const MySwal = withReactContent(Swal);


const DashboardPlay = ({ t }) => {
  const navigate = useNavigate();

  let getData = useSelector(selecttempdata);

  const selectdata = useSelector(settingsData);

  const review_answers_deduct_coin = selectdata && selectdata.filter(item => item.type == "review_answers_deduct_coin");

  const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [reviewAnswers, setReviewAnswers] = useState(false);
  const [coins, setCoins] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (!showScore && getData) {
      getNewQuestions(getData.category, getData.subcategory, getData.level);
    }
  }, []);

  // store data get
  const userData = useSelector((state) => state.User);
  const systemconfig = useSelector(sysConfigdata);

  const TIMER_SECONDS = parseInt(systemconfig.quiz_zone_duration);

  const getNewQuestions = (category_id, subcategory_id, level) => {
    setLevel(level);
    if (category_id && subcategory_id && level) {
      QuestionsApi(null, subcategory_id, level, (response) => {
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
          // console.log("que",questions)
          setQuestions(questions);
          setShowScore(false);
          setReviewAnswers(false);
          setScore(0);

      }, (error) => {
        toast.error(t("No Questions Found"));
        navigate("/quiz-play");
        console.log(error);
      })
    } else {
      QuestionsApi(category_id, null, level, (response) => {
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
        console.log(error)
      })
    }
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
    if (showScore && getData) {
      getNewQuestions(getData.category, getData.subcategory, level);
    }
  };

  const nextLevel = () => {
    if (showScore && getData) {
      let temp_level = level + 1;
      setLevel(temp_level);
      getNewQuestions(getData.category, getData.subcategory, temp_level);
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
        UserCoinScoreApi("-" + coins, null, null, "Review Answers", status, (response) => {
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
      <SEO title={t("DashboardPlay")} />
      <Breadcrumb title={t("Quiz Play")} content={t("Home")} contentTwo={t("Quiz Play")}/>
      <div className="dashboard">
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
                        currentLevel={level}
                        maxLevel={getData.maxLevel}
                        showQuestions={true}
                        reviewAnswer={true}
                        playAgain={true}
                        nextlevel={true}
                      />
                    );
                  } else if (reviewAnswers) {
                    return (
                      <ReviewAnswer
                      reviewlevel={true}
                      reportquestions={true}
                        questions={questions}
                        goBack={handleReviewAnswerBack}
                      />
                    );
                  } else {

                    return questions && questions.length >= 0 ? (
                      <Question
                        questions={questions}
                        timerSeconds={TIMER_SECONDS}
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
export default withTranslation()(DashboardPlay);
