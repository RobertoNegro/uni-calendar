import React from "react";
import { Card } from "react-bootstrap";

export const CardContainer = (props: any) => (
  <Card className="mx-auto mt-4">
    <Card.Header className="font-weight-bold">{props.header}</Card.Header>
    <Card.Body>
      <Card.Title>{props.title}</Card.Title>
      {props.children}
    </Card.Body>
  </Card>
);
