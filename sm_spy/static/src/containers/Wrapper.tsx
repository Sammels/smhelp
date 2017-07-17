///<reference path="../../../../node_modules/@types/react-redux/index.d.ts"/>
import * as React from "react";
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { returntypeof } from 'react-redux-typescript';

import Main from "./Main";
import Header from '../components/Header';
import Footer from '../components/Footer';

import { getUserInfo } from '../actions/userActions';

export interface IWrapperClassProps {

}

export interface IWrapperClassState {

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
    }

    render () {
        return (
            <div className="main" >
                <Header />
                <div className="content">
                    <Route exact path='/' component={Main} />
                </div>
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