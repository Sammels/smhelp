import *  as constants from '../constants';


const initialState = {
    // groupInfo: {},
    // groups: []
}


const groupsReducer = (state = initialState, action: any) => {
    var result: any = state || {};
    switch (action.type) {
        case constants.GROUP_USERS_INFO_SUCCESS:
            result.groupInfo = action.result.data;
            break;
        case constants.GET_GROUPS_SUCCESS:
            result.groups = action.result.data;
            break;
    }
    return result;
}

export default groupsReducer;