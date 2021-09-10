import { createStore } from "redux";
import { persistCombineReducers } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AuthReducer from "./reducers/authReducer/AuthReducer";
import TaskReducer from "./reducers/taskReducer/TaskReducer";
import FilterReducer from "./reducers/filterReducer/FilterReducer";

const rootPersistConfig = {
  key: "root",
  storage: AsyncStorage,
};

export default createStore(
  persistCombineReducers(rootPersistConfig, {
    AuthReducer,
    TaskReducer,
    FilterReducer,
  })
);
