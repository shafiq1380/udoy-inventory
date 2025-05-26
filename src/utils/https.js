
import axios from "axios";
export const fileUploadURL = "https://sacsbsec.gov.bd/FileUpload?"

export const BASE_URL = "https://api.udoyadn.com";
export const REPORT_URL = 'https://report.udoyadn.com'

export const REPORT_URL1 = "http://localhost:54992";

const getUserToken = localStorage.getItem('authUser')
const token = JSON.parse(getUserToken)

export const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'cCode': 'ADN',
}

export default axios.create({
    baseURL: BASE_URL,
    headers: headers
});


export const fileUploadHeaders = {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${token}`,
    'cCode': 'ADN',
}

export async function Post(apiEndPoint, data) {
    const getUserToken = localStorage.getItem('authUser')

    const token = JSON.parse(getUserToken)

    const headers2 = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'cCode': 'ADN',
    }

    return await axios.post(`${BASE_URL}${apiEndPoint}`, data, {
        headers: headers2
    });
}


export async function LoginPost(apiEndPoint, data) {

    const getUserToken = localStorage.getItem('authUser')
    const token = JSON.parse(getUserToken)

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'cCode': 'ADN',
    }

    return await axios.post(`${BASE_URL}${apiEndPoint}`, data, {
        headers: headers
    });
}


export async function FilePost(apiEndPoint, data) {
    return await axios.post(`${BASE_URL}${apiEndPoint}`, data, {
        headers: fileUploadHeaders
    });

}

export async function Get(apiEndPoint) {
    return await axios.get(`${BASE_URL}${apiEndPoint}`, {
        headers: headers
    });
}

export async function Put(apiEndPoint, data) {
    return await axios.put(`${BASE_URL}${apiEndPoint}`, data, {
        headers: headers
    });
}

export async function Delete(apiEndPoint) {
    return await axios.delete(`${BASE_URL}${apiEndPoint}`, {
        headers: headers
    });
}


