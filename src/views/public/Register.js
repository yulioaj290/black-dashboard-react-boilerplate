import React from 'react';
import {Link} from 'react-router-dom';
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

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            employer: {
                name: "",
                email: "",
                password: "",
                rpassword: ""
            },
        };
        this.notificationAlert = React.createRef();
    }

    componentDidMount() {
        document.title = "Register Employer - Job Posting";
        this.resetData();
    }

    resetData() {
        this.setState({
            employer: {
                name: "",
                email: "",
                password: "",
                rpassword: ""
            },
        });
    }

    handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevstate => {
            const newState = {...prevstate};
            newState.employer[name] = value;
            return newState;
        });
    };

    notifyError(loginErrors) {
        return loginErrors === "bad-network" ?
            notifyAlert(this.notificationAlert, "danger", "There is a network problem.")
            : loginErrors === "bad-credentials" ?
                notifyAlert(this.notificationAlert, "danger", "Bad credentials.")
                : "";
    }

    handleSubmit(e, employer) {
        e.preventDefault();

        if (employer.password !== employer.rpassword) {
            notifyAlert(this.notificationAlert, "danger", "The passwords does not match.");
        } else {
            fetch(process.env.REACT_APP_API_URL + '/employer/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employer)
            })
                .then(response => response.json())
                .then(jsonRes => {
                    if (typeof jsonRes.original === "undefined") {
                        notifyAlert(this.notificationAlert, "success", "Employer registered successfully!");
                        this.resetData();
                    } else {
                        notifyAlert(this.notificationAlert, "danger", jsonRes.original.sqlMessage);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    notifyAlert(this.notificationAlert, "danger", "Employer  registration failed. Please review your data.");
                });
        }
    }

    render() {
        const {employer} = this.state;
        const {loginErrors} = this.props;

        this.notifyError(loginErrors);

        return (
            <>
                <div className="react-notification-alert-container">
                    <NotificationAlert ref={this.notificationAlert}/>
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
                                        Register Employer
                                    </h3>
                                </CardHeader>
                                <CardBody>
                                    <Form onSubmit={(e) => this.handleSubmit(e, employer)}>
                                        <FormGroup>
                                            <Label for="name">Name</Label>
                                            <Input id={"name"} type={"text"} label={"Name"}
                                                   onChange={this.handleChange.bind(this)}
                                                   name={"name"} value={employer.name}
                                                   className={"border-info"} required/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="email">Email</Label>
                                            <Input id={"email"} type={"text"} label={"Email"}
                                                   onChange={this.handleChange.bind(this)}
                                                   name={"email"} value={employer.email}
                                                   className={"border-info"} required/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="password">Password</Label>
                                            <Input id={"password"} type={"password"} label={"Password"}
                                                   onChange={this.handleChange.bind(this)}
                                                   name={"password"} value={employer.password}
                                                   className={"border-info"} required/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="rpassword">Repeat Password</Label>
                                            <Input id={"rpassword"} type={"password"} label={"Repeat Password"}
                                                   onChange={this.handleChange.bind(this)}
                                                   name={"rpassword"} value={employer.rpassword}
                                                   className={"border-info"} required/>
                                        </FormGroup>
                                        <FormGroup className={"mt-5"}>
                                            <Row>
                                                <Col>
                                                    <Button className={"btn-block"} color={"success"}
                                                            id={"submit"} type={"submit"}>
                                                        Register
                                                    </Button>
                                                </Col>
                                                <Col>
                                                    <Link to="/login">
                                                        <Button color="info" className={"btn-block"}>Log In</Button>
                                                    </Link>
                                                </Col>
                                            </Row>
                                            <Link to="/public/job-list">
                                                <Button color="primary" className={"btn-block mt-3"}>Job
                                                    List</Button>
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

export default Register;