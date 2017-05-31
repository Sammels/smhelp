import * as React from "react";

import './css/main.scss';

interface IMain {
    match: any;
    location: any;
    history: any;
}


const MainClass = class Main extends React.Component<IMain, any> {
    constructor(props: any) {
        super(props);
    }
    render () {
        return (<div className="main-content">
                    <div className="slider">
                        <img src="/static/img/slider.jpg" className="slider-image"/>
                        <div className="slider-hint">
                            <div className="hint-title">Победа за нами</div>
                            <div className="hint-text">Используй свою жертву <br/> Легко и смело</div>
                        </div>
                    </div>
                    <div className="services">
                        <h2>Наши услуги</h2>
                        <div className="list">
                            <article className="service">
                                <div className="icon"><i className="fa fa-bar-chart" aria-hidden="true"></i></div>
                                <h3>Мониторинг активности</h3>
                                <div className="description">Следит за тем когда человек появляется в сети. </div>
                            </article>
                            <article className="service">
                                <div className="icon"><i className="fa fa-address-book-o" aria-hidden="true"></i></div>
                                <h3>Мониторинг контактов</h3>
                                <div className="description">Покажет кто добавился или удалился из друзей цели.</div>
                            </article>
                            <article className="service">
                                <div className="icon"><i className="fa fa-comments" aria-hidden="true"></i></div>
                                <h3>Мониторинг лайков</h3>
                                <div className="description">Регулярно сканирует персональную страницу человека. </div>
                            </article>
                            <article className="service">
                                <div className="icon"><i className="fa fa-heart" aria-hidden="true"></i></div>
                                <h3>Мониторинг комментариев</h3>
                                <div className="description">Находит все комментарии пользователя. </div>
                            </article>
                        </div>
                    </div>
                </div>);
      }
}

export default MainClass;