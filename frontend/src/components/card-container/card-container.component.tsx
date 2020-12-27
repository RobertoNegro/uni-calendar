import React from "react";
import { Card } from "react-bootstrap";

export const CardContainer = (props: any) => (
  <Card>
    <Card.Header>{props.header}</Card.Header>
    <Card.Body>
      <Card.Title className="d-flex justify-content-between">
        {props.title}
        <div className={"d-flex justify-content-center align-items-center"}>
          {props.buttons}
        </div>
      </Card.Title>
      {props.children}
    </Card.Body>
  </Card>
);
