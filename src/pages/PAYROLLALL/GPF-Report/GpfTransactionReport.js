import axios from "axios";
import { REPORT_URL } from "../../../utils/https";


export const gpfShowPdfGenerator = async (
    empTypeAll,
    deptAll,
    empAll,
    fstPrdEndDate,
    sndPrdEndDate,
    empTypeId,
    empId,
    deptId,
    selectedAnalysisType,
) => {


    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))


    const baseUrl = `${REPORT_URL}/api/PayrollReport/GetGPFReport?cCode=${cCode}&auth=${token}&`

    // http://localhost:54992/api/PayrollReport/GetGPFReport?cCode=DEV&auth=abcd&downloadtype=pdf&UserID=1090006&EmpTypeAll=1&DeptAll=1&EmpAll=1&StartDate=01/07/2023&EndDate=16/11/2024&EmployeeTypeID=0&EmployeeID=2801&DepartmentID=0&issummary=0

    const response = await axios.get(
        `${baseUrl}downloadtype=pdf&UserID=${userID}&EmpTypeAll=${empTypeAll}&DeptAll=${deptAll}&EmpAll=${empAll}&StartDate=${fstPrdEndDate}&EndDate=${sndPrdEndDate}&EmployeeTypeID=${empTypeId}&EmployeeID=${empId}&DepartmentID=${deptId}&issummary=${selectedAnalysisType}`, {
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



export const gpfDownloadReport = (
    empTypeAll,
    deptAll,
    empAll,
    fstPrdEndDate,
    sndPrdEndDate,
    empTypeId,
    empId,
    deptId,
    selectedAnalysisType,
    fileType,
) => {

    //local storage
    const token = JSON.parse(localStorage.getItem('authKey'))
    const cCode = JSON.parse(localStorage.getItem('cCode'))
    const userID = JSON.parse(localStorage.getItem('userID'))

    const baseUrl = `${REPORT_URL}/api/PayrollReport/GetGPFReport?cCode=${cCode}&auth=${token}&`

    // (string cCode, string auth, string downloadtype, string UserID, string FromDate, string ToDate, string AnalTypeID, string AnalID)
    window.location.href = `${baseUrl}downloadtype=${fileType}&UserID=${userID}&EmpTypeAll=${empTypeAll}&DeptAll=${deptAll}&EmpAll=${empAll}&StartDate=${fstPrdEndDate}&EndDate=${sndPrdEndDate}&EmployeeTypeID=${empTypeId}&EmployeeID=${empId}&DepartmentID=${deptId}&issummary=${selectedAnalysisType}`

}
