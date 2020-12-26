import React from "react";
import "./App.css";
import { Switch, Route } from "react-router-dom";
import HomePage from "./pages/homepage/homepage.component";
import SignIn from "./pages/sign-in/sign-in.component";
import LoginDone from "./pages/login-done/login-done.component";
import UserProfile from "./pages/user-profile/user-profile.component";
import IndexPage from "./pages/index/index.component";
import User from "./models/User";
import AuthContext from "./contexts/auth.context";

interface AppProps {}

interface AppState {
  user: User | null;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      user: null,
    };
  }

  setUser(user: User | null, callback?: () => void) {
    this.setState({ user: user }, callback);
  }

  render() {
    return (
      <AuthContext.Provider
        value={{
          user: this.state.user,
          setUser: this.setUser.bind(this),
        }}
      >
        <Switch>
          <Route exact path="/" component={IndexPage} />
          <Route exact path="/login" component={SignIn} />
          <Route path="/login/done" component={LoginDone} />
          <Route path="/profile" component={UserProfile} />
          <Route path="/homepage" component={HomePage} />
        </Switch>
      </AuthContext.Provider>
    );
  }
}

export default App;
