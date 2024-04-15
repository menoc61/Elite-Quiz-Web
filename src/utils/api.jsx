import axios from "axios";
import { store } from "../store/store";
const access_key = process.env.REACT_APP_ACCESS_KEY;

/** API ROUTES */
const USER_SIGNUP = "user_signup";
const GET_CATEGORIES = "get_categories";
const GET_SUBCATEGORIES = "get_subcategory_by_maincategory";
const GET_LANGUAGES = "get_languages";
const GET_LEVEL_DATA = "get_level_data";
const GET_QUESTIONS = "get_questions_by_level";
const GET_USER = "get_user_by_id";
const UPDATE_PROFILE = "update_profile";
const UPDATE_PROFILE_IMAGE = "upload_profile_image";
const SET_BOOKMARK = "set_bookmark";
const GET_BOOKMARK = "get_bookmark";
const GET_DAILY_LEADERBOARD = "get_daily_leaderboard";
const GET_MONTHLY_LEADERBOARD = "get_monthly_leaderboard";
const GET_GLOBLE_LEADERBOARD = "get_globle_leaderboard";
const GET_NOTIFICATIONS = "get_notifications";
const GET_USER_STATISTICS = "get_users_statistics";
const DELETE_USER_ACCOUNT = "delete_user_account";
const GET_SETTINGS = "get_settings";
const SET_USER_COIN_SCORE = "set_user_coin_score";
const REPORT_QUESITON = "report_question";
const SET_LEVEL_DATA = "set_level_data";
const SET_USER_STATISTICS = "set_users_statistics";
const CHECK_USER_EXISTS = "check_user_exists";
const GET_SYSTEM_CONFIGURATIONS = "get_system_configurations";
const GET_SLIDERS = "get_sliders";
const Daily_Quiz = "get_daily_quiz";
const Fun_and_Learn = "get_fun_n_learn";
const Fun_and_Learn_Questions = "get_fun_n_learn_questions";
const True_and_False_Questions = "get_questions_by_type";
const GUESS_THE_WORD = "get_guess_the_word";
const GET_QUESTIONS_SELF_CHALLENGE = "get_questions_for_self_challenge";
const GET_CONTEST = "get_contest";
const GET_QUESTIONS_CONTEST = "get_questions_by_contest";
const SET_CONTEST_LEADERBOARD = "set_contest_leaderboard";
const GET_CONTEST_LEADERBOARD = "get_contest_leaderboard";
const GET_RANDOM_QUESTIONS = "get_random_questions";
const GET_RANDOM_QUESTIONS_ROOM_ID = "get_question_by_room_id";
const CREATE_ROOM = "create_room";
const GET_AUDIO_QUESTIONS = "get_audio_questions";
const GET_MATH_QUESTIONS = "get_maths_questions";
const SET_QUIZ_CATEGORIES = "set_quiz_categories";
const GET_EXAM_MODULE = "get_exam_module";
const GET_EXAM_MODULE_QUESTIONS = "get_exam_module_questions";
const SET_EXAM_MODULE_RESULT = "set_exam_module_result";
const GET_TRACKER_DATA = "get_tracker_data";
const GET_USER_BADGES = "get_user_badges";
const SET_USER_BADGES = "set_badges";
const GET_WEB_SETTINGS = "get_web_settings";
const SET_PAYMENT_REQUEST = "set_payment_request";
const GET_PAYMENT_REQUEST = "get_payment_request";
const GET_USER_COINS = "get_user_coin_score";
const SET_BATTLE_STATISTICS = "set_battle_statistics";
const GET_BATTLE_STATISTICS = "get_battle_statistics";

//get language from storage
const getLanguage = () => {
    let language = store.getState().Languages.currentLanguage

    let sysconfig = store.getState().Settings.systemConfig

    if (language) {
        if (sysconfig.language_mode === "1") {
            return language;
        } else {
            // console.log("language",language)
            return false;
        }
    }
    return false;
};

