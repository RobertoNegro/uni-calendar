import React from "react";
import { withCookies } from "react-cookie";
import queryString from "query-string";
import moment from "moment";
import Loader from "../../components/loader/loader.component";
import { ReactCookieProps } from "react-cookie/cjs/types";
import { RouteComponentProps } from "react-router-dom";
import AuthContext from "../../contexts/auth.context";

interface LoginDoneProps extends ReactCookieProps, RouteComponentProps {}
interface LoginDoneState {
  redirect: string;
}

class LoginDone extends React.Component<LoginDoneProps, LoginDoneState> {
  static contextType = AuthContext;

  constructor(props: LoginDoneProps) {
    super(props);
    this.state = {
      redirect: "/",
    };
  }

  componentDidMount() {
    this.handleSessionCookie();
    this.props.history.replace(this.state.redirect);
  }

  handleSessionCookie() {
    const { cookies, history } = this.props;
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

    if (cookies && sessionToken) {
      cookies.set("sessionToken", sessionToken, {
        path: "/",
        expires:
          typeof exp === "number" ? moment(exp * 1000).toDate() : undefined,
      });
    } else {
      history.replace("/?err");
    }
  }

  render() {
    return <Loader show={true} />;
  }
}
export default withCookies(LoginDone);
