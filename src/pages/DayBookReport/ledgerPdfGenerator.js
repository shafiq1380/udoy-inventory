import axios from "axios";

import { REPORT_URL } from "../../utils/https";


export const ledgerShowPdfGenerator = async (transactionFrom, transactionTo, reportId) => {

    const fromDate = transactionFrom
    const toDate = transactionTo
    const reportIds = reportId

    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetDayBookReport?cCode=${cCode}&auth=${token}&`


    const response = await axios.get(
        `${baseUrl}downloadtype=pdf&UserID=${userID}&ReportType=${reportIds}&FromDate=${fromDate}&ToDate=${toDate}`, {
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



export const ledgerDownloadVoucherReport = (
    transactionFrom,
    transactionTo,
    reportId,
    type
) => {

    const fromDate = transactionFrom
    const toDate = transactionTo
    const reportIds = reportId

    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetDayBookReport?cCode=${cCode}&auth=${token}&`

    window.location.href = `${baseUrl}downloadtype=${type}&UserID=${userID}&ReportType=${reportIds}&FromDate=${fromDate}&ToDate=${toDate}`

}