// 1. SignUp
export const SignUpApi = (firebase_id, type, username, email, image_url, mobile, fcm_id, friends_code)  => {
    /**
     * @param
     * type : email / gmail / fb / mobile / apple
     */

    return {
        url: `${USER_SIGNUP}`,
        method: 'POST',
        data:{
            access_key:access_key,
            firebase_id:firebase_id,
            type:type,
            name:username,
            email:email,
            profile:image_url,
            mobile:mobile,
            fcm_id:fcm_id,
            friends_code:friends_code,
        },
        authorizationHeader: false,
    }
}

// 2. check user exists
export const checkUserExistsApi = (firebase_id) => {
    return {
        url: `${CHECK_USER_EXISTS}`,
        method:'POST',
        data: {
            access_key: access_key,
            firebase_id:firebase_id
        },
        authorizationHeader: false,
    }
};

// 3. update image profile
export const updateUserProfileImageApi = (image) => {
    let data = new FormData();
    data.append("image", image);
    data.append("access_key",access_key)
    return {
        url: `${UPDATE_PROFILE_IMAGE}`,
        method: "POST",
        data,
        authorizationHeader: true,
    }
};

// 4. get user profile
export const getUserProfileApi = (id) => {
    return {
        url: `${GET_USER}`,
        method: 'POST',
        data: {
            access_key: access_key,
            get_user_by_id: id,
        },
        authorizationHeader: true,

    }
};

// 5. update user name and mobile
export const updateUserProfileDataApi = (email,name,mobile) => {
    return {
        url: `${UPDATE_PROFILE}`,
        method: 'POST',
        data: {
            access_key: access_key,
            email:email,
            name: name,
            mobile:mobile
        },
        authorizationHeader: true,
    }
}

// 6. delete user account
export const deleteAccountApi = () => {
    return {
        url: `${DELETE_USER_ACCOUNT}`,
        method: "POST",
        data: {
            access_key: access_key,
        },
        authorizationHeader: true,
    }
}

// 7. get user statistics
export const getUserStatisticsApi = () => {
    return {
        url: `${GET_USER_STATISTICS}`,
        method: "POST",
        data: {
            access_key: access_key,
        },
        authorizationHeader: true,
    }
}

// 8. get notification
export const getNotificationsApi = (id, order, offset, limit) => {
    return {
        url: `${GET_NOTIFICATIONS}`,
        method: "POST",
        data: {
            access_key: access_key,
            sort: id, // {optional} - id / users / type
            order: order, // {optional} - DESC / ASC
            offset: offset, // {optional} - Starting position
            limit: limit, // {optional} - number of records per page
        },
        authorizationHeader: true,

    }
};

// 9. Get Languages
export const getLanguagesApi = (id) => {
    return {
        url: `${GET_LANGUAGES}`,
        method: "POST",
        data: {
            access_key: access_key,
            language_id: id,
        },
        authorizationHeader: false,
   }
};

// 10. get sliders
export const getSliderApi = (language_id) => {
    return {
        url: `${GET_SLIDERS}`,
        method: "POST",
        data: {
            access_key: access_key,
            language_id: language_id,
        },
        authorizationHeader: false,
    }
}

// 11. get settings
export const getSettingsApi = (type) => {
    return {
        url: `${GET_SETTINGS}`,
        method: "POST",
        data: {
            access_key: access_key,
            type:type //empty (""):- all data /about_us / privacy_policy / terms_conditions / contact_us / instructions
        },
        authorizationHeader: false,

    }
};

// 12. get system configurations
export const getSystemConfigurationsApi = () => {
    return {
        url: `${GET_SYSTEM_CONFIGURATIONS}`,
        method: "POST",
        data: {
            access_key: access_key,
        },
        authorizationHeader: false,

    }
};

// 13. get categories
export const getCategoriesApi = (type) => {
    let { id:language_id } = getLanguage();
    return {
        url: `${GET_CATEGORIES}`,
        method: "POST",
        data: {
            access_key: access_key,
            language_id: language_id,
            type:type,
        },
        authorizationHeader: true,

    }
};

