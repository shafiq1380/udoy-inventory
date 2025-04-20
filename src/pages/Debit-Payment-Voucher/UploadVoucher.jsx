import React, { useEffect, useState } from 'react'
import { Container, Card, CardBody } from "reactstrap";
import * as XLSX from 'xlsx';
import { Post } from '../../utils/https';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import CustomButton from '../JournalVoucher/CustomButton';
import excefile from '../../assets/Excel/excel.txt'


const toastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    theme: "dark",
};

const UploadVoucher = () => {

    const navigate = useNavigate();

    const [excelData, setExcelData] = useState([]);
    const [uploadSuccess, setUploadSuccess] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [postedData, setPostedData] = useState();


    const handleFileLoad = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const binaryString = event.target.result;
            const workbook = XLSX.read(binaryString, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            // console.log("Data ---------->>>> ", data);
            const loadData = { data: data }
            try {
                Post('/api/VoucherEntry/UploadVoucher', loadData)
                    .then((res) => {
                        // console.log("Res ----------->>>> ", res);
                        setUploadSuccess(res.data.success);
                        setUploadError(res.data.errorMessage);
                        setPostedData(res.data.data);
                    })
            } catch (error) {
                console.log(error)
            }
            setExcelData(data);
        };
        reader.readAsBinaryString(file);
    };


    // console.log("excelData ----------->>>>", excelData);

    useEffect(() => {
        if (uploadSuccess === true) {
            toast.success("File uploaded successfully", toastOptions);
        }
        // if (uploadError) {
        //     toast.error(uploadError, toastOptions);
        // }
    }, [uploadSuccess, uploadError]);

    const handleFileUpload = () => {
        // console.log("postedData ----------->>>>", postedData);
        navigate('/voucher-upload', { state: postedData });
    };




    const downloadExcel = () => {
        // Read the Base64 content from the .txt file
        fetch(excefile, { method: 'GET' })
            .then(response => response.text())
            .then(base64Data => {

                // Convert the Base64 data to a binary string
                const binaryString = atob(base64Data);

                // Convert the binary string to a Uint8Array
                const byteArray = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    byteArray[i] = binaryString.charCodeAt(i);
                }

                // Create a Blob object from the Uint8Array
                const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                // Create a temporary anchor element
                const anchor = document.createElement('a');
                anchor.href = window.URL.createObjectURL(blob);

                // Set the download attribute and click the anchor to trigger download
                anchor.download = 'Ledger.xlsx';
                anchor.click();

                // // // Clean up by revoking the Object URL
                // // window.URL.revokeObjectURL(anchor.href);
            })
            .catch(error => console.error('Error downloading Excel file:', error));
    };


    return (
        <div>
            <Container fluid>
                <div className='mt-5'>
                    <Card>
                        <CardBody className='d-flex justify-content-between flex-wrap '>
                            <input
                                type="file"
                                accept=".xlsx"
                                onChange={handleFileLoad}
                                required
                            />
                            <div className='mt-3 mt-md-0'>
                                <CustomButton
                                    onClick={downloadExcel}
                                    text={'Download Sample Excel File'}
                                />
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </Container>


            <Container fluid>
                <div className='mt-5'>
                    <Card>
                        <CardBody>
                            {
                                uploadSuccess ?
                                    <div className="text-end mb-4">
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={() => handleFileUpload()}
                                        >
                                            Upload voucher
                                        </button>
                                    </div>
                                    :
                                    uploadError ?
                                        <div className="text-end mb-4 d-flex justify-content-end align-items-center">
                                            <p className='text-danger fs-3 pe-md-5 mt-md-3 text-center'>{uploadError}</p>
                                            <button
                                                className="btn btn-danger"
                                                type="button"
                                                onClick={() => window.location.reload()}
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                        : null
                            }



                            <table className="table table-striped table-bordered table-sm" >
                                <thead>
                                    <tr>
                                        {excelData[0] &&
                                            excelData[0].map((cell, index) => <th key={index}>{cell}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {excelData.slice(1).map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {(() => {
                                                const cells = [];
                                                for (let cellIndex = 0; cellIndex < row.length; cellIndex++) {
                                                    const cell = row[cellIndex];
                                                    cells.push(
                                                        <td key={cellIndex}>{cell !== undefined ? cell : ''}</td>
                                                    );
                                                }
                                                return cells;
                                            })()}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </CardBody>
                    </Card>
                </div>
            </Container>

            <ToastContainer />
        </div>
    )
}

export default UploadVoucher