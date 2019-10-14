import React from 'react';
import PropTypes from 'prop-types';
import {Link, Redirect} from 'react-router-dom';
import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Card,
    CardHeader,
    CardBody,
} from 'reactstrap';
import NotificationAlert from "react-notification-alert";
import notifyAlert from "../../components/Utils/notifyAlert";

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            credentials: {
                email: '',
                password: ''
            },
            loginErrors: ""
        };
        this.notificationAlert = React.createRef();
    }

    componentDidMount() {
        document.title = "Login - Job Posting";
    }

    onDismissMessage() {
        this.setState({loginErrors: ""});
    }

    handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevstate => {
            const newState = {...prevstate};
            newState.credentials[name] = value;
            return newState;
        });
        this.onDismissMessage();
    };

    notifyError(loginErrors) {
        this.setState({loginErrors: loginErrors});
        return loginErrors === "bad-network" ?
            notifyAlert(this.notificationAlert, "danger", "There is a network problem.")
            : loginErrors === "bad-credentials" ?
            notifyAlert(this.notificationAlert, "danger", "Bad credentials.")
            : "";
    }

    render() {
        const {credentials, loginErrors} = this.state;
        const {isLoggedIn} = this.props;

        if (isLoggedIn) {
            return (
                <Redirect to="/admin"/>
            );
        } else {
            return (
                <>
                    <div className="react-notification-alert-container">
                        <NotificationAlert ref={this.notificationAlert} />
                    </div>
                    <Container>
                        <Row>
                            <Col lg={{size: 6, offset: 3}} className={"mt-5"}>
                                <Card className={"p-5"}>
                                    <CardHeader>
                                        <h1 className="h1 text-center mb-5 font-weight-light">
                                            Job Posting Management
                                        </h1>
                                        <hr className={"border-default"}/>
                                        <h3 className="h3 text-center mb-3">
                                            Log In
                                        </h3>
                                    </CardHeader>
                                    <CardBody>
                                        <Form onSubmit={(e) => this.props.handleLogin(e, credentials)}>
                                            <FormGroup
                                                className={loginErrors === "bad-credentials" ? "has-danger" : ""}>
                                                <Label for="email">Email</Label>
                                                <Input id={"email"} type={"text"} label={"Email"}
                                                       onChange={this.handleChange.bind(this)}
                                                       name={"email"} value={credentials.email}
                                                       className={loginErrors === "bad-credentials" ? "border-danger" : "border-info"}/>
                                            </FormGroup>
                                            <FormGroup
                                                className={loginErrors === "bad-credentials" ? "has-danger" : ""}>
                                                <Label for="password">Password</Label>
                                                <Input id={"password"} type={"password"} label={"Password"}
                                                       onChange={this.handleChange.bind(this)}
                                                       name={"password"} value={credentials.password}
                                                       className={loginErrors === "bad-credentials" ? "border-danger" : "border-info"}/>
                                            </FormGroup>
                                            <FormGroup className={"mt-5"}>
                                                <Row>
                                                    <Col>
                                                        <Button className={"btn-block"} color={"success"}
                                                                id={"submit"} type={"submit"}>
                                                            Log In
                                                        </Button>
                                                    </Col>
                                                    <Col>
                                                        <Link to="/register">
                                                            <Button color="info" className={"btn-block"}>Register Employer</Button>
                                                        </Link>
                                                    </Col>
                                                </Row>
                                                <Link to="/public/job-list">
                                                    <Button color="primary" className={"btn-block mt-3"}>Job List</Button>
                                                </Link>
                                            </FormGroup>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </>
            );
        }
    }
}

Login.defaultProps = {
    handleLogin: () => void(0),
    isLoggedIn: false
};

Login.propTypes = {
    handleLogin: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
};

export default Login;