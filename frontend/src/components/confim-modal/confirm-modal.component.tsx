import {Button, Modal} from "react-bootstrap";
import {Component} from "react";

interface ConfirmModalProps {
    show: boolean,
    handleClose: any,
    title: string,
    text: string
}

class ConfirmModal extends Component<ConfirmModalProps, any> {
    render() {
        return (
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={this.props.show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.props.text}</Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-dark" onClick={this.props.handleClose}>
                        Cancel
                    </Button>
                    <Button variant="secondary" onClick={this.props.handleClose}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ConfirmModal;

