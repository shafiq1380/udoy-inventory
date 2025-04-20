import React from 'react'
import { Post } from '../../../utils/https';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

const TestPdf = () => {


    const convertAndDownloadPdf = (fileContents, fileDownloadName) => {

        // Decode base64 data
        const byteCharacters = atob(fileContents);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        // Convert XLSX to JSON
        const workbook = XLSX.read(byteArray, { type: 'array' });
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

        console.log(jsonData)
        // Create PDF using jsPDF
        const pdf = new new jsPDF({
            orientation: "landscape",
            unit: "in",
            format: [4, 2]
        });
        pdf.text('Converted PDF from XLSX', 20, 20);

        // Convert JSON to a table in PDF
        // pdf.autoTable({
        //     startY: 30,
        //     head: [['Header 1', 'Header 2', 'Header 3']],
        //     body: jsonData.map(row => [row.column1, row.column2, row.column3])
        // });

        // Save or download the PDF
        pdf.save(fileDownloadName.replace('.xlsx', '.pdf'));
    };

    const handleDownload = () => {
        try {
            Post('/api/Payroll/GetAllEmployeePaySetupDetail')
                .then(res => {
                    console.log(res.data)
                    if (res.status === 200) {
                        convertAndDownloadPdf(res.data.fileContents, res.data.fileDownloadName,)
                        res.data.fileContents = res.data.fileContents.replace(/^data:image\/[a-z]+;base64,/, "");
                        const downloadLink = document.createElement("a");
                        downloadLink.download = res.data.fileDownloadName;
                        downloadLink.href = `data:image/png;base64,${res.data.fileContents}`;
                        downloadLink.click();
                        console.log(downloadLink)
                    }
                })
        } catch (error) {
            console.log("Download Error ------->>>", error)
        }
    };

    return (
        <div>

            <button onClick={handleDownload}>
                Click to Downlaod
            </button>
        </div>
    )
}

export default TestPdf