import axios from "axios";
import { REPORT_URL } from "../../utils/https";


export const analTranShowPdfGenerator = async (fstPrdEndDate, sndPrdEndDate, selectedAnalysisType,
    selectedAnalysis, isGroupData) => {

    const fistEndDate = fstPrdEndDate;
    const secondEndDate = sndPrdEndDate;
    const analysisType = selectedAnalysisType;
    const analysis = selectedAnalysis

    // console.log(fistEndDate, secondEndDate, analysisType, analysis)


    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))



    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetAnalysisReport?cCode=${cCode}&auth=${token}&`

    // (string cCode, string auth, string downloadtype, string UserID, string FromDate, string ToDate, string AnalTypeID, string AnalID)


    const response = await axios.get(
        `${baseUrl}downloadtype=pdf&UserID=${userID}&FromDate=${fistEndDate}&ToDate=${secondEndDate}&AnalTypeID=${analysisType}&AnalID=${analysis}&Summary=${isGroupData}`, {
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



export const analTranDownloadReport = (
    fstPrdEndDate, sndPrdEndDate, selectedAnalysisType,
    selectedAnalysis, type, isGroupData
) => {

    const fistEndDate = fstPrdEndDate;
    const secondEndDate = sndPrdEndDate;
    const analysisType = selectedAnalysisType;
    const analysis = selectedAnalysis;
    const fileType = type


    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/VoucherReport/GetAnalysisReport?cCode=${cCode}&auth=${token}&`

    // (string cCode, string auth, string downloadtype, string UserID, string FromDate, string ToDate, string AnalTypeID, string AnalID)
    window.location.href = `${baseUrl}downloadtype=${fileType}&UserID=${userID}
                                &FromDate=${fistEndDate}&ToDate=${secondEndDate}&AnalTypeID=${analysisType}&AnalID=${analysis}&Summary=${isGroupData}`

}