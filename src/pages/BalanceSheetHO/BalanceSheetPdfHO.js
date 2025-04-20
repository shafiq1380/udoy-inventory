import axios from "axios";
import { REPORT_URL } from "../../utils/https";


export const blcSlsShowPdfGenerator = async (fstPrdEndDate, sndPrdEndDate) => {

    const fistEndDate = fstPrdEndDate;
    const secondEndDate = sndPrdEndDate;


    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))



    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetBalanceSheetHoReport?cCode=${cCode}&auth=${token}&`

    const response = await axios.get(
        `${baseUrl}downloadtype=pdf&UserID=${userID}&ToDate1=${fistEndDate}&ToDate2=${secondEndDate}`, {
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



export const blcSlsDownloadVoucherReport = (
    fstPrdEndDate, sndPrdEndDate, type
) => {

    const fistEndDate = fstPrdEndDate;
    const secondEndDate = sndPrdEndDate;
    const fileType = type

    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetBalanceSheetHoReport?cCode=${cCode}&auth=${token}&`

    window.location.href = `${baseUrl}downloadtype=${fileType}&UserID=${userID}&ToDate1=${fistEndDate}&ToDate2=${secondEndDate}`

}