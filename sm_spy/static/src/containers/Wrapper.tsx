import * as React from "react";
import { connect } from 'react-redux';
import { Route } from 'react-router';

import Main from "./Main";
import Header from '../components/Header';
import Footer from '../components/Footer';

import { getUserInfo } from '../actions/userActions';


interface IWrapperClassProps {

}

interface IWrapperClassState {

}

interface StateFromProps {
    label: number
}

interface DispatchFromProps {
  onGetUserInfo: () => void;
}

type WrapperRedux = DispatchFromProps & IWrapperClassProps & StateFromProps;

class Wrapper extends React.Component<WrapperRedux, IWrapperClassState>  {

    props: WrapperRedux;
    state: IWrapperClassState;

    constructor(props: WrapperRedux) {
        super(props);
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

const mapDispatchToProps = (dispatch: any, ownProp: IWrapperClassProps) => ({
      onGetUserInfo: () => dispatch(getUserInfo())
});

export default connect<StateFromProps, DispatchFromProps, IWrapperClassProps>(mapStateToProps,
                                                                              mapDispatchToProps)(Wrapper);