
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import logo from '../../assets/images/logo.png';


const convertAndDownloadPdf = (fileContents, fileDownloadName, reportTitle, pageSize) => {

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

    // Create PDF using jsPDF and jspdf-autotable
    const pdf = new jsPDF({
        orientation: "landscape",
        unit: 'mm',
        format: pageSize || 'a2',
    });

    // Replace with the path to your logo image
    const logoUrl = logo;
    const logoWidth = 40;
    const logoHeight = 40;
    const marginLeft = (pdf.internal.pageSize.width - logoWidth) / 2;
    pdf.addImage(logoUrl, 'PNG', marginLeft, 10, logoWidth, logoHeight);

    // Set title text
    const titleText = reportTitle || "BSEC";
    const titleFontSize = 16;
    const titleWidth = pdf.getStringUnitWidth(titleText) * titleFontSize / pdf.internal.scaleFactor;
    const titleX = (pdf.internal.pageSize.width - titleWidth) / 2;
    pdf.setFontSize(titleFontSize);
    pdf.text(titleText, titleX, 60);

    // separate key from data
    const allKeys = Array.from(new Set(jsonData.flatMap(obj => Object.keys(obj))));

    // Convert JSON to a table in PDF
    pdf.autoTable({
        startY: 70,
        head: [allKeys],
        body: jsonData.map(row => allKeys.map(key => row[key])),
    });

    //page fotter
    const currentDate = new Date().toLocaleDateString();
    const pageNumber = pdf.internal.getNumberOfPages();
    pdf.setPage(pageNumber); // Set the current page
    pdf.text(`Date: ${currentDate}`, 20, pdf.internal.pageSize.height - 20);
    pdf.text(`Page ${pageNumber}`, pdf.internal.pageSize.width - 30, pdf.internal.pageSize.height - 20);

    // Save or download the PDF
    pdf.save(fileDownloadName.replace('.xlsx', '.pdf'));
};

export default convertAndDownloadPdf;
