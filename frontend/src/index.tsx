import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import {CookiesProvider} from "react-cookie";
import Header from "./components/header/header.component";
import {Container} from "react-bootstrap";

ReactDOM.render(
    <CookiesProvider>
        <BrowserRouter>
            <Header/>
            <Container>
                <App />
            </Container>
        </BrowserRouter>
    </CookiesProvider>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
