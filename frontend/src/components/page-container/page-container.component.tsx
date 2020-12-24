import React from "react";
import Header from "../header/header.component";
import { CardContainer } from "../card-container/card-container.component";
import { Container } from "react-bootstrap";

export const PageContainer = (props: any) => (
  <div>
    {!props.hideHeader && <Header />}
    <Container>
      <CardContainer header={props.header} title={props.title} buttonTitle={props.buttonTitle} handleModal={props.handleModal} >
        {props.children}
      </CardContainer>
    </Container>
  </div>
);
