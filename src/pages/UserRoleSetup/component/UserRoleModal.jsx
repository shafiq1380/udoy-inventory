import React, { useEffect, useMemo, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Row, Col } from 'reactstrap';

import NestedItem from './NestedItem';
import { Post } from '../../../utils/https'
import CustomSpinner from '../../../components/Common/CustomSpinner';


const UserRoleModal = ({ showModal, toggleModal, isEdit, updatData, reloadPage }) => {

    const [menuData, setMenuData] = useState()
    const [checkedItems, setCheckedItems] = useState([]);

    const [roleName, setRoleName] = useState('');


    const handleCheck = (itemId, isChecked) => {
        if (isChecked) {
            setCheckedItems([...checkedItems, itemId]);
        } else {
            setCheckedItems(checkedItems.filter((id) => id !== itemId));
        }
    };


    const handleChange = (e) => {
        setRoleName(e.target.value)
    }


    const handleAddedPermission = () => {
        const newData = { roleName: roleName, menuList: checkedItems }
        const data = { data: newData }
        try {
            Post('/api/UserManagement/AddRole', data)
                .then(res => {
                    if (res.data.data === false) {
                        //If Error Show Something
                    }
                    reloadPage()
                })
        } catch (error) {

        }
        toggleModal()
        setRoleName('')
        setCheckedItems([])
    }


    const handleUpdatePermission = () => {
        const newData = { roleID: updatData.roleID, roleName: roleName, menuList: checkedItems }
        const data = { data: newData }
        try {
            Post('/api/UserManagement/UpdateRole', data)
                .then(res => {
                    if (res.data.data === false) {
                        //If Error Show Something
                    }
                    reloadPage()
                })
        } catch (error) {

        }
        toggleModal()
        setRoleName('')
        setCheckedItems([])
    }


    useEffect(() => {
        try {
            Post('/api/UserManagement/GetAllNodes')
                .then(res => setMenuData(res.data.data))
        } catch (error) {

        }
        if (isEdit) {
            setCheckedItems(updatData.menuList)
            setRoleName(updatData?.roleName)
        }
    }, [isEdit])

    //filter the menu with header 

    // const filteredMenuHeaders = useMemo(() => {
    //     return menuData?.filter(item => item.menuHeader.toLowerCase() === updatData.roleName.toLowerCase());
    // }, [updatData.roleName]);

    // console.log(filteredMenuHeaders)
    // console.log(updatData?.roleName)

    return (
        <div >
            <Modal isOpen={showModal} centered={false}
                toggle={() => {
                    toggleModal()
                    setRoleName('')
                    setCheckedItems([])
                }} className="modal-lg">
                <ModalHeader toggle={() => {
                    toggleModal()
                    setRoleName('')
                    setCheckedItems([])
                }}> {isEdit ? 'Update Selected Permission' : 'Select User Permission'}</ModalHeader>

                <ModalBody>
                    <Row className='d-flex justify-content-between'>
                        <Col className='col-12 col-md-6'>
                            <Input
                                placeholder='Enter Permission Name'
                                onChange={handleChange}
                                onBlur={handleChange}
                                // name='roleName'
                                defaultValue={isEdit ? updatData?.roleName : ''}
                            />
                        </Col>
                        <Col className='col-12 col-md-6'>
                            {
                                !isEdit ? <Button
                                    className="btn-rounded px-4"
                                    type="button"
                                    color="success"
                                    onClick={() => handleAddedPermission()}
                                    disabled={!roleName || checkedItems.length === 0}
                                >
                                    Add Role
                                </Button>
                                    : <Button
                                        className="btn-rounded px-4"
                                        type="button"
                                        color="success"
                                        disabled={!roleName || checkedItems.length === 0}
                                        onClick={() => handleUpdatePermission()}
                                    >
                                        Update Role
                                    </Button>

                            }
                        </Col>

                    </Row>
                </ModalBody>

                <ModalBody className='d-flex flex-wrap custom-scrollbar'>

                    {menuData ?
                        menuData?.map((menu, index) =>
                            // console.log(menu.id)
                            < NestedItem
                                key={index}
                                item={menu}
                                onCheck={handleCheck}
                                isChecked={checkedItems.includes(menu.id)}
                                items={isEdit ? updatData?.menuList : []}

                            />
                        )
                        :
                        <CustomSpinner />
                    }

                </ModalBody>
                <ModalFooter>

                </ModalFooter>
            </Modal>
        </div >
    );
};

export default UserRoleModal;
