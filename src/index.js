import React from "react";
import ReactDOM from "react-dom";
import "./polyfills/endsWith";
import "./polyfills/performance";
import "./polyfills/includes";
import "./utils/visibility";
import "./index.css";
import Root from "./components/Root";
import configureStore from "./configureStore";
import * as spotify from "./api/spotify";

const store = configureStore();

spotify.catchAuthorization();
if (store.enableSpotify) spotify.authorize();

ReactDOM.render(<Root store={store} />, document.getElementById("root"));
