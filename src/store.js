import { createStore } from "redux";
import rootReducer from "./reactRedux";

const store = createStore(rootReducer);

export default store;
