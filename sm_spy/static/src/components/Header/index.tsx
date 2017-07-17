import * as React from "react";
import { Link } from 'react-router-dom'

var styles = require('./header.scss');

interface IHeaderProps {}


const HeaderClass = class Header extends React.Component<IHeaderProps, any> {

    login() {
        window['authVK']();
    }

    showUserMenu () {
        return (<div>
            <a href="javascript:void(0);" onClick={ () => this.login() } className="login-link">Выход</a>
            <a href="javascript:void(0);" onClick={ () => this.login() } className="login-link">Кабинет</a>
        </div>)
    }

    showLogIn() {
        return (<a href="javascript:void(0);" onClick={ () => this.login() } className="login-link">
                                Вход через VK
                            </a>)
    }

    render () {
        return <div className='header'>
                    <div className='header-top'>
                        { window['userInfo'] ? this.showUserMenu() : this.showLogIn() }
                    </div>
                    <div className='header-bottom'>
                        <div className="header-logo">
                            <img src="/static/img/logo.png" className="logo"/>
                            <span>vk-шпион</span>
                        </div>
                        <nav>
                            <ul>
                                <li><a href="">On-line</a></li>
                                <li><a href="">Друзья</a></li>
                                <li><a href="">Лайки</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>;
      }
}

export default HeaderClass;