import React from "react";
import { store } from "./store/store";
import { Provider } from "react-redux";
import {createRoot} from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { HelmetProvider } from "react-helmet-async";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <Router basename="/">
        <HelmetProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </HelmetProvider>
    </Router>,
);