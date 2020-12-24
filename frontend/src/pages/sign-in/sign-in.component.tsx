import { Button, Card } from "react-bootstrap";

import "./sign-in.styles.css";
import React from "react";
import PageContainer from "../../components/page-container/page-container.component";
import { ReactCookieProps } from "react-cookie/cjs/types";
import { RouteComponentProps } from "react-router-dom";

interface SignInProps extends RouteComponentProps {}

const SignIn = ({ history }: SignInProps) => (
  <PageContainer requireAuth={false} hideHeader={true} history={history}>
    <Card className="mt-4 mx-auto" style={{ width: "100%", maxWidth: "24rem" }}>
      <h1 className="text-center mt-4 app-name">UniCalendar</h1>
      <Card.Img
        className="mx-auto"
        style={{ width: "150px" }}
        variant="top"
        src="./unicalendar.svg"
      />
      <Card.Body>
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