// 14. get subcategories by main categories
export const getSubcategoriesApi = (category_id, subcategory_id) => {
    let { id: language_id } = getLanguage();
    return {
        url: `${GET_SUBCATEGORIES}`,
        method: "POST",
        data: {
            access_key: access_key,
            language_id: language_id,
            category: category_id,
            subcategory: subcategory_id,
        },
        authorizationHeader: true,
    }
};

// 15. get level data from subcategories or categories
export const getLevelDataApi = (category_id, subcategory_id) => {
    return {
        url: `${GET_LEVEL_DATA}`,
        method: "POST",
        data: {
            access_key: access_key,
            category: category_id,
            subcategory: subcategory_id,
        },
        authorizationHeader: true,
    }
};

// 16. setlevel data
export const setLevelDataApi = (category_id, subcategory_id, level) => {
    return {
        url: `${SET_LEVEL_DATA}`,
        method: "POST",
        data: {
            access_key: access_key,
            category: category_id,
            subcategory: subcategory_id,
            level: level,
        },
        authorizationHeader: true,
    }
};

// 17. dailyquiz
export const getDailyQuizApi = () => {
    let { id: language_id } = getLanguage();
    return {
        url: `${Daily_Quiz}`,
        method: "POST",
        data: {
            access_key: access_key,
            language_id: language_id,
        },
        authorizationHeader: true,
    }
};

// 18. get true and false questions
export const gettrueandfalsequestions = (type, limit) => {
    let { id: language_id } = getLanguage();
    return {
        url: `${True_and_False_Questions}`,
        method: "POST",
        data: {
            access_key: access_key,
            type: type,
            limit: limit,
            language_id: language_id,
        },
        authorizationHeader: true,
    }
};


// 19. get fun and learn
export const getfunandlearn = (type, type_id) => {
    let { id: language_id } = getLanguage();
    return {
        url: `${Fun_and_Learn}`,
        method: "POST",
        data: {
            access_key: access_key,
            language_id: language_id,
            type: type,
            type_id: type_id,
        },
        authorizationHeader: true,
    }
};

// 20. get fun and learn questions
export const getfunandlearnquestions = (fun_n_learn_id) => {
    let { id: language_id } = getLanguage();
    return {
        url: `${Fun_and_Learn_Questions}`,
        method: "POST",
        data: {
            access_key: access_key,
            language_id: language_id,
            fun_n_learn_id: fun_n_learn_id,
        },
        authorizationHeader: true,
    }
};

// 21. guess the word
export const getguessthewordApi = (type, type_id) => {
    let { id: language_id } = getLanguage();
    return {
        url: `${GUESS_THE_WORD}`,
        method: "POST",
        data: {
            access_key: access_key,
            language_id: language_id, //{optional}
            type: type, //category or subcategory
            type_id: type_id, //{if type:category then type_id:category id}
        },
        authorizationHeader: true,
    }
};

// 22. self chellenge
export const getselfQuestionsApi = (category, subcategory, limit) => {
    let { id: language_id } = getLanguage();
    return {
        url: `${GET_QUESTIONS_SELF_CHALLENGE}`,
        method: "POST",
        data: {
            access_key: access_key,
            category: category,
            subcategory: subcategory,
            limit: limit,
            language_id: language_id, //optional
        },
        authorizationHeader: true,
    }
};

// 23. get contest
export const getContestApi = () => {
    let { id: language_id } = getLanguage();
    return {
        url: `${GET_CONTEST}`,
        method: "POST",
        data: {
            access_key: access_key,
            language_id: language_id,
        },
        authorizationHeader: true,
    }
};

// 24. contest questions
export const getcontestQuestionsApi = (contest_id) => {
    let { id: language_id } = getLanguage();
    return {
        url: `${GET_QUESTIONS_CONTEST}`,
        method: "POST",
        data: {
            access_key: access_key,
            language_id: language_id,
            contest_id: contest_id,
        },
        authorizationHeader: true,
    }
};

