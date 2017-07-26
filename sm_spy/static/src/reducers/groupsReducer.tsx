import *  as constants from '../constants';


const initialState = {
    groupInfo: Object,
    groups: Array
}


const groupsReducer = (state = initialState, action: any) => {
    var result: any = state || {};
    switch (action.type) {
        case constants.GROUP_USERS_INFO_SUCCESS:
            result.groupInfo = action.result.data;
            break;
        case constants.GET_GROUPS_SUCCESS:
            return Object.assign({}, result, {groups: action.result.data});
        case constants.ADD_GROUP_SUCCESS:
            return Object.assign({}, result, {groups: action.result.data});
        default:
            return state
    }
}

export default groupsReducer;