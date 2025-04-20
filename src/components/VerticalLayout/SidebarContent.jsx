import PropTypes, { object } from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import './menu.css'

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { Link, NavLink, useLocation } from "react-router-dom";
import withRouter from "../Common/withRouter";

//i18n
import { withTranslation } from "react-i18next";
import { useCallback } from "react";
import menuData from "../MenuData/MenuData";
import { useDispatch, useSelector } from "react-redux";
import { getNodeList } from "../../store/nodeList/actions";
import hrMenu from "../MenuData/HRMenu";
import inventoryMenu from "../MenuData/InventoryMenu";
import TestNavbar from "./TestNavbar";


const SidebarContent = props => {


  const ref = useRef();

  // this function to active the parent dropdown
  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          // parent3.classList.add("mm-active"); // li
          // parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              // parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);


  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const path = useLocation();
  const activeMenu = useCallback(() => {
    const pathName = path.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path.pathname, activateParentDropdown]);



  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }


  //get all node list by user

  const userID = JSON.parse(localStorage.getItem('userID'))

  const { nodeList } = useSelector(state => state.NodeListReducer)



  const dispatch = useDispatch()

  //get the module id 
  // const { module } = useSelector(state => state.moduleChange)

  // const module = JSON.parse(localStorage.getItem('module'))
  const module = JSON.parse(sessionStorage.getItem('module'));

  useEffect(() => {
    const lclModule = JSON.parse(localStorage.getItem('module'))
    if (!module) {
      sessionStorage.setItem('module', lclModule);
    }
  }, [])


  //choice the menu based on the module
  const menuShow = module === 1 ? menuData : module === 2 ? hrMenu : inventoryMenu


  const getUserNodeList = () => {
    const data = { data: userID }
    dispatch(getNodeList(data))
  }



  const nodeListID = nodeList.map(node => {
    return node.nodeID
  })

  const sortedArray = nodeListID.sort((a, b) => a - b);


  // FILTER MENU AS USER NODE LIST
  function filterMenu(menu, sortedArray) {
    return menu.map(menuItem => {
      const filteredSubMenu = menuItem.subMenu
        ? filterMenu(menuItem.subMenu, sortedArray)
        : [];

      const filteredNestedSubmenu = menuItem.nestedSubmenu
        ? filterMenu(menuItem.nestedSubmenu, sortedArray)
        : [];

      if (sortedArray.includes(menuItem.id) || filteredSubMenu.length > 0 || filteredNestedSubmenu.length > 0) {
        return {
          ...menuItem,
          subMenu: filteredSubMenu,
          nestedSubmenu: filteredNestedSubmenu
        };
      }

      return null;
    }).filter(menuItem => menuItem !== null);
  }

  const filteredMenuData = filterMenu(menuShow, sortedArray);

  useEffect(() => {
    if (!nodeList.length) {
      getUserNodeList()
    }
  }, [])



  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
    activeMenu();
  }, [nodeList]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // activeMenu();
  }, []);  // activeMenu


  // format data
  function removeEmptySubmenus(data) {
    return data.map(item => {
      if (item.subMenu) {
        item.subMenu = removeEmptySubmenus(item.subMenu);
        if (item.subMenu.length === 0) {
          delete item.subMenu;
        }
      }

      if (item.nestedSubmenu) {
        item.nestedSubmenu = removeEmptySubmenus(item.nestedSubmenu);
        if (item.nestedSubmenu.length === 0) {
          delete item.nestedSubmenu;
        }
      }

      return item;
    });
  }

  const formatData = removeEmptySubmenus(filteredMenuData);


  //this use Effect user for the module change and reload the page
  // useEffect(() => {
  //   const updateModule = () => {
  //     if (filteredMenuData.length === 0 && module <= 3) {
  //       window.location.reload()
  //       localStorage.setItem('module', module + 1)
  //     }
  //   };
  //   const timer = setTimeout(updateModule, 10000);
  //   return () => clearTimeout(timer);
  // }, [formatData]);


  // console.log(nodeListID)

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">

            {/*Side  Menu edit from Here */}

            <li className="menu-title">{props.t("Menu")}</li>

            {

              inventoryMenu &&
              inventoryMenu.map((menuItem, index) =>
                // console.log(menu)
                <li key={index} >
                  <Link className="has-arrow ">
                    {
                      menuItem.subMenu &&
                      <i className="bx bx-receipt " ></i>
                    }
                    <span >{menuItem.menuHeader}</span>
                  </Link>

                  <ul className="sub-menu">
                    {
                      menuItem?.subMenu?.map((item, index) =>
                        <li key={index}>
                          {
                            <NavLink to={item.path}
                              className={`${item.nestedSubmenu ? "has-arrow" : ""}`}
                              data-bs-toggle="tooltip"
                              data-bs-placement="right"
                              title={item.tooltip}
                            >
                              <span >{item.title}</span>
                            </NavLink>

                          }

                          {
                            item.nestedSubmenu &&
                            <ul className="sub-menu">
                              {
                                item?.nestedSubmenu?.map((nesSubMnu, index) =>
                                  <li key={index}>
                                    {
                                      < NavLink to={nesSubMnu.url}
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="right"
                                        title={nesSubMnu.tooltip}

                                      >
                                        <span> {nesSubMnu.title}</span>
                                      </NavLink>
                                    }
                                  </li>
                                )
                              }
                            </ul>
                          }
                        </li>
                      )
                    }
                  </ul>
                </li>
              )
            }
          </ul>
        </div>
        {/* <TestNavbar formatData={formatData} /> */}
      </SimpleBar >
    </React.Fragment >
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
