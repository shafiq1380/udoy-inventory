import React, { useState, useEffect } from 'react'
import {
    DropdownMenu, DropdownItem,
    ButtonDropdown, DropdownToggle,
    UncontrolledTooltip,
} from "reactstrap";
import AddCategoryModal from '../../components/Common/AddCategoryModal';
import AddAccountModal from '../../components/Common/AddAccountModal';
import UpdateCOAModal from '../../components/Common/UpdateCOAModal';
import { useDispatch } from 'react-redux';
import { fetchCoaSetupFailure } from '../../store/coa-setup/actions';

const COAItem = ({ menu, isExpanded }) => {

    const [isChild, setIsChild] = useState(false);
    const [dropdownOpen, setOpen] = useState(false);
    const [isEditable, setIsEditable] = useState(false)

    const [addCategoryModal, setAddCategoryModal] = useState(false);
    const [addAccountModal, setAddAccountModal] = useState(false);
    const [updateCOAModal, setUpdateCOAModal] = useState(false);


    const [categoryData, setCategoryData] = useState([])
    const { coaCode, coaName, coaChildList, nodeTypeID } = menu;

    const dispatch = useDispatch()

    const childToggleHandler = () => {
        setIsChild((prevIsChild) => !prevIsChild);
    }

    const handleAddCategory = (menu) => {
        setCategoryData(menu)
        setAddCategoryModal(true)
    };

    const handleAddAccount = (menu, value) => {
        if (value) {
            setIsEditable(true)
        }
        setCategoryData(menu)
        setAddAccountModal(true)
    };

    const handleEdit = (menu) => {
        setCategoryData(menu)
        setUpdateCOAModal(true)
    }

    const onCloseClick = () => {
        setUpdateCOAModal(false)
        setAddAccountModal(false)
        setAddCategoryModal(false)
        setIsEditable(false)
        dispatch(fetchCoaSetupFailure(''))
    }

    useEffect(() => {
        setIsChild(isExpanded);
    }, [isExpanded]);

    return (
        <>
            <div>
                <div className='d-flex align-items-center'>

                    <span className='m-1 text-black' onClick={childToggleHandler} style={{ cursor: 'pointer' }}>
                        {
                            isChild && coaChildList ? <i className="mdi mdi-minus" />
                                :
                                coaChildList ? <i className="mdi mdi-plus" />
                                    :
                                    null
                        }
                    </span>

                    {
                        nodeTypeID > 0 ? <ButtonDropdown
                            toggle={() => { setOpen(!dropdownOpen) }}
                            isOpen={dropdownOpen}
                        >
                            <DropdownToggle color="white border border-white p-0" caret>
                                {/* <span className='m-1 text-black'><i className="mdi mdi-dots-vertical" /></span> */}
                                {nodeTypeID > 0 ?
                                    <span className={`${nodeTypeID === 1 ? 'm-1 text-primary' : 'm-1 text-black'}`}>{coaCode} : {coaName}</span>
                                    : <span className='m-1 text-black'>{coaName}</span>
                                }
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => handleAddAccount(menu, 'edit')}>Edit</DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>
                            :
                            <ButtonDropdown
                                toggle={() => { setOpen(!dropdownOpen) }}
                                isOpen={dropdownOpen}
                            >
                                <DropdownToggle color="white border border-white p-0" caret>
                                    {/* <span className='m-1 text-black'><i className="mdi mdi-dots-vertical" /></span> */}
                                    {nodeTypeID > 0 ?
                                        <span className={`${nodeTypeID === 1 ? 'm-1 text-primary' : 'm-1 text-black'}`}>{coaCode} : {coaName}</span>
                                        : <span className='m-1 text-black'>{coaName}</span>
                                    }
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={() => handleAddCategory(menu)}>Add Category</DropdownItem>
                                    <DropdownItem onClick={() => handleAddAccount(menu)}>Add Account</DropdownItem>
                                    <DropdownItem onClick={() => handleEdit(menu)}>Edit</DropdownItem>
                                </DropdownMenu>
                            </ButtonDropdown>
                    }

                </div>

                {
                    isChild ? (
                        <div style={{ marginLeft: 20 }} className='border-start border-2'>
                            {
                                coaChildList?.map((child, index) => <COAItem menu={child} key={index} isExpanded={isExpanded} />)
                            }
                        </div>
                    ) : null}
            </div>

            <AddCategoryModal
                show={addCategoryModal}
                onCloseClick={onCloseClick}
                menuData={menu}
            />


            <AddAccountModal
                show={addAccountModal}
                onCloseClick={onCloseClick}
                menuData={menu}
                isEditable={isEditable}
            />

            <UpdateCOAModal
                show={updateCOAModal}
                onCloseClick={onCloseClick}
                menuData={menu}
            />
        </>
    )
}



export default COAItem