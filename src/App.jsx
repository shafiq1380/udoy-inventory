import PropTypes from "prop-types";
import React, { useEffect } from "react";

import { Routes, Route, useNavigate } from "react-router-dom";
import { connect, useDispatch } from "react-redux";

import { useSelector } from "react-redux";

// Import Routes all
import { authProtectedRoutes, publicRoutes } from "./routes";

// Import all middleware
import Authmiddleware from "./routes/route";

// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";
import { useIdleTimer } from 'react-idle-timer'
// Import scss
import "./assets/scss/theme.scss";
import './index.css'
//date picker CSS link
import "flatpickr/dist/themes/material_green.css";

import 'react-loading-skeleton/dist/skeleton.css'




// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper"

import fakeBackend from "/src/helpers/AuthType/fakeBackend";
import ScrollToTop from "./pages/ScrollToTop/ScrollToTop";

// Activating fake backend
fakeBackend();


const App = (props) => {


  const { layoutType } = useSelector((state) => ({
    layoutType: state.Layout.layoutType,
  }));

  function getLayout(layoutType) {
    let layoutCls = VerticalLayout;
    switch (layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  }

  const Layout = getLayout(layoutType);

  // const userId = localStorage.getItem("userID");


  // idle time logout

  const navigate = useNavigate();
  const onIdle = () => {
    navigate('/logout')
    window.location.reload()
  }
  //idle itme logout
  const { getRemainingTime } = useIdleTimer({
    onIdle,
    timeout: 7200000,
    throttle: 500
  })




  return (
    <>
      <ScrollToTop>
        <Routes>
          {publicRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={<NonAuthLayout>{route.component}</NonAuthLayout>}
              key={idx}
              exact={true}
            />
          ))}

          {authProtectedRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <Authmiddleware>
                  <Layout>{route.component}</Layout>
                </Authmiddleware>
              }
              key={idx}
              exact={true}
            />
          ))}
        </Routes>
      </ScrollToTop >
    </>
  );
};

App.propTypes = {
  layout: PropTypes.any,
};

const mapStateToProps = (state) => {
  return {
    layout: state.Layout,
  };
};

export default connect(mapStateToProps, null)(App);
