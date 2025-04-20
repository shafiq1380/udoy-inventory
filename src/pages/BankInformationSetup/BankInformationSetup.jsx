import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, UncontrolledTooltip } from 'reactstrap'
import CustomSpinner from '../../components/Common/CustomSpinner'
import ResponseModal from '../../components/Common/ResponseModal'
import { addBankInfromation, deleteBankInformation, getBankInfromation, updateBankInformation } from '../../store/bankInfo/actions'
import { MobileNumber, UserID, UserName } from '../UserList/UserCol'
import { Link } from 'react-router-dom'
import TableContainer from '../../components/Common/TableContainer'
import UpdateModal from '../../components/Common/UpdateModal'
import './BankInformationSetup.css';
import { FaEdit } from 'react-icons/fa'
import { authorization } from '../../components/Common/Authorization'


const BankInformationSetup = () => {

    const [bankInformation, setBankInformation] = useState(
        {
            bankCode: '',
            bankName: ''
        }
    )
    const [modal, setModal] = useState(false)
    const [showBranch, setShowBranch] = useState(false)
    const [showDeleteBtn, setShowDeleteBtn] = useState(false)
    const [deleteID, setDeleteID] = useState()
    const [updateModal, setUpdateModal] = useState(false)
    const [bank, setBank] = useState()

    const dispatch = useDispatch()

    const { userID } = useSelector(state => state.Login.userInformation)
    const { loading, error, success, bankInfo } = useSelector(state => state.bankInfoReducer)



    //get input value
    const handleBankInformation = (e) => {
        const { name, value } = e.target;
        setBankInformation({ ...bankInformation, entryUserId: userID, [name]: value });
    }

    //added bank information
    const handleSubmit = () => {
        const data = { data: bankInformation }
        dispatch(addBankInfromation(data))
        if (loading === false) {
            setModal(true)
            setBankInformation({
                bankCode: '',
                bankName: ''
            })
        }
    }

    //get bank information
    const handleShowBranch = () => {
        const data = { data: 1 }
        dispatch(getBankInfromation(data))
        setShowBranch(!showBranch)
    }

    //update bank info
    const handleBankInfo = (bank) => {
        setBank(bank)
        setUpdateModal(true)
    }

    const handelUpdateBankInfo = (updateBank) => {
        const data = { data: updateBank }
        console.log('update data', data)
        setUpdateModal(false)
        dispatch(updateBankInformation(data))
    }



    //delete bank info
    const deleteBankInfo = (id) => {
        setDeleteID(id)
        setShowDeleteBtn(true)
        setModal(true)

    }
    const onDeleteClick = () => {
        const data = { data: deleteID }
        dispatch(deleteBankInformation(data))
        setShowDeleteBtn(false)
        setModal(false)
        setDeleteID('')
    }

    //close modal btn
    const onCloseClick = () => {
        setModal(false)
        setShowDeleteBtn(false)
        setUpdateModal(false)
    }

    // pdf data format.......
    const pdfRows = bankInfo.map(item => [item.id, item.bankCode, item.bankName,]);
    const pdfColoumData = [['ID', 'Bank Code', 'Bank Name',]]


    //Authorization check
    useEffect(() => {
        authorization(11)
    }, [])

    useEffect(() => {
        const data = { data: 1 }
        dispatch(getBankInfromation(data))
    }, [modal])


    // table colums start here 
    //colums cell text use from userList col
    const columns = useMemo(
        () => [
            // {
            //     Header: "SL#",
            //     accessor: "userID",
            //     width: 150,
            //     filterable: true,
            //     Cell: (cellProps) => {
            //         return <UserID {...cellProps} />
            //     },
            // },
            {
                Header: "Bank Code",
                accessor: "bankCode",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Bank Name",
                accessor: "bankName",
                filterable: true,
                Cell: (cellProps) => {
                    return <MobileNumber {...cellProps} />;
                },
            },
            {
                Header: "Action",
                // accessor: "action",
                disableFilters: true,
                Cell: (bankinfo) => {
                    return (
                        <div className="d-flex gap-3">
                            <Link
                                to="#"
                                className="text-success"
                                onClick={() => {
                                    handleBankInfo(bankinfo.row.original)
                                }}
                            >
                                {/* <i className="mdi mdi-pencil font-size-18" id="edittooltip" /> */}
                                <FaEdit id="edittooltip" size={18} />
                                <UncontrolledTooltip placement="top" target="edittooltip">
                                    Edit
                                </UncontrolledTooltip>
                            </Link>
                            {/* <Link
                                to="#"
                                className="text-danger"
                                onClick={() => {
                                    deleteBankInfo(bankinfo.row.original.id);
                                }}
                            >
                                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                                <UncontrolledTooltip placement="top" target="deletetooltip">
                                    Delete
                                </UncontrolledTooltip>
                            </Link> */}
                        </div>
                    );
                },
            },
        ],
        []
    );



    return (
        <div className="page-content">
            <Row>
                <Col xs="12">
                    <Card>
                        <CardBody>
                            <Form>
                                <FormGroup row>
                                    <Label for="bankCode" sm={2} size="lg">Bank Code</Label>
                                    <Col sm={10} md={4}>
                                        <Input
                                            id="bankCode"
                                            name="bankCode"
                                            placeholder='Enter Bank Code'
                                            className='custom-input'
                                            bsSize="lg"
                                            value={bankInformation.bankCode}
                                            onChange={handleBankInformation}
                                        />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="bankName" sm={2} size="lg">Bank Name</Label>
                                    <Col sm={10} md={4}>
                                        <Input
                                            id="bankName"
                                            name="bankName"
                                            placeholder='Enter Bank Name'
                                            className='custom-input'
                                            bsSize="lg"
                                            value={bankInformation.bankName}
                                            onChange={handleBankInformation}
                                        />

                                    </Col>
                                </FormGroup>
                            </Form>

                            <Col md={6}>
                                <div className='d-flex'>
                                    <FormGroup className="mt-md-2 text-right">
                                        <Button
                                            type="button"
                                            color="success"
                                            className="mb-2 me-2  px-5 "
                                            onClick={handleSubmit}
                                            disabled={loading ||
                                                !bankInformation.bankCode ||
                                                !bankInformation.bankName
                                            }
                                        >
                                            {loading ? <CustomSpinner /> : 'Submit'}
                                        </Button>
                                    </FormGroup>
                                </div>
                            </Col>
                        </CardBody>
                    </Card>
                </Col>
            </Row>


            <Row>
                <Col xs="12">
                    <Card className=''>
                        <CardBody>
                            <Col md={4}>
                                <FormGroup className="mt-md-2">
                                    <Button
                                        type="button"
                                        color="success"
                                        className="mb-2 me-2  px-3 "
                                        onClick={handleShowBranch}
                                    >
                                        {showBranch ? 'Hide All Bank' : 'Show All Bank'}
                                    </Button>
                                </FormGroup>
                            </Col>

                            {
                                showBranch &&
                                <Row>
                                    <Col xs="12">
                                        <Card>
                                            <CardBody>
                                                <TableContainer
                                                    columns={columns}
                                                    data={bankInfo}
                                                    // isGlobalFilter={true}
                                                    // isAddUserList={true}
                                                    // handleOrderClicks={handleUserInfo}
                                                    showbtn
                                                    customPageSize={10}
                                                    className="custom-header-css"
                                                    pdfRows={pdfRows}
                                                    pdfColoumData={pdfColoumData}
                                                />
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            }

                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <ResponseModal
                show={modal}
                onCloseClick={onCloseClick}
                errorMsg={error}
                msg={success}
                showbtn={showDeleteBtn}
                onDeleteClick={onDeleteClick}
            />

            <UpdateModal
                branchData={bank}
                updateBank
                show={updateModal}
                onCloseClick={onCloseClick}
                updateBranchData={handelUpdateBankInfo}
            />

        </div>
    )
}

export default BankInformationSetup