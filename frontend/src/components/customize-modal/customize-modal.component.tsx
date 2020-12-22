import {Button, Modal, Form} from "react-bootstrap";
import {Component} from "react";
import './customize-modal.styles.css'

class CustomizeModal extends Component<{ show: any, handleClose: any }> {
    private eventColorsHash: { [key: string]: { background: string, foreground: string } } = {
        "1": {
            "background": "#a4bdfc",
            "foreground": "#1d1d1d"
        },
        "2": {
            "background": "#7ae7bf",
            "foreground": "#1d1d1d"
        },
        "3": {
            "background": "#dbadff",
            "foreground": "#1d1d1d"
        },
        "4": {
            "background": "#ff887c",
            "foreground": "#1d1d1d"
        },
        "5": {
            "background": "#fbd75b",
            "foreground": "#1d1d1d"
        },
        "6": {
            "background": "#ffb878",
            "foreground": "#1d1d1d"
        },
        "7": {
            "background": "#46d6db",
            "foreground": "#1d1d1d"
        },
        "8": {
            "background": "#e1e1e1",
            "foreground": "#1d1d1d"
        },
        "9": {
            "background": "#5484ed",
            "foreground": "#1d1d1d"
        },
        "10": {
            "background": "#51b749",
            "foreground": "#1d1d1d"
        },
        "11": {
            "background": "#dc2127",
            "foreground": "#1d1d1d"
        }
    };

    render() {
        let {show, handleClose} = this.props;
        return (
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Customize course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <Form>
                            <fieldset>
                                <Form.Group>
                                    <Form.Label>
                                        Select how you'll follow the course
                                    </Form.Label>
                                    <Form.Check
                                        type="radio"
                                        label="Synchronous"
                                        name="formHorizontalRadios"
                                        id="synchronous"
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Asynchronous"
                                        name="formHorizontalRadios"
                                        id="asynchronous"
                                    />
                                </Form.Group>
                            </fieldset>
                            <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control type="text" placeholder="Description"/>
                            </Form.Group>
                            <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                                <Form.Label>Select course's color</Form.Label>
                                <div className='d-flex justify-content-between card-color'>
                                    {
                                        Object.keys(this.eventColorsHash).map(key => this.eventColorsHash[key]).map((item, index) => (
                                            <div key={index} className='color mr-1'
                                                 style={{backgroundColor: '' + item.background}}></div>
                                        ))
                                    }
                                </div>
                            </Form.Group>
                            <Form.Group controlId="zoomUrl">
                                <Form.Label>Zoom Link</Form.Label>
                                <Form.Control type="text" placeholder="Zoom link"/>
                            </Form.Group>
                        </Form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleClose}>
                        Apply
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default CustomizeModal;
