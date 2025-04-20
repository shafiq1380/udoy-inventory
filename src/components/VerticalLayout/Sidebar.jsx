import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import withRouter from "../Common/withRouter";

//i18n
import { withTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";

import { Link } from "react-router-dom";


import logoLightPng from "../../assets/images/logo-light.png";
import logoDark from "../../assets/images/logo-dark.png";

// import logo from "../../assets/images/logo.svg";
import logoLightSvg from "../../assets/images/logo-light.svg";
import logo from "../../assets/images/logo.png";
// import logoLightSvg from "../../assets/images/logo.png";
import logoLight2 from '../../assets/images/logo_light_2.png'


import accountingSystem from '../../assets/images/sidebarLogo/accounting_system.png'
import inventorySystem from '../../assets/images/sidebarLogo/inventory_system.png'
import payroll from '../../assets/images/sidebarLogo/payroll_system.png'




const Sidebar = (props) => {

  // const module = JSON.parse(localStorage.getItem('module'))
  // let module = JSON.parse(sessionStorage.getItem('module'));
  // const sideBarLogo = module === 1 ? accountingSystem : module === 2 ? payroll : inventorySystem

  // useEffect(() => {
  //   if (!module) {
  //     module = JSON.parse(localStorage.getItem('module'));
  //   }
  // }, [])


  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box">
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              <img src={logo} alt="" height="22" />
            </span>
            <span className="logo-lg">
              {/* <img src={logoDark} alt="" height="17" /> */}
              <img src={logoDark} alt="" height="40" />
            </span>
          </Link>

          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src={logoLightSvg} alt="" height="22" />
            </span>
            <span className="logo-lg">
              {/* <img src={logoLightPng} alt="" height="19" /> */}
              {/* <img src={logoLightPng} alt="" height="40" /> */}
              <img src={inventorySystem} alt="" height="47" />
            </span>
          </Link>
        </div>


        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>


        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
};

const mapStatetoProps = (state) => {
  return {
    layout: state.Layout,
  };
};
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)));
