import { Button, Modal, Form } from "react-bootstrap";
import React, { ChangeEvent, Component } from "react";
import "./customize-modal.styles.css";
import {SearchBar} from "../search-bar/search-bar.component";

interface CustomizeModalProps {
  show: boolean;
  handleClose: () => void;
  addCourse: boolean;
}

interface CustomizeModalState {
  asynchronous: boolean;
  description: string;
  colorId: string;
  zoomUrl: string;
  courseId: string;
}

const eventColorsHash: {
  [key: string]: { background: string; foreground: string };
} = {
  "1": {
    background: "#a4bdfc",
    foreground: "#1d1d1d",
  },
  "2": {
    background: "#7ae7bf",
    foreground: "#1d1d1d",
  },
  "3": {
    background: "#dbadff",
    foreground: "#1d1d1d",
  },
  "4": {
    background: "#ff887c",
    foreground: "#1d1d1d",
  },
  "5": {
    background: "#fbd75b",
    foreground: "#1d1d1d",
  },
  "6": {
    background: "#ffb878",
    foreground: "#1d1d1d",
  },
  "7": {
    background: "#46d6db",
    foreground: "#1d1d1d",
  },
  "8": {
    background: "#e1e1e1",
    foreground: "#1d1d1d",
  },
  "9": {
    background: "#5484ed",
    foreground: "#1d1d1d",
  },
  "10": {
    background: "#51b749",
    foreground: "#1d1d1d",
  },
  "11": {
    background: "#dc2127",
    foreground: "#1d1d1d",
  },
};

class CustomizeModal extends Component<
  CustomizeModalProps,
  CustomizeModalState
> {
  constructor(props: CustomizeModalProps) {
    super(props);
    this.state = {
      asynchronous: false,
      description: "",
      colorId: "1",
      zoomUrl: "",
      courseId: ""
    };
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    if (name === "asynchronous") {
      this.setState({ [name]: value === "true" });
    } else if (name === "description") {
      this.setState({ [name]: value });
    } else if (name === "colorId") {
      this.setState({ [name]: value });
    } else if (name === "zoomUrl") {
      this.setState({ [name]: value });
    }else if (name === "courseId") {
      this.setState({ [name]: value });
    }
  };

  handleSubmit = async (event: { preventDefault: () => void }) => {
    console.log(this.state);
    event.preventDefault();
  };

  render() {
    let { show, handleClose, addCourse } = this.props;
    return (
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Customize course</Modal.Title>
        </Modal.Header>

        <Form onSubmit={this.handleSubmit}>
          <Modal.Body>
            <div>
              {addCourse && <SearchBar label={'Search course'} name={'courseId'} value={this.state.courseId} onChange={this.handleChange} /> }
              <Form.Group>
                <Form.Label>Select how you'll follow the course</Form.Label>
                <Form.Check
                  type="radio"
                  label="Synchronous"
                  id="synchronous"
                  name="asynchronous"
                  value="false"
                  defaultChecked={!this.state.asynchronous}
                  onChange={this.handleChange}
                />
                <Form.Check
                  type="radio"
                  label="Asynchronous"
                  name="asynchronous"
                  id="asynchronous"
                  value="true"
                  defaultChecked={this.state.asynchronous}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  onChange={this.handleChange}
                  value={this.state.description}
                  name="description"
                  type="text"
                  placeholder="Description"
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.SelectCustomSizeSm">
                <Form.Label>Select course's color</Form.Label>
                <div className="card-color">
                  <Form.Group className="d-flex justify-content-around flex-wrap mb-0">
                    {Object.keys(eventColorsHash)
                      .map((key) => {
                        return { ...eventColorsHash[key], id: key };
                      })
                      .map((item, index) => (
                        <Form.Check
                          type="radio"
                          name="colorId"
                          id={item.id}
                          key={item.id}
                          className="check-color"
                          label={
                            <span
                              className="check-color-label"
                              style={{
                                backgroundColor: item.background,
                              }}
                            />
                          }
                          value={item.id}
                          defaultChecked={this.state.colorId === item.id}
                          onChange={this.handleChange}
                        />
                      ))}
                  </Form.Group>
                </div>
              </Form.Group>
              <Form.Group controlId="zoomUrl">
                <Form.Label>Zoom Link</Form.Label>
                <Form.Control
                  onChange={this.handleChange}
                  type="text"
                  placeholder="Zoom link"
                  name="zoomUrl"
                  value={this.state.zoomUrl}
                />
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-dark" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="secondary" onClick={handleClose}>
              Apply
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default CustomizeModal;
