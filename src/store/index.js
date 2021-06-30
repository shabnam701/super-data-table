import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import * as rootReducer from '../reducers';
import apiMiddleware from '../middleware/api';

const initialState = {};
const middlewareState = applyMiddleware(apiMiddleware, thunk, logger);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({ ...rootReducer }),
  initialState,
  composeEnhancers(middlewareState),
);
window.store = store;
export default store;
