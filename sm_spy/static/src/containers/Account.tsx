import * as React from "react";
import { connect } from 'react-redux';

import Sidebar from '../components/Account/Sidebar';
import { getGroupUsersInfo } from '../actions/groupsActions';

import './css/account.scss';

interface IAccountProps {
    match: any;
    location: any;
    history: any;
}

export interface IAccountClassState {

}

export interface StateFromProps {

}

interface DispatchFromProps {
    onGetGroupUsersInfo: (group_id: number) => void;
}

type AccountRedux = DispatchFromProps & IAccountProps & StateFromProps;


class Account extends React.Component<AccountRedux, any> {

    group_id: number;

    constructor(props: AccountRedux) {
        super(props);
        this.group_id = 1;
    }

    getGroupUsersInfo() {
        this.props.onGetGroupUsersInfo(this.group_id);
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

const mapStateToProps= (state: any, ownProp: IAccountProps) => ({

});

const mapDispatchToProps = (dispatch: any) => ({
    onGetGroupUsersInfo: (group_id: number) => dispatch(getGroupUsersInfo(group_id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);