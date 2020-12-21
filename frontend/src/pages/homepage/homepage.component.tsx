import {Button, Card, Col, Container, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import Header from "../../components/header/header.component";
import React from "react";
import DeleteModal from "../../components/delete-modal/delete-modal.component";

class HomePage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentUser: null,
            courses: null,
            deleteModal: false
        }
    }

    handleClose =  () => {
        this.setState({deleteModal : false});
    }
    handleShow =  () =>  {
        this.setState({deleteModal : true});
    }
    render() {
        return (
            <div>
                <Header/>
                <Container>
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
                                                <Button variant="light mr-1"><i className="fas fa-cog"></i></Button>
                                                <Button variant="light" onClick={this.handleShow}><i className="fas fa-trash"></i></Button>
                                            </Col>
                                        </Row>
                                    </ListGroupItem>
                                </ListGroup>
                        </Card.Body>
                    </Card>
                </Container>
                <DeleteModal show={this.state.deleteModal} handleClose={this.handleClose}/>
            </div>
        );
    }
}


export default HomePage;
