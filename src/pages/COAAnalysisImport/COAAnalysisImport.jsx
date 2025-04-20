import React, { useEffect } from 'react'
import { Card, CardBody, Container } from 'reactstrap'
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useDispatch, useSelector } from 'react-redux';
import { coaAnalysisImport, coaImportByIdData } from '../../store/coa-analysis-import/actions';
// import { BiImport } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';


function Loader() {
    return (
        <div className="d-flex justify-content-center align-items-center mt-5">
            <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}


const COAAnalysisImport = () => {

    const { coaImportLoading, coaImportError, coaSuccess } = useSelector(state => state.coaAnalysisImportReducer);
    const dispatch = useDispatch();

    const navigate = useNavigate();


    // console.log("coaSuccess", coaSuccess);

    useEffect(() => {
        dispatch(coaAnalysisImport())
    }, [dispatch]);



    const handleImport = (id) => {
        // console.log("handleImport", id);
        const data = { data: id };
        // dispatch(coaImportByIdData(data));
        navigate(`/coa-analysis-import-by-id/${id}`, { state: data });
    };


    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="COA" breadcrumbItem="Coa /  Analysis Import" />
            </Container>

            <Container fluid>
                {
                    coaImportLoading ? (

                        <div className="centered-loader">
                            <Loader />
                        </div>
                    ) : coaImportError ? (
                        <div className="centered-loader">
                            <h3>{coaImportError}</h3>
                        </div>
                    ) : (
                        <Card>
                            <CardBody>
                                <div className="table-responsive-sm">
                                    <table className="table table-striped table-bordered table-sm" width="100%">
                                        <thead>
                                            <tr>
                                                <th className="col-1">ID</th>
                                                <th className="col-4">Sub Code Type Name</th>
                                                <th className="col-2">Total Sub Code</th>
                                                <th className="col-2">Total Imported</th>
                                                <th className="col-2">Total Excluded</th>
                                                <th className="col-1">Import</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {coaSuccess && coaSuccess.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <th scope="row">{item.analId}</th>
                                                        <td>{item.analName}</td>
                                                        <td>{item.totSubcode}</td>
                                                        <td>{item.totImported}</td>
                                                        <td>{item.totExcluded}</td>
                                                        <td>
                                                            {/* <BiImport
                                                                color='green'
                                                                size={25}
                                                                role="button"
                                                                onClick={() => handleImport(item.analId)}
                                                            /> */}
                                                            <FaEdit
                                                                color='green'
                                                                size={20}
                                                                role="button"
                                                                onClick={() => handleImport(item.analId)}
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </CardBody>
                        </Card>
                    )

                }
            </Container>

        </div>
    )
}

export default COAAnalysisImport