import { createSelector, createSlice } from "@reduxjs/toolkit";
import { store } from "../store";

// Define the initial state
const initialState = {
    data: {},
};

export const badgeSlice = createSlice({
    name: "Badges",
    initialState,
    reducers: {
        badgeSuccess: (badge, action) => {
            badge.data = action.payload.data;
        },
        badgestatusSuccess: (badge, action) => {
            const { key, value } = action.payload;
            badge.data[key].status = value;

        },
    }
});

export const { badgeSuccess,badgestatusSuccess } = badgeSlice.actions;
export default badgeSlice.reducer;

// load dat a
export const Loadbadgedata = (data) => {
    store.dispatch(badgeSuccess({ data }));
}

// load data
export const LoadNewBadgesData = (key, value) => {
    store.dispatch(badgestatusSuccess({ key,value }))
};

// selector
export const badgesData = createSelector(
    state => state.Badges,
    Badges => Badges
)