import * as React from "react";
import { connect } from 'react-redux';
import {Icon} from 'react-fa'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Sector, Cell, BarChart, Bar } from 'recharts';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
const Select = require('react-select');

import Sidebar from '../components/Account/Sidebar';
import { getGroupUsersInfo, getGroups, addGroup, getGroupsGeography, getGroupsIntersection, forceUpdate, deleteGroup,
         getGroupUsersInfoChanges, getOnlinePeople, wallGroupContent } from '../actions/groupsActions';
import Modal from "../components/Modal";

import './css/account.scss';
import 'react-select/dist/react-select.css';


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
    vk_id: string
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
    id: number,
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

interface StateFromProps {
    groupsList: Array<groupContainer>,
    groupInfo: Array<groupInfoContainer>,
    groupInfoGegraphy: Array<groupGeagraphyContainer>,
    groupInfoIntersection: Array<groupIntersectionContainer>,
    groupPeopleOnline: Array<groupPeopleOnlineContainer>,
    groupsError: groupError,
    groupWall: Array<groupWallContainer>,
}

interface DispatchFromProps {
    onGetGroupUsersInfo: (group_id: number) => Promise<any>;
    getGroups: () => Promise<any>;
    addGroup: (data: addGroupData) => Promise<any>;
    getGroupsGeography: (group_id: number) => Promise<any>;
    getGroupsIntersection: (first_group_id: number, second_group_id: Array<selectValue>) => Promise<any>;
    getGroupUsersInfoChanges: (group_id: number, date: string) => Promise<any>;
    forceUpdate: (group_id: number) => Promise<any>;
    deleteGroup: (group_id: number) => Promise<any>;
    getOnlinePeople: (group_id: number, day_week: number) => Promise<any>;
    wallGroupContent: (group_id: number, sort: string, order: string) => Promise<any>;
}

type AccountRedux = DispatchFromProps & IAccountProps & StateFromProps;


class Account extends React.Component<AccountRedux, IAccountClassState> {

    addGroupInput: HTMLInputElement;
    state: IAccountClassState;
    props: AccountRedux;
    currentAction: string;
    currentModalMessage: string;

    constructor() {
        super();
        this.state = {
            isShowAddForm: false,
            currentGroup: 0,
            html_content: <p>Выберите категорию</p>,
            crossGroup: 0,
            inersectionValue: [],
            showMessage: false
        }
        this.addGroupInput = null;
        this.currentModalMessage = '';
    }

    componentDidMount() {
        this.props.getGroups().then(() => {
            if (!this.state.currentGroup) {
                this.setState({
                    'currentGroup': this.props.groupsList[0].id
                });
            }
        });
    }

    getGroupProperties() {
        if ((!this.props.groupsList.length) || (this.props.groupsList.length && this.props.groupsList[0] == undefined)) {
            return null
        }
        return this.props.groupsList.filter((group_object) => { return this.state.currentGroup ==  group_object.id })[0]
    }

    getGroupUsersInfo(action: string) {
        if (action == 'members') {
            this.props.onGetGroupUsersInfo(this.state.currentGroup).then(() => {
                this.memebersContent()
            });
        } else if(action == 'geography') {
            this.props.getGroupsGeography(this.state.currentGroup).then( () => { this.geographyContent() } )
        } else if (action == 'cross_groups') {
            this.groupsIntersectionContent()
        } else if (action == 'active_members') {
            this.props.getOnlinePeople(this.state.currentGroup, 1).then( () => { this.activeMembersContent(1) } )
        } else if (action == 'group_wall') {
            this.props.wallGroupContent(this.state.currentGroup, "id", "desc").then(
                () => { this.wallGroupContent() } )
        } else {
            this.noDataContent()
        }
        this.currentAction = action;
    }

    noDataContent() {
        this.setState({
            'html_content': <p>Нет данных или идет загрузка</p>
        });
    }

