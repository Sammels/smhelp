import * as React from "react";
import { connect } from 'react-redux';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Sector, Cell } from 'recharts';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
const Select = require('react-select');

import Sidebar from '../components/Account/Sidebar';
import { getGroupUsersInfo, getGroups, addGroup, getGroupsGeography, getGroupsIntersection } from '../actions/groupsActions';

import './css/account.scss';
import 'react-select/dist/react-select.css';

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
    crossGroup: number,
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
    getGroupsIntersection: (first_group_id: number, second_group_id: number) => Promise<any>;
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
            html_content: <p>Выберите категорию</p>,
            crossGroup: 0
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
        if (action == 'members') {
            this.props.onGetGroupUsersInfo(this.state.currentGroup).then(() => {
                this.memebersContent()
            });
        } else if(action == 'geography') {
            this.props.getGroupsGeography(this.state.currentGroup).then( () => { this.geographyContent() } )
        } else if (action == 'cross_groups') {
            this.groupsIntersectionContent()
        } else {
            this.noDataContent()
        }
    }

    noDataContent() {
        this.setState({
            'html_content': <p>Извините, данные не обнаружены</p>
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
            <div>
            <Select
              name="form-field-name"
              value="one"
              options={ options }
               onChange={() => {}}
            />
            </div>
        );
        this.setState({
            'html_content': this.state.html_content
        });

            // this.props.getGroupsIntersection(this.state.currentGroup, this.state.crossGroup).then(
            //     () => { this.groupsIntersectionContent() } )
    }

    geographyContent() {
        let total = 0;
        let slice_total = 0;
        const stop_index_slice = 4;
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
    getGroupsGeography: (group_id: number) => dispatch(getGroupsGeography(group_id)),
    getGroupsIntersection: (first_group_id: number, second_group_id: number) =>
        dispatch(getGroupsIntersection(first_group_id, second_group_id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);