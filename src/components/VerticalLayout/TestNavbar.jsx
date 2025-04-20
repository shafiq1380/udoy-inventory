import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const SidebarItem = ({ item, openMenu, setOpenMenu }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [nesisOpen, setNesIsOpen] = useState(false);


    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (openMenu !== item.id) {
            setOpenMenu(item.id);
        } else {
            setOpenMenu(null); // Close the current menu if it's already open
        }
    };
    const handleNesToggle = () => {
        setNesIsOpen(!nesisOpen);

    };

    return (
        <li>
            <button className={`btn btn-link ${isOpen ? 'active' : ''}`} onClick={handleToggle}>
                {item.menuHeader}
            </button>
            {isOpen && item.subMenu && (
                <ul onClick={handleNesToggle} className='list-unstyled'>
                    {item.subMenu.map((subItem) => (
                        <li key={subItem.id} style={{ marginLeft: '20px' }} onClick={handleNesToggle}>
                            {subItem.path ? (
                                <Link to={subItem.path}>{subItem.title}</Link>
                            ) : (
                                <button className="btn btn-link">{subItem.title}</button>
                            )}


                            {nesisOpen && subItem.nestedSubmenu && (
                                <ul>
                                    {subItem.nestedSubmenu.map((nestedItem) => (
                                        <li key={nestedItem.id}>
                                            <Link to={nestedItem.url}>{nestedItem.title}</Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>


                    ))}

                </ul>
            )}
        </li>
    );
};

const TestNavbar = ({ formatData }) => {
    const [openMenu, setOpenMenu] = useState(null);
    console.log(openMenu)
    return (
        <div className="container-fluid">
            <div className="row">
                <nav className="col-md-2 d-none d-md-block  sidebar">
                    <div className="sidebar-sticky">
                        <ul className="nav flex-column">
                            {formatData.map((item) => (
                                <SidebarItem
                                    key={item.id}
                                    item={item}
                                    openMenu={openMenu}
                                    setOpenMenu={setOpenMenu}
                                />
                            ))}
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default TestNavbar;
