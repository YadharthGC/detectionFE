import { combineReducers } from "redux";
import { candidateReducer } from "./reducer";

const rootReducer = combineReducers({ candidateReducer });

export default rootReducer;
