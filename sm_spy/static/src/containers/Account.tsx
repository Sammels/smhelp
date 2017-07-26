import * as React from "react";
import { connect } from 'react-redux';

import Sidebar from '../components/Account/Sidebar';
import { getGroupUsersInfo, getGroups, addGroup } from '../actions/groupsActions';

import './css/account.scss';

interface addGroupData {
    name: string
}

interface groupContainer{
    name: string
}

interface IAccountProps {
    match: any;
    location: any;
    history: any;
}

interface IAccountClassState {
    isShowAddForm: boolean,
    currentGroup: number
}

interface StateFromProps {
    groupsList: Array<groupContainer>,
    groupInfo: object,
}

interface DispatchFromProps {
    onGetGroupUsersInfo: (group_id: number) => void;
    getGroups: () => void;
    addGroup: (data: addGroupData) => void
}

type AccountRedux = DispatchFromProps & IAccountProps & StateFromProps;


class Account extends React.Component<AccountRedux, IAccountClassState> {

    addGroupInput: HTMLInputElement;

    constructor() {
        super();
        this.state = {
            isShowAddForm: false,
            currentGroup: 0
        }
        this.addGroupInput = null;
    }

    componentDidMount() {
        this.props.getGroups();
    }

    getGroupUsersInfo() {
        this.props.onGetGroupUsersInfo(3);
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
        const gloupsList = Object.keys(this.props.groupsList).length ? this.props.groupsList : null;
        return <div className="account-wrapper">
            <div className="account-header">
                <h3>Статистика</h3>
            </div>
            <Sidebar getGroupUsersInfo={ () => this.getGroupUsersInfo() }/>
            <div id="content">

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
});

const mapDispatchToProps = (dispatch: any):DispatchFromProps => ({
    onGetGroupUsersInfo: (group_id: number) => dispatch(getGroupUsersInfo(group_id)),
    getGroups: () => dispatch(getGroups()),
    addGroup: (data: addGroupData) => dispatch(addGroup(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);