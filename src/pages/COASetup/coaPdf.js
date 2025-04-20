import axios from "axios";
import { REPORT_URL } from "../../utils/https";


export const coaPdf = async (endUrl) => {

    const response = await axios.get((`${REPORT_URL}${endUrl}=pdf`), {
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



export const downloadPdf = (endUrl) => {
    window.location.href = `${REPORT_URL}${endUrl}=pdf`
}
export const downloadWord = (endUrl) => {
    window.location.href = `${REPORT_URL}${endUrl}=doc`
}


export const downloadExcel = (endUrl) => {
    window.location.href = `${REPORT_URL}${endUrl}=xls`
}
