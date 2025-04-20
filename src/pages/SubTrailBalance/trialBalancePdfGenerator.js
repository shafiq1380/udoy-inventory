import axios from "axios";

import { REPORT_URL } from "../../utils/https";



export const subTrialShowPdfGenerator = async (
    transactionFrom,
    transactionTo,
    accountType,
) => {

    const fromDate = transactionFrom
    const toDate = transactionTo
    const acctype = accountType

    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetSubTrialBalanceReport?cCode=${cCode}&auth=${token}&`


    const response = await axios.get(
        `${baseUrl}downloadtype=pdf&UserID=${userID}&AccountGroup=${acctype}&FromDate=${fromDate}&ToDate=${toDate}`, {
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



export const subTrialDownloadVoucherReport = (
    transactionFrom,
    transactionTo,
    accountType,
    type
) => {
    const fromDate = transactionFrom.split('-').join('/') || ''
    const toDate = transactionTo.split('-').join('/') || ''
    const acctype = accountType

    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetTrialBalanceReport?cCode=${cCode}&auth=${token}&`

    window.location.href = `${baseUrl}downloadtype=${type}&UserID=${userID}&AccountGroup=${acctype}&FromDate=${fromDate}&ToDate=${toDate}`

}