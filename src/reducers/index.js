import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger'

import fileManagerReducer from './file-manager';
import CopyMoveReducer from './copy-move';

const rootReducer = combineReducers({
	levelData: fileManagerReducer,
	copyMovePaths: CopyMoveReducer
});

const store = createStore(rootReducer, {}, applyMiddleware(thunk, logger));

export default store;
