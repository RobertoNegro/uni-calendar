import React from "react";

import {Button, Card, Container, Image, ListGroup} from "react-bootstrap";
import Header from "../../components/header/header.component";
import ConfirmModal from "../../components/confim-modal/confirm-modal.component";

interface UserProfileState {
    currentUser: null,
    showConfirmModal: boolean,
}

class UserProfile extends React.Component<any, UserProfileState> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentUser: null,
            showConfirmModal: false
        }
    }
    handleConfirmModal = () => {
        this.setState({ showConfirmModal: !this.state.showConfirmModal });
    };

    render() {
        return (
            <div>
                <Header/>
                <Container>
                    <Card className='mt-3'>
                        <Image src="./unicalendar.svg" style={{width: "150px", height: "150px"}} className='mx-auto mt-4' roundedCircle />
                        <Card.Body>
                            <Card.Title className='text-center'>Hi, Giulia Peserico</Card.Title>
                            <Card.Text className='text-center'>You can handle your information here.</Card.Text>
                            <ListGroup variant="flush">
                                <ListGroup.Item>Giulia Peserico</ListGroup.Item>
                                <ListGroup.Item>giu.peserico@gmail.com</ListGroup.Item>
                                <ListGroup.Item className='d-flex justify-content-between'>
                                    <span>Università degli studi di Trento</span>
                                    <Button variant="secondary">Edit</Button>
                                </ListGroup.Item>
                                <ListGroup.Item className='d-flex justify-content-between'>
                                    <span>Telegram connection</span>
                                    <Button variant="secondary" onClick={this.handleConfirmModal}>Send code</Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Container>
                <ConfirmModal
                    show={this.state.showConfirmModal}
                    handleClose={this.handleConfirmModal}
                    title={'Connection with telegram'} text={'Your code to connect' +
                ' you' +
                ' account with' +
                ' Telegram is: '}>

                </ConfirmModal>
            </div>

        );
    }
}


export default UserProfile;
