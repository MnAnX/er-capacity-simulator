import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "./reducers";

const loggerMiddleware = createLogger({
	colors: false
});

const createStoreWithMiddleware = applyMiddleware(
	thunkMiddleware,
	loggerMiddleware
);

const initialState = {};

const configureStore = createStore(rootReducer, initialState, compose(createStoreWithMiddleware));

export default configureStore;
