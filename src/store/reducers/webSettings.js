import { createSelector, createSlice } from "@reduxjs/toolkit";
import { getWebSettingsApi } from "../../utils/api";
import { apiCallBegan } from "../actions/apiActions";
import { store } from "../store";

// state
const initialState = {
    data: [],
    loading: false,
};

// slice
export const userSlice = createSlice({
    name: 'WebSettings',
    initialState,
    reducers: {
        webSettingsRequested: (web, action) => {
            web.loading = true;
        },
        webSettingsSuccess: (web, action) => {
            let { data } = action.payload;
            web.data = data;
            web.loading = false;
        },
        webSettingsFailed: (web, action) => {
            web.loading = false;
        },
    }

});

export const { webSettingsRequested,webSettingsSuccess,webSettingsFailed } = userSlice.actions;
export default userSlice.reducer;

// selectors
export const selectUser = (state) => state.User;

// update name and mobile
export const LoadWebSettingsDataApi = (onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getWebSettingsApi(),
        displayToast: false,
        onStartDispatch: webSettingsRequested.type,
        onSuccessDispatch: webSettingsSuccess.type,
        onErrorDispatch: webSettingsFailed.type,
        onStart,
        onSuccess,
        onError,
    }))
};

// Selector Functions
export const websettingsData = createSelector(
    state => state.WebSettings,
    WebSettings => WebSettings.data,
);
