import { Button, Col, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import React, { Component } from "react";
import CustomizeModal from "../../components/customize-modal/customize-modal.component";
import { PageContainer } from "../../components/page-container/page-container.component";
import ConfirmModal from "../../components/confim-modal/confirm-modal.component";

interface HomePageState {
  currentUser: null | string;
  showHideDeleteModal: boolean;
  showHideCustomizeModal: boolean;
  addCourse: boolean;
}

class HomePage extends Component<any, HomePageState> {
  constructor(props: any) {
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
      addCourse: false
    });
  };
  onButtonClickModal = () => {
    this.setState({
      showHideCustomizeModal: !this.state.showHideCustomizeModal,
      addCourse: true
    });
  };

  render() {
    return (
      <PageContainer
        header={"Università degli Studi di Trento"}
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
                <Button variant="light" onClick={this.handleDeleteModal}>
                  <i className="fas fa-trash" />
                </Button>
              </Col>
            </Row>
          </ListGroupItem>
        </ListGroup>
        <ConfirmModal
          show={this.state.showHideDeleteModal}
          handleClose={this.handleDeleteModal}
          title={'Delete course from list'}
          text={'Are you sure you want to remove this course from your list?'}
        />
        <CustomizeModal
          show={this.state.showHideCustomizeModal}
          handleClose={this.handleCustomizeModal}
          addCourse={this.state.addCourse}
        />
      </PageContainer>
    );
  }
}

export default HomePage;
