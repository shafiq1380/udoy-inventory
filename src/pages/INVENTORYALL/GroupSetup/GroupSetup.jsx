import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MobileNumber, UserEmail } from '../../UserList/UserCol';
import { Card, CardBody, Col, Container, Row, UncontrolledTooltip } from 'reactstrap';
import Breadcrumb from '../../../components/Common/Breadcrumb';
import TableContainer from '../../../components/Common/TableContainer';
import { FaEdit } from 'react-icons/fa';
import { fetchAllGroup } from '../../../store/InventoryItemList/actions';
import { authorization } from '../../../components/Common/Authorization';

const GroupSetup = () => {
    const { itemGroupList } = useSelector(state => state.AllItemList)
    console.log('itemGroupList', itemGroupList);
    const dispatch = useDispatch()

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
                Header: "Group Code",
                accessor: "groupCode",
                // disableFilters: true,
                filterable: true,
                width: 200,
                Cell: (cellProps) => {
                    return <UserEmail {...cellProps} />;
                },
            },
            {
                Header: "Group Name",
                accessor: "groupName",
                filterable: true,
                Cell: (cellProps) => {
                    return <MobileNumber {...cellProps} />;
                },
            },

            // {
            //     Header: "Action",
            //     accessor: "action",
            //     disableFilters: true,
            //     Cell: (usr) => {
            //         return (
            //             <div className="d-flex gap-3">
            //                 <a
            //                     to="#"
            //                     className="text-success"
            //                 // onClick={() => handleEdit(usr.row.original)}
            //                 >
            //                     <FaEdit id="edittooltip" size={18} />
            //                     <UncontrolledTooltip placement="top" target="edittooltip">
            //                         Edit
            //                     </UncontrolledTooltip>
            //                 </a>
            //             </div>
            //         );
            //     },
            // },
        ],
        []
    );

    //get Data from Server
    useEffect(() => {
        dispatch(fetchAllGroup())
    }, [])

    //authorization
    useEffect(() => {
        authorization(63)
    }, [])


    return (
        <div className='page-content'>
            <Container fluid>
                <Breadcrumb breadcrumbItem={'Group'} title={'Group'} />
                {
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CardBody>
                                    <TableContainer
                                        columns={columns}
                                        data={itemGroupList ? itemGroupList : []}
                                        isGlobalFilter={true}
                                        isAddUserList={true}
                                        // onClickBtn={handleModal}
                                        customPageSize={100}
                                        className="custom-header-css"
                                        hidden
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                }
            </Container>
        </div>
    )
}

export default GroupSetup