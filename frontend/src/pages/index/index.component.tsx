import React, { Component } from "react";
import { checkSessionCookie } from "../../helpers";
import User from "../../models/User";
import Loader from "../../components/loader/loader.component";
import { withCookies, ReactCookieProps } from "react-cookie";
import { RouteComponentProps } from "react-router-dom";

interface IndexPageProps extends ReactCookieProps, RouteComponentProps {}

class IndexPage extends Component<IndexPageProps> {
  componentDidMount() {
    const { cookies, history } = this.props;

    if (cookies) {
      checkSessionCookie(cookies).then((user: User | undefined) => {
        if (user) {
          history.replace("/homepage");
        } else {
          history.replace("/login");
        }
      });
    } else {
      history.replace("/login");
    }
  }

  render() {
    return <Loader show={true} />;
  }
}

export default withCookies(IndexPage);
