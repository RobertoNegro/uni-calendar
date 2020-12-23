import React from "react";

import {Button, Card, Image, ListGroup} from "react-bootstrap";

class UserProfile extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentUser: null,
        }
    }

    render() {
        return (
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
                        </ListGroup>
                    </Card.Body>
                </Card>
        );
    }
}


export default UserProfile;
