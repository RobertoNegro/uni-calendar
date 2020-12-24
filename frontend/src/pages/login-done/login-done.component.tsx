import React from "react";
import { instanceOf } from "prop-types";
import { Alert } from "react-bootstrap";
import { Cookies, withCookies } from "react-cookie";
import queryString from "query-string";
import moment from "moment";

class LoginDone extends React.Component<any, any> {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  constructor(props: any) {
    super(props);
    this.state = {
      redirect: "/homepage",
    };
  }

  render() {
    return <Alert variant="success">Login success</Alert>;
  }
  componentDidMount() {
    this.handleSessionCookie();
    this.props.history.replace(this.state.redirect);
  }

  handleSessionCookie() {
    const { cookies } = this.props;
    const params = queryString.parse(this.props.location.search);
    let sessionToken = params.token;
    let exp: number | string[] | string | null = params.exp;

    if (Array.isArray(sessionToken)) {
      sessionToken = sessionToken[0];
    }
    if (Array.isArray(exp)) {
      exp = exp[0];
    }

    if (exp) {
      try {
        exp = parseInt(exp);
      } catch (e) {
        exp = null;
      }
    }

    if (sessionToken) {
      cookies.set("sessionToken", sessionToken, {
        path: "/",
        expires:
          typeof exp === "number" ? moment(exp * 1000).toDate() : undefined,
      });
    }
  }
}
export default withCookies(LoginDone);
