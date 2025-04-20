import axios from "axios";
import { REPORT_URL } from "../../utils/https";



export const subLedgerShowPdfGenerator = async (transactionFrom, transactionTo, coaId, toCoaId, analType, analId) => {

    // console.log("analType", analType, typeof analType);

    // console.log(toCoaID)

    const fromDate = transactionFrom;
    const toDate = transactionTo;
    const coaID = analType && analId ? coaId : 0 || !toCoaId ? coaId : 0;
    const fromCoaID = !analType && !analId && toCoaId ? coaId : 0;
    const toCoaID = toCoaId || 0;
    const anlType = analType || 0;
    const anlID = analId || 0;

    // console.log("fromDate", fromDate);
    // console.log("toDate", toDate);
    // console.log("coaID", coaID);
    // console.log("fromCoaID", fromCoaID);
    // console.log("toCoaID", toCoaID);
    // console.log("anlType", anlType);
    // console.log("anlID", anlID);

    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetSubLedgerReport?cCode=${cCode}&auth=${token}&`

    // const url = `${baseUrl}downloadtype=pdf&UserID=${userID}&FromDate=${fromDate}&ToDate=${toDate}&CoaID=${coaID}&AnalTypeID=${anlType}&AnalID=${anlID}&FromCoaID=${fromCoaID}&ToCoaID=${toCoaID}`
    // console.log(url)

    const response = await axios.get(
        `${baseUrl}downloadtype=pdf&UserID=${userID}&FromDate=${fromDate}&ToDate=${toDate}&CoaID=${coaID}&AnalTypeID=${anlType}&AnalID=${anlID}&FromCoaID=${fromCoaID}&ToCoaID=${toCoaID}`, {
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



export const subLedgerDownloadVoucherReport = (
    transactionFrom,
    transactionTo,
    coaId,
    analType,
    analId,
    type,
    toCoaId
) => {

    // const fromDate = transactionFrom
    // const toDate = transactionTo
    // const coaID = coaId
    // const anlType = analType || ''
    // const anlID = analId || ''

    const fromDate = transactionFrom;
    const toDate = transactionTo;
    const coaID = analType && analId ? coaId : 0 || !toCoaId ? coaId : 0;
    const fromCoaID = !analType && !analId && toCoaId ? coaId : 0;
    const toCoaID = toCoaId || 0;
    const anlType = analType || 0;
    const anlID = analId || 0;
    const fileType = type

    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetSubLedgerReport?cCode=${cCode}&auth=${token}&`

    // window.location.href = `${baseUrl}downloadtype=${fileType}&UserID=${userID}&FromDate=${fromDate}&ToDate=${toDate}&CoaID=${coaID}&AnalTypeID=${anlType}&AnalID=${anlID}`
    window.location.href = `${baseUrl}downloadtype=${fileType}&UserID=${userID}&FromDate=${fromDate}&ToDate=${toDate}&CoaID=${coaID}&AnalTypeID=${anlType}&AnalID=${anlID}&FromCoaID=${fromCoaID}&ToCoaID=${toCoaID}`

}