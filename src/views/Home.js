import { Layout } from 'antd';
import "antd/dist/antd.css";
import React from "react";
import {
    HashRouter as Router,
    Switch,
    Route,
    Redirect

} from "react-router-dom";

import EventList from "./pages/EventList.js"

import EventDetail from "./pages/EventDetail.js"
import CapacityDetail from "./pages/CapacityDetail.js"
import CapacityChildDetail from './pages/CapacityChildDetail.js'

import Sidediv from "./Sidediv.js"

const routes = [
    {
        path: "/EventList",
        component: EventList
    },

    {
        path: "/EventDetail",
        component: EventDetail
    },
    {
        path: "/CapacityDetail",
        component: CapacityDetail
    },
    {
        path: "/CapacityChildDetail",
        component: CapacityChildDetail,
    }
];


const { Content } = Layout;


function Home() {
    return (
        <Router>


            <Layout>
                <Sidediv />
                <Layout>

                    <Content>

                        <Switch>

                            <Route exact path="/">
                                <Redirect to="/EventList" />
                            </Route>
                            {routes.map((route, index) => (
                                // Render more <Route>s with the same paths as
                                // above, but different components this time.
                                <Route
                                    key={index}
                                    path={route.path}
                                    exact={route.exact}
                                    component={route.component}
                                // children={<route.component />}
                                />
                            ))}
                        </Switch>
                    </Content>

                </Layout>
            </Layout>


        </Router>
    )
}

export default Home;
