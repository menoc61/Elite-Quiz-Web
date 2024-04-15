import { createSelector, createSlice } from "@reduxjs/toolkit"
import { store } from "../store";


const initialState = {}

export const groupbattleSlice = createSlice({
    name: "GroupBattle",
    initialState,
    reducers: {
        groupbattleSuccess: (groupbattle, action) => {
            const { key, value } = action.payload;
            switch(key) {
                case 'roomid':
                    groupbattle.roomID = value;
                    break;
                case 'createdby':
                    groupbattle.createdBy = value;
                    break;
                case 'readytoplay':
                    groupbattle.readytoplay = value;
                    break;
                case 'roomCode':
                    groupbattle.roomCode = value;
                    break;
                case 'user1name':
                    groupbattle.user1name = value;
                    break;
                case 'user2name':
                    groupbattle.user2name = value;
                    break;
                case 'user3name':
                    groupbattle.user3name = value;
                    break;
                case 'user4name':
                    groupbattle.user4name = value;
                    break;
                case 'user1image':
                    groupbattle.user1image = value;
                    break;
                case 'user2image':
                    groupbattle.user2image = value;
                    break;
                case 'user3image':
                    groupbattle.user3image = value;
                    break;
                case 'user4image':
                    groupbattle.user4image = value;
                    break;
                case 'user1uid':
                    groupbattle.user1uid = value;
                    break;
                case 'user2uid':
                    groupbattle.user2uid = value;
                    break;
                case 'user3uid':
                    groupbattle.user3uid = value;
                    break;
                case 'user4uid':
                    groupbattle.user4uid = value;
                    break;
                case 'user1CorrectAnswer':
                    groupbattle.user1CorrectAnswer = value;
                    break;
                case 'user2CorrectAnswer':
                    groupbattle.user2CorrectAnswer = value;
                    break;
                case 'user3CorrectAnswer':
                    groupbattle.user3CorrectAnswer = value;
                    break;
                case 'user4CorrectAnswer':
                    groupbattle.user4CorrectAnswer = value;
                    break;
                case 'user1point':
                    groupbattle.user1point = value;
                    break;
                case 'user2point':
                    groupbattle.user2point = value;
                    break;
                case 'entryFee':
                    groupbattle.entryFee = value;
                    break;
                case 'totalusers':
                    groupbattle.totalusers = value;
                    break;
                default:
                    break;
            }
        },
        groupbattleDataClearSuccess: (groupbattle) => {
            groupbattle = initialState;
            return groupbattle;
        },
    }
});

export const { groupbattleSuccess,groupbattleDataClearSuccess } = groupbattleSlice.actions;
export default groupbattleSlice.reducer;

// load data
export const LoadGroupBattleData = (key,value) => {
    store.dispatch(groupbattleSuccess({ key,value }))
};

// data clear after playing in storage
export const battleDataClear = () => {
    store.dispatch(groupbattleDataClearSuccess())
}

// selector
export const groupbattledata = createSelector(
    state => state.GroupBattle,
    GroupBattle => GroupBattle,
)