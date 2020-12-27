import {
  Alert,
  Button,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";
import React, { Component } from "react";
import CustomizeModal from "../../components/customize-modal/customize-modal.component";
import PageContainer from "../../components/page-container/page-container.component";
import ConfirmModal from "../../components/confim-modal/confirm-modal.component";
import { CardContainer } from "../../components/card-container/card-container.component";
import { RouteComponentProps } from "react-router-dom";
import AuthContext from "../../contexts/auth.context";
import "./homepage.styles.css";
import CourseSettings from "../../models/CourseSettings";
import axios from "axios";
import config from "../../config";
import Spinner from "../../components/spinner/spinner.component";
import { withCookies } from "react-cookie";
import { ReactCookieProps } from "react-cookie/cjs/types";
import moment from "moment";
import { eventColorsHash } from "../../helpers";
import AddModal from "../../components/add-modal/add-modal.component";
import CourseSettingsCreation from "../../models/CourseSettingsCreation";
import Loader from "../../components/loader/loader.component";

interface HomePageProps extends RouteComponentProps, ReactCookieProps {}

interface HomePageState {
  showHideDeleteModal: boolean;
  deleteCourse: CourseSettings | undefined;
  showHideAddModal: boolean;
  showHideCustomizeModal: boolean;
  customizeCourse: CourseSettings | undefined;
  loadingCurses: boolean;
  isRefreshing: boolean;
  courses: CourseSettings[];
}

class HomePage extends Component<HomePageProps, HomePageState> {
  static contextType = AuthContext;

  constructor(props: HomePageProps) {
    super(props);
    this.state = {
      showHideDeleteModal: false,
      deleteCourse: undefined,
      showHideAddModal: false,
      showHideCustomizeModal: false,
      customizeCourse: undefined,
      loadingCurses: false,
      isRefreshing: false,
      courses: [],
    };
  }

  componentDidMount() {
    this.loadCourses().catch((e) =>
      console.error("Error while fetching followed courses: ", e)
    );
  }

  loadCourses = async () => {
    this.setState({
      loadingCurses: true,
      courses: [],
    });

    let courses: CourseSettings[] = [];
    const { cookies } = this.props;
    if (cookies) {
      const sessionToken = cookies.get("sessionToken");
      if (sessionToken) {
        try {
          const coursesReq = await axios.get<CourseSettings[]>(
            config.API_URL + "/courses",
            {
              headers: {
                Authorization: "Bearer " + sessionToken,
              },
            }
          );
          if (coursesReq.data) {
            courses = coursesReq.data;
          }
        } catch (e) {
          console.error("Error while fetching followed courses: ", e);
        }
      }
    }

    this.setState({
      loadingCurses: false,
      courses: courses,
    });
  };

  handleOpenDeleteModal = async (
    confirmed?: boolean,
    course?: CourseSettings
  ) => {
    const { deleteCourse } = this.state;

    this.setState({
      deleteCourse: !this.state.showHideDeleteModal ? course : undefined,
      showHideDeleteModal: !this.state.showHideDeleteModal,
    });

    if (confirmed && deleteCourse) {
      const { cookies } = this.props;
      if (cookies) {
        const sessionToken = cookies.get("sessionToken");
        if (sessionToken) {
          try {
            await axios.delete(config.API_URL + "/courses/" + deleteCourse.id, {
              headers: {
                Authorization: "Bearer " + sessionToken,
              },
            });
            await this.loadCourses();
          } catch (e) {
            console.error("Error while deleting course", e);
          }
        }
      }
    }
  };

  handleCustomizeModal = async (
    confirmed?: boolean,
    course?: CourseSettings,
    courseSettings?: CourseSettingsCreation
  ) => {
    const { customizeCourse } = this.state;
    this.setState({
      customizeCourse: !this.state.showHideCustomizeModal ? course : undefined,
      showHideCustomizeModal: !this.state.showHideCustomizeModal,
    });
    if (confirmed && customizeCourse && courseSettings) {
      const { cookies } = this.props;
      if (cookies) {
        const sessionToken = cookies.get("sessionToken");
        if (sessionToken) {
          try {
            await axios.put(
              config.API_URL + "/courses/" + customizeCourse.id,
              {
                ...courseSettings,
              },
              {
                headers: {
                  Authorization: "Bearer " + sessionToken,
                },
              }
            );
            await this.loadCourses();
          } catch (e) {
            console.error("Error while customizing course", e);
          }
        }
      }
    }
  };

  handleAddModal = async (
    confirmed?: boolean,
    course?: CourseSettingsCreation
  ) => {
    this.setState({
      showHideAddModal: !this.state.showHideAddModal,
    });
    if (confirmed && course && course.courseId) {
      const { cookies } = this.props;
      const { user } = this.context;
      if (cookies && user) {
        const sessionToken = cookies.get("sessionToken");
        if (sessionToken) {
          try {
            await axios.post(
              config.API_URL + "/courses",
              {
                ...course,
                universitySlug: user.university.slug,
              },
              {
                headers: {
                  Authorization: "Bearer " + sessionToken,
                },
              }
            );
            await this.loadCourses();
          } catch (e) {
            console.error("Error while adding course", e);
          }
        }
      }
    }
  };

  handleRefresh = async () => {
    const { cookies } = this.props;
    if (cookies) {
      const sessionToken = cookies.get("sessionToken");
      if (sessionToken) {
        try {
          this.setState({ isRefreshing: true });
          await axios.get(config.API_URL + "/update", {
            headers: {
              Authorization: "Bearer " + sessionToken,
            },
          });
          this.setState({ isRefreshing: false });
        } catch (e) {
          console.error("Error while adding course", e);
        }
      }
    }
  };

  render() {
    return (
      <PageContainer requireAuth={true} history={this.props.history}>
        {this.state.isRefreshing && (
          <Alert variant="secondary">
            We're currently updating your Google Calendar...
          </Alert>
        )}
        <AuthContext.Consumer>
          {({ user }) =>
            user ? (
              <>
                <CardContainer
                  header={user.university ? user.university.fullName : ""}
                  title={"Your courses"}
                  buttons={
                    <>
                      <Button
                        className={"mr-2"}
                        variant="secondary"
                        onClick={() => this.handleRefresh()}
                      >
                        Refresh <i className="fas fa-calendar" />
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => this.handleAddModal(false)}
                      >
                        Add course <i className="fas fa-plus" />
                      </Button>
                    </>
                  }
                >
                  {this.state.loadingCurses && <Spinner />}
                  {!this.state.loadingCurses && (
                    <ListGroup className="list-group-flush course-list">
                      {this.state.courses.map((course) =>
                        course && course.course ? (
                          <ListGroupItem>
                            <Row>
                              <Col
                                lg={{ span: "12" }}
                                xl={{ span: true }}
                                className="course-name"
                              >
                                <div className="font-weight-bold">
                                  {course.course.name}
                                </div>
                                <div>{course.course.professor}</div>
                              </Col>
                              <Col
                                sm={{ span: "12" }}
                                md={{ span: true }}
                                xl={{ span: "auto" }}
                                className="course-info"
                              >
                                <div className={"course-info-header"}>
                                  Event settings:
                                </div>
                                {course.asynchronous && (
                                  <div>
                                    <i className="fas fa-history" />{" "}
                                    Asynchronous event
                                  </div>
                                )}
                                {!course.asynchronous && (
                                  <div>
                                    <i className="fas fa-stopwatch" />{" "}
                                    Synchronous event
                                  </div>
                                )}
                                {course.link && (
                                  <div>
                                    <i className="fas fa-link" /> Link:{" "}
                                    {course.link}
                                  </div>
                                )}
                                {course.colourId !== "0" && (
                                  <div>
                                    <i className="fas fa-calendar" /> Event
                                    colour:{" "}
                                    <span
                                      style={{
                                        display: "inline-block",
                                        width: "1rem",
                                        height: "1rem",
                                        padding: 0,
                                        margin: 0,
                                        borderRadius: "3px",
                                        position: "relative",
                                        bottom: "-2px",
                                        backgroundColor:
                                          eventColorsHash[course.colourId]
                                            .background,
                                      }}
                                    />
                                  </div>
                                )}
                              </Col>
                              <Col
                                sm={{ span: "12" }}
                                md={{ span: true }}
                                xl={{ span: "auto" }}
                                className="course-info"
                              >
                                <div className={"course-info-header"}>
                                  Notification settings:
                                </div>
                                {course.notifyTelegram && (
                                  <div>
                                    <i className="fab fa-telegram-plane" />{" "}
                                    Telegram: ON
                                  </div>
                                )}
                                {course.notifyEmail && (
                                  <div>
                                    <i className="fas fa-envelope" /> E-Mail:{" "}
                                    {course.notifyEmail}
                                  </div>
                                )}
                                {(course.notifyTelegram ||
                                  course.notifyEmail) && (
                                  <div>
                                    <i className="fas fa-hourglass-half" />{" "}
                                    {moment
                                      .duration(course.notifyBefore, "minutes")
                                      .humanize()}{" "}
                                    before
                                  </div>
                                )}
                                {!course.notifyTelegram && !course.notifyEmail && (
                                  <div>
                                    <i>None</i>
                                  </div>
                                )}
                              </Col>
                              <Col
                                sm={{ span: "12" }}
                                md={{ span: "auto" }}
                                className="course-buttons d-flex align-items-center justify-content-center"
                              >
                                <Button
                                  variant="light mr-1"
                                  onClick={() =>
                                    this.handleCustomizeModal(false, course)
                                  }
                                >
                                  <i className="fas fa-cog" />
                                </Button>
                                <Button
                                  variant="light"
                                  onClick={() =>
                                    this.handleOpenDeleteModal(false, course)
                                  }
                                >
                                  <i className="fas fa-trash" />
                                </Button>
                              </Col>
                            </Row>
                          </ListGroupItem>
                        ) : null
                      )}
                    </ListGroup>
                  )}
                </CardContainer>
                <ConfirmModal
                  show={this.state.showHideDeleteModal}
                  handleClose={this.handleOpenDeleteModal}
                  title={"Delete course from list"}
                  text={
                    "Are you sure you want to remove this course from your list?"
                  }
                />
                <CustomizeModal
                  show={this.state.showHideCustomizeModal}
                  handleClose={this.handleCustomizeModal}
                  course={this.state.customizeCourse}
                />
                <AddModal
                  show={this.state.showHideAddModal}
                  handleClose={this.handleAddModal}
                />
              </>
            ) : null
          }
        </AuthContext.Consumer>
      </PageContainer>
    );
  }
}

export default withCookies(HomePage);
