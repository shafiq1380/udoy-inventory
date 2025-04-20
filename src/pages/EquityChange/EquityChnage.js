import axios from "axios";


import { REPORT_URL } from "../../utils/https";

export const equityShowPdfGenerator = async (transactionFrom, transactionTo, equityType) => {

    const fromDate = transactionFrom
    const toDate = transactionTo
    const eqtyType = equityType

    const eqtyTypeRepotUrl = eqtyType === 1 ? 'GetNewEquityChangeReport' : 'GetEquityChangeReport'

    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/VoucherReport/${eqtyTypeRepotUrl}?cCode=${cCode}&auth=${token}&`

    const response = await axios.get(
        `${baseUrl}downloadtype=pdf&UserID=${userID}&AccountGroup=1&FromDate=${fromDate}&ToDate=${toDate}`, {
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



export const equityDownloadVoucherReport = (
    transactionFrom, transactionTo, type, equityType
) => {

    const fromDate = transactionFrom
    const toDate = transactionTo
    const fileType = type
    const eqtyType = equityType

    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const eqtyTypeRepotUrl = eqtyType === 1 ? 'GetNewEquityChangeReport' : 'GetEquityChangeReport'

    const baseUrl = `${REPORT_URL}/api/VoucherReport/${eqtyTypeRepotUrl}?cCode=${cCode}&auth=${token}&`


    window.location.href = `${baseUrl}downloadtype=${fileType}&UserID=${userID}&AccountGroup=1&FromDate=${fromDate}&ToDate=${toDate}`

}