import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import createHistory from 'history/createBrowserHistory'

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import reducers from './reducers'

const history = createHistory()
const middleware = routerMiddleware(history)

import promiseMiddleware from './middleware/promiseMiddleware';

const store = createStore(
  reducers,
  applyMiddleware(middleware, promiseMiddleware, thunk)
)

import WrapperClass from "./containers/Wrapper";

const routes = (
    <Provider store={store}>
    { /* ConnectedRouter will use the store from Provider automatically */ }
    <ConnectedRouter history={history}>
        <WrapperClass/>
    </ConnectedRouter>
  </Provider>
);

ReactDOM.render(routes, document.getElementById("app"));