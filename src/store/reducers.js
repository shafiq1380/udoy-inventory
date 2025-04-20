import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";

//E-commerce
import ecommerce from "./e-commerce/reducer";

//Calendar
import calendar from "./calendar/reducer";

//chat
import chat from "./chat/reducer";

//crypto
import crypto from "./crypto/reducer";

//invoices
import invoices from "./invoices/reducer";

//jobs
import JobReducer from "./jobs/reducer";

//projects
import projects from "./projects/reducer";


//tasks
import tasks from "./tasks/reducer";

//contacts
import contacts from "./contacts/reducer";

//mails
import mails from "./mails/reducer";

//Dashboard 
import Dashboard from "./dashboard/reducer";

//Dasboard saas
import DashboardSaas from "./dashboard-saas/reducer";

//Dasboard crypto
import DashboardCrypto from "./dashboard-crypto/reducer";

//Dasboard blog
import DashboardBlog from "./dashboard-blog/reducer";

//Dasboard job
import DashboardJob from "./dashboard-jobs/reducer";
import usersReducer from "./users-list/reducer";
import analtypeReducer from "./analysis-type-setup/reducer";
//bankinfo
import bankInfoReducer from './bankInfo/reducer'
import branchInfoReducer from './branchInfo/reducer'
import coaSetupReducer from './coa-setup/reducer';
import voucherEntryReducer from './debit-payment-voucher/reducer';
import voucherUpdateReducer from './voucher_update/reducers';
import NodeListReducer from './nodeList/reducer';
import reverseVoucherEntryReducer from './reverse-voucher/reducers';
import reviseVoucherEntryReducer from './revise-voucher/reducers';
import reviseVoucherUploadReducer from './revise-voucher-upload/reducers';
import getVoucherChangesByRefReducer from './voucher-changes-by-ref/reducer';
import fileUploadReducer from './file-upload/reducer';
import AllItemList from './InventoryItemList/reducer';

// vouchcer tab
import voucherTabChangeReducer from './voucher-tab-change/reducer'
// import moduleChange from './Module/reducer'
import coaAnalysisImportReducer from './coa-analysis-import/reducer';
import currentStockReducer from "./current-stock/reducers";
import allowanceListsByTypeReducer from "./allowance-types-store/reducer";
import allowanceDataForInsertByTypeReducer from "./allowance-insert-by-types/reducer";
import allowanceDetailsByIdReducer from "./allowance-details-by-id/reducer";
import pfTransactionByTypeReducer from "./pf-transaction/reducers";
import pfDataInsertByTypeReducer from "./pf-data-insert-by-types/reducers";
import pfDetailsByIdReducer from "./pf-details-by-id/reducers";


const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  ecommerce,
  calendar,
  chat,
  mails,
  crypto,
  invoices,
  JobReducer,
  projects,
  tasks,
  contacts,
  Dashboard,
  DashboardSaas,
  DashboardCrypto,
  DashboardBlog,
  DashboardJob,
  usersReducer,
  bankInfoReducer,
  branchInfoReducer,
  coaSetupReducer,
  analtypeReducer,
  voucherEntryReducer,
  voucherUpdateReducer,
  NodeListReducer,
  reverseVoucherEntryReducer,
  reviseVoucherEntryReducer,
  reviseVoucherUploadReducer,
  getVoucherChangesByRefReducer,
  fileUploadReducer,
  voucherTabChangeReducer,
  AllItemList,
  coaAnalysisImportReducer,
  currentStockReducer,
  allowanceListsByTypeReducer,
  allowanceDataForInsertByTypeReducer,
  allowanceDetailsByIdReducer,
  pfTransactionByTypeReducer,
  pfDataInsertByTypeReducer,
  pfDetailsByIdReducer,
});

export default rootReducer;
