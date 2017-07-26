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
            <h3>Выберите: </h3>
            <ul>
                <li><a onClick={ () => this.getPartData() }>Участники группы</a></li>
                <li><a onClick={ () => this.getPartData() }>География подписчиков</a></li>
                <li><a onClick={ () => this.getPartData() }>Активные участники</a></li>
            </ul>
        </div>
    }
}