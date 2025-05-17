import React, { useEffect, useMemo, useState } from 'react'
import Breadcrumb from '../../../components/Common/Breadcrumb'
import { Card, CardBody, Col, Container, FormGroup, Label, Row, UncontrolledTooltip } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { MobileNumber, UserEmail, UserID, UserName, UserStatus } from '../../UserList/UserCol'
import TableContainer from '../../../components/Common/TableContainer'
import CustomSpinner from '../../../components/Common/CustomSpinner'
import { Link } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import SubgrpModal from './SubgrpModal'
import { fetchAllGroup, fetchAllItemList, fetchSubGroup } from '../../../store/InventoryItemList/actions'
import ReactSelectItem from '../component/ReactSelectItem'
import { authorization } from '../../../components/Common/Authorization'

const Subgroup = () => {

    const { itemSubGroupList, itemGroupList } = useSelector(state => state.AllItemList)
    const dispatch = useDispatch()

    const [showMdal, setShowModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [updateData, setUpdateData] = useState({})


    const [selectItem, setSelectItem] = useState({
        "label": "01 : Construction Material",
        "value": 1
    })


    const handleModal = () => {
        setIsEdit(false)
        setShowModal(!showMdal)
    }

    const handleEdit = (data) => {
        setUpdateData(data)
        setIsEdit(true)
        setShowModal(!showMdal)
    }


    const columns = useMemo(
        () => [
            // {
            //     Header: "Group ID",
            //     accessor: "groupID",
            //     filterable: true,
            //     Cell: (cellProps) => {
            //         return <UserName {...cellProps} />;
            //     },
            // },
            {
                Header: "Sub Group Code",
                accessor: "subGroupCode",
                // disableFilters: true,
                filterable: true,
                width: 200,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },
            {
                Header: "Sub Group Name",
                accessor: "subGroupName",
                filterable: true,
                Cell: (cellProps) => {
                    return <MobileNumber {...cellProps} />;
                },
            },

            {
                Header: "Action",
                accessor: "action",
                disableFilters: true,
                Cell: (usr) => {
                    return (
                        <div className="d-flex gap-3">
                            <a
                                to="#"
                                className="text-success"
                                onClick={() => handleEdit(usr.row.original)}
                            >
                                <FaEdit id="edittooltip" size={18} />
                                <UncontrolledTooltip placement="top" target="edittooltip">
                                    Edit
                                </UncontrolledTooltip>
                            </a>
                        </div>
                    );
                },
            },
        ],
        []
    );


    const handleSelectedItem = (event) => {
        localStorage.setItem('selectItem', JSON.stringify(event))
        const getSelectItem = JSON.parse(localStorage.getItem('selectItem'))
        setSelectItem(getSelectItem)
    }

    // option formated for react select
    const groupOption = itemGroupList?.map((item) => ({
        label: item.groupCode + " : " + item.groupName,
        value: item.id
    }))


    //get Data from Server
    useEffect(() => {
        dispatch(fetchAllGroup())
    }, [])


    useEffect(() => {
        dispatch(fetchSubGroup(selectItem.value))
    }, [selectItem, showMdal])

    useEffect(() => {
        authorization(64)
    }, [])

    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb breadcrumbItem={'Sub Group'} title={'Sub Group'} />

                <Card>
                    <CardBody >
                        <Col md={6} className='d-flex align-items-center justify-content-start flex-wrap'>
                            <Label size="lg" className='me-3'>Select Group</Label>
                            <ReactSelectItem
                                col={8}
                                options={groupOption}
                                handleSelectedItem={handleSelectedItem}
                                hidden
                                value={selectItem}
                            />
                        </Col>
                    </CardBody>
                </Card>

                {
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CardBody>
                                    <TableContainer
                                        columns={columns}
                                        // data={[]}
                                        data={itemSubGroupList ? itemSubGroupList : []}
                                        isGlobalFilter={true}
                                        isAddUserList={true}
                                        onClickBtn={handleModal}
                                        customPageSize={100}
                                        className="custom-header-css"
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                }
            </Container>

            <SubgrpModal
                show={showMdal}
                handleModal={handleModal}
                isEdit={isEdit}
                selectItem={selectItem}
                updateData={updateData}
            />
        </div>
    )
}

export default Subgroup