import { all, fork } from "redux-saga/effects";

//public
import AccountSaga from "./auth/register/saga";
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import ProfileSaga from "./auth/profile/saga";
import LayoutSaga from "./layout/saga";
import ecommerceSaga from "./e-commerce/saga";
import calendarSaga from "./calendar/saga";
import chatSaga from "./chat/saga";
import cryptoSaga from "./crypto/saga";
import invoiceSaga from "./invoices/saga";
import jobsSaga from "./jobs/saga";
import projectsSaga from "./projects/saga";
import tasksSaga from "./tasks/saga";
import mailsSaga from "./mails/saga";
import contactsSaga from "./contacts/saga";
import dashboardSaga from "./dashboard/saga";
import dashboardSaasSaga from "./dashboard-saas/saga";
import dashboardCryptoSaga from "./dashboard-crypto/saga";
import dashboardBlogSaga from "./dashboard-blog/saga";
import dashboardJobSaga from "./dashboard-jobs/saga";
import usersSaga from "./users-list/saga";
import banKInfoSaga from "./bankInfo/saga";
import branchInfoSaga from "./branchInfo/saga";
import coaSetupSaga from "./coa-setup/saga";
import analtypeSaga from "./analysis-type-setup/saga";
import voucherEntrySaga from "./debit-payment-voucher/saga";
import voucherUpdateSaga from "./voucher_update/saga";
import nodeList from "./nodeList/saga";
import reverseVoucherEntrySaga from "./reverse-voucher/saga";
import reviseVoucherEntrySaga from "./revise-voucher/saga";
import reviseVoucherUploadSaga from "./revise-voucher-upload/saga";
import voucherChangesByREfSaga from "./voucher-changes-by-ref/saga";
import fileUploadEntrySaga from "./file-upload/saga";
import inventorySaga from "./InventoryItemList/saga";
import coaAnalysisImportSaga from "./coa-analysis-import/saga";
import watchFetchCurrentStock from "./current-stock/saga";
import fetchAllowanceListsByTypeSaga from "./allowance-types-store/saga";
import fetchAllowanceDataForInsertByTypeSaga from "./allowance-insert-by-types/saga";
import fetchAllowanceDetailsByIdSaga from "./allowance-details-by-id/saga";
import getPFTransactionByTypeSaga from "./pf-transaction/saga";
import getPFDataInsertByTypeSaga from "./pf-data-insert-by-types/saga";
import fetchPFDetailsByIdSaga from "./pf-details-by-id/saga";

export default function* rootSaga() {
  yield all([
    //public
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ProfileSaga),
    fork(LayoutSaga),
    fork(ecommerceSaga),
    fork(calendarSaga),
    fork(chatSaga),
    fork(mailsSaga),
    fork(cryptoSaga),
    fork(invoiceSaga),
    fork(jobsSaga),
    fork(projectsSaga),
    fork(tasksSaga),
    fork(contactsSaga),
    fork(dashboardSaga),
    fork(dashboardSaasSaga),
    fork(dashboardCryptoSaga),
    fork(dashboardBlogSaga),
    fork(dashboardJobSaga),
    fork(usersSaga),
    fork(banKInfoSaga),
    fork(branchInfoSaga),
    fork(coaSetupSaga),
    fork(analtypeSaga),
    fork(voucherEntrySaga),
    fork(voucherUpdateSaga),
    fork(nodeList),
    fork(reverseVoucherEntrySaga),
    fork(reviseVoucherEntrySaga),
    fork(reviseVoucherUploadSaga),
    fork(voucherChangesByREfSaga),
    fork(fileUploadEntrySaga),
    fork(inventorySaga),
    fork(coaAnalysisImportSaga),
    fork(watchFetchCurrentStock),
    fork(fetchAllowanceListsByTypeSaga),
    fork(fetchAllowanceDataForInsertByTypeSaga),
    fork(fetchAllowanceDetailsByIdSaga),
    fork(getPFTransactionByTypeSaga),
    fork(getPFDataInsertByTypeSaga),
    fork(fetchPFDetailsByIdSaga),
  ]);
}
