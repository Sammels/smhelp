import * as React from "react";
import Gallery from '../components/Gallery';

import './css/main.scss';

interface IMainProps {
    match: any;
    location: any;
    history: any;
}

interface IMainState {
    lightboxIsOpen: boolean
}


const MainClass = class Main extends React.Component<IMainProps, IMainState> {

    props: IMainProps

    constructor(props: IMainProps) {
        super(props);
        this.state = {
            lightboxIsOpen: false
        }
    }

    render () {
        const PHOTO_SET = [
            { src: '/static/img/gallery/members.png', width: 1200, height: 800 },
            { src: '/static/img/gallery/users_online.png', width: 1200, height: 800 },
            { src: '/static/img/gallery/geography.png', width: 1200, height: 800 },
            { src: '/static/img/gallery/intersection.png', width: 1200, height: 800 },
        ]
        return (<div className="main-content">
                    <div className="slider">
                        <img src="/static/img/slider.jpg" className="slider-image"/>
                        <div className="slider-hint">
                            <div className="hint-title">Ваш новый уровень</div>
                            <div className="hint-text">Анализируй свои возможности</div>
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
                                <div className="icon"><i className="fa fa-globe" aria-hidden="true"></i></div>
                                <h3>География подписчиков</h3>
                                <div className="description">Проможет в продвижении региональных групп</div>
                            </article>
                            <article className="service">
                                <div className="icon"><i className="fa fa-crosshairs" aria-hidden="true"></i></div>
                                <h3>Пересечение участников</h3>
                                <div className="description">Поможет найти аудиторию для вашей группы. </div>
                            </article>
                        </div>
                    </div>
                    <div className="services">
                        <h2>Примеры интерфеса</h2>
                         <Slider images = {PHOTO_SET} isInfinite delay={5000}>
                         {PHOTO_SET.map((image, key) => <div key={key}><img src={PHOTO_SET}/></div) }
                         </Slider>
                    </div>
                </div>);
      }
}

export default MainClass;