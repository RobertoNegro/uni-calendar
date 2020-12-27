import { Image, Nav, Navbar } from "react-bootstrap";
import AuthContext from "../../contexts/auth.context";
import React from "react";
import "./header.styles.css";

const Header = () => (
  <Navbar expand="lg" variant="light">
    <Navbar.Brand href="./homepage" className="app-name">
      <img
        src="./unicalendar.svg"
        width="30"
        height="30"
        className="d-inline-block align-top"
        alt="Unicalendar logo"
      />
      UniCalendar
    </Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Collapse className="justify-content-end">
      <Nav>
        <AuthContext.Consumer>
          {({ user }) =>
            user ? (
              <Nav.Link href="./profile">
                {`${user.firstName} ${user.lastName}`}
                <Image
                  src={user.picture}
                  style={{ width: "30px", height: "30px" }}
                  className="ml-2"
                  roundedCircle
                />
              </Nav.Link>
            ) : null
          }
        </AuthContext.Consumer>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default Header;
