import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, CardBody, Container } from 'reactstrap'
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { coaImportByIdData } from '../../store/coa-analysis-import/actions';
import TableContainer from '../../components/Common/TableContainer';
import { ActiveStatus, UserID, UserName } from '../UserList/UserCol';
import COACfrmModal from './COACfrmModal';
import SyncDataModal from './SyncDataModal';



function Loader() {
    return (
        <div className="d-flex justify-content-center align-items-center mt-5">
            <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}



const COAAnalysisImportById = () => {

    const { coaImportByIdLoading, coaImportByIdError, coaImportByIdSuccess } = useSelector(state => state.coaAnalysisImportReducer);

    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState(null);
    const [confirmModal, setConfirmModal] = useState(false)
    const [updateParentData, setUpdateParentData] = useState(false)
    const [coa, setCoa] = useState({});

    const { state } = useLocation();

    const dispatch = useDispatch();


    const handleModal = async (coa, modalText) => {
        setCoa(coa)
        setStatus(modalText)
        setShowModal(!showModal)
    }


    useEffect(() => {
        dispatch(coaImportByIdData(state));
    }, [dispatch, state, updateParentData]);


    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: "id",
                width: 150,
                filterable: true,
                Cell: (cellProps) => {
                    return <UserID {...cellProps} />
                },
            },
            {
                Header: "Sub Code ID",
                accessor: "subCodeID",
                width: 150,
                filterable: true,
                Cell: (cellProps) => {
                    return <UserID {...cellProps} />
                },
            },
            {
                Header: "Sub Code Name",
                accessor: "subCodeName",
                filterable: true,
                Cell: (cellProps) => {
                    return <UserName {...cellProps} />;
                },
            },
            {
                Header: "Is Import",
                accessor: "isImported",
                filterable: true,
                filter: 'select',
                Cell: (cellProps) => {
                    return <ActiveStatus {...cellProps} />;
                }
            },
            {
                Header: "Inactive Status",
                accessor: " ",
                disableFilters: true,
                Cell: (cellProps) => {
                    return (
                        <Button
                            type="button"
                            color="success"
                            className="btn-sm btn-rounded"
                            onClick={() => handleModal(cellProps.row.original, 0)}
                        >
                            Make Active / Update
                        </Button>
                    )
                }
            },
            {
                Header: "Active",
                accessor: "",
                disableFilters: true,
                Cell: (cellProps) => {
                    if (cellProps.row.original.isImported === true) {
                        return (
                            <Button
                                type="button"
                                color="danger"
                                className="btn-sm btn-rounded"
                                onClick={() => handleModal(cellProps.row.original, 1)}
                            >
                                Make Inactive
                            </Button>
                        )
                    }

                }
            },
        ],
        []
    );

    const handleSyncData = () => {
        setConfirmModal(!confirmModal)
    }


    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="COA" breadcrumbItem="COA / Analysis Import By ID" />
            </Container>

            <Container fluid>
                {
                    coaImportByIdLoading ? (

                        <div className="centered-loader">
                            <Loader />
                        </div>
                    ) : coaImportByIdError ? (
                        <div className="centered-loader">
                            <h3>{coaImportByIdError}</h3>
                        </div>
                    ) : (
                        <Card>
                            <CardBody>

                                <div>
                                    <h4 className="card-title mb-4">Analysis (Sub Code Import)</h4>
                                </div>

                                <div className="border border-success p-3 mb-5">
                                    <h4 className="fw-bolder mb-4">Analysis ID: {coaImportByIdSuccess && coaImportByIdSuccess.analId}</h4>
                                    <h4 className="fw-bolder">Analysis Name: {coaImportByIdSuccess && coaImportByIdSuccess.analName}</h4>
                                </div>
                                {coaImportByIdSuccess && coaImportByIdSuccess.subCodeList &&

                                    <TableContainer
                                        columns={columns}
                                        data={coaImportByIdSuccess && coaImportByIdSuccess.subCodeList}
                                        isGlobalFilter={true}
                                        isAddUserList={true}
                                        customPageSize={100}
                                        className="custom-header-css"
                                        hidden
                                        syncbtn
                                        handleSyncData={handleSyncData}
                                    // onClickBtn={handleUserInfo}
                                    />

                                }

                            </CardBody>
                        </Card>
                    )

                }
            </Container>

            <COACfrmModal
                show={showModal}
                handleClose={handleModal}
                status={status}
                coa={coa}
                analId={coaImportByIdSuccess && coaImportByIdSuccess.analId}
            />

            <SyncDataModal
                show={confirmModal}
                handleClose={handleSyncData}
                state={state}
                updateParentData={updateParentData}
                setUpdateParentData={setUpdateParentData}
            />

        </div>
    )
}

export default COAAnalysisImportById