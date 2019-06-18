import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
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
    CardBody,
    Alert
} from 'reactstrap';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            credentials: {
                username: '',
                password: ''
            },
        };
        this.onDismissMessage = this.onDismissMessage.bind(this);
    }

    onDismissMessage() {
        this.props.dismissMessage();
    }

    handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevstate => {
            const newState = {...prevstate};
            newState.credentials[name] = value;
            return newState;
        });
    };

    render() {
        const {credentials} = this.state;
        const {isLoggedIn, loginErrors} = this.props;

        // const message = loginErrors ? (
        //     <Alert color="danger" isOpen={showMessage} toggle={this.onDismissMessage}>
        //         <span>
        //             <b>Error:</b> Credenciales incorrectas.
        //         </span>
        //     </Alert>
        // ) : "";

        if (isLoggedIn) {
            return (
                <Redirect to="/admin"/>
            );
        } else {
            return (
                <Container>
                    <Row>
                        <Col lg={{size: 6, offset: 3}} className={"mt-5"}>
                            <Card className={"p-5"}>
                                <CardBody>
                                    <h1 className="h1 text-center mb-5">Bienvenido!!!</h1>

                                    {!!loginErrors &&
                                    <Alert color={"danger"}
                                           isOpen={!!loginErrors} toggle={this.onDismissMessage}>
                                        <span>
                                            <b>Error: </b>
                                            {(() => {
                                                switch (loginErrors) {
                                                    case "bad-network":
                                                        return "Hay un problema con la red.";
                                                    case "bad-credentials":
                                                        return "Credenciales incorrectas.";
                                                    default:
                                                        return null;
                                                }
                                            })()}
                                        </span>
                                    </Alert>
                                    }

                                    <Form onSubmit={(e) => this.props.handleLogin(e, credentials)}>
                                        <FormGroup className={loginErrors === "bad-credentials" ? "has-danger" : ""}>
                                            <Label for="username">Nombre de Usuario</Label>
                                            <Input id={"username"} type={"text"} label={"Usuario"}
                                                   onChange={this.handleChange.bind(this)}
                                                   name={"username"} value={credentials.username}
                                                   className={loginErrors === "bad-credentials" ? "border-danger" : "border-info"}/>
                                        </FormGroup>
                                        <FormGroup className={loginErrors === "bad-credentials" ? "has-danger" : ""}>
                                            <Label for="password">Clave de Acceso</Label>
                                            <Input id={"password"} type={"password"} label={"Clave de acceso"}
                                                   onChange={this.handleChange.bind(this)}
                                                   name={"password"} value={credentials.password}
                                                   className={loginErrors === "bad-credentials" ? "border-danger" : "border-info"}/>
                                        </FormGroup>
                                        <FormGroup className={"mt-5"}>
                                            <Button className={"btn-block"} color={"info"}
                                                    id={"submit"} type={"submit"}>
                                                Autenticarse
                                            </Button>
                                        </FormGroup>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
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