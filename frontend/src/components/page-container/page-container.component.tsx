import React, { Component } from "react";
import Header from "../header/header.component";
import { Container } from "react-bootstrap";
import { withCookies } from "react-cookie";
import { ReactCookieProps } from "react-cookie/cjs/types";
import User from "../../models/User";
import Loader from "../loader/loader.component";
import { checkSessionCookie } from "../../helpers";
import { History } from "history";
import AuthContext from "../../contexts/auth.context";
import { Redirect } from "react-router-dom";

interface PageContainerProps extends ReactCookieProps {
  hideHeader?: boolean;
  requireAuth?: boolean;
  history: History;
}

interface PageContainerState {
  authChecked: boolean;
}

class PageContainer extends Component<PageContainerProps, PageContainerState> {
  static contextType = AuthContext;

  constructor(props: PageContainerProps) {
    super(props);
    this.state = {
      authChecked: !props.requireAuth,
    };
  }

  componentDidMount() {
    const { authChecked } = this.state;
    const { history, cookies } = this.props;
    const { setUser } = this.context;

    if (!authChecked) {
      if (cookies) {
        checkSessionCookie(cookies).then((user: User | undefined) => {
          if (user) {
            setUser(user, () => {
              this.setState({ authChecked: true });
            });
          } else {
            setUser(null);
            history.replace("/");
          }
        });
      } else {
        setUser(null);
        history.replace("/");
      }
    }
  }

  render() {
    const { user } = this.context;
    const { hideHeader } = this.props;
    const { authChecked } = this.state;

    if (
      authChecked &&
      user &&
      !user.university &&
      (this.props.history.location.pathname !== "/profile" ||
        this.props.history.location.search !== "?uni=missing")
    ) {
      return <Redirect to={"/profile?uni=missing"} />;
    }

    return (
      <>
        <Loader show={!authChecked || (this.props.requireAuth && !user)} />
        {!hideHeader && <Header />}
        <Container>{this.props.children}</Container>
      </>
    );
  }
}

export default withCookies(PageContainer);
