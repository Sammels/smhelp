import * as React from "react";

import './css/sidebar.scss';

interface ISidebarProps {
    getGroupUsersInfo: (action: string) => void
}

export default class Sidebar extends React.Component<ISidebarProps, any> {

    props: ISidebarProps

    getPartData(action: string) {
        this.props.getGroupUsersInfo(action);
    }

    getMyGroups() {

    }

    render () {
        return <div className="account-sidebar">
            <h3>Выберите: </h3>
            <ul>
                <li><a onClick={ () => this.getPartData('members') }>Участники группы</a></li>
                <li><a onClick={ () => this.getPartData('geography') }>География подписчиков</a></li>
                <li><a onClick={ () => this.getPartData('active_members') }>Активные участники</a></li>
                <li><a onClick={ () => this.getPartData('cross_groups') }>Пересечение групп</a></li>
            </ul>
        </div>
    }
}