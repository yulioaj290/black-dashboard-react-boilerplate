import React, {Component} from 'react';
import {Router, Route, Switch, Redirect} from "react-router-dom";
import {PrivateRoute} from './routing/PrivateRoute';
import AdminLayout from './layouts/Admin/Admin';
import LoginForm from './views/public/Login';
import {createBrowserHistory} from "history";
import PublicLayout from "./views/public/PublicLayout";
import Register from "./views/public/Register";

/* Font Awesome Library */
// import {library} from '@fortawesome/fontawesome-svg-core'
// import {fab} from '@fortawesome/free-brands-svg-icons'
// import {faCheckSquare, faCoffee} from '@fortawesome/free-solid-svg-icons'
/* Font Awesome Library */

// library.add(fab, faCheckSquare, faCoffee);

const hist = createBrowserHistory();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: !!localStorage.getItem('auth-token')
        };
        this.loginRef = React.createRef();
    }

    handleLogin(e, credentials) {
        e.preventDefault();

        fetch(process.env.REACT_APP_API_URL + 'token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
            .then(response => response.json())
            .then(jsonRes => {
                if (jsonRes.hasOwnProperty('auth-token') && jsonRes.hasOwnProperty('auth-refresh')) {
                    localStorage.setItem('auth-token', jsonRes['auth-token']);
                    localStorage.setItem('auth-refresh', jsonRes['auth-refresh']);
                    localStorage.setItem('employer', JSON.stringify(jsonRes['employer']));

                    this.setState({isLoggedIn: true});
                } else if (jsonRes.hasOwnProperty('message')) {
                    this.loginRef.current.notifyError("bad-credentials");
                }
            })
            .catch((err) => {
                console.log(err);
                this.loginRef.current.notifyError("bad-network");
            });
    }

    handleLogout(e) {
        e.preventDefault();

        localStorage.removeItem('auth-token');
        localStorage.removeItem('employer');
        localStorage.removeItem('ts_api_refresh');
        this.setState({isLoggedIn: false});
    }

    render() {
        const {isLoggedIn} = this.state;
        return (
            <Router history={hist}>
                <Switch>
                    <Redirect exact from="/" to="/login"/>
                    <Route path="/public" component={PublicLayout}/>
                    <Route path="/register" component={Register}/>
                    <Route path="/login" render={props => (
                        <LoginForm handleLogin={(e, credentials) => this.handleLogin(e, credentials)}
                                   {...props} isLoggedIn={isLoggedIn} ref={this.loginRef}/>
                    )}/>

                    <Redirect exact from="/admin" to="/admin/dashboard"/>
                    <PrivateRoute path="/admin" component={AdminLayout} isLoggedIn={isLoggedIn}
                                  handleLogout={(e) => this.handleLogout(e)}/>

                    {/*<Route path="/admin" component={AdminLayout}/>*/}
                    {/*<Route component={NotFound}/>*/}
                </Switch>
            </Router>
        );
    }
}

export default App;
