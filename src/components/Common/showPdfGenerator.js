import axios from "axios";

import { REPORT_URL } from "../../utils/https";


export const showPdfGenerator = async (journalType, rfFrom, transactionFrom, transactionTo, selectedOption) => {

    const journal = journalType || ''
    const refFrom = rfFrom || ''
    // const refTo = rfTo || ''
    const fromDate = transactionFrom || ''
    const toDate = transactionTo || ''
    const option = selectedOption || 1

    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetVoucherReport?cCode=${cCode}&auth=${token}&`




    const response = await axios.get(
        `${baseUrl}downloadtype=pdf&UserID=${userID}&Posted=${option}&VoucherType=${journal}&FromDate=${fromDate}&ToDate=${toDate}&RefNo=${refFrom}`, {
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



export const downloadVoucherReport = (journalType, rfFrom, transactionFrom, transactionTo, selectedOption, downloadType) => {

    const journal = journalType || ''
    const refFrom = rfFrom || ''
    // const refTo = rfTo || ''
    const fromDate = transactionFrom || ''
    const toDate = transactionTo || ''
    const option = selectedOption || 1
    const type = downloadType || 'pdf'

    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetVoucherReport?cCode=${cCode}&auth=${token}&`


    window.location.href = `${baseUrl}downloadtype=${type}&UserID=${userID}&Posted=${option}&VoucherType=${journal}&FromDate=${fromDate}&ToDate=${toDate}&RefNo=${refFrom}`

}