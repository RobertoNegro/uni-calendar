import React from "react";

import { Button, Card, Image, ListGroup } from "react-bootstrap";
import ConfirmModal from "../../components/confim-modal/confirm-modal.component";
import { SearchBar } from "../../components/search-bar/search-bar.component";
import PageContainer from "../../components/page-container/page-container.component";
import { withCookies, ReactCookieProps } from "react-cookie";
import { RouteComponentProps } from "react-router-dom";
import AuthContext from "../../contexts/auth.context";
import axios from "axios";
import config from "../../config";
import University from "../../models/University";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import moment from "moment";
import queryString from "query-string";
import "./user-profile.styles.css";

interface UserProfileProps extends ReactCookieProps, RouteComponentProps {}

interface UserProfileState {
  showConfirmModal: boolean;
  showSelectUniversityModal: boolean;
  university: University | undefined;
  universities: University[];
  loadingUniversities: boolean;
}

class UserProfile extends React.Component<UserProfileProps, UserProfileState> {
  static contextType = AuthContext;

  constructor(props: UserProfileProps) {
    super(props);

    this.state = {
      showConfirmModal: false,
      showSelectUniversityModal: !!queryString.parse(this.props.location.search)
        .uni,
      university: undefined,
      universities: [],
      loadingUniversities: false,
    };
  }

  async refreshUniversitiesList() {
    this.setState({ universities: [], loadingUniversities: true });
    let res = null;
    try {
      res = await axios.get<University[]>(config.API_URL + "/uni/universities");
    } catch (e) {
      console.error("Error while fetching universities list:", e);
    }
    if (res && res.data) {
      this.setState({
        universities: res.data,
        loadingUniversities: false,
      });
    } else {
      this.setState({ loadingUniversities: false });
    }
  }

  componentDidMount() {
    this.refreshUniversitiesList().catch((e) =>
      console.error("Error while fetching universities list:", e)
    );
  }

  handleTelegramModal = () => {
    this.setState({ showConfirmModal: !this.state.showConfirmModal });
  };

  handleUniversityModal = (confirmed: boolean) => {
    const hasToSet = !!queryString.parse(this.props.location.search).uni;
    if (!hasToSet || (confirmed && this.state.university)) {
      this.setState({
        showSelectUniversityModal: !this.state.showSelectUniversityModal,
      });

      if (confirmed && this.state.university) {
        const { user } = this.context;
        if (
          !user ||
          !user.university ||
          this.state.university.slug !== user.university.slug
        ) {
          const { cookies } = this.props;
          if (cookies) {
            const sessionToken = cookies.get("sessionToken");
            if (sessionToken) {
              axios
                .post(
                  config.API_URL + "/user/settings",
                  {
                    universitySlug: this.state.university.slug,
                  },
                  {
                    headers: {
                      Authorization: "Bearer " + sessionToken,
                    },
                  }
                )
                .then(() => {
                  if (hasToSet) {
                    this.props.history.replace("/");
                  } else {
                    this.props.history.push("/redirect");
                    this.props.history.goBack();
                  }
                })
                .catch((e) => {
                  console.error("Error while updating user settings:", e);
                });
            }
          }
        }
      }
    }
  };

  generateTelegramCode = async () => {
    const { cookies } = this.props;
    if (cookies) {
      const sessionToken = cookies.get("sessionToken");
      if (sessionToken) {
        try {
          const res = await axios.get(config.API_URL + "/telegram", {
            headers: {
              Authorization: "Bearer " + sessionToken,
            },
          });
          if (res.data) {
            return (
              <div
                className={
                  "text-center d-flex align-items-center justify-content-center flex-column"
                }
              >
                In order to associate your Telegram account with your
                UniCalendar account, please send a message to our UniCalendar
                bot with this command:{" "}
                <pre className={"mt-2"}>\start {res.data.secret}</pre>
                <CountdownCircleTimer
                  isPlaying
                  initialRemainingTime={moment(res.data.expires).diff(
                    moment(),
                    "seconds"
                  )}
                  duration={120}
                  colors={[
                    ["#004777", 0.33],
                    ["#F7B801", 0.33],
                    ["#A30000", 0],
                  ]}
                >
                  {({ remainingTime }) => {
                    return remainingTime ? (
                      <div
                        className={
                          "text-center d-flex align-items-center justify-content-center flex-column"
                        }
                      >
                        <div>You can do it in</div>
                        <div className={"h1 mb-0"}>{remainingTime}</div>
                        <div>seconds</div>
                      </div>
                    ) : (
                      <div className={"h1 mb-0"}>Expired!</div>
                    );
                  }}
                </CountdownCircleTimer>
              </div>
            );
          }
        } catch (e) {
          console.error(
            "Something went wrong while your obtaining telegram token: ",
            e
          );
        }
      }
    }
    return "Something went wrong while obtaining your telegram token. Please, try again.";
  };

  handleChangeSearchBar = (selected: University[]) => {
    if (selected.length >= 1) {
      this.setState({ university: selected[0] });
    } else {
      this.setState({ university: undefined });
    }
  };

  handleLogout = () => {
    const { setUser } = this.context;
    const { cookies, history } = this.props;
    if (cookies) {
      setUser(null);
      cookies.remove("sessionToken");
      history.replace("/");
    }
  };

  render() {
    return (
      <PageContainer requireAuth={true} history={this.props.history}>
        <AuthContext.Consumer>
          {({ user }) =>
            user ? (
              <>
                <Card>
                  <Image
                    src={user.picture}
                    style={{ width: "150px", height: "150px" }}
                    className="mx-auto mt-4"
                    roundedCircle
                  />
                  <Card.Body>
                    <Card.Title className="text-center">
                      Hi, {`${user.firstName} ${user.lastName}`}
                    </Card.Title>
                    <Card.Text className="text-center">
                      You can handle your information here.
                    </Card.Text>
                    <ListGroup variant="flush">
                      <ListGroup.Item>{`${user.firstName} ${user.lastName}`}</ListGroup.Item>
                      <ListGroup.Item>{user.email}</ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <span className={!user.university ? "font-italic" : ""}>
                          {user.university
                            ? user.university.fullName
                            : "There is no university set yet."}
                        </span>
                        <Button
                          variant="secondary"
                          disabled={this.state.loadingUniversities}
                          onClick={() => this.handleUniversityModal(false)}
                        >
                          Edit
                        </Button>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between  align-items-center">
                        <span>Add telegram connection</span>
                        <Button
                          variant="secondary"
                          onClick={this.handleTelegramModal}
                        >
                          Obtain code
                        </Button>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-center">
                        <Button variant="danger" onClick={this.handleLogout}>
                          Logout
                        </Button>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
                <ConfirmModal
                  show={this.state.showSelectUniversityModal}
                  handleClose={this.handleUniversityModal}
                  title={"Choose university"}
                  notCancellable={
                    !!queryString.parse(this.props.location.search).uni
                  }
                >
                  <SearchBar
                    label={"Select a university from the list"}
                    data={this.state.universities}
                    defaultSelected={user.university}
                    labelKey={"fullName"}
                    handleChange={this.handleChangeSearchBar}
                  />
                </ConfirmModal>
                <ConfirmModal
                  show={this.state.showConfirmModal}
                  handleClose={this.handleTelegramModal}
                  title={"Connection with telegram"}
                  text={this.generateTelegramCode}
                  notCancellable={true}
                />
              </>
            ) : null
          }
        </AuthContext.Consumer>
      </PageContainer>
    );
  }
}

export default withCookies(UserProfile);
