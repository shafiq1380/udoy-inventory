import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";

// Redux
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../Common/withRouter";
import { FaAddressBook } from "react-icons/fa";

//icon
import { MdOutlineManageSearch } from "react-icons/md";
import { MdInventory2 } from "react-icons/md";
import { MdOutlineAccountBalance } from "react-icons/md";

// users
import user1 from "../../../assets/images/users/avatar-1.jpg";
import axios from "axios";
import { SET_USER_INFORMATION } from "../../../store/auth/login/actionTypes";

// import { moduleChange } from "../../../store/Module/actions";

const ProfileMenu = (props) => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);
  const cName = JSON.parse(localStorage.getItem('cName'))
  const cCode = JSON.parse(localStorage.getItem('cCode'))

  const { userName, userPhoto } = useSelector(state => state.Login.userInformation)

  // const module = JSON.parse(localStorage.getItem('module'))
  const module = JSON.parse(sessionStorage.getItem('module'));

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOnclick = (value) => {
    navigate('/', { replace: true })
    window.location.reload()
    // dispatch(moduleChange(value))
    localStorage.setItem('module', value)
    sessionStorage.setItem('module', value);
  }



  return (
    <React.Fragment>
      <div className="d-flex align-items-center">
        <span className="text-white font-size-16 align-middle me-1 badge bg-success float-end d-sm-none d-lg-block d-none" >
          {cName}
        </span>
        <span className="text-white font-size-16 align-middle me-1 badge bg-success float-end d-lg-none d-block text-uppercase" >
          {cCode}
        </span>
      </div>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item "
          id="page-header-user-dropdown"
          tag="button"
        >
          {
            userPhoto &&
            <img
              className="rounded-circle header-profile-user"
              src={`data:image/png;base64,${userPhoto}`}
              alt="Header Avatar"
            />
          }
          <span className="d-none d-xl-inline-block ms-2 me-1">{userName}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>


        <DropdownMenu className="dropdown-menu-end">

          {/* <Link to="#">
            <DropdownItem tag="a">
              <i className="bx bx-wallet font-size-16 align-middle me-1" />
              {props.t("My Wallet")}
            </DropdownItem>
          </Link>
          <Link to="#">
            <DropdownItem tag="a">
              <span className="badge bg-success float-end">11</span>
              <i className="bx bx-wrench font-size-16 align-middle me-1" />
              {props.t("Settings")}
            </DropdownItem>
          </Link>
          <Link to="#">
            <DropdownItem tag="a" >
              <i className="bx bx-lock-open font-size-16 align-middle me-1" />
              {props.t("Lock screen")}
            </DropdownItem>
          </Link> */}


          {/* <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" /> */}
          <DropdownItem tag="a" className={`py-2 ${module === 1 ? 'text-primary fw-bold' : ''}`} onClick={() => handleOnclick(1)}>
            {" "}
            <MdOutlineAccountBalance size={20} color={`${module === 1 ? 'blue' : 'gray'}`} className="me-2" />
            {props.t("Account Module")}{" "}
          </DropdownItem>

          <DropdownItem tag="a" className={`py-2 ${module === 2 ? 'text-primary fw-bold' : ''}`} onClick={() => handleOnclick(2)}>
            {" "}
            <MdOutlineManageSearch size={20} color={`${module === 2 ? 'blue' : 'gray'}`} className="me-2" />
            {props.t("Payroll Module")}{" "}
          </DropdownItem>

          <DropdownItem tag="a" className={`py-2 ${module === 3 ? 'text-primary fw-bold' : ''}`} onClick={() => handleOnclick(3)}>
            {" "}
            <MdInventory2 size={20} color={`${module === 3 ? 'blue' : 'gray'}`} className="me-2" />
            {props.t("Inventory Management")}{" "}
          </DropdownItem>


          {/* diviver and logout */}

          <div className="dropdown-divider" />

          <Link to="/profile">
            <DropdownItem tag="a" className="py-2">
              {" "}
              <i className="bx bx-user font-size-16 align-middle me-1" />
              {props.t("Profile")}{" "}
            </DropdownItem>
          </Link>


          <Link to="/user-manual">
            <DropdownItem tag="a" className="py-2">
              {" "}
              <FaAddressBook
                className="bx bx-power-off font-size-16 align-middle me-1"
                style={{ color: 'gray' }}
              />
              {props.t(" User Manual")}{" "}
            </DropdownItem>
          </Link>



          <Link onClick={() => {
            navigate('/logout')
            window.location.reload()
          }}>
            <DropdownItem tag="a" className="py-2">
              {" "}
              <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
              {props.t("Logout")}{" "}
            </DropdownItem>
          </Link>

        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
};

const mapStatetoProps = (state) => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
