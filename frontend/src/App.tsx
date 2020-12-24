import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import HomePage from "./pages/homepage/homepage.component";
import SignIn from "./pages/sign-in/sign-in.component";
import LoginDone from "./pages/login-done/login-done.component";
import UserProfile from "./pages/user-profile/user-profile.component";
import IndexPage from "./pages/index/index.component";

function App() {
  return (
    <Switch>
      <Route exact path="/" component={IndexPage} />
      <Route exact path="/login" component={SignIn} />
      <Route path="/login/done" component={LoginDone} />
      <Route path="/profile" component={UserProfile} />
      <Route path="/homepage" component={HomePage} />
    </Switch>
  );
}

export default App;
