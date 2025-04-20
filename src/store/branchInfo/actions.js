import {
    ADDED_BRANCHINFORMATION_FAIL,
    ADDED_BRANCHINFORMATION_SUCCESS,
    ADD_BRANCH_INFORMATION,
    GET_ALL_BRANCH_INFORMATIION_SUCCESS,
    GET_BRANCH_INFORMATION,
    UPDATE_BRANCHINFORMATION
} from "./actionType"

export const addBranchInfromation = (value) => ({
    type: ADD_BRANCH_INFORMATION,
    payload: value,
})

export const getBranchInfromation = (value) => ({
    type: GET_BRANCH_INFORMATION,
    payload: value,
})

export const addBranchInformationSuccess = success => ({
    type: ADDED_BRANCHINFORMATION_SUCCESS,
    payload: success,
})

export const getAllBranchInformationSuccess = (data) => ({
    type: GET_ALL_BRANCH_INFORMATIION_SUCCESS,
    payload: data
})

export const addBranchInformationFail = error => ({
    type: ADDED_BRANCHINFORMATION_FAIL,
    payload: error,
})


export const updateBranchInformation = (value) => ({
    type: UPDATE_BRANCHINFORMATION,
    payload: value
})