    wallGroupContent() {
        const group_data = this.props.groupWall.map((object, index) => {
            return {
                'vk_id': object.vk_id,
                'text': (object.text.length > 100) ? object.text.substr(0, 100) + '...' : object.text,
                'comments': object.comments,
                'likes': object.likes,
                'views': object.views,
                'reposts': object.reposts,
            }
        });
        const content = (
            <div className="center-pie">
            <BootstrapTable data={group_data} striped={true} hover={true}>
              <TableHeaderColumn dataField="vk_id" isKey={true} dataAlign="center" dataSort={true}>ID</TableHeaderColumn>
              <TableHeaderColumn dataField="text" dataAlign="center" dataSort={true}>Текст</TableHeaderColumn>
              <TableHeaderColumn dataField="comments" dataAlign="center" dataSort={true}>Комментарии</TableHeaderColumn>
              <TableHeaderColumn dataField="likes" dataAlign="center" dataSort={true}>Лайки</TableHeaderColumn>
              <TableHeaderColumn dataField="reposts" dataAlign="center" dataSort={true}>Репосты</TableHeaderColumn>
              <TableHeaderColumn dataField="views" dataAlign="center" dataSort={true}>Просмотры</TableHeaderColumn>
            </BootstrapTable>
        </div>);
        this.setState({
            'html_content': content
        });
    }

    changingSelect(object_value: any) {
        if (!Array.isArray(object_value)) {
            object_value = [object_value];
        }
        this.setState({
            inersectionValue: object_value
        });
        this.props.getGroupsIntersection(this.state.currentGroup, object_value).then(
             () => {
                 this.groupsIntersectionContentSecondStep();
             } )
    }

    groupsIntersectionContentSecondStep() {
        const gloupsList = Object.keys(this.props.groupsList).length ? this.props.groupsList : null;
        const options = gloupsList
            .filter((object) => { return  object.id != this.state.currentGroup })
            .map((object, index) => { return { 'value': object.id, 'label': object.name }
        });
        const data = [
            {'name': 'Пересчение', 'value': this.props.groupInfoIntersection.length},
            {'name': 'Уникальные участинки моей группы', 'value': 100 - this.props.groupInfoIntersection.length}
        ];
        const group_data = this.props.groupInfoIntersection.map((object, index) => {
            return {'name': object.first_name + ' ' + object.last_name,
                    //'link': <a href={'https://vk.com/' + object.vk_id} target="_blank">{object.vk_id}</a>
                    'link': object.vk_id
            }
        });
        const COLORS = ['#0088FE', '#00C49F'];
        const intersection = (
            <div className="center-pie"><PieChart width={410} height={410}>
                <Pie
                    activeIndex={[]}
                    activeShape={[]}
                    data={data}
                    cx={150}
                    cy={150}
                    outerRadius={150}
                    paddingAngle={0}
                    fill="#8268ee"
                    isAnimationActive={false}
                >
                    {
                        data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
                    }
                </Pie>
                <Legend width={140} height={76} layout='vertical' align='right' verticalAlign='middle' />
            </PieChart>

            <BootstrapTable data={group_data} striped={true} hover={true}>
              <TableHeaderColumn dataField="name" isKey={true} dataAlign="center" dataSort={true}>Имя</TableHeaderColumn>
              <TableHeaderColumn dataField="link" dataAlign="center" dataSort={true}>Ссылка</TableHeaderColumn>
            </BootstrapTable>
        </div>);
        const content = (<div>
            <Select
              name="groups_inersection"
              value={this.state.inersectionValue}
              multi={true}
              options={ options }
              onChange={(object_value: selectValue) => this.changingSelect(object_value)}
            />
            <div>{intersection}</div>
        </div>);
        this.setState({
            'html_content': content
        });
    }

    getTimeZoneHour(hour: number) {
        // TODO: If offset less then 0, problems can appear
        const dateNow = new Date();
        const timeZoneOffset = (dateNow.getTimezoneOffset()*-1)/60;
        let newHour = (timeZoneOffset + hour);
        if (newHour >= 24) {
            newHour = newHour - 24;
        }
        return newHour.toString()
    }

