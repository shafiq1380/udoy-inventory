import axios from "axios";
import { REPORT_URL } from "../../utils/https";


export const receiptShowPdfGenerator = async (fstPrdStrDate, fstPrdEndDate, reportType) => {

    const fistStrDate = fstPrdStrDate;
    const fistEndDate = fstPrdEndDate;

    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetReceiptPaymentReport?cCode=${cCode}&auth=${token}&`

    const response = await axios.get(
        `${baseUrl}downloadtype=pdf&UserID=${userID}&FromDate=${fistStrDate}&ToDate=${fistEndDate}&ReportType=${reportType}`, {
        responseType: 'blob',
    })
        .then((response) => {
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            return url;
        })
        .catch((error) => {
            console.error('Error fetching PDF:', error);
        });
    return response;
}



export const receiptDownloadVoucherReport = (
    fstPrdStrDate, fstPrdEndDate, reportType, type
) => {

    const fistStrDate = fstPrdStrDate;
    const fistEndDate = fstPrdEndDate;
    const fileType = type

    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetReceiptPaymentReport?cCode=${cCode}&auth=${token}&`

    window.location.href = `${baseUrl}downloadtype=${fileType}&UserID=${userID}&FromDate=${fistStrDate}&ToDate=${fistEndDate}&ReportType=${reportType}`

}