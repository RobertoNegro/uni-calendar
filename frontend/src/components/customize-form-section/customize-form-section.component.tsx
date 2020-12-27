import { Form } from "react-bootstrap";
import React, { ChangeEvent, Component } from "react";
import { eventColorsHash } from "../../helpers";
import "./customize-form-section.styles.css";
import CourseSettingsCreation from "../../models/CourseSettingsCreation";

interface CustomizeFormSectionProps {
  course: CourseSettingsCreation;
}

interface CustomizeFormSectionState {
  course: CourseSettingsCreation;
}

class CustomizeFormSection extends Component<
  CustomizeFormSectionProps,
  CustomizeFormSectionState
> {
  constructor(props: CustomizeFormSectionProps) {
    super(props);
    this.state = {
      course: this.props.course,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<CustomizeFormSectionProps>,
    prevState: Readonly<CustomizeFormSectionState>,
    snapshot?: any
  ) {
    if (prevProps.course !== this.props.course) {
      this.setState({
        course: this.props.course,
      });
    }
  }

  getCourseSettings: () => CourseSettingsCreation | null = () => {
    return this.state.course;
  };

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    if (name === "asynchronous") {
      this.setState({
        course: {
          ...this.state.course,
          asynchronous: JSON.parse(value.toLowerCase()),
        },
      });
    } else if (name === "colourId") {
      this.setState({
        course: {
          ...this.state.course,
          colourId: value.toLowerCase(),
        },
      });
    } else if (name === "link") {
      this.setState({
        course: {
          ...this.state.course,
          link:
            value.toLowerCase().trim().length > 0
              ? value.toLowerCase().trim()
              : null,
        },
      });
    } else if (name === "notifyTelegram") {
      this.setState({
        course: {
          ...this.state.course,
          notifyTelegram: JSON.parse(value.toLowerCase()),
        },
      });
    } else if (name === "notifyEmail") {
      this.setState({
        course: {
          ...this.state.course,
          notifyEmail:
            value.toLowerCase().trim().length > 0
              ? value.toLowerCase().trim()
              : null,
        },
      });
    } else if (name === "notifyBefore") {
      this.setState({
        course: {
          ...this.state.course,
          notifyBefore:
            value.toLowerCase().trim().length > 0
              ? parseInt(value.toLowerCase().trim())
              : 0,
        },
      });
    }
  };

  render() {
    return (
      <>
        <Form.Group controlId="asynchronous">
          <Form.Label>Select how you'll follow the course</Form.Label>
          <Form.Check
            type="radio"
            label="Synchronous"
            id="synchronous"
            name="asynchronous"
            value="false"
            checked={!this.state.course.asynchronous}
            onChange={this.handleChange}
          />
          <Form.Check
            type="radio"
            label="Asynchronous"
            name="asynchronous"
            id="asynchronous"
            value="true"
            checked={this.state.course.asynchronous}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group controlId="colourId">
          <Form.Label>Select event color</Form.Label>
          <div className="card-color">
            <Form.Group className="d-flex justify-content-around flex-wrap mb-0">
              <Form.Check
                type="radio"
                name="colourId"
                id={"0"}
                key={"0"}
                className="check-color"
                label={
                  <span
                    className="check-color-label"
                    style={{
                      backgroundColor: "#AD1457",
                    }}
                  />
                }
                value={"0"}
                checked={this.state.course.colourId === "0"}
                onChange={this.handleChange}
              />
              {Object.keys(eventColorsHash)
                .map((key) => {
                  return { ...eventColorsHash[key], id: key };
                })
                .map((item, index) => (
                  <Form.Check
                    type="radio"
                    name="colourId"
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
                    checked={this.state.course.colourId === item.id}
                    onChange={this.handleChange}
                  />
                ))}
            </Form.Group>
          </div>
        </Form.Group>
        <Form.Group controlId="link">
          <Form.Label>Meeting Link</Form.Label>
          <Form.Control
            onChange={this.handleChange}
            type="text"
            placeholder="Type here the link to join the meeting"
            name="link"
            value={this.state.course.link ? this.state.course.link : ""}
          />
        </Form.Group>
        <Form.Group controlId="notifyEmail">
          <Form.Label>E-mail Notification</Form.Label>
          <Form.Control
            onChange={this.handleChange}
            value={
              this.state.course.notifyEmail ? this.state.course.notifyEmail : ""
            }
            name="notifyEmail"
            type="text"
            placeholder="Type here your e-mail address"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Telegram Notification</Form.Label>
          <Form.Check
            type="radio"
            label="OFF"
            id="notifyTelegramOFF"
            name="notifyTelegram"
            value="false"
            checked={!this.state.course.notifyTelegram}
            onChange={this.handleChange}
          />
          <Form.Check
            type="radio"
            label="ON"
            name="notifyTelegram"
            id="notifyTelegramON"
            value="true"
            checked={this.state.course.notifyTelegram}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group controlId="notifyBefore">
          <Form.Label>
            Set how many minutes before the event's start the notifications are
            sent:
          </Form.Label>
          <Form.Control
            className="input-number"
            onChange={this.handleChange}
            value={
              this.state.course.notifyBefore
                ? this.state.course.notifyBefore
                : ""
            }
            name="notifyBefore"
            type="text"
            placeholder="Minutes before the event's start"
          />
        </Form.Group>
      </>
    );
  }
}

export default CustomizeFormSection;
