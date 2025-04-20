import { REPORT_URL } from "../../../utils/https";

export const getAllAllowanceReport = (auth, cCode, allowId) => {

    const url = `${REPORT_URL}/api/PayrollReport/GetAllowanceReport?cCode=${cCode}&auth=${auth}&downloadtype=pdf&AllowID=${allowId}`

    window.open(url)
};

export const getAllAllowanceReportTypeDownload = (auth, cCode, type, allowId) => {

    const url = `${REPORT_URL}/api/PayrollReport/GetAllowanceReport?cCode=${cCode}&auth=${auth}&downloadtype=${type}&AllowID=${allowId}`

    window.open(url)
};