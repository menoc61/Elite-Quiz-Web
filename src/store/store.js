import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import userReducer from "./reducers/userSlice"
import languageReducer from './reducers/languageSlice';
import settingsReducer from './reducers/settingsSlice';
import tempdataReducer from './reducers/tempDataSlice';
import bookmarkReducer from './reducers/bookmarkSlice';
import groupbattleReducer from './reducers/groupbattleSlice';
import badgeReducer from './reducers/badgesSlice';
import webSettingsReducer from './reducers/webSettings';
import api from "../store/middleware/api";

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
    User: userReducer,
    Languages: languageReducer,
    Settings: settingsReducer,
    Tempdata: tempdataReducer,
    Bookmark: bookmarkReducer,
    GroupBattle: groupbattleReducer,
    Badges: badgeReducer,
    WebSettings:webSettingsReducer,
});

export const store = configureStore({
    reducer: persistReducer(persistConfig, rootReducer),
    middleware: [
        api
    ]
});

export const persistor = persistStore(store);