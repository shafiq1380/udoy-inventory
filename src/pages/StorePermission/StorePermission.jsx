import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Col, Container, Input, Row } from 'reactstrap'
import { Post } from '../../utils/https';
import StoreItem from './StoreItem';
import Breadcrumb from '../../components/Common/Breadcrumb';
import { authorization } from '../../components/Common/Authorization';
import CustomSpinner from '../../components/Common/CustomSpinner';
import TableHeader from './TableHeader';

const StorePermission = () => {

    const [allStoreList, setAllStoreList] = useState([])
    const [userList, setUserList] = useState([])
    const [loading, setLoading] = useState(false)
    const [filterText, setFilterText] = useState('')

    const fetchAllStoreList = () => {
        Post('/api/v1/Product/GetAllStore')
            .then((res) => {
                // console.log("res", res)
                setAllStoreList(res.data.data)
            })
    };
    const getUserList = () => {
        setLoading(true)
        Post('/api/v1/InvTransaction/GetStorePermissionList')
            .then((res) => {
                // console.log("res", res)
                setLoading(false)
                setUserList(res.data.data)
            })
    };

    const addStoresToUsers = () => {
        return userList && userList.map(user => {
            // Add a new property 'stores' to each user
            return {
                ...user,
                storesItems: allStoreList
            };
        });
    };

    const onSearchTextHandler = (searchtext) => {
        // console.log(searchtext)
        setFilterText(searchtext)
    }

    const concatenated = addStoresToUsers()?.filter(user => {
        if (filterText === "") {
            return true;
        }
        // Otherwise, convert filterText to a string and compare with userID and name
        return user?.userID?.includes(String(filterText))
            || user?.userName?.toLowerCase()?.includes(String(filterText))
            || user?.designation?.toLowerCase()?.includes(String(filterText))
    });
    // console.log(concatenated)

    useEffect(() => {
        fetchAllStoreList()
        getUserList()
    }, [])


    useEffect(() => {
        authorization(92)
    }, [])


    const handleChangeTheCheckBox = (userID, storeID) => {
        setUserList(prevUsers => {
            return prevUsers.map(user => {
                if (user.userID === userID) {
                    const storeList = user?.storeList?.includes(storeID)
                        ? user.storeList.filter(item => item !== storeID)
                        : [...user.storeList, storeID];
                    return { ...user, storeList };
                }
                return user;
            });
        });
    }

    // console.log(filterText)


    return (
        <div className='page-content'>
            <Container fluid>

                <Breadcrumb title="Store Permission" breadcrumbItem="Store Permission" />
                <Card>
                    <CardBody>
                        <CardHeader>
                            <h3 className="text-center text-uppercase text-success mb-0">Store Permission</h3>
                        </CardHeader>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <Row>
                            <Col xs="12">

                                <Row>
                                    {
                                        !loading ?

                                            <div className="table-responsive-sm">
                                                <table className="table table-striped table-bordered table-sm" width="100%">
                                                    <thead style={{
                                                        height: "50px",
                                                        background: '#EFF2F7',
                                                        color: "black",
                                                        verticalAlign: 'middle',
                                                        padding: '10px'
                                                    }}>
                                                        <tr >
                                                            <th className="col-2 p-2" >
                                                                <TableHeader
                                                                    title={"User ID"}
                                                                    placeholder={concatenated?.length}
                                                                    onSearchTextHandler={onSearchTextHandler}
                                                                />
                                                            </th>
                                                            <th className="col-2">
                                                                <TableHeader
                                                                    title={"User Name"}
                                                                    placeholder={concatenated?.length}
                                                                    onSearchTextHandler={onSearchTextHandler}
                                                                />
                                                            </th>
                                                            <th className="col-2">
                                                                <TableHeader
                                                                    title={"Designation"}
                                                                    placeholder={concatenated?.length}
                                                                    onSearchTextHandler={onSearchTextHandler}
                                                                />
                                                            </th>
                                                            <th className="col-8" >
                                                                <TableHeader
                                                                    title={"Stores"}
                                                                    hide
                                                                />
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody style={{ verticalAlign: 'middle' }}>
                                                        {
                                                            concatenated?.length === 0 &&
                                                            <tr>
                                                                <td colSpan={4} className="text-center p-4 display-5">
                                                                    No Data Found
                                                                </td>
                                                            </tr>
                                                        }
                                                        {concatenated?.map((userData, index) => (
                                                            <tr key={index}>
                                                                <td >
                                                                    {userData?.userID}
                                                                </td>
                                                                <td >
                                                                    {userData?.userName}
                                                                </td>
                                                                <td >
                                                                    {userData?.designation}
                                                                </td>

                                                                <td >
                                                                    <div className='d-flex fw-bold flex-wrap'>
                                                                        {userData?.storesItems.map((store, index) => (
                                                                            <tr key={index} >
                                                                                <td>
                                                                                    <StoreItem
                                                                                        key={index}
                                                                                        storesItems={store}
                                                                                        userData={userData}
                                                                                        handleChangeTheCheckBox={handleChangeTheCheckBox}
                                                                                        checkedData={userData?.storeList}
                                                                                    />
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>

                                                </table>
                                            </div>
                                            :
                                            <CustomSpinner />
                                    }
                                </Row>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container >
        </div >
    )
}

export default StorePermission