// 25. set contest leaderboard
export const setContestLeaderboardApi = (contest_id, questions_attended, correct_answers, score) => {
    let { id: language_id } = getLanguage();
    return {
        url: `${SET_CONTEST_LEADERBOARD}`,
        method: "POST",
        data: {
            access_key: access_key,
            language_id: language_id,
            contest_id: contest_id,
            questions_attended: questions_attended,
            correct_answers: correct_answers,
            score: score,
        },
        authorizationHeader: true,
    }
};

// 26. get contest leaderboard
export const getContestLeaderboardApi = (contest_id) => {
    let { id: language_id } = getLanguage();
    return {
        url: `${GET_CONTEST_LEADERBOARD}`,
        method: "POST",
        data: {
            access_key: access_key,
            language_id: language_id,
            contest_id: contest_id,
        },
        authorizationHeader: true,
    }
};

// 27. get questions for quiz zone
export const getQuestionsApi = (category_id, subcategory_id, level) => {
    let { id: language_id } = getLanguage();
    return {
        url: `${GET_QUESTIONS}`,
        method: "POST",
        data: {
            access_key: access_key,
            language_id: language_id,
            category: category_id,
            subcategory: subcategory_id,
            level: level,
        },
        authorizationHeader: true,
    }
};

// 28. get random questions
export const getRandomQuestionsApi = (match_id, category, destroy_match) => {
    let { id: language_id } = getLanguage();
    return {
        url: `${GET_RANDOM_QUESTIONS}`,
        method: "POST",
        data: {
            access_key: access_key,
            language_id: language_id,
            match_id: match_id,
            category: category,  // required if battle category enable form panel
            destroy_match:destroy_match  // 0 - don't destroy | 1 - destroy the battle
        },
        authorizationHeader: true,
    }
};

// 29. get questions from room id for group battle
export const getQuestionsByRoomIdApi = (room_id) => {
    let { id: language_id } = getLanguage();
    return {
        url: `${GET_RANDOM_QUESTIONS_ROOM_ID}`,
        method: "POST",
        data: {
            access_key: access_key,
            language_id: language_id,
            room_id:room_id,
            },
        authorizationHeader: true,
    }
};

// 30. create room for Groupbattle in sql database entry
export const getcreateMultiRoomApi = (room_id, room_type, category, no_of_que) => {
    let { id: language_id } = getLanguage();
    return {
        url: `${CREATE_ROOM}`,
        method: "POST",
        data: {
            access_key: access_key,
            language_id: language_id,
            room_id: room_id,
            room_type: room_type,// private or public
            category: category, // required if room category enable form panel
            no_of_que:no_of_que,
            },
        authorizationHeader: true,
    }
};

// 31. audio questions api
export const getAudioquestionsApi = (type, type_id) => {
    let { id: language_id } = getLanguage();
    return {
        url: `${GET_AUDIO_QUESTIONS}`,
        method: "POST",
        data: {
            access_key: access_key,
            language_id: language_id, //{optional}
            type: type, //category or subcategory
            type_id: type_id, //{if type:category then type_id:category id}
        },
        authorizationHeader: true,
    }
};

// 32. set bookmark
export const setBookmarkApi = (question_id, bookmark, type) => {
    return {
        url: `${SET_BOOKMARK}`,
        method: "POST",
        data: {
            access_key: access_key,
            question_id: question_id,
            status: bookmark, //1-bookmark,0-unmark
            type: type, //1-quiz_zone, 3-guess_the_word, 4-audio_question
        },
        authorizationHeader: true,
    }
};

// 33. get bookmark
export const getBookmarkApi = (type) => {
    return {
        url: `${GET_BOOKMARK}`,
        method: "POST",
        data: {
            access_key: access_key,
            type: type, //1-quiz_zone, 3-guess_the_word, 4-audio_question
        },
        authorizationHeader: true,
    }
};

// 34. get dailyleaderboard data
export const getDailyLeaderBoardApi = (offset, limit) => {
    return {
        url: `${GET_DAILY_LEADERBOARD}`,
        method: "POST",
        data: {
           access_key: access_key,
            offset: offset, // {optional} - starting position
            limit: limit, // {optional} - Number of records per page
        },
        authorizationHeader: true,
    }
};

