import *  as constants from '../constants';

const initialState = {}


const groupsReducer = (state = initialState, action: any) => {
    var result: any = state || {};
    switch (action.type) {
        case constants.GROUP_USERS_INFO_SUCCESS:
            return result;
        default:
            return state;
    }
}

export default groupsReducer;