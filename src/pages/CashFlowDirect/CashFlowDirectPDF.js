import axios from "axios";
import { REPORT_URL } from "../../utils/https";


export const blcSlsShowPdfGenerator = async (fstPrdStrDate, fstPrdEndDate, sndPrdStrDate, sndPrdEndDate) => {

    const fistStrDate = fstPrdStrDate;
    const fistEndDate = fstPrdEndDate;
    const secondStrDate = sndPrdStrDate;
    const secondEndDate = sndPrdEndDate;

    // console.log("fistStrDate", fistStrDate)
    // console.log("fistEndDate", fistEndDate)
    // console.log("secondStrDate", secondStrDate)
    // console.log("secondEndDate", secondEndDate)

    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetCashFlowDirectReport?cCode=${cCode}&auth=${token}&`

    const response = await axios.get(
        `${baseUrl}downloadtype=pdf&UserID=${userID}&FromDate1=${fistStrDate}&ToDate1=${fistEndDate}&FromDate2=${secondStrDate}&ToDate2=${secondEndDate}`, {
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
    fstPrdStrDate, fstPrdEndDate, sndPrdStrDate, sndPrdEndDate, type
) => {
    const fistStrDate = fstPrdStrDate;
    const fistEndDate = fstPrdEndDate;
    const secondStrDate = sndPrdStrDate;
    const secondEndDate = sndPrdEndDate;
    const fileType = type

    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetCashFlowDirectReport?cCode=${cCode}&auth=${token}&`
    window.location.href = `${baseUrl}downloadtype=${fileType}&UserID=${userID}&FromDate1=${fistStrDate}&ToDate1=${fistEndDate}&FromDate2=${secondStrDate}&ToDate2=${secondEndDate}`
}