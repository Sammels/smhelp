import * as React from "react";

var styles = require('./header.scss');

interface IHeaderProps {}


const HeaderClass = class Header extends React.Component<IHeaderProps, any> {

    login() {
        window['authVK']();
    }

    logout() {
        return false;
    }

    showUserMenu () {
        return (<div>
            <a href="#/account" className="login-link">Кабинет</a>
            <a href="javascript:void(0);" onClick={ () => this.logout() } className="login-link">Выход</a>
        </div>)
    }

    showLogIn() {
        return (<a href="javascript:void(0);" onClick={ () => this.login() } className="login-link">
                                Вход через VK
                            </a>)
    }

    render () {
        return <div className='header'>
                    <div className='header-top'></div>
                    <div className='header-bottom'>
                        <div className="header-logo">
                            <img src="/static/img/logo.png" className="logo"/>
                            <span>vk-помощник</span>
                        </div>
                        <nav>
                            <ul>
                                <li><a href="">On-line</a></li>
                                <li><a href="">Друзья</a></li>
                                <li><a href="">Лайки</a></li>
                            </ul>
                        </nav>
                        <div className="account">{ window['userInfo'] ? this.showUserMenu() : this.showLogIn() }</div>
                    </div>
                </div>;
      }
}

export default HeaderClass;