import * as React from "react";

import './css/sidebar.scss';

interface ISidebarProps {

}

export default class Sidebar extends React.Component<ISidebarProps, any> {

    getPartData() {

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