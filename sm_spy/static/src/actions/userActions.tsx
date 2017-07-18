import request from '../utils/request';
import { USER_INFO, USER_INFO_SUCCESS, USER_INFO_FAIL} from '../constants';


export const getUserInfo = function (): object {
    return {
        types: [USER_INFO, USER_INFO_SUCCESS, USER_INFO_FAIL],
        promise: request.get('/user/get_info')
    }
}