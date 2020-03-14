import { combineReducers } from 'redux';

import app from './app';
import config from './config';

const rootReducer = combineReducers({
	app,
	config,
})

export default rootReducer;
