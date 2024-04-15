import { createSelector, createSlice } from "@reduxjs/toolkit";
import { getSettingsApi, getSystemConfigurationsApi } from "../../utils/api";
import { apiCallBegan } from "../actions/apiActions";
import { store } from "../store";

// initial state
const initialState = {
    data: null,
    loading: false,
    systemConfig: {} //immutable data
}

// slice
export const settingsSlice = createSlice({
    name: 'Settings',
    initialState,
    reducers: {
        settingsRequested: (settings, action) => {
            settings.loading = true;
        },
        settingsSucess: (settings, action) => {
            settings.data = action.payload.data;
            settings.loading = false;
            // {console.log(action)}
        },
        settingsFailure: (settings, action) => {
            settings.loading = false;
        },
        settingsConfigurationSucess: (settings, action) => {
            let { data } = action.payload;
            settings.systemConfig = data;
            settings.loading = false;
        }
    }
});

export const { settingsRequested, settingsSucess, settingsFailure,settingsConfigurationSucess } = settingsSlice.actions;
export default settingsSlice.reducer;

// API Callls
export const settingsLoaded = (type,onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getSettingsApi(type),
        displayToast: false,
        onStartDispatch: settingsRequested.type,
        onSuccessDispatch: settingsSucess.type,
        onErrorDispatch: settingsFailure.type,
        onStart,
        onSuccess,
        onError
    }))
}

export const systemconfigApi = (onSuccess, onError, onStart) => {
    store.dispatch(apiCallBegan({
        ...getSystemConfigurationsApi(),
        displayToast: false,
        onSuccessDispatch: settingsConfigurationSucess.type,
        onStart,
        onSuccess,
        onError
    }))
}

// selectors
export const settingsData = createSelector(
    state => state.Settings,
    Settings => Settings.data
)

export const sysConfigdata = createSelector(
    state => state.Settings,
    Settings => Settings.systemConfig
)