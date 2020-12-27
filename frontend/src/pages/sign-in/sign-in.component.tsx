import { Button, Card } from "react-bootstrap";

import "./sign-in.styles.css";
import React from "react";
import PageContainer from "../../components/page-container/page-container.component";
import { RouteComponentProps } from "react-router-dom";

interface SignInProps extends RouteComponentProps {}

const SignIn = ({ history }: SignInProps) => (
  <PageContainer requireAuth={false} hideHeader={true} history={history}>
    <Card style={{ width: "100%", maxWidth: "30rem" }}>
      <Card.Body
        className={
          "d-flex flex-column align-items-center justify-content-center p-5"
        }
      >
        <h1 className="text-center app-name">UniCalendar</h1>
        <Card.Img
          className="mx-auto"
          style={{ width: "150px" }}
          variant="top"
          src="./unicalendar.svg"
        />
        <Card.Title className="text-center">Sign in</Card.Title>
        <Card.Text className="text-center">
          Don't have an account? Sign up with Google
        </Card.Text>
        <Button
          href="http://localhost:8082/auth/google/oauth"
          className="btn-block"
          variant="danger"
        >
          Sign in with Google
        </Button>
      </Card.Body>
    </Card>
  </PageContainer>
);

export default SignIn;
