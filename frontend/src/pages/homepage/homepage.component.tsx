import {Button, Card, Col, Container, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import React from "react";
import DeleteModal from "../../components/delete-modal/delete-modal.component";
import CustomizeModal from "../../components/customize-modal/customize-modal.component";

class HomePage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentUser: null,
            courses: null,
            showHideDeleteModal: false,
            showHideCustomizeModal: false
        }
    }

    handleDeleteModal =  () => {
        this.setState({showHideDeleteModal : !this.state.showHideDeleteModal});
    }
    handleCustomizeModal =  () => {
        this.setState({showHideCustomizeModal : !this.state.showHideCustomizeModal});
    }
    render() {
        return (
            <div>
                <Card className='mx-auto mt-4'>
                    <Card.Header className='font-weight-bold'>Università degli Studi di Trento</Card.Header>
                    <Card.Body>
                        <Card.Title>Your courses</Card.Title>
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>
                                    <Row>
                                        <Col>Machine Learning</Col>
                                        <Col className='text-right'>1 year</Col>
                                        <Col className='text-right'>
                                            <Button variant="light mr-1" onClick={this.handleCustomizeModal}><i className="fas fa-cog"></i></Button>
                                            <Button variant="light" onClick={this.handleDeleteModal}><i className="fas fa-trash"></i></Button>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            </ListGroup>
                    </Card.Body>
                </Card>
                <DeleteModal show={this.state.showHideDeleteModal} handleClose={this.handleDeleteModal}/>
                <CustomizeModal show={this.state.showHideCustomizeModal} handleClose={this.handleCustomizeModal}/>
            </div>
        );
    }
}


export default HomePage;
