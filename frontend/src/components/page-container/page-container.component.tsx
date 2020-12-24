import React, { Component, ReactNode } from "react";
import Header from "../header/header.component";
import { CardContainer } from "../card-container/card-container.component";
import { Container } from "react-bootstrap";
import { withCookies } from "react-cookie";
import { ReactCookieProps } from "react-cookie/cjs/types";
import axios from "axios";
import config from "../../config";
import User from "../../models/User";
import Loader from "../loader/loader.component";

interface PageContainerProps extends ReactCookieProps {
  header: string | ReactNode;
  title: string;
  history?: any;
  hideHeader?: boolean;
  requireAuth?: boolean;
  buttonTitle: string;
  handleModal: () => void;
}
interface PageContainerState {
  authChecked: boolean;
  user: undefined | User;
}

class PageContainer extends Component<PageContainerProps, PageContainerState> {
  async checkAuth() {
    const { cookies } = this.props;
    if (cookies) {
      try {
        const sessionToken = cookies.get("sessionToken");
        console.log("Bearer " + sessionToken);
        const userReq = await axios.get<{ user: User }>(
          config.API_URL + "/auth",
          {
            headers: {
              Authorization: "Bearer " + sessionToken,
            },
          }
        );
        if (userReq.data && userReq.data.user && userReq.data.user.id) {
          return userReq.data.user;
        }
      } catch (e) {
        console.warn(e);
      }
    }
    return undefined;
  }
  constructor(props: PageContainerProps) {
    super(props);
    this.state = {
      authChecked: !props.requireAuth,
      user: undefined,
    };
  }

  componentDidMount() {
    if (!this.state.authChecked) {
      this.checkAuth().then((user: User | undefined) => {
        if (user) {
          this.setState({ authChecked: true, user: user });
        } else {
          this.props.history.replace("/");
        }
      });
    }
  }

  render() {
    const { hideHeader, header, title, buttonTitle, handleModal } = this.props;
    const { authChecked } = this.state;

    if (!authChecked) {
      return <Loader />;
    }
    return (
      <div>
        {!hideHeader && <Header />}
        <Container>
          <CardContainer
            header={header}
            title={title}
            buttonTitle={buttonTitle}
            handleModal={handleModal}
          >
            {this.props.children}
          </CardContainer>
        </Container>
      </div>
    );
  }
}

export default withCookies(PageContainer);
