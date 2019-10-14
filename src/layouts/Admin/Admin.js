import React from "react";
import {Route, Switch} from "react-router-dom";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

// core components
import AdminNavbar from "../../components/Navbars/AdminNavbar";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import FixedPlugin from "../../components/FixedPlugin/FixedPlugin";

import routes from "../../routing/routes";

import logo from "../../assets/img/react-logo.png";
import PropTypes from "prop-types";

let ps;

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: "blue",
            sidebarOpened:
                document.documentElement.className.indexOf("nav-open") !== -1
        };
        this.mainPanel = React.createRef();
    }

    componentDidMount() {
        if (navigator.platform.indexOf("Win") > -1) {
            document.documentElement.className += " perfect-scrollbar-on";
            document.documentElement.classList.remove("perfect-scrollbar-off");
            ps = new PerfectScrollbar(this.mainPanel.current, {suppressScrollX: true});
            let tables = document.querySelectorAll(".table-responsive");
            for (let i = 0; i < tables.length; i++) {
                ps = new PerfectScrollbar(tables[i]);
            }
        }
    }

    componentWillUnmount() {
        if (navigator.platform.indexOf("Win") > -1) {
            ps.destroy();
            document.documentElement.className += " perfect-scrollbar-off";
            document.documentElement.classList.remove("perfect-scrollbar-on");
        }
    }

    componentDidUpdate(e) {
        if (e.history.action === "PUSH") {
            if (navigator.platform.indexOf("Win") > -1) {
                let tables = document.querySelectorAll(".table-responsive");
                for (let i = 0; i < tables.length; i++) {
                    ps = new PerfectScrollbar(tables[i]);
                }
            }
            document.documentElement.scrollTop = 0;
            document.scrollingElement.scrollTop = 0;
            this.mainPanel.current.scrollTop = 0;
        }
    }

    // this function opens and closes the sidebar on small devices
    toggleSidebar = () => {
        document.documentElement.classList.toggle("nav-open");
        this.setState({sidebarOpened: !this.state.sidebarOpened});
    };
    getRoutes = routes => {
        return routes.map((prop, key) => {
            if (prop.layout === "/admin") {
                return (
                    <Route
                        path={prop.layout + prop.path}
                        component={prop.component}
                        key={key}
                    />
                );
            } else {
                return null;
            }
        });
    };
    handleBgClick = color => {
        this.setState({backgroundColor: color});
    };
    getBrandText = path => {
        for (let i = 0; i < routes.length; i++) {
            if (
                this.props.location.pathname.indexOf(
                    routes[i].layout + routes[i].path
                ) !== -1
            ) {
                return routes[i].name;
            }
        }
        return "Brand";
    };

    render() {
        return (
            <>
                <div className="wrapper">
                    <Sidebar
                        {...this.props}
                        routes={routes}
                        bgColor={this.state.backgroundColor}
                        logo={{
                            innerLink: "/admin",
                            text: "Management",
                            imgSrc: logo
                        }}
                        toggleSidebar={this.toggleSidebar}
                    />
                    <div
                        className="main-panel"
                        ref={this.mainPanel}
                        data={this.state.backgroundColor}
                    >
                        <AdminNavbar
                            {...this.props}
                            brandText={this.getBrandText(this.props.location.pathname)}
                            toggleSidebar={this.toggleSidebar}
                            sidebarOpened={this.state.sidebarOpened}
                            handleLogout={(e) => this.props.handleLogout(e)}
                        />
                        <Switch>{this.getRoutes(routes)}</Switch>
                        {// we don't want the Footer to be rendered on map pag
                            this.props.location.pathname.indexOf("maps") !== -1 ? null : (
                                <Footer fluid/>
                            )}
                    </div>
                </div>
                <FixedPlugin
                    bgColor={this.state.backgroundColor}
                    handleBgClick={this.handleBgClick}
                />
            </>
        );
    }
}

Admin.defaultProps = {
    handleLogout: () => void(0),
    isLoggedIn: false
};

Admin.propTypes = {
    handleLogout: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
};

export default Admin;
