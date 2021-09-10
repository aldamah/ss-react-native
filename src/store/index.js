import { createStore, compose } from "redux";

import reducer from "./reducer";

const enhancerList = [];
const devToolsExtension = window && window.__REDUX_DEVTOOLS_EXTENSION__;

if (typeof devToolsExtension === "function") {
  enhancerList.push(devToolsExtension());
}

const composedEnhancer = compose(...enhancerList);

const initStore = () => createStore(reducer, {}, composedEnhancer);

module.exports = {
  initStore,
};
