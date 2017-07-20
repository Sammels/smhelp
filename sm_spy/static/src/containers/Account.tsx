import * as React from "react";
import { connect } from 'react-redux';

import Sidebar from '../components/Account/Sidebar';
import { getGroupUsersInfo, getGroups } from '../actions/groupsActions';

import './css/account.scss';

interface IAccountProps {
    match: any;
    location: any;
    history: any;
}

interface IAccountClassState {

}

interface StateFromProps {
    groups: object,
    groupInfo: object,
}

interface DispatchFromProps {
    onGetGroupUsersInfo: (group_id: number) => void;
    getGroups: () => void;
}

type AccountRedux = DispatchFromProps & IAccountProps & StateFromProps;


class Account extends React.Component<AccountRedux, IAccountClassState> {

    componentDidMount() {
        this.props.getGroups();
    }

    getGroupUsersInfo() {
        this.props.onGetGroupUsersInfo(3);
    }

    render () {
        return <div>
            <div className="account-header">
                <h3>Статистика</h3>
            </div>
            <Sidebar getGroupUsersInfo={ () => this.getGroupUsersInfo() }/>
            <div id="content">

            </div>
        </div>
    }
}

const mapStateToProps = (state: any, ownProp? :any):StateFromProps => ({
    groups: state.groupsReducer.groups,
    groupInfo: state.groupsReducer.groupInfo,
});

const mapDispatchToProps = (dispatch: any):DispatchFromProps => ({
    onGetGroupUsersInfo: (group_id: number) => dispatch(getGroupUsersInfo(group_id)),
    getGroups: () => dispatch(getGroups())
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);