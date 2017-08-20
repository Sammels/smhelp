import request from '../utils/request';
import * as constants from '../constants';


export const getGroupUsersInfo = function (group_id: number): object {
    return {
        types: [constants.GROUP_USERS_INFO, constants.GROUP_USERS_INFO_SUCCESS, constants.GROUP_USERS_INFO_FAIL],
        promise: request.get('/vk/get_overview_users/' + group_id + '/')
    }
}

export const getGroups = function (): object {
    return {
        types: [constants.GET_GROUPS, constants.GET_GROUPS_SUCCESS, constants.GET_GROUPS_FAIL],
        promise: request.get('/vk/get_groups/')
    }
}

export const getGroupsGeography = function (group_id: number): object {
    return {
        types: [constants.GET_GROUP_GEOGRAPHY, constants.GET_GROUP_GEOGRAPHY_SUCCESS,
                constants.GET_GROUP_GEOGRAPHY_FAIL],
        promise: request.get('/vk/get_group_geography/' + group_id + '/')
    }
}

export const addGroup = function (data: any) {
    var params = new URLSearchParams();
    for (let key in data) {
        params.append(key, data[key])
    }
    return {
        types: [constants.ADD_GROUP, constants.ADD_GROUP_SUCCESS, constants.ADD_GROUP_FAIL],
        promise: request.post('/vk/add_group/', params)
    }
}

export const getGroupsIntersection = function (first_group_id: number, groups: any) {
    var params = new URLSearchParams();
    for (let key in groups) {
            for (let key_group in groups[key]) {
                if (key_group != 'value') {
                    continue
                }
                params.append(key_group + '[]', groups[key][key_group]);
            }

    }
    return {
        types: [constants.GET_GROUP_INTERSECTION, constants.GET_GROUP_INTERSECTION_SUCCESS, constants.GET_GROUP_INTERSECTION_FAIL],
        promise: request.get('/vk/get_group_intersection/' + first_group_id + '/', {params: params})
    }

}