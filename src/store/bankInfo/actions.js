import {
    ADDED_BANKINFORMATION_FAIL,
    ADDED_BANKINFORMATION_SUCCESS,
    ADD_BANK_INFORMATION,
    DELETE_BANK_INFORMATION,
    GET_ALL_BANK_INFORMATION,
    GET_ALL_BANK_INFORMATION_SUCCESS,
    UPDATE_BANKINFORMATION
} from "./actionType"


export const addBankInfromation = (value) => ({
    type: ADD_BANK_INFORMATION,
    payload: value,
})

export const addBankInformationSuccess = (success) => ({
    type: ADDED_BANKINFORMATION_SUCCESS,
    payload: success
})

export const addBankInformationFail = error => ({
    type: ADDED_BANKINFORMATION_FAIL,
    payload: error,
})


export const getBankInfromation = (value) => ({
    type: GET_ALL_BANK_INFORMATION,
    payload: value,
})


export const getAllBankInformationSuccess = (data) => ({
    type: GET_ALL_BANK_INFORMATION_SUCCESS,
    payload: data,
})


export const updateBankInformation = (value) => ({
    type: UPDATE_BANKINFORMATION,
    payload: value
})


export const deleteBankInformation = (value) => ({
    type: DELETE_BANK_INFORMATION,
    payload: value
})
