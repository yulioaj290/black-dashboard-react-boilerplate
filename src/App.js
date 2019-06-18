import React, {Component} from 'react';
import {Router, Route, Switch, Redirect} from "react-router-dom";
import {PrivateRoute} from './routing/PrivateRoute';
import AdminLayout from './layouts/Admin/Admin';
import LoginForm from './views/Login';
import {createBrowserHistory} from "history";

/* Font Awesome Library */
// import {library} from '@fortawesome/fontawesome-svg-core'
// import {fab} from '@fortawesome/free-brands-svg-icons'
// import {faCheckSquare, faCoffee} from '@fortawesome/free-solid-svg-icons'
/* Font Awesome Library */

// library.add(fab, faCheckSquare, faCoffee);

const hist = createBrowserHistory();

class App extends Component {
    state = {
        isLoggedIn: !!localStorage.getItem('ts_api_token'),
        loginErrors: false
    };

    // componentDidMount() {
    //     if (this.state.isLoggedIn) {
    //         fetch(process.env.REACT_APP_API_URL + 'token/', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 refresh: localStorage.getItem('ts_api_refresh')
    //             })
    //         })
    //             .then(response => response.json())
    //             .then(json => {
    //                 if (typeof json.code !== "undefined" && json.code === "token_not_valid") {
    //                     this.setState({isLoggedIn: false});
    //                     localStorage.removeItem('ts_api_token');
    //                     localStorage.removeItem('ts_api_refresh');
    //                     this.setState({isLoggedIn: false});
    //                 } else {
    //                     localStorage.setItem('ts_api_token', json.access);
    //                     // console.log(localStorage.getItem('ts_api_token'));
    //                 }
    //             });
    //     } else {
    //         this.setState({isLoggedIn: false});
    //     }
    // }

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
            .then(json => {
                if (json.hasOwnProperty('access') && json.hasOwnProperty('refresh')) {
                    localStorage.setItem('ts_api_token', json.access);
                    localStorage.setItem('ts_api_refresh', json.refresh);

                    this.setState({isLoggedIn: true});
                    this.onDismissMessage();
                } else if (json.hasOwnProperty('detail')) {
                    this.setState({loginErrors: "bad-credentials"})
                }
            })
            // .catch((error) => {
            .catch(() => {
                this.setState({loginErrors: "bad-network"})
            });
    }

    handleLogout(e) {
        e.preventDefault();

        localStorage.removeItem('ts_api_token');
        localStorage.removeItem('ts_api_refresh');
        this.setState({isLoggedIn: false});
    }

    onDismissMessage() {
        this.setState({loginErrors: false})
    }

    render() {
        const {isLoggedIn, loginErrors} = this.state;
        return (
            <Router history={hist}>
                <Switch>
                    <Redirect exact from="/" to="/login"/>
                    <Route path="/login" render={props => (
                        <LoginForm handleLogin={(e, credentials) => this.handleLogin(e, credentials)}
                                   {...props} isLoggedIn={isLoggedIn} loginErrors={loginErrors}
                                   dismissMessage={() => {
                                       this.onDismissMessage()
                                   }}/>
                    )}/>

                    <Redirect exact from="/admin" to="/admin/dashboard"/>
                    <PrivateRoute path="/admin" component={AdminLayout}
                                  handleLogout={(e) => this.handleLogout(e)} isLoggedIn={isLoggedIn}/>

                    {/*<Route path="/admin" component={AdminLayout}/>*/}
                    {/*<Route component={NotFound}/>*/}
                </Switch>
            </Router>
        );
    }
}

export default App;