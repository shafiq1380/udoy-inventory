import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Row, Col, Collapse } from "reactstrap";
import { Link } from "react-router-dom";
import withRouter from "../Common/withRouter";
import classname from "classnames";

//i18n
import { withTranslation } from "react-i18next";

import { connect, useDispatch, useSelector } from "react-redux";
import menuData from "../MenuData/MenuData";
import { Post } from "../../utils/https";
import hrMenu from "../MenuData/HRMenu";
import inventoryMenu from "../MenuData/InventoryMenu";

const Navbar = props => {

  const [dashboard, setdashboard] = useState(false);
  const [ui, setui] = useState(false);
  const [app, setapp] = useState(false);
  const [email, setemail] = useState(false);
  const [ecommerce, setecommerce] = useState(false);
  const [crypto, setcrypto] = useState(false);
  const [project, setproject] = useState(false);
  const [task, settask] = useState(false);
  const [contact, setcontact] = useState(false);
  const [blog, setBlog] = useState(false);
  const [job, setJob] = useState(false);
  const [candidate, setCandidate] = useState(false);
  const [component, setcomponent] = useState(false);
  const [form, setform] = useState(false);
  const [table, settable] = useState(false);
  const [chart, setchart] = useState(false);
  const [icon, seticon] = useState(false);
  const [map, setmap] = useState(false);
  const [extra, setextra] = useState(false);
  const [invoice, setinvoice] = useState(false);
  const [auth, setauth] = useState(false);
  const [utility, setutility] = useState(false);

  useEffect(() => {
    var matchingMenuItem = null;
    var ul = document.getElementById("navigation");
    var items = ul.getElementsByTagName("a");
    removeActivation(items);
    for (var i = 0; i < items.length; ++i) {
      if (window.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  });

  //this use Effect for fetch the User Data

  const removeActivation = items => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;
      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        if (parent.classList.contains("active")) {
          parent.classList.remove("active");
        }
      }
    }
  };

  function activateParentDropdown(item) {
    item.classList.add("active");
    const parent = item.parentElement;
    if (parent) {
      parent.classList.add("active"); // li
      const parent2 = parent.parentElement;
      parent2.classList.add("active"); // li
      const parent3 = parent2.parentElement;
      if (parent3) {
        parent3.classList.add("active"); // li
        const parent4 = parent3.parentElement;
        if (parent4) {
          parent4.classList.add("active"); // li
          const parent5 = parent4.parentElement;
          if (parent5) {
            parent5.classList.add("active"); // li
            const parent6 = parent5.parentElement;
            if (parent6) {
              parent6.classList.add("active"); // li
            }
          }
        }
      }
    }
    return false;
  }


  // const { module } = useSelector(state => state.moduleChange)
  const module = JSON.parse(localStorage.getItem('module'))
  //choice the menu based on the module
  const menuShow = module === 1 ? menuData : module === 2 ? hrMenu : inventoryMenu


  //get all node list by user

  const userID = JSON.parse(localStorage.getItem('userID'))
  // const [nodeList, setNodeList] = useState([])

  // const getUserNodeList = () => {
  //   const data = { data: userID }

  //   try {
  //     const response = Post('/api/v1/UserManagement/GetNodeListByUser', data)
  //       .then(res => setNodeList(res.data.data))
  //   } catch (error) {
  //   }
  // }

  // const nodeListID = nodeList.map(node => {
  //   return node.nodeID
  // })

  // const sortedArray = nodeListID.sort((a, b) => a - b);


  // function filterMenu(menu, sortedArray) {
  //   return menu.map(menuItem => {
  //     const filteredSubMenu = menuItem.subMenu
  //       ? filterMenu(menuItem.subMenu, sortedArray)
  //       : [];

  //     const filteredNestedSubmenu = menuItem.nestedSubmenu
  //       ? filterMenu(menuItem.nestedSubmenu, sortedArray)
  //       : [];

  //     if (sortedArray.includes(menuItem.id) || filteredSubMenu.length > 0 || filteredNestedSubmenu.length > 0) {
  //       return {
  //         ...menuItem,
  //         subMenu: filteredSubMenu,
  //         nestedSubmenu: filteredNestedSubmenu
  //       };
  //     }

  //     return null;
  //   }).filter(menuItem => menuItem !== null);
  // }

  // const filteredMenuData = filterMenu(menuShow, sortedArray);



  // useEffect(() => {
  //   getUserNodeList()
  // }, [])


  return (
    <React.Fragment>
      <div className="topnav">
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              isOpen={props.leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">

                {/* menu start from Here */}

                {
                  inventoryMenu.map(menuItem =>
                    <li className="nav-item dropdown" key={menuItem.id}>
                      {/* Menu Header */}
                      <Link
                        // to="/#"
                        // onClick={e => {
                        //   e.preventDefault();
                        //   setecommerce(!ecommerce);
                        // }}
                        className="nav-link dropdown-togglez arrow-none fs-5"
                      >
                        <i className="bx bx-customize me-2"></i>
                        {menuItem.menuHeader} <div className="arrow-down"></div>
                      </Link>

                      {/* menu submenu */}
                      {menuItem.subMenu &&
                        <div className={classname("dropdown-menu")}>
                          {
                            menuItem && menuItem.subMenu && menuItem.subMenu.map(submenuItem =>
                              <div className="dropdown" key={submenuItem.id}>
                                <Link
                                  className="dropdown-item dropdown-toggle arrow-none"
                                  to={submenuItem.path}
                                  // onClick={e => {
                                  //   e.preventDefault();
                                  //   setemail(!email);
                                  // }}
                                  data-bs-toggle="tooltip" data-bs-placement="right" title={submenuItem.tooltip}
                                >
                                  {submenuItem.title}
                                  {
                                    submenuItem.nestedSubmenu.length > 0 &&
                                    <div className="arrow-down"></div>
                                  }
                                </Link>

                                {/* nested submenu start here */}
                                {
                                  submenuItem?.nestedSubmenu.length > 0 &&
                                  <div
                                    className={classname("dropdown-menu", { show: email })}
                                  >
                                    {
                                      submenuItem?.nestedSubmenu?.map(nesMnuItem =>
                                        <Link to={nesMnuItem.url} className="dropdown-item" data-bs-toggle="tooltip" data-bs-placement="right" title={nesMnuItem.tooltip}>
                                          {nesMnuItem.title}
                                        </Link>
                                      )
                                    }
                                  </div>
                                }
                              </div>
                            )
                          }
                        </div>
                      }
                    </li>
                  )
                }


              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment>
  );
};

Navbar.propTypes = {
  leftMenu: PropTypes.any,
  location: PropTypes.any,
  menuOpen: PropTypes.any,
  t: PropTypes.any,
};

const mapStatetoProps = state => {
  const { leftMenu } = state.Layout;
  return { leftMenu };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(Navbar))
);
