import React from "react";
import { instanceOf } from 'prop-types';
import {Alert, Container} from "react-bootstrap";
import {Cookies, withCookies} from "react-cookie";
import queryString from  'query-string'

class LoginDone extends React.Component<any, any>{
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props: any) {
        super(props);
        this.state = {
            redirect: '/homepage'
        }
    }
    render() {
        return (
            <Container>
                <Alert variant='success'>
                    Login success
                </Alert>
            </Container>
        );
    }
    componentDidMount() {
        if(this.handleSessionCookie(false)) {
            this.props.history.replace(this.state.redirect);
        }
    }

    handleSessionCookie(done: boolean) {
        const { cookies } = this.props;
        const params = queryString.parse(this.props.location.search);
        let sessionToken: string[] | string | null = '';
        let exp: string[] | string | null = '';
        sessionToken = params.token;
        exp = params.exp;
        cookies.set('sessionToken', sessionToken,  {
            maxAge: exp
        });
        return true;
    }
}
export default withCookies(LoginDone);
