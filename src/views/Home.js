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
import EventListHand from './pages/EventListHand.js'
import EventDetail from "./pages/EventDetail.js"
import CapacityDetail from "./pages/CapacityDetail.js"
import CapacityChildDetail from './pages/CapacityChildDetail.js'
import CapacityChildDetailAuto from './pages/CapacityChildDetailAuto.js'
import CapacityList from './pages/CapacityList.js'
import EventListAuto from './pages/EventListAuto.js'
import Sidediv from "./Sidediv.js"
import Taslist from './pages/Tasklist/list'
import Ahmodel from './pages/Ahmodel/Ahmodel.jsx';
import Details from './pages/Tasklist//details/details';
const routes = [
    {
        path: "/EventList",
        component: EventList
    },
    {
        path: '/EventListHand',
        component: EventListHand
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
        path: "/CapacityChildDetailAuto",
        component: CapacityChildDetailAuto,
    },
    {
        path: "/CapacityChildDetail",
        component: CapacityChildDetail,
    },
    {
        path: "/EventListAuto",
        component: EventListAuto,
    },
    {
        path: "/CapacityList",
        component: CapacityList
    },
    {
        path:'/Taslist',
        component: Taslist
    },
    {
        path:'/Ahmodel',
        component: Ahmodel
    },
    {
        path:'/Details',
        component: Details,
    },
];


const { Content } = Layout;


function Home() {
    return (
        <Router>


            <div id="bigcontents">
                <Sidediv />
                <div id="rightcontentwrp">

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

                </div>
            </div>


        </Router>
    )
}

export default Home;
