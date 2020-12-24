import React from "react";

import { Button, Card, Image, ListGroup } from "react-bootstrap";
import ConfirmModal from "../../components/confim-modal/confirm-modal.component";
import { SearchBar } from "../../components/search-bar/search-bar.component";
import PageContainer from "../../components/page-container/page-container.component";
import { withCookies, ReactCookieProps } from "react-cookie";
import { RouteComponentProps } from "react-router-dom";

interface UserProfileProps extends ReactCookieProps, RouteComponentProps {}

interface UserProfileState {
  currentUser: null;
  showConfirmModal: boolean;
  showSelectUniversityModal: boolean;
  university: { id: number; name: string } | undefined;
}

const universities = [
  {
    id: 0,
    name: "University of Trento",
  },
  {
    id: 1,
    name: "University of Bolzano",
  },
];

class UserProfile extends React.Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);
    this.state = {
      currentUser: null,
      showConfirmModal: false,
      showSelectUniversityModal: false,
      university: undefined,
    };
  }
  handleTelegramModal = () => {
    this.setState({ showConfirmModal: !this.state.showConfirmModal });
  };

  handleUniversityModal = () => {
    this.setState({
      showSelectUniversityModal: !this.state.showSelectUniversityModal,
    });
  };

  handleChangeSearchBar = (selected: { id: number; name: string }[]) => {
    if (selected.length >= 1) {
      this.setState({ university: selected[0] });
    } else {
      this.setState({ university: undefined });
    }
  };

  handleLogout = () => {
    const { cookies, history } = this.props;
    if (cookies) {
      cookies.remove("sessionToken");
      history.replace("/");
    }
  };

  render() {
    return (
      <PageContainer requireAuth={true} history={this.props.history}>
        <Card className="mt-3">
          <Image
            src="./unicalendar.svg"
            style={{ width: "150px", height: "150px" }}
            className="mx-auto mt-4"
            roundedCircle
          />
          <Card.Body>
            <Card.Title className="text-center">Hi, Giulia Peserico</Card.Title>
            <Card.Text className="text-center">
              You can handle your information here.
            </Card.Text>
            <ListGroup variant="flush">
              <ListGroup.Item>Giulia Peserico</ListGroup.Item>
              <ListGroup.Item>giu.peserico@gmail.com</ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Università degli studi di Trento</span>
                <Button
                  variant="secondary"
                  onClick={this.handleUniversityModal}
                >
                  Edit
                </Button>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span>Telegram connection</span>
                <Button variant="secondary" onClick={this.handleTelegramModal}>
                  Send code
                </Button>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-center">
                <Button variant="danger" onClick={this.handleLogout}>
                  Logout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
        <ConfirmModal
          show={this.state.showSelectUniversityModal}
          handleClose={this.handleUniversityModal}
          title={"Choose university"}
        >
          <SearchBar
            label={"Select university"}
            data={universities}
            handleChange={this.handleUniversityModal}
          />
        </ConfirmModal>
        <ConfirmModal
          show={this.state.showConfirmModal}
          handleClose={this.handleTelegramModal}
          title={"Connection with telegram"}
          text={"Your code to connect you account with Telegram is: "}
        />
      </PageContainer>
    );
  }
}

export default withCookies(UserProfile);
