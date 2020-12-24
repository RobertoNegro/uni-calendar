import React, { Component } from "react";
import Header from "../header/header.component";
import { Container } from "react-bootstrap";
import { withCookies } from "react-cookie";
import { ReactCookieProps } from "react-cookie/cjs/types";
import User from "../../models/User";
import Loader from "../loader/loader.component";
import { checkSessionCookie } from "../../helpers";
import { History } from "history";

interface PageContainerProps extends ReactCookieProps {
  hideHeader?: boolean;
  requireAuth?: boolean;
  history: History;
}

interface PageContainerState {
  authChecked: boolean;
  user: undefined | User;
}

class PageContainer extends Component<PageContainerProps, PageContainerState> {
  constructor(props: PageContainerProps) {
    super(props);
    this.state = {
      authChecked: !props.requireAuth,
      user: undefined,
    };
  }

  componentDidMount() {
    const { authChecked } = this.state;
    const { history, cookies } = this.props;

    if (!authChecked) {
      if (cookies) {
        checkSessionCookie(cookies).then((user: User | undefined) => {
          if (user) {
            this.setState({ authChecked: true, user: user });
          } else {
            history.replace("/");
          }
        });
      } else {
        history.replace("/");
      }
    }
  }

  render() {
    const { hideHeader } = this.props;
    const { authChecked } = this.state;

    return (
      <>
        <Loader show={!authChecked} />
        {authChecked && (
          <>
            {!hideHeader && <Header />}
            <Container>{this.props.children}</Container>
          </>
        )}
      </>
    );
  }
}

export default withCookies(PageContainer);
