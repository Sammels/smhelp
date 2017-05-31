import { combineReducers } from 'redux';
import userReducer from '../reducer/userReducer';

const appReducer = combineReducers({
    userReducer
});

export default appReducer