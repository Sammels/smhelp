import *  as constants from '../constants';

const initialState = {}


const userReducer = (state = initialState, action: any) => {
    var result: any = state || {};
    switch (action.type) {
        case constants.USER_INFO_SUCCESS:
            result['dd'] = 'dd';
            return result;
        default:
            return state;
    }
}

export default userReducer;