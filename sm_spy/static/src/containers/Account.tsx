import * as React from "react";

import Sidebar from '../components/Account/Sidebar'

import './css/account.scss';

interface IAccountProps {
    match: any;
    location: any;
    history: any;
}

export default class Account extends React.Component<IAccountProps, any> {
    render () {
        return <div>
            <div className="account-header">
                <h3>Статистика</h3>
            </div>
            <Sidebar/>
            <div id="content">

            </div>
        </div>
    }
}