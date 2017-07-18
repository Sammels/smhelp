import * as React from "react";

import './css/main.scss';

interface IMain {
    match: any;
    location: any;
    history: any;
}


const MainClass = class Main extends React.Component<IMain, any> {

    render () {
        console.log(this.props);
        return (<div className="main-content">
                    <div className="slider">
                        <img src="/static/img/slider.jpg" className="slider-image"/>
                        <div className="slider-hint">
                            <div className="hint-title">Ваш новый уровень</div>
                            <div className="hint-text">Продвигай свой бизнес <br/> Легко и смело</div>
                        </div>
                    </div>
                    <div className="services">
                        <h2>Наши услуги</h2>
                        <div className="list">
                            <article className="service">
                                <div className="icon"><i className="fa fa-bar-chart" aria-hidden="true"></i></div>
                                <h3>Мониторинг активности</h3>
                                <div className="description">Следит за тем когда человек появляется в сети. Поможет узнать время вашей аудитории </div>
                            </article>
                            <article className="service">
                                <div className="icon"><i className="fa fa-address-book-o" aria-hidden="true"></i></div>
                                <h3>Мониторинг участников</h3>
                                <div className="description">Покажет кто добавился или удалился из участников группы</div>
                            </article>
                            <article className="service">
                                <div className="icon"><i className="fa fa-comments" aria-hidden="true"></i></div>
                                <h3>Мониторинг лайков</h3>
                                <div className="description">Регулярно сканируе страницу группу. Покажет популярные записи</div>
                            </article>
                            <article className="service">
                                <div className="icon"><i className="fa fa-heart" aria-hidden="true"></i></div>
                                <h3>Мониторинг комментариев</h3>
                                <div className="description">Находит все комментарии в группе. </div>
                            </article>
                        </div>
                    </div>
                </div>);
      }
}

export default MainClass;