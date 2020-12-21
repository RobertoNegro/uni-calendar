import {Button, Modal} from "react-bootstrap";
import {Component} from "react";

class DeleteModal extends Component<{ show: any, handleClose: any }> {
    render() {
        let {show, handleClose} = this.props;
        return (
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete course from list</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to remove this course from your list?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleClose}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default DeleteModal;
