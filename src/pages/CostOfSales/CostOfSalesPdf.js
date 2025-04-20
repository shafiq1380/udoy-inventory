import axios from "axios";
import { REPORT_URL } from "../../utils/https";


export const cstSlsShowPdfGenerator = async (fstPrdStrDate, fstPrdEndDate, sndPrdStrDate, sndPrdEndDate, trdPrdStrDate, trdPrdEndDate) => {

    const fistStrDate = fstPrdStrDate;
    const fistEndDate = fstPrdEndDate;
    const secondStrDate = sndPrdStrDate;
    const secondEndDate = sndPrdEndDate;
    const thirdStrDate = trdPrdStrDate;
    const thirdEndDate = trdPrdEndDate;


    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetCostOfSalesReport?cCode=${cCode}&auth=${token}&`

    const response = await axios.get(
        `${baseUrl}downloadtype=pdf&UserID=${userID}&FromDate1=${fistStrDate}&ToDate1=${fistEndDate}&FromDate2=${secondStrDate}&ToDate2=${secondEndDate}&FromDate3=${thirdStrDate}&ToDate3=${thirdEndDate}`, {
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



export const cstSlsDownloadVoucherReport = (
    fstPrdStrDate, fstPrdEndDate, sndPrdStrDate, sndPrdEndDate, trdPrdStrDate, trdPrdEndDate, type
) => {

    const fistStrDate = fstPrdStrDate;
    const fistEndDate = fstPrdEndDate;
    const secondStrDate = sndPrdStrDate;
    const secondEndDate = sndPrdEndDate;
    const thirdStrDate = trdPrdStrDate;
    const thirdEndDate = trdPrdEndDate;
    const fileType = type

    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetCostOfSalesReport?cCode=${cCode}&auth=${token}&`

    window.location.href = `${baseUrl}downloadtype=${fileType}&UserID=${userID}&FromDate1=${fistStrDate}&ToDate1=${fistEndDate}&FromDate2=${secondStrDate}&ToDate2=${secondEndDate}&FromDate3=${thirdStrDate}&ToDate3=${thirdEndDate}`

}