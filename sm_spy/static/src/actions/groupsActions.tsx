import request from '../utils/request';
import * as constants from '../constants';


export const getGroupUsersInfo = function (group_id: number): object {
    return {
        types: [constants.GROUP_USERS_INFO, constants.GROUP_USERS_INFO_SUCCESS, constants.GROUP_USERS_INFO_FAIL],
        promise: request.get('/vk/get_overview_users/' + group_id + '/')
    }
}

export const getGroupUsersInfoChanges = function (group_id: number, date: string): object {
    return {
        types: [constants.GET_GROUP_INTERSECTION, constants.GET_GROUP_INTERSECTION_SUCCESS, constants.GET_GROUP_INTERSECTION_FAIL],
        promise: request.get('/vk/get_overview_changins_users/' + group_id + '/', {params: {date: date}})
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

export const wallGroupContent = function (group_id: number, sort: string, order: string): object {
    return {
        types: [constants.GET_GROUP_WALL, constants.GET_GROUP_WALL_SUCCESS,
                constants.GET_GROUP_WALL_FAIL],
        promise: request.get('/vk/group/' + group_id + '/posts/' + sort + "/" + order + "/")
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

export const forceUpdate = function (group_id: number) {
    return {
        types: [constants.GET_GROUPS, constants.GET_GROUPS_SUCCESS, constants.GET_GROUPS_FAIL],
        promise: request.post('/vk/groups/force_update/' + group_id + '/')
    }
}

export const deleteGroup = function (group_id: number) {
    return {
        types: [constants.GET_GROUPS, constants.GET_GROUPS_SUCCESS, constants.GET_GROUPS_FAIL],
        promise: request.delete('/vk/groups/delete/' + group_id + '/')
    }
}

export const getOnlinePeople = function (group_id: number, day_week: number): object {
    return {
        types: [constants.GET_GROUP_PEOPLE_ONLINE, constants.GET_GROUP_PEOPLE_ONLINE_SUCCESS,
                constants.GET_GROUP_PEOPLE_ONLINE_FAIL],
        promise: request.get('/vk/group/' + group_id + '/online/' + day_week + "/")
    }
}

export const getActionsPeople = function (group_id: number, date: string): object {
    return {
        types: [constants.GET_GROUP_ACTIONS, constants.GET_GROUP_ACTIONS_SUCCESS,
                constants.GET_GROUP_ACTIONS_FAIL],
        promise: request.get('/vk/group/' + group_id + '/actions/?date_start=' + date + '&date_end=' + date)
    }
}

export const searchGroups = function (query: string): object {
    let filter = {
        "query": query
    }
    return {
        types: [constants.SEARCH_GROUP_ACTIONS, constants.SEARCH_GROUP_ACTIONS_SUCCESS,
                constants.SEARCH_GROUP_ACTIONS_FAIL],
        promise: request.post('/vk/group/search/', filter)
    }
}