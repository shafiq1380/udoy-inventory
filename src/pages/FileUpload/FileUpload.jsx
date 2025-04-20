import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { CardHeader, Card, CardBody, Row, Col, Form, FormGroup, Label, Button, Modal, ModalBody, ModalFooter, ModalHeader, } from "reactstrap";
import { fileUploadRequest } from '../../store/file-upload/actions';
import Spinner from '../../components/Common/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { FilePost, Post } from '../../utils/https';
import { authorization } from '../../components/Common/Authorization';


const toastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
};

const FileUpload = () => {
    // document.title = "File Upload | SMART Accounting System";

    const { fileUploadLoading, fileUploadError, fileUploadSuccess, } = useSelector(state => state.fileUploadReducer);


    const userId = JSON.parse(localStorage.getItem('userID'))

    const [attachmentTitle, setAttachmentTitle] = useState('');
    const [uploadFile, setUploadFile] = useState(null);


    const dispatch = useDispatch();

    const [id, setId] = useState('');
    const [catId, setCatId] = useState();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const catId = params.get('catId');
        setCatId(catId);
        const paramsId = params.get('id');
        setId(paramsId);

        const data = {
            data: {
                categoryID: +catId,
                refNo: id
            }
        }
        dispatch(fileUploadRequest(data))
    }, [id]);


    // file Upload
    const getImage = (e) => {
        const selectFile = e.target.files[0]
        setUploadFile(selectFile)
    }

    const attachmentUpload = () => {
        if (attachmentTitle === '' || attachmentTitle === null) {
            toast.error("Please Enter Attachment Title", toastOptions);
            return;
        }
        if (uploadFile === null) {
            toast.error("Please Select Attachment", toastOptions);
            return;
        }
        const file = new FormData()
        file.append('Data.CategoryID', +catId)
        file.append('Data.RefNo', id)
        file.append('Data.FileTitle', attachmentTitle)
        file.append('Data.fileDoc', uploadFile)
        file.append('Data.UserCode', userId)

        try {
            FilePost('/api/DocumentAttachment/DocumentUpload', file)
                .then(res => {
                    console.log("res --------->>>", res)
                    if (res.status === 200) {
                        toast.success("File Uploaded Successfully", toastOptions);
                        window.location.reload();
                    }
                })
        } catch (error) {
            console.log("Upload Error -------->>>>", error)
        }
    };


    const handleDownload = (id) => {

        const data = { data: id }

        try {
            Post('/api/DocumentAttachment/ViewUpload', data)
                .then(res => {
                    console.log("res --------->>>", res)
                    if (res.status === 200) {
                        res.data.fileContents = res.data.fileContents.replace(/^data:image\/[a-z]+;base64,/, "");
                        const downloadLink = document.createElement("a");
                        downloadLink.download = res.data.fileDownloadName;
                        downloadLink.href = `data:image/png;base64,${res.data.fileContents}`;
                        downloadLink.click();
                    }
                })
        } catch (error) {
            console.log("Download Error ------->>>", error)
        }
    };

    const handleDelete = (id) => {

        if (window.confirm("Are you sure you want to delete?")) {
            const data = { data: id }

            try {
                Post('/api/DocumentAttachment/DeleteUpload', data)
                    .then(res => {
                        console.log("res --------->>>", res)
                        if (res.status === 200) {
                            toast.success("File Deleted Successfully", toastOptions);
                            window.location.reload();
                        }
                    })
            } catch (error) {
                console.log("Delete Error ------->>>", error)

            }

        } else {
            return false
        }
    };


    //Authorization check
    useEffect(() => {
        authorization(18)
    }, [])

    return (
        <div>
            <Card>
                <CardBody>
                    <CardHeader>
                        <h5 className="text-center fw-bolder">Document Upload / Download Screen</h5>
                    </CardHeader>
                    <div>
                        {
                            fileUploadLoading === true ? <h1 className="text-center">Loading...</h1> :
                                fileUploadError === true ? <h1 className="text-center">Error</h1> :
                                    fileUploadSuccess === null ? <h1 className="text-center">No Data</h1> :
                                        fileUploadSuccess ?
                                            <div>
                                                <div>
                                                    <h5 className='text-center my-3'>
                                                        {
                                                            fileUploadSuccess && fileUploadSuccess.title !== null && fileUploadSuccess.title
                                                        }
                                                    </h5>
                                                </div>

                                                <div className='border border-success rounded p-2'>
                                                    <Row>
                                                        <Col sm={12} md={6} lg={6}>
                                                            <Label for="title" size="md">Title *</Label>
                                                            <input
                                                                type="text"
                                                                id="title"
                                                                name="title"
                                                                placeholder='Enter Attachment Title'
                                                                className='form-control'
                                                                onChange={(e) => setAttachmentTitle(e.target.value)}
                                                                value={attachmentTitle}
                                                            />
                                                        </Col>
                                                        <Col sm={12} md={6} lg={6}>
                                                            <Label for="attachment" size="md">Attachment</Label>
                                                            <input
                                                                type="file"
                                                                id="attachment"
                                                                name="attachment"
                                                                className='form-control'
                                                                onChange={getImage}
                                                            />
                                                        </Col>
                                                        <div className='text-end my-2'>
                                                            <Button
                                                                type="button"
                                                                color="success"
                                                                className="px-5"
                                                                onClick={attachmentUpload}
                                                            >
                                                                Upload
                                                            </Button>
                                                        </div>
                                                    </Row>
                                                </div>
                                            </div>
                                            :
                                            null
                        }
                    </div>

                    <div>
                        {
                            fileUploadLoading === true ? <Spinner /> :
                                fileUploadSuccess && fileUploadSuccess.documentList !== null && fileUploadSuccess.documentList.length > 0 ?
                                    <div className='my-3'>
                                        <div className="table-responsive-sm">
                                            <table className="table table-striped table-bordered table-sm" width="100%">
                                                <thead>
                                                    <tr>
                                                        <th className='col-1'>S/N</th>
                                                        <th className='col-3'>Title</th>
                                                        <th className='col-3'>Attachment</th>
                                                        <th className='col-1'>View/Download</th>
                                                        <th className='col-1'>Delete</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        fileUploadSuccess && fileUploadSuccess.documentList.map((document, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {index + 1}
                                                                    </td>
                                                                    <td>
                                                                        {document.documentTitle}
                                                                    </td>
                                                                    <td>
                                                                        {document.fileName}
                                                                    </td>
                                                                    <td>
                                                                        <button
                                                                            className="btn btn-primary btn-sm"
                                                                            onClick={() => { handleDownload(document.id) }}
                                                                        >
                                                                            Download
                                                                        </button>
                                                                    </td>
                                                                    <td>
                                                                        <button
                                                                            className="btn btn-danger btn-sm"
                                                                            onClick={() => { handleDelete(document.id) }}
                                                                        >Delete</button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    :
                                    <div className='my-3'>
                                        <h1 className="text-center text-danger">No Data Found</h1>
                                    </div>
                        }
                    </div>
                </CardBody>
            </Card>
            <ToastContainer />
        </div>
    )
}

export default FileUpload