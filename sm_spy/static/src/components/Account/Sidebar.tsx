import * as React from "react";
var classNames = require('classnames');

import './css/sidebar.scss';

interface ISidebarProps {
    getGroupUsersInfo: (action: string) => void,
    currentAction: string
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
                <li className={classNames({'active': (this.props.currentAction == 'members')})}>
                    <a onClick={ () => this.getPartData('members') }>Участники группы</a>
                </li>
                <li className={classNames({'active': (this.props.currentAction == 'geography')})}>
                    <a onClick={ () => this.getPartData('geography') }>География подписчиков</a>
                </li>
                <li className={classNames({'active': (this.props.currentAction == 'active_members')})}>
                    <a onClick={ () => this.getPartData('active_members') }>Активные участники</a>
                </li>
                <li className={classNames({'active': (this.props.currentAction == 'cross_groups')})}>
                    <a onClick={ () => this.getPartData('cross_groups') }>Пересечение групп</a>
                </li>
            </ul>
        </div>
    }
}