// 35. get monthly leaderboard
export const getMonthlyLeaderBoardApi = (offset, limit) => {
    return {
        url: `${GET_MONTHLY_LEADERBOARD}`,
        method: "POST",
        data: {
            access_key: access_key,
            offset: offset, // {optional} - starting position
            limit: limit, // {optional} - Number of records per page
        },
        authorizationHeader: true,
    }
};


// 36. get global leaderboard
export const getGlobleLeaderBoardApi = (offset, limit) => {
    return {
        url: `${GET_GLOBLE_LEADERBOARD}`,
        method: "POST",
        data: {
            access_key: access_key,
            offset: offset, // {optional} - starting position
            limit: limit, // {optional} - Number of records per page
        },
        authorizationHeader: true,
    }
};

// 37. set user coin store
export const setUserCoinScoreApi = (coins, score, type, title, status) => {
    return {
        url: `${SET_USER_COIN_SCORE}`,
        method: "POST",
        data: {
            access_key: access_key,
            coins: coins, //if deduct coin than set with minus sign -2
            score: score,
            type: type, // (dashing_debut, combat_winner, clash_winner, most_wanted_winner, ultimate_player, quiz_warrior, super_sonic, flashback, brainiac, big_thing, elite, thirsty, power_elite, sharing_caring, streak)
            title: title,
            status: status, //0-add coin, 1-deduct coin
        },
        authorizationHeader: true,
    }
};

// 38. report questions
export const getreportQuestionApi = (question_id, message) => {
    return {
        url: `${REPORT_QUESITON}`,
        method: "POST",
        data: {
            access_key: access_key,
            question_id: question_id,
            message: message,
        },
        authorizationHeader: true,
    }
};

// 39. set user statistics
export const setUserStatisticsApi = (questions_answered, correct_answers, category_id, percentage) => {
    return {
        url: `${SET_USER_STATISTICS}`,
        method: "POST",
        data: {
            access_key: access_key,
            questions_answered: questions_answered,
            correct_answers: correct_answers,
            category_id: category_id, //(id of category which user played)
            ratio: percentage, // (In percenatge)
        },
        authorizationHeader: true,
    }
};

// 40. get math questions
export const getMathQuestionsApi = (type, type_id) => {
    return {
        url: `${GET_MATH_QUESTIONS}`,
        method: 'POST',
        data: {
            access_key: access_key,
            type: type,//category or subcategory,
            type_id: type_id, //{if type:category then type_id:category id},
        },
        authorizationHeader: true,
    }
};

// 41. set quiz Categories
export const setquizCategoriesApi = (type, category_id, subcategory_id, type_id) => {
    return {
        url: `${SET_QUIZ_CATEGORIES}`,
        method: 'POST',
        data: {
            access_key: access_key,
            type: type,      // 2-fun_n_learn, 3-guess_the_word, 4-audio_question, 5-maths_question
            category: category_id,
            subcategory: subcategory_id,  //{optional}
            type_id: type_id,      // for fun_n_learn_id
        },
        authorizationHeader: true,
    }
};

// 42. get exam module
export const getExamModuleApi = (type, offset, limit) => {
    let { id: language_id } = getLanguage();
    // console.log("language",language_id)
    return {
        url: `${GET_EXAM_MODULE}`,
        method: 'POST',
        data: {
            access_key: access_key,
            language_id: language_id,   //{optional}
            type: type,          //1-today, 2-completed
            offset: offset,    // {optional} - Starting position
            limit: limit,    // {optional} - number of records per page
        },
        authorizationHeader: true,
    }
};

// 43. get exam module questions
export const getExamModuleQuestionsApi = (exam_module_id) => {
    return {
        url: `${GET_EXAM_MODULE_QUESTIONS}`,
        method: 'POST',
        data: {
            access_key: access_key,
            exam_module_id: exam_module_id,
        },
        authorizationHeader: true,
    }
};

