import {Container} from "react-bootstrap";
import Header from "../../components/header/header.component";
import React from "react";

class HomePage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentUser: null
        }
    }
    render() {
        return (
            <div>
                <Header/>
                <Container>
                    <h1>Loggato</h1>
                </Container>
            </div>
        );
    }
}


export default HomePage;
