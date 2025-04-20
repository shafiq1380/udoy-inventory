import axios from "axios";

import { REPORT_URL } from "../../utils/https";

export const ledgerShowPdfGenerator = async (transactionFrom, transactionTo, accontCodeFrom, accontCodeTo, reportformat) => {

    const fromDate = transactionFrom
    const toDate = transactionTo
    const coaFrom = accontCodeFrom
    const coaTo = accontCodeTo
    const reportFormatValue = reportformat

    //local storage data
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetLedgerReport?cCode=${cCode}&auth=${token}&`

    // console.log(`${baseUrl}downloadtype=pdf&UserID=${userID}&FromDate=${fromDate}&ToDate=${toDate}&FromCoaCode=${coaFrom}&ToCoaCode=${coaTo}&Reportformat=${reportFormatValue}`)

    const response = await axios.get(
        `${baseUrl}downloadtype=pdf&UserID=${userID}&FromDate=${fromDate}&ToDate=${toDate}&FromCoaCode=${coaFrom}&ToCoaCode=${coaTo}&Reportformat=${reportFormatValue}`, {
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
    accontCodeFrom,
    accontCodeTo,
    type,
    reportformat
) => {
    // console.log(type)

    const fromDate = transactionFrom
    const toDate = transactionTo
    const coaFrom = accontCodeFrom
    const coaTo = accontCodeTo
    const reportFormatValue = reportformat

    //local storage data
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetLedgerReport?cCode=${cCode}&auth=${token}&`

    window.location.href = `${baseUrl}downloadtype=${type}&UserID=${userID}&FromDate=${fromDate}&ToDate=${toDate}&FromCoaCode=${coaFrom}&ToCoaCode=${coaTo}&Reportformat=${reportFormatValue}`

}