import React, { useState } from "react";
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
import { connect, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../Common/withRouter";

const ProfileMenu = (props) => {
  const [menu, setMenu] = useState(false);

  // const { userName, userPhoto } = useSelector(state => state.Login.userInformation)

  const userName = JSON.parse(localStorage.getItem('userName'));
  const userPhoto = JSON.parse(localStorage.getItem('userPhoto'));

  const navigate = useNavigate();


  return (
    <React.Fragment>
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

          <Link to="/profile">
            <DropdownItem tag="a" className="py-2">
              {" "}
              <i className="bx bx-user font-size-16 align-middle me-1" />
              {props.t("Profile")}{" "}
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
