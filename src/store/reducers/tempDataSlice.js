import { createSelector, createSlice } from "@reduxjs/toolkit";
import { store } from "../store";

const initialState = {
    data: {},
    contestLeaderboarddata: {},
    playwithfrienddata: {},
    examQuestionData: [],
    examCompletedata: {
        totalQuestions: null,
        Correctanswer: null,
        InCorrectanswer: null,
    },
    examsetQuiz: {
        remianingtimer: null,
        statistics: null,
        totalmarks: "",
    },
};

export const tempSlice = createSlice({
    name: "Tempdata",
    initialState,
    reducers: {
        tempdataSuccess: (temporary, action) => {
            temporary.data = action.payload.data;
        },
        contestLeaderboarddataSuccess: (temporary, action) => {
            temporary.contestLeaderboarddata = action.payload.data
        },
        playwithFrienddataSuccess: (temporary, action) => {
            temporary.playwithfrienddata = action.payload.data
        },
        examcompletedataSuccess: (temporary, action) => {
            temporary.examCompletedata.totalQuestions = action.payload.totalQuestions;
            temporary.examCompletedata.Correctanswer = action.payload.Correctanswer;
            temporary.examCompletedata.InCorrectanswer = action.payload.InCorrectanswer;
        },
        examsetquizSuccess: (temporary, action) => {
            temporary.examsetQuiz.remianingtimer = action.payload.remianingtimer;
            temporary.examsetQuiz.statistics = action.payload.statistics;
            temporary.examsetQuiz.totalmarks = action.payload.totalmarks;
        },
        examquestionsSuccess: (temporary, action) => {
            temporary.examQuestionData = action.payload.data;
        },

    }
});

export const {tempdataSuccess,contestLeaderboarddataSuccess,playwithFrienddataSuccess,exammarksSuccess,examcompletedataSuccess,examsetquizSuccess,examquestionsSuccess} = tempSlice.actions;
export default tempSlice.reducer;

export const Loadtempdata = (data) => {
    store.dispatch(tempdataSuccess({ data }));
}

export const LoadcontestLeaderboard = (data) => {
    store.dispatch(contestLeaderboarddataSuccess({ data }));
}

export const playwithFrienddata = (data) => {
    store.dispatch(playwithFrienddataSuccess({ data }));
}

export const LoadexamCompletedata = (totalQuestions, Correctanswer, InCorrectanswer ) => {
    store.dispatch(examcompletedataSuccess({ totalQuestions, Correctanswer, InCorrectanswer }));
}

export const Loadexamsetquiz = (remianingtimer,statistics,totalmarks) => {
    store.dispatch(examsetquizSuccess({ remianingtimer, statistics,totalmarks }));
}

export const LoadExamQuestion = (data) => {
    store.dispatch(examquestionsSuccess({ data }));
}

// selector
export const selecttempdata = createSelector(
    state => state.Tempdata,
    Tempdata => Tempdata.data,
);

export const contestleaderboard = createSelector(
    state => state.Tempdata,
    Tempdata => Tempdata.contestLeaderboarddata,
);

export const playwithfreind = createSelector(
    state => state.Tempdata,
    Tempdata => Tempdata.playwithfrienddata,
);

export const examCompletedata = createSelector(
    state => state.Tempdata.examCompletedata,
    Tempdata => Tempdata
);

export const getexamsetQuiz = createSelector(
    state => state.Tempdata.examsetQuiz,
    Tempdata => Tempdata
);

export const getexamQuestion = createSelector(
    state => state.Tempdata,
    Tempdata => Tempdata.examQuestionData
);
