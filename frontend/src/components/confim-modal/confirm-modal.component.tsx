import { Button, Modal } from "react-bootstrap";
import React, { Component, ReactNode } from "react";

interface ConfirmModalState {
  text: ReactNode;
}

interface ConfirmModalProps {
  show: boolean;
  handleClose: (confirmed: boolean) => void;
  title: string;
  notCancellable?: boolean;
  text?:
    | string
    | (() => string)
    | (() => Promise<string>)
    | (() => ReactNode)
    | (() => Promise<ReactNode>);
}

class ConfirmModal extends Component<ConfirmModalProps, ConfirmModalState> {
  constructor(props: ConfirmModalProps) {
    super(props);
    this.state = {
      text: <></>,
    };
  }

  sanitizeText = async (
    text?:
      | string
      | (() => string)
      | (() => Promise<string>)
      | (() => ReactNode)
      | (() => Promise<ReactNode>)
  ) => {
    if (text) {
      if (typeof text === "string") {
        return text;
      } else {
        const resolved = await Promise.resolve(text());
        if (typeof resolved === "string") {
          return <span>{resolved}</span>;
        } else {
          return resolved;
        }
      }
    }
    return "";
  };

  componentDidMount() {
    if (this.props.show) {
      this.sanitizeText(this.props.text).then((text) => {
        this.setState({ text });
      });
    }
  }

  componentDidUpdate(
    prevProps: Readonly<ConfirmModalProps>,
    prevState: Readonly<any>,
    snapshot?: any
  ) {
    if (
      prevProps.text !== this.props.text ||
      (!prevProps.show && this.props.show)
    ) {
      this.sanitizeText(this.props.text).then((text) => {
        this.setState({ text });
      });
    }
  }

  render() {
    return (
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={this.props.show}
        onHide={this.props.handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.text}
          {this.props.children}
        </Modal.Body>
        <Modal.Footer>
          {!this.props.notCancellable && (
            <Button
              variant="outline-dark"
              onClick={() => this.props.handleClose(false)}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() => this.props.handleClose(true)}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ConfirmModal;
