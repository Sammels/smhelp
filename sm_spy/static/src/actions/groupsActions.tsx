import request from '../utils/request';
import * as constants from '../constants';


export const getGroupUsersInfo = function (group_id: number): object {
    return {
        types: [constants.GROUP_USERS_INFO, constants.GROUP_USERS_INFO_SUCCESS, constants.GROUP_USERS_INFO_FAIL],
        promise: request.get('/vk/get_overview_users/' + group_id)
    }
}

export const getGroups = function (): object {
    return {
        types: [constants.GET_GROUPS, constants.GET_GROUPS_SUCCESS, constants.GET_GROUPS_FAIL],
        promise: request.get('/vk/get_groups/')
    }
}