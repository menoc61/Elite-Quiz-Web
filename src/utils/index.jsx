import cryptoJs from "crypto-js";
import config from "./config";
import { store } from "../store/store";
import { getbookmarkApi } from "../store/actions/campaign";
import { Loadbookmarkdata } from "../store/reducers/bookmarkSlice";


// -----------------global functions-----------------------------

// getSiblings, getClosest, slideUp, slideDown, slideToggle :- mobile navigation and navbar for header
export const getSiblings = function (elem) {
    let siblings = [];
    let sibling = elem.parentNode.firstChild;
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== elem) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }
    return siblings;
};

export const getClosest = function (elem, selector) {
    for (; elem && elem !== document; elem = elem.parentNode) {
        if (elem.matches(selector)) return elem;
    }
    return null;
};

export const slideUp = (element, duration = 500) => {
    return new Promise(function (resolve) {
        element.style.height = element.offsetHeight + "px";
        element.style.transitionProperty = `height, margin, padding`;
        element.style.transitionDuration = duration + "ms";
        // element.offsetHeight;
        element.style.overflow = "hidden";
        element.style.height = 0;
        element.style.paddingTop = 0;
        element.style.paddingBottom = 0;
        element.style.marginTop = 0;
        element.style.marginBottom = 0;
        window.setTimeout(function () {
            element.style.display = "none";
            element.style.removeProperty("height");
            element.style.removeProperty("padding-top");
            element.style.removeProperty("padding-bottom");
            element.style.removeProperty("margin-top");
            element.style.removeProperty("margin-bottom");
            element.style.removeProperty("overflow");
            element.style.removeProperty("transition-duration");
            element.style.removeProperty("transition-property");
            resolve(false);
        }, duration);
    });
}

export const slideDown = (element, duration = 500) => {
    return new Promise(function () {
        element.style.removeProperty("display");
        let display = window.getComputedStyle(element).display;

        if (display === "none") display = "block";

        element.style.display = display;
        let height = element.offsetHeight;
        element.style.overflow = "hidden";
        element.style.height = 0;
        element.style.paddingTop = 0;
        element.style.paddingBottom = 0;
        element.style.marginTop = 0;
        element.style.marginBottom = 0;
        // element.offsetHeight;
        element.style.transitionProperty = `height, margin, padding`;
        element.style.transitionDuration = duration + "ms";
        element.style.height = height + "px";
        element.style.removeProperty("padding-top");
        element.style.removeProperty("padding-bottom");
        element.style.removeProperty("margin-top");
        element.style.removeProperty("margin-bottom");
        window.setTimeout(function () {
            element.style.removeProperty("height");
            element.style.removeProperty("overflow");
            element.style.removeProperty("transition-duration");
            element.style.removeProperty("transition-property");
        }, duration);
    });
}

export const slideToggle = (element, duration = 500) => {
    if (window.getComputedStyle(element).display === "none") {
        return slideDown(element, duration);
    } else {
        return slideUp(element, duration);
    }
}


// is login user check
export const isLogin = () => {
    let user = store.getState().User
    if (user) {
        try {
            // user = JSON.parse(user);
            if (user.data.api_token) {
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }
    return false;
}

// decrypt answer wont show inspect element
export const decryptAnswer = (encrypted_json_string, key) => {
    let obj_json = encrypted_json_string;
    let encrypted = obj_json.ciphertext;
    let iv = cryptoJs.enc.Hex.parse(obj_json.iv);
    key += "0000";
    key = cryptoJs.enc.Utf8.parse(key);
    try {
        let decrypted = cryptoJs.AES.decrypt(encrypted, key, {
            iv: iv,
        }).toString(cryptoJs.enc.Utf8);
        return decrypted;
    } catch (error) {
        console.log(error);
    }
}

//calculate coins
export const calculateCoins = (score, totalQuestions) => {
    //This method will determine how much coins will user get after
    //completing the quiz
    //if percentage is more than maxCoinsWinningPercentage then user will earn maxWinningCoins
    //
    //if percentage is less than maxCoinsWinningPercentage
    //coin value will deduct from maxWinning coins
    //earned coins = (maxWinningCoins - ((maxCoinsWinningPercentage - percentage)/ 10))
    //For example: if percentage is 70 then user will
    //earn 3 coins if maxWinningCoins is 4
    const systemconfig = store.getState().Settings.systemConfig

    let percentage = (score * 100) / totalQuestions; // 400/5 = 80
    let earnedCoins = 0;
    if (percentage >= Number(systemconfig.maximum_coins_winning_percentage)) {
        //80 >= 30
        earnedCoins = systemconfig.maximum_winning_coins; // 4
    } else {
        earnedCoins = systemconfig.maximum_winning_coins - (Number(systemconfig.maximum_coins_winning_percentage) - percentage) / 10; // 4 - (30 - 80) / 10 => 34/10 => 5.4
    }
    if (earnedCoins < 0) {
        earnedCoins = 0;
    }

    return earnedCoins;
}

//calculate score
export const calculateScore = (score, totalQuestions) => {
    const systemconfig = store.getState().Settings.systemConfig
    let correctAnswer = score;
    let incorrectAnswer = totalQuestions - score;
    let correctAnswerScore = correctAnswer * systemconfig.score;
    let incorrectAnswerScore = incorrectAnswer * config.deductIncorrectAnswerScore;
    let finalScore = correctAnswerScore - incorrectAnswerScore;
    return finalScore;
}

// load bookmark data
export const getAndUpdateBookmarkData = (type) => {
    getbookmarkApi(type, (response) => {
        Loadbookmarkdata(response.data)
    }, (error) => {
        // console.log(error);
    })
}

// get bookmark data
export const getBookmarkData = () => {
    let alldata = store.getState().Bookmark.data;
    if (alldata) {
        return alldata;
    }
    return false;
}

// delete bookmarkdata
export const deleteBookmarkData = (bookmark_id) => {
    let alldata = store.getState().Bookmark.data;
    if (alldata) {
        alldata = Object.values(alldata).filter((bookmark) => {
                    return bookmark.id !== bookmark_id;
        });
        Loadbookmarkdata(alldata)
    }
    return false;
}

// delete bookmark data by questionsid
export const deleteBookmarkByQuestionID = (question_id) => {
    let alldata = store.getState().Bookmark.data;
    if (alldata) {
        alldata = Object.values(alldata).filter((bookmark) => {
            return bookmark.question_id !== question_id;
        });
        Loadbookmarkdata(alldata)
        return alldata;
    }
    return false;
}

//scrollhandler in mobile device
export const scrollhandler = (top) => {
    const scrollTohowItWorks = () =>
        window.scroll({
            top: top,
            left: 0,
            behavior: "smooth",
        });
    if (window.innerWidth <= 600) {
        scrollTohowItWorks();
    }
    return false;
}

 // server image error
export const imgError = (e) => {
    e.target.src = "/images/user.svg"
}
