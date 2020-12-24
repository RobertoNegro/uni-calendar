import React from "react";
import {Button, Card} from "react-bootstrap";

export const CardContainer = (props: any) => (
  <Card className="mx-auto mt-4">
    <Card.Header className="font-weight-bold">{props.header}</Card.Header>
    <Card.Body>
      <Card.Title className='d-flex justify-content-between'>
          {props.title}
          <Button variant="secondary" onClick={props.handleModal}>
              {props.buttonTitle} <i className="fas fa-plus"></i>
          </Button>
      </Card.Title>
      {props.children}
    </Card.Body>
  </Card>
);
