import { REPORT_URL } from "../../../utils/https";

export const getAllAllowanceReportTypeDownload = (auth, cCode, type, salID) => {

    const url = `${REPORT_URL}/api/PayrollReport/GetBankStatement?cCode=${cCode}&auth=${auth}&downloadtype=${type}&SalID=${salID}`

    window.open(url)
};