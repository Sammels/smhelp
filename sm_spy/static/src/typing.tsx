interface addGroupData {
    name: string
}

interface selectValue {
    value: number,
    name: string
}

interface groupContainer{
    name: string,
    link: string,
    id: number
}

interface groupInfoContainer{
    dt_checking: string,
    count: number
}

interface IAccountProps {
    match: any;
    location: any;
    history: any;
}

interface IAccountClassState {
    isShowAddForm: boolean,
    currentGroup: number,
    crossGroup: number,
    html_content: object,
    inersectionValue: Array<selectValue>,
    showMessage: boolean
}

interface groupGeagraphyContainer {
    city_id: number,
    count: number,
    city_name: string
}

interface groupIntersectionContainer {
    first_name: string,
    last_name: string,
    vk_id: string,
    id: number
}

interface groupPeopleOnlineContainer {
    hour_online: number,
    count_person: number
}

interface groupWallAttachContainer {
    vk_id: number,
    dt_create: number,
    title: string,
    views: number,
    comments: number,
    type: string,
    description: string,
    photo: string,
}

interface groupWallContainer {
    vk_id: number,
    dt_create: number,
    text: string,
    likes: number,
    views: number,
    reposts: number,
    comments: number,
    attach: Array<groupWallAttachContainer>,
}

interface groupError {
    error: string
}

interface groupActionsContainer {
    dt_create: string,
    group: number,
    action: number,
    person: groupIntersectionContainer
}

interface StateFromProps {
    groupsList: Array<groupContainer>,
    groupInfo: Array<groupInfoContainer>,
    groupInfoGegraphy: Array<groupGeagraphyContainer>,
    groupInfoIntersection: Array<groupIntersectionContainer>,
    groupPeopleOnline: Array<groupPeopleOnlineContainer>,
    groupsError: groupError,
    groupWall: Array<groupWallContainer>,
    groupActions: Array<groupActionsContainer>
}

interface DispatchFromProps {
    onGetGroupUsersInfo: (group_id: number) => Promise<any>;
    getGroups: () => Promise<any>;
    addGroup: (data: addGroupData) => Promise<any>;
    getGroupsGeography: (group_id: number) => Promise<any>;
    getGroupsIntersection: (first_group_id: number, second_group_id: Array<selectValue>) => Promise<any>;
    getGroupUsersInfoChanges: (group_id: number, date: string) => Promise<any>;
    getActionsPeople: (group_id: number, date: string) => Promise<any>;
    forceUpdate: (group_id: number) => Promise<any>;
    deleteGroup: (group_id: number) => Promise<any>;
    getOnlinePeople: (group_id: number, day_week: number) => Promise<any>;
    wallGroupContent: (group_id: number, sort: string, order: string) => Promise<any>;
}

type AccountRedux = DispatchFromProps & IAccountProps & StateFromProps;

interface ISidebarProps {
    getGroupUsersInfo: (action: string) => void,
    currentAction: string
}

interface IWallProps {
    groupWall: Array<any>
}

interface IWallState {

}

interface IRetargetingProps {

}

interface IRetargetingState {
    searchValue: string
}