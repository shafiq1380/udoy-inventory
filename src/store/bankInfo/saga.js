import { put, takeEvery } from "redux-saga/effects"
import { Post } from "../../utils/https"
import {
    addBankInformationFail,
    addBankInformationSuccess,
    getAllBankInformationSuccess
} from "./actions"
import { ADD_BANK_INFORMATION, DELETE_BANK_INFORMATION, GET_ALL_BANK_INFORMATION, UPDATE_BANKINFORMATION } from "./actionType"



function* addBankInfromation(data) {
    console.log('Bank Saga File', data.payload)
    try {
        const bankInformation = yield Post('/api/v1/dBankInfo/AddBankInformation', data.payload)
        if (bankInformation?.data.success === false) {
            yield put(addBankInformationFail(bankInformation.data.errorMessage))
        } else {
            yield put(addBankInformationSuccess(' Bank information Create Successfully'))
        }
    } catch (error) {
        // console.log('Error')
    }
}


function* getBankInformation(data) {

    try {
        const bankInformation = yield Post('/api/v1/BankInfo/GetAllBankInformation', data.payload)
        if (bankInformation?.data.success === false) {
            yield put(addBankInformationFail(bankInformation.data.errorMessage))
        } else {
            yield put(getAllBankInformationSuccess(bankInformation.data.data))
        }
    } catch (error) {
        // console.log('Error')
    }
}


function* updateBankInformation(data) {
    try {
        const bankInformation = yield Post('/api/v1/BankInfo/UpdateBankInformationByID', data.payload)
        console.log(bankInformation)
        // if (bankInformation?.data.success === false) {
        //     yield put(bankInformation(branchInformation.data.errorMessage))
        // } else {
        //     yield put(deleteBankInformationSuccess())
        // }
    } catch (error) {
        // console.log('Error')
    }
}


function* deleteBankInformation(data) {
    try {
        const bankInformation = yield Post('/api/v1/BankInfo/DeleteBankInformationByID', data.payload)
        console.log(bankInformation.data.data)
        // if (bankInformation) {
        //     yield put(deleteBankInformationSuccess())
        // }
    } catch (error) {
        // console.log('Error')
    }
}




function* banKInfoSaga() {
    yield takeEvery(ADD_BANK_INFORMATION, addBankInfromation)
    yield takeEvery(GET_ALL_BANK_INFORMATION, getBankInformation)
    yield takeEvery(UPDATE_BANKINFORMATION, updateBankInformation)
    yield takeEvery(DELETE_BANK_INFORMATION, deleteBankInformation)
}


export default banKInfoSaga;