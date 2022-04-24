import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App";
import './index.css'
import {Provider} from "react-redux";
import {PlateProvider} from "@udecode/plate"
import {store} from './storage/store'
import {BrowserRouter} from "react-router-dom";
import {ConfirmProvider} from "material-ui-confirm";


ReactDOM.render(
    <ConfirmProvider defaultOptions={{
        cancellationButtonProps: {
            autoFocus: true,
            variant: "outlined"
        },
        confirmationButtonProps: {
            variant: "outlined",
            color: "error"
        },
    }}>
        <BrowserRouter>
            <Provider store={store}>
                <PlateProvider id="confluence">
                    <App/>
                </PlateProvider>
            </Provider>
        </BrowserRouter>
    </ConfirmProvider>,
    document.getElementById('root')
);
