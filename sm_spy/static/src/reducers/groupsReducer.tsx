import *  as constants from '../constants';


const initialState = {
    groupInfo: Object,
    groups: Array
}


const groupsReducer = (state = initialState, action: any) => {
    var result: any = state || {};
    switch (action.type) {
        case constants.GET_GROUP_GEOGRAPHY_SUCCESS:
            return  Object.assign({}, result, {groupInfoGegraphy: action.result.data});
        case constants.GROUP_USERS_INFO_SUCCESS:
            return  Object.assign({}, result, {groupInfo: action.result.data});
        case constants.GET_GROUPS_SUCCESS:
            return Object.assign({}, result, {groups: action.result.data});
        case constants.ADD_GROUP_SUCCESS:
            return Object.assign({}, result, {groups: action.result.data});
        default:
            return state
    }
}

export default groupsReducer;