// 44. set ExamModule Result
export const setExamModuleResultApi = (exam_module_id, total_duration, obtained_marks, statistics, rules_violated, captured_question_ids) => {
    return {
        url: `${SET_EXAM_MODULE_RESULT}`,
        method: 'POST',
        data: {
            access_key: access_key,
            exam_module_id: exam_module_id,
            total_duration: total_duration,
            obtained_marks: obtained_marks,
            statistics: statistics, //statistics:[{"mark":"1","correct_answer":"2","incorrect":"3"},{"mark":"2","correct_answer":"2","incorrect":"3"}]
            rules_violated: rules_violated,
            captured_question_ids: captured_question_ids,//Array of String

        },
        authorizationHeader: true,
    }
};

// 45. get table tracker data
export const getTableTrackerDataApi = (offset, limit) => {
    return {
        url: `${GET_TRACKER_DATA}`,
        method: 'POST',
        data: {
            access_key: access_key,
            offset: offset, // {optional} - Starting position
            limit: limit,  // {optional} - number of records per page
        },
        authorizationHeader: true,
    }
};

// 46. get user badges
// there is to show this api in different way because the its resposne is in message not in data so there is issue with api middleware.
export const getUserBadgesApi = async () => {
    const user = store.getState().User
    const requestOptions = {
        access_key: process.env.REACT_APP_ACCESS_KEY,
    };
    let response = await axios.post(process.env.REACT_APP_BASE_URL + GET_USER_BADGES, requestOptions, {
        headers: {
            Authorization: user && user.data && user.data.api_token ? "Bearer " + user.data.api_token : "",
        },
    });
    return response.data;
};

// 47. set user badges
export const setUserBadgesApi = (type) => {
    return {
        url: `${SET_USER_BADGES}`,
        method: 'POST',
        data: {
            access_key: access_key,
            type: type,  //dashing_debut, clash_winner, ultimate_player, super_sonic, flashback, brainiac, thirsty, streak etc.
        },
        authorizationHeader: true,
    }
};

// 48. web settings
export const getWebSettingsApi = () => {
    return {
        url: `${GET_WEB_SETTINGS}`,
        method: 'POST',
        data: {
            access_key: access_key,
        },
        authorizationHeader: false,
    }
};

// 49. set payment request
export const setPaymentRequestApi = (payment_type, payment_address, payment_amount, coin_used, details) => {
    return {
        url: `${SET_PAYMENT_REQUEST}`,
        method: 'POST',
        data: {
            access_key: access_key,
            payment_type: payment_type,
            payment_address: payment_address,
            payment_amount: payment_amount,
            coin_used: coin_used,
            details: details,
        },
        authorizationHeader: true,
    }
};

// 50. get payment request
export const getPaymentRequestApi = (offset,limit) => {
    return {
        url: `${GET_PAYMENT_REQUEST}`,
        method: 'POST',
        data: {
            access_key: access_key,
            offset: offset, //optional
            limit: limit //optional
        },
        authorizationHeader: true,
    }
};

// 51. get user coins
export const getUserCoinsApi = () => {
    return {
        url: `${GET_USER_COINS}`,
        method: 'POST',
        data: {
            access_key: access_key,
        },
        authorizationHeader: true,
    }
}

// 52. set battle statictics
export const setBattleStaticticsApi = (user_id1,user_id2,winner_id,is_drawn) => {
    return {
        url: `${SET_BATTLE_STATISTICS}`,
        method: 'POST',
        data: {
            access_key: access_key,
            user_id1:user_id1,
            user_id2:user_id2,
            winner_id:winner_id,
            is_drawn:is_drawn //0 / 1 (0->no_drawn,1->drawn)

        },
        authorizationHeader: true,
    }
}

// 53. get battle statictics
export const getBattleStaticticsApi = (sort,order,offset,limit) => {
    return {
        url: `${GET_BATTLE_STATISTICS}`,
        method: 'POST',
        data: {
            access_key: access_key,
            sort:sort, // is_drawn / winner_id // {optional}
            order:order, //DESC / ASC // {optional}
            offset:offset,    // {optional} - Starting position
            limit:limit,    // {optional} - number of records per page
        },
        authorizationHeader: true,
    }
}