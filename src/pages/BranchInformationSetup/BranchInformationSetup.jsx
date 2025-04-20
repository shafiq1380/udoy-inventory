import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, UncontrolledTooltip } from 'reactstrap'
import CustomSpinner from '../../components/Common/CustomSpinner'
import ResponseModal from '../../components/Common/ResponseModal'
import { addBranchInfromation, getBranchInfromation, updateBranchInformation } from '../../store/branchInfo/actions'
import UpdateModal from '../../components/Common/UpdateModal'
import TableContainer from '../../components/Common/TableContainer'
import { Link } from 'react-router-dom'
import { MobileNumber, UserName } from '../UserList/UserCol'
import AutoCompleteInput from '../JournalVoucher/AutoCompleteInput'
import { getBankInfromation } from '../../store/bankInfo/actions'
import { FaEdit } from 'react-icons/fa'
import { authorization } from '../../components/Common/Authorization'


const branchInformationSetup = () => {

    //local state
    const [branchInformation, setbranchInformation] = useState(
        {
            // bankCode: '',
            branchCode: '',
            branchName: '',
            branchAddress: '',
            contactNumber: ''
        }
    )
    const [modal, setModal] = useState(false)
    const [showBranch, setShowBranch] = useState(false)
    const [updateModal, setUpdateModal] = useState()
    const [branchData, setBranchData] = useState()
    const [selectBankCode, setSelectedBankCode] = useState()

    //get redux state
    const { userID } = useSelector(state => state.Login.userInformation)
    const { bankInfo } = useSelector(state => state.bankInfoReducer)
    const { loading, error, success, branchInfo } = useSelector(state => state.branchInfoReducer)



    const dispatch = useDispatch()

    // input field get all branch information
    const handlebranchInformation = (e) => {
        const { name, value } = e.target;
        setbranchInformation({ ...branchInformation, entryUserId: userID, status: 1, bankCode: selectBankCode, [name]: value });
    }

    // select bank Code Dropdown
    const handleSelect = (bankcode) => {
        setSelectedBankCode(bankcode.value)
    }

    //add branch information
    const handleSubmit = async () => {
        const data = { data: branchInformation }
        // console.log(data)
        dispatch(addBranchInfromation(data))
        setModal(true)
        setbranchInformation({
            branchCode: '',
            branchName: '',
            branchAddress: '',
            contactNumber: ''
        })
    }

    //close the modal
    const onCloseClick = (modal) => {
        if (modal === 'update') {
            setUpdateModal(false)
        } else {
            setModal(false)
        }
    }

    //show all barnch
    const handleShowBranch = () => {
        const data = { data: 1 }
        setShowBranch(!showBranch)
        dispatch(getBranchInfromation(data))
    }

    //upate and delete branch info
    const handleDeleteItem = (e) => {
        setUpdateModal(true)
        console.log(e)
    }

    const editBranchBtn = (branch) => {
        setUpdateModal(true)
        setBranchData(branch)
    }

    const updateBranchData = (updatebranch) => {
        const data = { data: updatebranch }
        setUpdateModal(false)
        dispatch(updateBranchInformation(data))
    }

    // getbank information 
    const getbankInformation = () => {
        const data = { data: 1 }
        dispatch(getBankInfromation(data))
    }

    // pdf data format.......
    const pdfRows = branchInfo.map(item =>
        [item.id, item.bankCode, item.branchCode, item.branchName, item.branchAddress, item.contactNumber]);
    const pdfColoumData = [['ID', 'Bank Code', 'Branch Code', 'Branch Name', 'Branch Address', 'Contact Number']]


    //Authorization check
    useEffect(() => {
        authorization(12)
    }, [])


    useEffect(() => {
        const data = { data: 1 }
        dispatch(getBranchInfromation(data))

        getbankInformation()
    }, [updateModal, modal])


    const columns = useMemo(
        () => [
            {
                Header: "Bank Code",
                accessor: "bankCode",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Branch Code",
                accessor: "branchCode",
                filterable: true,
                Cell: (cellProps) => {
                    return <MobileNumber {...cellProps} />;
                },
            },
            {
                Header: "Branch Name",
                accessor: "branchName",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Branch Address",
                accessor: "branchAddress",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Contact Number",
                accessor: "contactNumber",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Action",
                disableFilters: true,
                Cell: (bankinfo) => {
                    return (
                        <div className="d-flex gap-3">
                            <Link
                                to="#"
                                className="text-success"
                                onClick={() => {
                                    editBranchBtn(bankinfo.row.original)
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
                                    handleDeleteItem(bankinfo.row.original.id);
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
                    <Card className=''>
                        <CardBody>
                            <Form>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="bankCode">
                                                Bank Code
                                            </Label>
                                            {/* <Input
                                                id="particulars"
                                                name="bankCode"
                                                placeholder='bankCode'
                                                bsSize="lg"
                                                value={branchInformation.bankCode}
                                                onChange={handlebranchInformation}
                                            /> */}

                                            {/* it's a autocomplete format */}
                                            <AutoCompleteInput
                                                options={bankInfo}
                                                handleSelect={handleSelect}
                                                selectedOption={selectBankCode}
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="branchCode">
                                                Branch Code
                                            </Label>
                                            <Input
                                                id="branchCode"
                                                name="branchCode"
                                                placeholder='Enter Bank Code'
                                                bsSize="lg"
                                                value={branchInformation.branchCode}
                                                onChange={handlebranchInformation}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                            <Form>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="branchName">
                                                Branch Name
                                            </Label>
                                            <Input
                                                id="branchName"
                                                name="branchName"
                                                placeholder='Enter Branch Name'
                                                bsSize="lg"
                                                value={branchInformation.branchName}
                                                onChange={handlebranchInformation}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="branchAddress">
                                                Branch Address
                                            </Label>
                                            <Input
                                                id="branchAddress"
                                                name="branchAddress"
                                                placeholder='Enter Branch Address'
                                                bsSize="lg"
                                                value={branchInformation.branchAddress}
                                                onChange={handlebranchInformation}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                            <Form>
                                <Row>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="contactNumber">
                                                Contact Number
                                            </Label>
                                            <Input
                                                id="contactNumber"
                                                name="contactNumber"
                                                placeholder='Enter Contact Number'
                                                bsSize="lg"
                                                value={branchInformation.contactNumber}
                                                onChange={handlebranchInformation}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                            <Col md={4}>
                                <FormGroup className="mt-md-2">
                                    <Button
                                        type="button"
                                        color="success"
                                        className="mb-2 me-2  px-5 "
                                        onClick={handleSubmit}
                                        disabled={loading ||
                                            !branchInformation.bankCode ||
                                            !branchInformation.branchAddress ||
                                            !branchInformation.branchName ||
                                            !branchInformation.contactNumber ||
                                            !branchInformation.branchCode
                                        }
                                    >
                                        {loading ? <CustomSpinner /> : 'Submit'}
                                    </Button>
                                </FormGroup>
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
                                        {showBranch ? 'Hidden All Branch' : 'Show All Branch'}
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
                                                    data={branchInfo}
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
            />

            <UpdateModal
                show={updateModal}
                onCloseClick={onCloseClick}
                branchData={branchData}
                updateBranchData={updateBranchData}
            />
        </div>
    )
}

export default branchInformationSetup