import React from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import HomePage from "./pages/homepage/homepage.component";
import SignIn from "./pages/sign-in/sign-in.component";

function App() {
  return (
      <Switch>
          <Route exact path="/" component={SignIn} />
          <Route path="/homepage" component={HomePage} />
      </Switch>
  );
}

export default App;
