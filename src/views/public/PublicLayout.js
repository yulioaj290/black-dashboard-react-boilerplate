import React from "react";

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col,
    Button
} from "reactstrap";

import {Link, Route, Switch} from 'react-router-dom';
import Footer from "../../components/Footer/Footer";
import ListJob from "./ListJob";
import NewApplication from "./NewApplication";

class PublicLayout extends React.Component {

    render() {
        return (
            <div className={"container"}>
                <div className="content" id={"job-list"}>
                    <Row>
                        <Col md="12">
                            <Card className={"p-sm-5 p-2"}>
                                <CardHeader className={"mb-4"}>
                                    <CardTitle tag="h1">
                                        Job Posting Website - Job List
                                        <Link to="/login">
                                            <Button color="info">Log In</Button>
                                        </Link>
                                    </CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Switch>
                                        <Route path="/public/job-list" component={ListJob}/>
                                        <Route path="/public/new-application/:jobId" component={NewApplication}/>
                                    </Switch>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <Footer fluid/>
            </div>
        );
    }
}

export default PublicLayout;