    activeMembersContent(week_day: number) {
        const head = (<ul className="account-day-weeks">
                        <li><a href="javascript:void(0)" className={week_day == 1 ? 'active' : null}
                               onClick={() => (this.props.getOnlinePeople(this.state.currentGroup, 1).then( () => { this.activeMembersContent(1) } ))}>Понедельник</a></li>
                        <li><a href="javascript:void(0)" className={week_day == 2 ? 'active' : null}
                               onClick={() => (this.props.getOnlinePeople(this.state.currentGroup, 2).then( () => { this.activeMembersContent(2) } ))}>Вторник</a></li>
                        <li><a href="javascript:void(0)" className={week_day == 3 ? 'active' : null}
                               onClick={() => (this.props.getOnlinePeople(this.state.currentGroup, 3).then( () => { this.activeMembersContent(3) } ))}>Среда</a></li>
                        <li><a href="javascript:void(0)" className={week_day == 4 ? 'active' : null}
                               onClick={() => (this.props.getOnlinePeople(this.state.currentGroup, 4).then( () => { this.activeMembersContent(4) } ))}>Четверг</a></li>
                        <li><a href="javascript:void(0)" className={week_day == 5 ? 'active' : null}
                               onClick={() => (this.props.getOnlinePeople(this.state.currentGroup, 5).then( () => { this.activeMembersContent(5) } ))}>Пятница</a></li>
                        <li><a href="javascript:void(0)" className={week_day == 6 ? 'active' : null}
                               onClick={() => (this.props.getOnlinePeople(this.state.currentGroup, 6).then( () => { this.activeMembersContent(6) } ))}>Суббота</a></li>
                        <li><a href="javascript:void(0)" className={week_day == 0 ? 'active' : null}
                               onClick={() => (this.props.getOnlinePeople(this.state.currentGroup, 0).then( () => { this.activeMembersContent(0) } ))}>Воскресенье</a></li>
                     </ul>);
        if (!this.props.groupPeopleOnline.length) {
            this.state.html_content = <p>Данные не обнаружены или идет загрузка</p>;
            this.setState({
                'html_content': <span>{head} {this.state.html_content}</span>
            });
            return;
        }


        const data = this.props.groupPeopleOnline.map((object, index) => {
            return {"name": object.hour_online + ' час (а, ов)', "Количество online": object.count_person }
        });
        this.state.html_content = (
            <BarChart width={570} height={300} data={data}>
           <XAxis dataKey="name"/>
           <YAxis/>
           <CartesianGrid strokeDasharray="3 3"/>
           <Tooltip/>
           <Legend />
           <Bar dataKey="Количество online" fill="#8884d8" />
          </BarChart>);
        this.setState({
            'html_content': <span>{head} {this.state.html_content}</span>
        });
    }

    groupsIntersectionContent() {
        const gloupsList = Object.keys(this.props.groupsList).length ? this.props.groupsList : null;
        const options = gloupsList
            .filter((object) => { return  object.id != this.state.currentGroup })
            .map((object, index) => { return { 'value': object.id, 'label': object.name }
        });
        if (!options.length) {
            this.setState({
                'html_content': <p>Недостаточно групп. Добавьте минимум одну группу.</p>
            });
            return false;
        }
        this.state.html_content = (
            <Select
              name="groups_inersection"
              value=""
              options={ options }
              onChange={(object_value: selectValue) => this.changingSelect(object_value)}
            />
        );
        this.setState({
            'html_content': this.state.html_content
        });
    }

    geographyContent() {
        let total = 0;
        let slice_total = 0;
        const stop_index_slice = 4;
        if(this.props.groupInfoGegraphy.length == 0) {
            this.state.html_content = <p>Данные не обнаружены или идет загрузка</p>;
            this.setState({
                'html_content': this.state.html_content
            });
            return;
        }
        const data = this.props.groupInfoGegraphy
            .filter((obj) => {return obj.city_id})
            .sort((a, b) => {return b.count - a.count})
            .map((object, index) => {
                total += object.count;
                if (index < stop_index_slice) {
                    slice_total += object.count;
                }
                return {'name': object.city_name, 'value': object.count}
            });
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a6d4fe'];
        let finish_data = data.slice(0, stop_index_slice);
        finish_data.push({'name': 'Остальные', 'value': total - slice_total});
        this.state.html_content = (
            <div className="center-pie"><PieChart width={410} height={410}>
                <Pie
                    activeIndex={[]}
                    activeShape={[]}
                    data={finish_data}
                    cx={150}
                    cy={150}
                    outerRadius={150}
                    paddingAngle={0}
                    fill="#8268ee"
                    isAnimationActive={false}
                >
                    {
                        finish_data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
                    }
                </Pie>
                <Legend width={140} height={76} layout='vertical' align='right' verticalAlign='middle' />
            </PieChart>
            <BootstrapTable data={data} striped={true} hover={true}>
              <TableHeaderColumn dataField="name" isKey={true} dataAlign="center" dataSort={true}>Город</TableHeaderColumn>
              <TableHeaderColumn dataField="value" dataAlign="center" dataSort={true}>Количество</TableHeaderColumn>
            </BootstrapTable>
            </div>);
        this.setState({
            'html_content': this.state.html_content
        });
    }

