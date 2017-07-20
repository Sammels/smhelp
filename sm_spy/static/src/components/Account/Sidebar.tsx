import * as React from "react";

import './css/sidebar.scss';

interface ISidebarProps {
    getGroupUsersInfo: () => void
}

export default class Sidebar extends React.Component<ISidebarProps, any> {

    getPartData() {
        this.props.getGroupUsersInfo();
    }

    getMyGroups() {

    }

    render () {
        return <div className="account-sidebar">
            <ul>
                <li><a onClick={ () => this.getPartData() }>Участники группы</a></li>
            </ul>
        </div>
    }
}