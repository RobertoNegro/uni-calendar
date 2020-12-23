import {Nav, Navbar} from "react-bootstrap";

const Header = () => (
    <Navbar className='bg-red' expand="lg" variant='dark'>
        <Navbar.Brand href="./homepage" className='app-name'><img
            src="./unicalendar.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Unicalendar logo"
        />UniCalendar</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
            <Nav>
                <Nav.Link href='./profile'>Giulia Peserico</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);

export default Header;