    membersChartsClick(e: any, group_data: groupInfoContainer) {
        if (e === null) {
            return false;
        }
        const db_checking = e.activePayload[0].payload.name;
        if (!db_checking || db_checking == group_data.dt_checking) {
            return false;
        }

        const data = this.props.groupInfo.map((object, index) => {
            return {'name': object.dt_checking, 'count': object.count}
        });

        this.state.html_content = (<LineChart width={570} height={300} data={data}
                                              onClick={(e) => this.membersChartsClick(e, this.props.groupInfo[0])}>
           <XAxis dataKey="name" padding={{left: 30, right: 30}}/>
           <YAxis/>
           <CartesianGrid strokeDasharray="3 3"/>
           <Tooltip viewBox={{ 'x': 0, 'y': 0, 'width': 200, 'height': 150 }}/>
           <Legend />
           <Line type="monotone" dataKey="count" stroke="#82ca9d" />
        </LineChart>);

        this.props.getGroupUsersInfoChanges(this.state.currentGroup, db_checking).then(() => {

            const group_data_in = this.props.groupInfoIntersection['data_in'].map((object, index) => {
                return {'name': object.first_name + ' ' + object.last_name,
                        //'link': <a href={'https://vk.com/' + object.vk_id} target="_blank">{object.vk_id}</a>
                        'link': object.vk_id
                }
            });
            const group_data_out = this.props.groupInfoIntersection['data_out'].map((object, index) => {
                return {'name': object.first_name + ' ' + object.last_name,
                        //'link': <a href={'https://vk.com/' + object.vk_id} target="_blank">{object.vk_id}</a>
                        'link': object.vk_id
                }
            });

            const new_content_in = (<div><h3 className="new_members">Новые участники</h3><BootstrapTable data={group_data_in} striped={true} hover={true}>
              <TableHeaderColumn dataField="name" isKey={true} dataAlign="center" dataSort={true}>Имя</TableHeaderColumn>
              <TableHeaderColumn dataField="link" dataAlign="center" dataSort={true}>Ссылка</TableHeaderColumn>
            </BootstrapTable></div>);

            const new_content_out = (<div><h3 className="new_members">Ушедшие участники</h3><BootstrapTable data={group_data_out} striped={true} hover={true}>
              <TableHeaderColumn dataField="name" isKey={true} dataAlign="center" dataSort={true}>Имя</TableHeaderColumn>
              <TableHeaderColumn dataField="link" dataAlign="center" dataSort={true}>Ссылка</TableHeaderColumn>
            </BootstrapTable></div>);

            this.setState({
                'html_content': <div>{this.state.html_content}{new_content_in}{new_content_out}</div>
            });
        });
    }

    memebersContent() {
        if (!this.props.groupInfo.length) {
            this.state.html_content = <p>Данные не обнаружены или идет загрузка</p>;
            this.setState({
                'html_content': this.state.html_content
            });
            return;
        }
        const data = this.props.groupInfo.map((object, index) => {
            return {'name': object.dt_checking, 'count': object.count}
        });
        const tips = data.length > 1 ? <p>Кликните на точки, если хотите узнать кто именно пришел\ушел</p> : null;

        this.state.html_content = (<div><LineChart width={570} height={300} data={data}
                                              onClick={(e) => this.membersChartsClick(e, this.props.groupInfo[0])}>
           <XAxis dataKey="name" padding={{left: 30, right: 30}}/>
           <YAxis/>
           <CartesianGrid strokeDasharray="3 3"/>
           <Tooltip viewBox={{ 'x': 0, 'y': 0, 'width': 200, 'height': 150 }}/>
           <Legend />
           <Line type="monotone" dataKey="count" stroke="#82ca9d" />
        </LineChart>{tips}</div>);
        this.setState({
            'html_content': this.state.html_content
        });
    }

    switchAddForm() {
        this.setState({
            'isShowAddForm': !this.state.isShowAddForm
        });
    }

    addGroup() {
        this.props.addGroup({
            'name': this.addGroupInput.value
        }).then(() => {
            if (this.props.groupsError.error) {
                this.currentModalMessage = 'Первышен лимит участников';
                this.setState({
                    'showMessage': true
                })
            }

        });
    }

    switchCurrentGroup(group_id: number) {
        if (group_id == this.state.currentGroup) {
            return false;
        }
        this.setState({
            currentGroup: group_id
        }, () => this.getGroupUsersInfo(this.currentAction));

    }

