import * as React from "react";
import { connect } from 'react-redux';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Sector, Cell } from 'recharts';

import Sidebar from '../components/Account/Sidebar';
import { getGroupUsersInfo, getGroups, addGroup, getGroupsGeography } from '../actions/groupsActions';

import './css/account.scss';

interface addGroupData {
    name: string
}

interface groupContainer{
    name: string,
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
    html_content: object
}

interface groupGeagraphyContainer {
    city_id: number,
    count: number,
    city_name: string
}

interface StateFromProps {
    groupsList: Array<groupContainer>,
    groupInfo: Array<groupInfoContainer>,
    groupInfoGegraphy: Array<groupGeagraphyContainer>
}

interface DispatchFromProps {
    onGetGroupUsersInfo: (group_id: number) => Promise<any>;
    getGroups: () => Promise<any>;
    addGroup: (data: addGroupData) => Promise<any>;
    getGroupsGeography: (group_id: number) => Promise<any>;
}

type AccountRedux = DispatchFromProps & IAccountProps & StateFromProps;


class Account extends React.Component<AccountRedux, IAccountClassState> {

    addGroupInput: HTMLInputElement;
    state: IAccountClassState;
    props: AccountRedux;

    constructor() {
        super();
        this.state = {
            isShowAddForm: false,
            currentGroup: 0,
            html_content: <p>Выберите категорию</p>
        }
        this.addGroupInput = null;
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

    getGroupUsersInfo(action: string) {
        switch (action) {
            case 'members':
                this.props.onGetGroupUsersInfo(this.state.currentGroup).then( () => { this.memebersContent() });
            case 'geography':
                this.props.getGroupsGeography(this.state.currentGroup).then( () => { this.geographyContent() } )
            default:
                this.noDataContent()

        }
    }

    noDataContent() {
        this.setState({
            'html_content': <p>Извините, данные не обнаружены</p>
        });
    }

    geographyContent() {
        const data = this.props.groupInfoGegraphy.map((object, index) => {
           return {'name': object.city_name, 'value': object.count}
        });
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
        this.state.html_content = (
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
            </PieChart></div>);
        this.setState({
            'html_content': this.state.html_content
        });
    }

    memebersContent() {
        if (!this.props.groupInfo.length) {
            this.state.html_content = <p>Извините, данные не обнаружены</p>;
            return;
        }
        const data = this.props.groupInfo.map((object, index) => {
            return {'name': object.dt_checking, 'count': object.count}
        });
        this.state.html_content = (<LineChart width={570} height={300} data={data}>
           <XAxis dataKey="name" padding={{left: 30, right: 30}}/>
           <YAxis/>
           <CartesianGrid strokeDasharray="3 3"/>
           <Tooltip viewBox={{ 'x': 0, 'y': 0, 'width': 200, 'height': 150 }}/>
           <Legend />
           <Line type="monotone" dataKey="count" stroke="#82ca9d" />
        </LineChart>);
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
        })
    }

    switchCurrentGroup(index: number) {
        if (index == this.state.currentGroup) {
            return false;
        }
        this.setState({
            currentGroup: index
        });
    }

    render () {
        const self = this;
        const { groupInfo } = this.props;
        const gloupsList = Object.keys(this.props.groupsList).length ? this.props.groupsList : null;
        return <div className="account-wrapper">
            <div className="account-header">
                <h3>Статистика</h3>
            </div>
            <Sidebar getGroupUsersInfo={ (action) => this.getGroupUsersInfo(action) }/>
            <div id="content">
                { this.state.html_content }
            </div>
            <div className="third-menu">
                <h3>Мои группы:</h3>
                <div className="third-menu-content">
                    {gloupsList ? (gloupsList.map((objects: groupContainer, index: number) => {
                        return <a href="javascript:void(0)"
                                  key={ index }
                                  onClick={ () => this.switchCurrentGroup(index)  }
                                  className={ (index === self.state.currentGroup) ? 'active' : '' }
                                >
                            { objects['name'] }
                            </a>
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
    groupInfoGegraphy: state.groupsReducer.groupInfoGegraphy,
});

const mapDispatchToProps = (dispatch: any):DispatchFromProps => ({
    onGetGroupUsersInfo: (group_id: number) => dispatch(getGroupUsersInfo(group_id)),
    getGroups: () => dispatch(getGroups()),
    addGroup: (data: addGroupData) => dispatch(addGroup(data)),
    getGroupsGeography: (group_id: number) => dispatch(getGroupsGeography(group_id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);