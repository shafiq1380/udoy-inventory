import axios from 'axios';

import { REPORT_URL } from "../../utils/https";



export const mainPdfGenerator = async (endUrl) => {
    const popupWidth = 900;
    const popupHeight = 700;
    const left = (window.innerWidth - popupWidth) / 2;
    const top = (window.innerHeight - popupHeight) / 2;

    // console.log("anup", endUrl)

    const response = await axios.get(`${REPORT_URL}${endUrl}=pdf`, {
        responseType: 'blob',
    })
        .then((response) => {
            // console.log(response)
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            // console.log(url)
            window.open(url, '_blank', `width=${popupWidth},height=${popupHeight},left=${left},top=${top},status=yes,resizable=yes,scrollbars=yes`)
        })
        .catch((error) => {
            console.error('Error fetching PDF:', error);
        });
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