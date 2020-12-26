import { Button, Col, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import React, { Component } from "react";
import CustomizeModal from "../../components/customize-modal/customize-modal.component";
import PageContainer from "../../components/page-container/page-container.component";
import ConfirmModal from "../../components/confim-modal/confirm-modal.component";
import { CardContainer } from "../../components/card-container/card-container.component";
import { Redirect, RouteComponentProps } from "react-router-dom";
import AuthContext from "../../contexts/auth.context";

interface HomePageProps extends RouteComponentProps {}

interface HomePageState {
  currentUser: null | string;
  showHideDeleteModal: boolean;
  showHideCustomizeModal: boolean;
  addCourse: boolean;
}

class HomePage extends Component<HomePageProps, HomePageState> {
  static contextType = AuthContext;

  constructor(props: HomePageProps) {
    super(props);
    this.state = {
      currentUser: null,
      showHideDeleteModal: false,
      showHideCustomizeModal: false,
      addCourse: false,
    };
  }

  handleDeleteModal = () => {
    this.setState({ showHideDeleteModal: !this.state.showHideDeleteModal });
  };

  handleCustomizeModal = () => {
    this.setState({
      showHideCustomizeModal: !this.state.showHideCustomizeModal,
      addCourse: false,
    });
  };
  onButtonClickModal = () => {
    this.setState({
      showHideCustomizeModal: !this.state.showHideCustomizeModal,
      addCourse: true,
    });
  };

  render() {
    return (
      <PageContainer requireAuth={true} history={this.props.history}>
        <AuthContext.Consumer>
          {({ user }) =>
            user ? (
              <>
                <CardContainer
                  header={user.university ? user.university.fullName : ""}
                  title={"Your courses"}
                  buttonTitle={"Add course"}
                  handleModal={this.onButtonClickModal}
                >
                  <ListGroup className="list-group-flush">
                    <ListGroupItem>
                      <Row>
                        <Col>Machine Learning</Col>
                        <Col className="text-right">Aula B107</Col>
                        <Col className="text-right">
                          <Button
                            variant="light mr-1"
                            onClick={this.handleCustomizeModal}
                          >
                            <i className="fas fa-cog" />
                          </Button>
                          <Button
                            variant="light"
                            onClick={this.handleDeleteModal}
                          >
                            <i className="fas fa-trash" />
                          </Button>
                        </Col>
                      </Row>
                    </ListGroupItem>
                  </ListGroup>
                </CardContainer>
                <ConfirmModal
                  show={this.state.showHideDeleteModal}
                  handleClose={this.handleDeleteModal}
                  title={"Delete course from list"}
                  text={
                    "Are you sure you want to remove this course from your list?"
                  }
                />
                <CustomizeModal
                  show={this.state.showHideCustomizeModal}
                  handleClose={this.handleCustomizeModal}
                  addCourse={this.state.addCourse}
                />
              </>
            ) : null
          }
        </AuthContext.Consumer>
      </PageContainer>
    );
  }
}

export default HomePage;
