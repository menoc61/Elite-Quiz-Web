import { deleteAccountApi, getAudioquestionsApi, getBattleStaticticsApi, getBookmarkApi, getCategoriesApi, getContestApi, getContestLeaderboardApi, getcontestQuestionsApi, getcreateMultiRoomApi, getDailyLeaderBoardApi, getDailyQuizApi, getExamModuleApi, getExamModuleQuestionsApi, getfunandlearn, getfunandlearnquestions, getGlobleLeaderBoardApi, getguessthewordApi, getLevelDataApi, getMathQuestionsApi, getMonthlyLeaderBoardApi, getNotificationsApi, getPaymentRequestApi, getQuestionsApi, getQuestionsByRoomIdApi, getRandomQuestionsApi, getreportQuestionApi, getselfQuestionsApi, getSliderApi, getSubcategoriesApi, getTableTrackerDataApi, gettrueandfalsequestions, getUserBadgesApi, getUserCoinsApi, reportQuestionApi, setBattleStaticticsApi, setBookmarkApi, setContestLeaderboardApi, setExamModuleResultApi, setLevelDataApi, setPaymentRequestApi, setquizCategoriesApi, setUserBadgesApi, setUserCoinScoreApi, setUserStatisticsApi } from "../../utils/api"
import { store } from "../store"
import { apiCallBegan } from "./apiActions"

// delete user account
export const deleteuserAccountApi = (onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...deleteAccountApi(),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// notification
export const notificationApi = (id, order, offset, limit,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getNotificationsApi(id, order, offset, limit),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// slider api
export const sliderApi = (language_id,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getSliderApi(language_id),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// categories api
export const categoriesApi = (type, onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getCategoriesApi(type),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get subcategroies by main categories
export const subcategoriesApi = (category_id, subcategory_id, onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getSubcategoriesApi(category_id, subcategory_id),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get level data from subcategories or categories
export const levelDataApi = (category_id, subcategory_id,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getLevelDataApi(category_id, subcategory_id),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// set level data from subcategory and category
export const leveldataApi = (category_id, subcategory_id, level,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...setLevelDataApi(category_id, subcategory_id, level),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get daily Quiz
export const dailyQuizApi = (onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getDailyQuizApi(),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get true and false
export const trueandfalsequestionsApi = (type, limit, onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...gettrueandfalsequestions(type, limit),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get fun and learn
export const getfunandlearnApi = (type, type_id, onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getfunandlearn(type, type_id),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get fun and learn questions
export const funandlearnquestionsApi = (fun_n_learn_id, onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getfunandlearnquestions(fun_n_learn_id),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get guess the word
export const guessthewordApi = (type, type_id, onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getguessthewordApi(type, type_id),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get self Learning questions
export const selfQuestionsApi = (category, subcategory, limit, onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getselfQuestionsApi(category, subcategory, limit),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get Contest Play
export const ContestPlayApi = (onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getContestApi(),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get contest questions
export const contestQuestionsApi = (contest_id,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getcontestQuestionsApi(contest_id),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get contest leaderboard
export const ContestLeaderboardApi = (contest_id,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getContestLeaderboardApi(contest_id),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// set contest leaderboard
export const setcontestleaderboardApi = (contest_id, questions_attended, correct_answers, score,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...setContestLeaderboardApi(contest_id, questions_attended, correct_answers, score),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get questions api
export const QuestionsApi = (category_id, subcategory_id, level,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getQuestionsApi(category_id, subcategory_id, level),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get random questions api
export const RandomQuestionsApi = (match_id, category, destroy_match,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getRandomQuestionsApi(match_id, category, destroy_match),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get questions by room id
export const QuestionsByRoomIdApi = (room_id,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getQuestionsByRoomIdApi(room_id),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// create multi room
export const createMultiRoomApi = (room_id, room_type, category, no_of_que,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getcreateMultiRoomApi(room_id, room_type, category, no_of_que),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get audio questions
export const audioquestionsApi = (type, type_id,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getAudioquestionsApi(type, type_id),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// set bookmark api
export const setbookmarkApi = (question_id, bookmark, type,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...setBookmarkApi(question_id, bookmark, type),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get bookmark api
export const getbookmarkApi = (type,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getBookmarkApi(type),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get daily leaderboard api
export const DailyLeaderBoardApi = (offset, limit,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getDailyLeaderBoardApi(offset, limit),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get montly leaderboard api
export const MonthlyLeaderBoardApi = (offset, limit,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getMonthlyLeaderBoardApi(offset, limit),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get global leaderboard api
export const GlobleLeaderBoardApi = (offset, limit,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getGlobleLeaderBoardApi(offset, limit),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// user coin score api
export const UserCoinScoreApi = (coins, score, type, title, status,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...setUserCoinScoreApi(coins, score, type, title, status),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// report question api
export const ReportQuestionApi = (question_id, message,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getreportQuestionApi(question_id, message),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// set user statistics api
export const UserStatisticsApi = (questions_answered, correct_answers, category_id, percentage,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...setUserStatisticsApi(questions_answered, correct_answers, category_id, percentage),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get maths questions api
export const getmathQuestionsApi = (type,type_id,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getMathQuestionsApi(type,type_id),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// set quiz CategoriesApi
export const setQuizCategoriesApi = (type,category_id,subcategory_id,type_id,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...setquizCategoriesApi(type,category_id,subcategory_id,type_id),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get exam module
export const getexamModuleApi = (type,offset,limit,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getExamModuleApi(type,offset,limit),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get exam module questions
export const getexamModuleQuestionsApi = (exam_module_id, onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getExamModuleQuestionsApi(exam_module_id),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
};

// set ExamModule Result
export const setExammoduleresultApi = (exam_module_id,total_duration,obtained_marks,statistics,rules_violated,captured_question_ids, onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...setExamModuleResultApi(exam_module_id,total_duration,obtained_marks,statistics,rules_violated,captured_question_ids),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
};

// get table tracker data
export const getTrackerDataApi = (offset,limit, onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getTableTrackerDataApi(offset,limit),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
};

// set user badges
export const setBadgesApi = (type,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...setUserBadgesApi(type),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
};

// set payment request
export const setPaymentApi = (payment_type, payment_address, payment_amount, coin_used, details,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...setPaymentRequestApi(payment_type, payment_address, payment_amount, coin_used, details),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
};

// get payment request
export const getPaymentApi = (offset,limit,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getPaymentRequestApi(offset,limit),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
};

// get user coins
export const getusercoinsApi = (onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getUserCoinsApi(),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// set battle statictics
export const setbattlestaticticsApi = (user_id1,user_id2,winner_id,is_drawn,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...setBattleStaticticsApi(user_id1,user_id2,winner_id,is_drawn),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}

// get battle statictics
export const getbattlestaticticsApi = (sort,order,offset,limit,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getBattleStaticticsApi(sort,order,offset,limit),
        displayToast: false,
        onStart,
        onSuccess,
        onError,
    }))
}