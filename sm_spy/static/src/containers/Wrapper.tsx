///<reference path="../../../../node_modules/@types/react-redux/index.d.ts"/>
import * as React from "react";
import { connect } from 'react-redux';
import {
  HashRouter as Router,
  Route
} from 'react-router-dom'


import Main from "./Main";
import Account from "./Account";
import Header from '../components/Header';
import Footer from '../components/Footer';

import { getUserInfo } from '../actions/userActions';

import './css/wrapper.scss';


interface IWrapperClassProps {

}

interface IWrapperClassState {

}

export interface StateFromProps {
    label: number
}

interface DispatchFromProps {
  onGetUserInfo: () => void;
}

type WrapperRedux = DispatchFromProps & IWrapperClassProps & StateFromProps;

class Wrapper extends React.Component<WrapperRedux, IWrapperClassState>  {

    props: WrapperRedux;
    state: IWrapperClassState;

    constructor() {
        super();
        this.state = {

        }
    }

    componentDidMount() {
        this.props.onGetUserInfo();
        const currentTimeZone = (new Date).getTimezoneOffset()/-60;
        const date = new Date(new Date().getTime() + 60 * 1000);
        document.cookie = "time_zone=" + currentTimeZone + "; path=/; expires=" + date.toUTCString();
    }

    render () {
        return (
            <div className="main" >
                <Header />
                <Router>
                    <div className="content">
                        <Route exact path='/' component={Main} />
                        <Route path='/account' component={Account} />
                    </div>
                </Router>
                <Footer />
            </div>
        )
      }
}

const mapStateToProps= (state: any, ownProp: IWrapperClassProps) => ({
    label: state.label
});

const mapDispatchToProps = (dispatch: any) => ({
      onGetUserInfo: () => dispatch(getUserInfo())
});


export default connect(mapStateToProps, mapDispatchToProps)(Wrapper);