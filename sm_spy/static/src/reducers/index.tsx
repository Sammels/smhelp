import { combineReducers } from 'redux';
import userReducer from './userReducer';
import groupsReducer from './groupsReducer';

const appReducer = combineReducers({
    userReducer,
    groupsReducer
});

export default appReducer