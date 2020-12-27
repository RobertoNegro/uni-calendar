import { Button, Modal, Form } from "react-bootstrap";
import React, { Component } from "react";
import CustomizeFormSection from "../customize-form-section/customize-form-section.component";
import CourseSettingsCreation from "../../models/CourseSettingsCreation";
import AuthContext from "../../contexts/auth.context";
import { SearchBar } from "../search-bar/search-bar.component";
import Course from "../../models/Course";
import axios from "axios";
import config from "../../config";
import "./add-modal.styles.css";
import Spinner from "../spinner/spinner.component";

interface AddModalProps {
  show: boolean;
  handleClose: (confirmed?: boolean, course?: CourseSettingsCreation) => void;
}

interface AddModalState {
  course: CourseSettingsCreation;
  courses: Course[];
  isLoadingCourses: boolean;
}

class AddModal extends Component<AddModalProps, AddModalState> {
  static contextType = AuthContext;
  customizeRef = React.createRef<CustomizeFormSection>();

  constructor(props: AddModalProps) {
    super(props);
    this.state = {
      course: {
        courseId: undefined,
        asynchronous: false,
        link: null,
        colourId: "0",
        notifyBefore: 5,
        notifyTelegram: false,
        notifyEmail: null,
      },
      courses: [],
      isLoadingCourses: false,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<AddModalProps>,
    prevState: Readonly<AddModalState>,
    snapshot?: any
  ) {
    if (!prevProps.show && this.props.show) {
      this.setState({
        course: {
          courseId: undefined,
          asynchronous: false,
          link: null,
          colourId: "0",
          notifyBefore: 5,
          notifyTelegram: false,
          notifyEmail: null,
        },
      });
      this.getCourses().catch((e) => {
        console.error("Error while fetching courses", e);
      });
    }
  }

  getCourses = async () => {
    this.setState({
      courses: [],
      isLoadingCourses: true,
    });

    const { user } = this.context;
    let newCourses: Course[] = [];
    try {
      const coursesReq = await axios.get<Course[]>(
        config.API_URL + "/uni/university/" + user.university.slug + "/courses"
      );
      if (coursesReq.data) {
        newCourses = coursesReq.data;
      }
    } catch (e) {
      console.error("Error while fetching courses", e);
    }
    this.setState({
      courses: newCourses,
      isLoadingCourses: false,
    });
  };

  handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const courseSettings = this.customizeRef.current
      ? this.customizeRef.current.getCourseSettings()
      : null;
    if (courseSettings && courseSettings.courseId) {
      this.props.handleClose(true, courseSettings);
    }
  };

  handleChangeSearchBar = (selected: Course[]) => {
    if (selected.length >= 1) {
      this.setState({
        course: { ...this.state.course, courseId: selected[0].id },
      });
    } else {
      this.setState({
        course: { ...this.state.course, courseId: undefined },
      });
    }
  };

  render() {
    let { show, handleClose } = this.props;

    if (!show) {
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
          <Modal.Title>Add course</Modal.Title>
        </Modal.Header>

        <Form onSubmit={this.handleSubmit}>
          {!this.state.isLoadingCourses && (
            <>
              <Modal.Body>
                <SearchBar
                  label={"Search course"}
                  data={this.state.courses}
                  labelKey={"name"}
                  handleChange={this.handleChangeSearchBar}
                />
                <CustomizeFormSection
                  ref={this.customizeRef}
                  course={this.state.course}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="outline-dark"
                  onClick={() => handleClose(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Apply
                </Button>
              </Modal.Footer>
            </>
          )}
          {this.state.isLoadingCourses && (
            <>
              <Modal.Body
                className={"d-flex align-items-center justify-content-center"}
              >
                <Spinner />
              </Modal.Body>
            </>
          )}
        </Form>
      </Modal>
    );
  }
}

export default AddModal;