    deleteGroup(group_id: number) {
        this.props.deleteGroup(group_id);
    }

    forceUpdate() {
        this.props.forceUpdate(this.state.currentGroup).then(() => {
            this.currentModalMessage = 'Обновления запущено. Дождитесь обновления';
            this.setState({
                'showMessage': true
            })
        });
    }

    showMessage() {
        const self = this;
        setTimeout(function() {self.setState({
            showMessage: false
        })}, 800);
        return <Modal message={this.currentModalMessage} />
    }

    render () {
        const self = this;
        let metaInfo = <div/>;
        const { groupInfo } = this.props;
        const gloupsList = Object.keys(this.props.groupsList).length ? this.props.groupsList : null;
        const currentGroupInfo = this.getGroupProperties();
        if (currentGroupInfo) {
            metaInfo = (
                <div id="content-header">
                    <a href={ currentGroupInfo.link } target="_blank" id="title-link">{ currentGroupInfo.name }</a>
                    <Icon name="refresh" className="update-icon" title="Обновить данные" onClick={() => this.forceUpdate() }/>
                </div>
            )
        }
        return <div className="account-wrapper">
            {this.state.showMessage ? this.showMessage() : ''}
            <div className="account-header">
                <h3>Статистика</h3>
            </div>
            <Sidebar getGroupUsersInfo={ (action) => this.getGroupUsersInfo(action) }
                     currentAction={ this.currentAction }/>
            <div id="content">
                { metaInfo }
                { this.state.html_content }
            </div>
            <div className="third-menu">
                <h3>Мои группы:</h3>
                <div className="third-menu-content">
                    {gloupsList ? (gloupsList.map((objects: groupContainer, index: number) => {
                        return (<div className="block-group-delete" key={index}>
                            <Icon name="trash" className="group-delete" title="Удалить из наблюдения"
                                  onClick={ () => this.deleteGroup(objects.id)  }/>
                            <a href="javascript:void(0)"
                                  key={ index }
                                  onClick={ () => this.switchCurrentGroup(objects.id)  }
                                  className={ (objects.id === self.state.currentGroup) ? 'active' : '' }
                                >
                            { objects['name'] }
                            </a></div>);
                    })) :
                        <p>Группы не найдены</p>
                    }
                </div>
                <button onClick={ () => this.switchAddForm() }>Добавить группу</button>
                {this.state.isShowAddForm  ?
                    <form className="add_group">
                        <input type="text" placeholder="Ссылка на группу" ref={ (input) => { this.addGroupInput = input } }/>
                        <button onClick={ () => this.addGroup() }>ОК</button>
                    </form>
                    : null
                }
            </div>
        </div>
    }
}

const mapStateToProps = (state: any, ownProp? :any):StateFromProps => ({
    groupsList: state.groupsReducer.groups,
    groupInfo: state.groupsReducer.groupInfo,
    groupsError: state.groupsReducer.groupsError,
    groupInfoGegraphy: state.groupsReducer.groupInfoGegraphy,
    groupInfoIntersection: state.groupsReducer.groupIntersection,
    groupPeopleOnline: state.groupsReducer.groupPeopleOnline,
    groupWall: state.groupsReducer.groupWall
});

const mapDispatchToProps = (dispatch: any):DispatchFromProps => ({
    onGetGroupUsersInfo: (group_id: number) => dispatch(getGroupUsersInfo(group_id)),
    getGroupUsersInfoChanges: (group_id: number, date: string) => dispatch(getGroupUsersInfoChanges(group_id, date)),
    getGroups: () => dispatch(getGroups()),
    addGroup: (data: addGroupData) => dispatch(addGroup(data)),
    getGroupsGeography: (group_id: number) => dispatch(getGroupsGeography(group_id)),
    getGroupsIntersection: (first_group_id: number, second_group_id: Array<selectValue>) =>
        dispatch(getGroupsIntersection(first_group_id, second_group_id)),
    forceUpdate: (group_id: number) => dispatch(forceUpdate(group_id)),
    deleteGroup: (group_id: number) => dispatch(deleteGroup(group_id)),
    getOnlinePeople: (group_id: number, day_week: number) => dispatch(getOnlinePeople(group_id, day_week)),
    wallGroupContent: (group_id: number, sort: string, order: string) => dispatch(wallGroupContent(group_id, sort, order)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);