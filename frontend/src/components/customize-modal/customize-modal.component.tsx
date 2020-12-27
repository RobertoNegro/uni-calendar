import { Button, Modal, Form } from "react-bootstrap";
import React, { Component } from "react";
import "./customize-modal.styles.css";
import CustomizeFormSection from "../customize-form-section/customize-form-section.component";
import CourseSettingsCreation from "../../models/CourseSettingsCreation";
import AuthContext from "../../contexts/auth.context";
import CourseSettings from "../../models/CourseSettings";

interface CustomizeModalProps {
  show: boolean;
  handleClose: (
    confirmed?: boolean,
    course?: CourseSettings,
    courseSettings?: CourseSettingsCreation
  ) => void;
  course?: CourseSettings;
}

interface CustomizeModalState {
  course?: CourseSettingsCreation;
}

class CustomizeModal extends Component<
  CustomizeModalProps,
  CustomizeModalState
> {
  static contextType = AuthContext;
  customizeRef = React.createRef<CustomizeFormSection>();

  constructor(props: CustomizeModalProps) {
    super(props);

    const newCourse = {
      asynchronous: props.course ? props.course.asynchronous : false,
      link: props.course ? props.course.link : null,
      colourId: props.course ? props.course.colourId : "0",
      notifyBefore: props.course ? props.course.notifyBefore : 5,
      notifyTelegram: props.course ? props.course.notifyTelegram : false,
      notifyEmail: props.course ? props.course.notifyEmail : null,
    };
    this.state = {
      course: newCourse,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<CustomizeModalProps>,
    prevState: Readonly<CustomizeModalState>,
    snapshot?: any
  ) {
    if (prevProps.course !== this.props.course) {
      const newCourse = {
        asynchronous: this.props.course
          ? this.props.course.asynchronous
          : false,
        link: this.props.course ? this.props.course.link : null,
        colourId: this.props.course ? this.props.course.colourId : "0",
        notifyBefore: this.props.course ? this.props.course.notifyBefore : 5,
        notifyTelegram: this.props.course
          ? this.props.course.notifyTelegram
          : false,
        notifyEmail: this.props.course ? this.props.course.notifyEmail : null,
      };
      this.setState({
        course: newCourse,
      });
    }
  }

  handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const courseSettings = this.customizeRef.current
      ? this.customizeRef.current.getCourseSettings()
      : null;

    if (courseSettings) {
      this.props.handleClose(true, undefined, courseSettings);
    }
  };

  render() {
    let { show, handleClose } = this.props;

    if (!this.state.course || !show) {
      return <></>;
    }

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
            <CustomizeFormSection
              ref={this.customizeRef}
              course={this.state.course}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-dark" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Apply
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default CustomizeModal;
