import { put, takeEvery } from "redux-saga/effects"
import { Post } from "../../utils/https"
import { addBranchInformationFail, addBranchInformationSuccess, getAllBranchInformationSuccess } from "./actions"
import { ADD_BRANCH_INFORMATION, GET_BRANCH_INFORMATION, UPDATE_BRANCHINFORMATION } from "./actionType"


function* addBranchInformation(data) {
    try {
        const branchInformation = yield Post('/api/v1/BankInfo/AddBankBranchInformation', data.payload)
        if (branchInformation?.data.success === false) {
            yield put(addBranchInformationFail(branchInformation.data.errorMessage))
        } else {
            yield put(addBranchInformationSuccess(' Branch information Create Successfully'))
        }
    } catch (error) {
        // console.log('Error')
    }
}



function* getBranchInformation(data) {
    try {
        const branchInformation = yield Post('/api/v1/BankInfo/GetAllBankBranchInformation', data.payload)
        if (branchInformation?.data.success === false) {
            yield put(addBranchInformationFail(branchInformation.data.errorMessage))
        } else {
            yield put(getAllBranchInformationSuccess(branchInformation.data.data))
        }
    } catch (error) {
        // console.log('Error')
    }
}



function* updateBranchInformation(data) {
    try {
        const branchInformation = yield Post('/api/v1/BankInfo/UpdateBankBranchInformationByID', data.payload)
        // console.log(branchInformation)
        // if (branchInformation?.data.success === false) {
        //     yield put(addBranchInformationFail(branchInformation.data.errorMessage))
        // } else {
        //     yield put(addBranchInformationSuccess('Update Branch Information  Successfully', branchInformation.data.data))
        // }
    } catch (error) {
        // console.log('Error')
    }
}





function* branchInfoSaga() {
    yield takeEvery(ADD_BRANCH_INFORMATION, addBranchInformation)
    yield takeEvery(GET_BRANCH_INFORMATION, getBranchInformation)
    yield takeEvery(UPDATE_BRANCHINFORMATION, updateBranchInformation)
}


export default branchInfoSaga;