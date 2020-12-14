import {Button, Card, Container} from "react-bootstrap";

import './sign-in.styles.css'
import React from "react";

const SignIn = () => (
    <Container>
        <Card className='mt-4 mx-auto' style={{ width: '21.5rem' }}>
            <h1 className='text-center mt-4 app-name'>UniCalendar</h1>
            <Card.Img className='mx-auto' style={{ width: '150px' }} variant="top" src="./unicalendar.svg" />
            <Card.Body>
                <Card.Title className='text-center'>Accedi</Card.Title>
                <Card.Text className='text-center'>
                    Non hai un account? Accedi con Google
                </Card.Text>
                <Button href='http://localhost:8082/auth/google/oauth' className='btn-block' variant="danger">
                    Sign in with Google
                </Button>
            </Card.Body>
        </Card>
    </Container>
);
export default SignIn
