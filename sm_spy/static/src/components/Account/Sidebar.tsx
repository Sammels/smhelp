import * as React from "react";
var classNames = require('classnames');

import './css/sidebar.scss';
import '../../typing'


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
                    <a onClick={ () => this.getPartData('active_members') }>Активность участников</a>
                </li>
                <li className={classNames({'active': (this.props.currentAction == 'cross_groups')})}>
                    <a onClick={ () => this.getPartData('cross_groups') }>Пересечение групп</a>
                </li>
                <li className={classNames({'active': (this.props.currentAction == 'group_wall')})}>
                    <a onClick={ () => this.getPartData('group_wall') }>Стена группы</a>
                </li>
                <li className={classNames({'active': (this.props.currentAction == 'retargeting')})}>
                    <a onClick={ () => this.getPartData('retargeting') }>Ретаргетинг</a>
                </li>
            </ul>
        </div>
    }
}