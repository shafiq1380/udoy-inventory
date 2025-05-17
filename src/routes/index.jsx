//import XLSX from 'xlsx';

import React from "react"
import { Navigate } from "react-router-dom"

// Profile
import UserProfile from "../pages/Authentication/user-profile"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

// Dashboard
import Dashboard from "../pages/Dashboard/index"
import Demo from "../pages/demo"
import Login2 from "../pages/Authentication/Login2"
import DashboardSaas from "../pages/Dashboard-saas"
import DashboardCrypto from "../pages/Dashboard-crypto/index"
import Blog from "../pages/Dashboard-Blog/index"
import UserList from "../pages/UserList"
import Login3 from "../pages/Authentication/Login3"
import DebitPaymentVoucher from "../pages/Debit-Payment-Voucher"
import BankInformationSetup from "../pages/BankInformationSetup/BankInformationSetup"
import BranchInformationSetup from "../pages/BranchInformationSetup/BranchInformationSetup"
import COASetup from "../pages/COASetup/COASetup"
import AnalysisTypeSetup from "../pages/AnalysisTypeSetup/index"
import AnalysisDetails from "../pages/AnalysisDetails/AnalysisDetails"
import VoucherTypeSetup from "../pages/VoucherTypeSetup/VoucherTypeSetup"
import UserNodeSetup from "../pages/UserNodeSetup/UserNodeSetup"

import AccPartnerType from "../pages/AccPartnerType/AccPartnerType"
import AccPartnerAccount from "../pages/AccPartnerAccount/AccPartnerAccount"
import AccPartnerSubcontract from "../pages/AccPartnerSubcontract/AccPartnerSubcontract"
import OrgEnterpriseSetup from "../pages/OrgEnterpriseSetup/OrgEnterpriseSetup"
import OrgDivisionSetup from "../pages/OrgDivisionSetup/OrgDivisionSetup"
import OrgEntitySetup from "../pages/OrgEntitySetup/OrgEntitySetup"
import OrgBusinessUnitSetup from "../pages/OrgBusinessUnitSetup/OrgBusinessUnitSetup"
import UserRoleSetup from "../pages/UserRoleSetup/UserRoleSetup"
import VoucherFromBusiness from "../pages/VoucherFromBusiness/Index"
import VoucherPrint from "../pages/VoucherPrint/VoucherPrint"
import VoucherLedger from "../pages/VoucherLedger/VoucherLedger"
import VoucherSubLedger from "../pages/VoucherSubLedger/VoucherSubLedger"
import TrialBalancePrint from "../pages/TrialBalancePrint/TrialBalancePrint"
import AccPeriodSetup from "../pages/AccPeriodSetup/AccPeriodSetup"
import VoucherPermission from "../pages/VoucherPermission/VoucherPermission"
import VoucherEdit from "../pages/VoucherEdit/VoucherEdit"
import IncomeStatement from "../pages/IncomeStatement/IncomeStatement"
import COAMap from "../pages/COAMap/COAMap"
import VoucherUpload from "../pages/VoucherUpload/VoucherUpload"
import UnAuthorizationPage from "../pages/UnAuthorizationPage/UnAuthorizationPage"
import ReverseVoucher from "../pages/ReverseVoucher/ReverseVoucher"
import BalanceSheet from "../pages/BalanceSheet/BalanceSheet"
import EquityChange from "../pages/EquityChange/EquityChange"
import ReviseVoucher from "../pages/ReviseVoucher/ReviseVoucher"
import ReviseVoucherUpload from "../pages/ReviseVoucherUpload/ReviseVoucherUpload"
import ViewVoucher from "../pages/ViewVoucher/ViewVoucher"
import FileUpload from "../pages/FileUpload/FileUpload"
import DayBookReport from "../pages/DayBookReport/VoucherLedger"
import VoucherList from "../pages/VoucherListReport/VoucherList"
import UsrLoginHistory from "../pages/UsrLoginHistory/UsrLoginHistory"
import CoaAnlImport from "../pages/CoaAnlImport/CoaAnlImport"
import SubTrialBalancePrint from "../pages/SubTrailBalance/SubTrialBalancePrint"
import LandingPage from "../pages/LandingPage/LandingPage"

import UserManual from "../pages/UserManual/UserManual"

import Payroll from '../pages/PAYROLLALL/Payroll/Payroll';

import CostOfSales from "../pages/CostOfSales/CostOfSales"
import ReceiptPaymentReport from "../pages/ReceiptPaymentReport/ReceiptPaymentReport"
import MaterialPurchaseReq from "../pages/INVENTORYALL/MaterialPurchaseReq/MaterialPurchaseReq"

import PurchaseIndex from "../pages/INVENTORYALL/MaterialPurchaseRequisition/PurchaseIndex"
import EmployeeInformation from "../pages/PAYROLLALL/EmployeeInformation/EmployeeInformation"

import InventoryItemList from "../pages/INVENTORYALL/InventoryItemList/InventoryItemList"
import AddInvenItem from "../pages/INVENTORYALL/InventoryItemList/AddInvenItem"
import Subgroup from "../pages/INVENTORYALL/AddSubGroup/Subgroup"

import AllEmployeeList from "../pages/PAYROLLALL/AllEmployeeList/AllEmployeeList"
import EmployeeInformationEdit from "../pages/PAYROLLALL/EmployeeInformationEdit/EmployeeInformationEdit"

import StoreList from "../pages/INVENTORYALL/StoreList/StoreList"
import GetAllPartner from "../pages/PAYROLLALL/PartnerManagement/GetAllPartner/GetAllPartner"
import PartnerInformationEdit from "../pages/PAYROLLALL/PartnerManagement/PartnerInformationEdit/PartnerInformationEdit"

import GroupSetup from "../pages/INVENTORYALL/GroupSetup/GroupSetup"

import COAAnalysisImport from "../pages/COAAnalysisImport/COAAnalysisImport"
import COAAnalysisImportById from "../pages/COAAnalysisImport/COAAnalysisImportById"

import PayRollList from "../pages/PAYROLLALL/EmployeeList/PayRollList"
import UOMSetup from "../pages/INVENTORYALL/UOMSetup/UOMSetup"
import ProductCategorySetup from "../pages/INVENTORYALL/ProductCtgrySetup/ProductCategorySetup"
import BalanceSheetHO from "../pages/BalanceSheetHO/BalanceSheetHO"
import IncomeStatementHO from "../pages/IncomeStatementHO/IncomeStatementHO"
import PayrollSetupReport from "../pages/PAYROLLALL/PayrollSetupReport/PayrollSetupReport"
import EmployeePayrollReport from "../pages/PAYROLLALL/EmployeePayrollReport/EmployeePayrollReport"
import EmployeePayroll from "../pages/PAYROLLALL/EmployeePayRoll/EmployeePayroll"
import CreatePayRoll from "../pages/PAYROLLALL/EmployeePayRoll/CreatePayRoll"
import PayrollDetails from "../pages/PAYROLLALL/EmployeePayRoll/PayrollDetails"
import PeriodSetup from "../pages/PeriodSetup/PeriodSetup"
import COAMaps from "../pages/COAMaps/COAMaps"
import COADetails from "../pages/COADetails/COADetails"
import CashFlowIndirect from "../pages/CashFlowIndirect/CashFlowIndirect"
import CashFlowDirect from "../pages/CashFlowDirect/CashFlowDirect"
import VoucherPermissions from "../pages/VoucherPermissions/VoucherPermissions"
import EditVoucherPermissions from "../pages/VoucherPermissions/EditVoucherPermissions"
import UsersNodeSetup from "../pages/UsersNodeSetup/UsersNodeSetup"
import UsersLoginHistory from "../pages/UsersLoginHistory/UsersLoginHistory"
import CashFlowHO from "../pages/CashFlowHO/CashFlowHO"
import DepartmentSetup from "../pages/PAYROLLALL/DepartmentSetup/DepartmentSetup"
import VouchersTpeSetup from "../pages/VoucherTypeSetup/VouchersTypeSetup"
import AccpartnerTypes from "../pages/AccPartnersType/AccPartnerTypes"
import MaterialRequisitionIndex from "../pages/INVENTORYALL/MaterialRequisitionAndIssue/MaterialRequisitionIndex"
import MaterialSalesIndex from "../pages/INVENTORYALL/MaterialSales/MaterialSalesIndex"
import MaterialReceiveFromProductionIndex from "../pages/INVENTORYALL/MaterialReceiveFromProduction/MaterialReceiveFromProductionIndex"
import MaterialTransfer from "../pages/INVENTORYALL/MaterialTransfer/MaterialTransferIndex"
import MaterialReturn from "../pages/INVENTORYALL/MaterialReturn/MaterialReturnIndex"
import MaterialAdjustment from "../pages/INVENTORYALL/MaterialAdjustment/MaterialAdjustmentIndex"
import EmployeePayslipReport from "../pages/PAYROLLALL/EmployeePayslipReport/EmployeePayslipReport"
import EmployeeSalaryRegisterReport from "../pages/PAYROLLALL/EmployeeSalaryRegisterReport/EmployeeSalaryRegisterReport"
import EditTransactionPage from "../pages/INVENTORYALL/MaterialPurchaseRequisition/EditTransactionPage"
import ItemLedgerReport from "../pages/INVENTORYALL/ItemLedgerReport/ItemLedgerReport"
import ItemCurrentStockReport from "../pages/INVENTORYALL/ItemCurrentStockReport/ItemCurrentStockReport"
import TransactionDetailReport from "../pages/INVENTORYALL/TransactionDetailReport/TransactionDetailReport"
import TransactionListingReport from "../pages/INVENTORYALL/TransactionListingReport/TransactionListingReport"
import ViewTransactionList from "../pages/INVENTORYALL/ViewTransactionList/ViewTransactionList"
import EditTransactionIssuePage from "../pages/INVENTORYALL/MaterialRequisitionAndIssue/EditTransactionIssuePage"
import EditSalesPage from "../pages/INVENTORYALL/MaterialSales/EditSalesPage"
import EditRcvProductionPage from "../pages/INVENTORYALL/MaterialReceiveFromProduction/EditRcvProductionPage"
import EditMaterialTransfer from "../pages/INVENTORYALL/MaterialTransfer/EditMtrlTransferPage"
import EditMtrlReturn from "../pages/INVENTORYALL/MaterialReturn/EditMtrlReturn"
import EditMtrlAdjustment from "../pages/INVENTORYALL/MaterialAdjustment/EditMtrlAdjustment"
import InventoryTransactionPermissionScreen from "../pages/InventoryTransactionPermissionScreen/InventoryTransactionPermissionScreen"
import EditInventoryTransactionPermissionScreen from "../pages/InventoryTransactionPermissionScreen/EditInventoryTransactionPermissionScreen"
import TransactionValueUpdate from "../pages/INVENTORYALL/TransactionValueUpdate/TransactionValueUpdate"
import MtrlRcvMaintanceIndex from "../pages/INVENTORYALL/ReceiveForMaintance/MtrlRcvMaintanceIndex"
import IssueForMaintanceIndex from "../pages/INVENTORYALL/IssueForMaintance/IssueForMaintanceIndex"
import EditMtrlRcvMaintance from "../pages/INVENTORYALL/ReceiveForMaintance/EditMtrlRcvMaintance"
import EditIssueMaintance from "../pages/INVENTORYALL/IssueForMaintance/EditIssueMaintance"
import InventorySerialReport from "../pages/INVENTORYALL/InventorySerialReport/InventorySerialReport"
import OvertimeAllowance from "../pages/PAYROLLALL/OvertimeAllowance/OvertimeAllowance"
import CreateOT from "../pages/PAYROLLALL/CreateOT/CreateOT"
import OvertimeDetails from "../pages/PAYROLLALL/OvertimeDetails/OvertimeDetails"
import OvertimeEdit from "../pages/PAYROLLALL/OvertimeEdit/OvertimeEdit"
import FestivalBonusLists from "../pages/PAYROLLALL/FestivalBonus/FestivalBonusLists/FestivalBonusLists"
import CreateFestivalBonus from "../pages/PAYROLLALL/FestivalBonus/CreateFestivalBonus/CreateFestivalBonus"
import EditFestivalBonus from "../pages/PAYROLLALL/FestivalBonus/EditFestivalBonus/EditFestivalBonus"
import DetailsFestivalBonus from "../pages/PAYROLLALL/FestivalBonus/DetailsFestivalBonus/DetailsFestivalBonus"
import StorePermission from "../pages/StorePermission/StorePermission"
import EmployeeAllowanceReport from "../pages/PAYROLLALL/EmployeeAllowanceReport/EmployeeAllowanceReport"
import TransactionUpdatePending from "../pages/INVENTORYALL/TransactionUpdatePending/TransactionUpdatePending"
import BoishakhiVataLists from "../pages/PAYROLLALL/BOISHAKHIVATA/BoishakhiVataLists/BoishakhiVataLists"
import CreateBoishakhiVata from "../pages/PAYROLLALL/BOISHAKHIVATA/CreateBoishakhiVata/CreateBoishakhiVata"
import DetailsBoishakhiVata from "../pages/PAYROLLALL/BOISHAKHIVATA/DetailsBoishakhiVata/DetailsBoishakhiVata"
import EditBoishakhiVata from "../pages/PAYROLLALL/BOISHAKHIVATA/EditBoishakhiVata/EditBoishakhiVata"
import WPPFAllowanceLists from "../pages/PAYROLLALL/WPPFAllowance/WPPFAllowanceLists/WPPFAllowanceLists"
import CreateWPPFAllowance from "../pages/PAYROLLALL/WPPFAllowance/CreateWPPFAllowance/CreateWPPFAllowance"
import DetailsWPPFAllowance from "../pages/PAYROLLALL/WPPFAllowance/DetailsWPPFAllowance/DetailsWPPFAllowance"
import EditWPPFAllowance from "../pages/PAYROLLALL/WPPFAllowance/EditWPPFAllowance/EditWPPFAllowance"
import RecreationLeaveAllowanceLists from "../pages/PAYROLLALL/RecreationLeaveAllowance/RecreationLeaveAllowanceLists/RecreationLeaveAllowanceLists"
import CreateRecreationLeaveAllowance from "../pages/PAYROLLALL/RecreationLeaveAllowance/CreateRecreationLeaveAllowance/CreateRecreationLeaveAllowance"
import DetailsRecreationLeaveAllowance from "../pages/PAYROLLALL/RecreationLeaveAllowance/DetailsRecreationLeaveAllowance/DetailsRecreationLeaveAllowance"
import EditRecreationLeaveAllowance from "../pages/PAYROLLALL/RecreationLeaveAllowance/EditRecreationLeaveAllowance/EditRecreationLeaveAllowance"
import PayrollVoucherSetup from "../pages/PayrollVoucherSetup/PayrollVoucherSetup"
import OpeningPayrollVoucher from "../pages/PAYROLLALL/OldPayRollVoucherSetup/OpeningPayrollVoucher"
import PayCodeSetup from "../pages/PAYROLLALL/PayCodeSetup/PayCodeSetup"
import GPFLists from "../pages/PAYROLLALL/GPF/GPFLists/GPFLists"
import GPFCreate from "../pages/PAYROLLALL/GPF/GPFCreate/GPFCreate"
import SalaryBankStatement from "../pages/PAYROLLALL/SalaryBankStatement/SalaryBankStatement"
import GPFDetails from "../pages/PAYROLLALL/GPF/GPFDetails/GPFDetails"
import GPFEdit from "../pages/PAYROLLALL/GPF/GPFEdit/GPFEdit"
import CPFLists from "../pages/PAYROLLALL/CPF/CPFLists/CPFLists"
import CPFCreate from "../pages/PAYROLLALL/CPF/CPFCreate/CPFCreate"
import CPFDetails from "../pages/PAYROLLALL/CPF/CPFDetails/CPFDetails"
import CPFEdit from "../pages/PAYROLLALL/CPF/CPFEdit/CPFEdit"
import EmployeeLoanOpeningInterestLists from "../pages/PAYROLLALL/EmployeeLoanOpeningInterest/EmployeeLoanOpeningInterestLists/EmployeeLoanOpeningInterestLists"
import EmployeeLoanOpeningInterestCreate from "../pages/PAYROLLALL/EmployeeLoanOpeningInterest/EmployeeLoanOpeningInterestCreate/EmployeeLoanOpeningInterestCreate"
import EmployeeLoanOpeningInterestDetails from "../pages/PAYROLLALL/EmployeeLoanOpeningInterest/EmployeeLoanOpeningInterestDetails/EmployeeLoanOpeningInterestDetails"
import EmployeeLoanOpeningInterestEdit from "../pages/PAYROLLALL/EmployeeLoanOpeningInterest/EmployeeLoanOpeningInterestEdit/EmployeeLoanOpeningInterestEdit"
import AllowanceBankStatement from "../pages/PAYROLLALL/AllowanceBankStatement/AllowanceBankStatement"
import UnpostVoucher from "../pages/UnpostVoucher/UnpostVoucher"
import UnpostTransaction from "../pages/PAYROLLALL/UnpostTransaction/UnpostTransaction"
import AnalysisTransactionReport from "../pages/AnalysisTransactionReport/AnalysisTransactionReport"
import GpfReport from "../pages/PAYROLLALL/GPF-Report/GpfReport"
import CGIDashboard from "../pages/INVENTORYALL/CGIDashboard/CGIDashboard"
import GDIDetails from "../pages/INVENTORYALL/CGIDashboard/GDIDetails"
import CGIManagement from "../pages/INVENTORYALL/CGIManagement/CGIManagement"
import GpfProfitCalculation from "../pages/PAYROLLALL/GPFProfitCalculation/GpfProfitCalculation"





const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/landingPage", component: <LandingPage /> },
  { path: "/dashboard-saas", component: <DashboardSaas /> },
  { path: "/dashboard-crypto", component: <DashboardCrypto /> },
  { path: "/blog", component: <Blog /> },

  // //profile
  { path: "/profile", component: <UserProfile /> },
  { path: "/enterprise-setup", component: <Demo /> },
  { path: "/user-list", component: <UserList /> },
  { path: "/debit-payment-voucher", component: <DebitPaymentVoucher /> },
  { path: "/voucher-edit/:id", component: <VoucherEdit /> },
  { path: "/voucher-upload", component: <VoucherUpload /> },
  { path: '/bank-information-setup', component: <BankInformationSetup /> },
  { path: '/branch-information-setup', component: <BranchInformationSetup /> },
  { path: '/reverse-voucher', component: <ReverseVoucher /> },
  { path: '/revise-voucher', component: <ReviseVoucher /> },
  { path: '/revise-voucher-upload', component: <ReviseVoucherUpload /> },
  { path: '/view-voucher', component: <ViewVoucher /> },
  { path: '/unpost-voucher', component: <UnpostVoucher /> },

  // Setup
  { path: '/coa-setup', component: <COASetup /> },
  { path: '/analysis-type-setup', component: <AnalysisTypeSetup /> },
  { path: '/analysis-details/:id', component: <AnalysisDetails /> },

  // { path: '/voucher-type-setup', component: <VoucherTypeSetup /> },                     // This Data is came from iframe
  { path: '/voucher-type-setup', component: <VouchersTpeSetup /> },                  // This Data is came from react app

  // { path: '/Usr-Node-Setup', component: <UserNodeSetup /> },                     // This Data is came from iframe
  { path: '/Usr-Node-Setup', component: <UsersNodeSetup /> },                       // This Data is came from react app

  // { path: '/partner-type', component: <AccPartnerType /> },         // This Data is came from iframe
  { path: '/partner-type', component: <AccpartnerTypes /> },    // This Data is came from react app

  // { path: '/partner-account', component: <AccPartnerAccount /> },
  { path: '/partner-account', component: <GetAllPartner /> },

  { path: '/partner-subcontract', component: <AccPartnerSubcontract /> },
  { path: '/enterpr-Setup', component: <OrgEnterpriseSetup /> },
  { path: '/division-setup', component: <OrgDivisionSetup /> },
  { path: '/entity-setup', component: <OrgEntitySetup /> },
  { path: '/business-unit-setup', component: <OrgBusinessUnitSetup /> },

  // { path: '/coa-analysis-import', component: <CoaAnlImport /> },             // This Data is came from iframe
  { path: '/coa-analysis-import', component: <COAAnalysisImport /> },                // This Data is came from react app

  { path: '/coa-analysis-import-by-id/:id', component: <COAAnalysisImportById /> },


  //configuration section path
  { path: '/user-role-setup', component: <UserRoleSetup /> },
  { path: '/voucher-from-business', component: <VoucherFromBusiness /> },

  { path: '/usrloginhistory', component: <UsrLoginHistory /> },                      // This Data is came from iframe
  // { path: '/usrloginhistory', component: <UsersLoginHistory /> },                       // This Data is came from react app

  //Report section
  { path: '/voucherprint', component: <VoucherPrint /> },
  { path: '/general-ledger', component: <VoucherLedger /> },
  { path: '/sub-ledger', component: <VoucherSubLedger /> },
  { path: '/trial-balance', component: <TrialBalancePrint /> },
  { path: '/sub-trial-balance', component: <SubTrialBalancePrint /> },

  // { path: '/period-setup', component: <AccPeriodSetup /> },         // This Data is came from iframe
  { path: '/period-setup', component: <PeriodSetup /> },              // This Data is came from react app

  // { path: '/voucher-permission', component: <VoucherPermission /> },     // This Data is came from iframe
  { path: '/voucher-permission', component: <VoucherPermissions /> },       // This Data is came from react app
  { path: '/edit-voucher-permission/:id', component: <EditVoucherPermissions /> },       // This Data is came from react app
  { path: '/inventory-permission-transaction-screen', component: <InventoryTransactionPermissionScreen /> },
  { path: '/edit-inventory-permission-transaction-screen/:id', component: <EditInventoryTransactionPermissionScreen /> },
  { path: '/store-permission', component: <StorePermission /> },
  { path: '/payroll-voucher-setup', component: <PayrollVoucherSetup /> },


  { path: '/income-statement', component: <IncomeStatement /> },
  { path: '/income-statement-ho', component: <IncomeStatementHO /> },

  { path: '/COAMap', component: <COAMap /> },                         // This Data is came from iframe
  // { path: '/COAMap', component: <COAMaps /> },                         // This Data is came from react app

  { path: '/coa-details', component: <COADetails /> },                         // This Data is came from react app
  { path: '/balancesheet', component: <BalanceSheet /> },
  { path: '/balancesheet-ho', component: <BalanceSheetHO /> },
  { path: '/cash-flow-direct', component: <CashFlowDirect /> },
  { path: '/cash-flow-indirect', component: <CashFlowIndirect /> },
  { path: '/cash-flow-ho', component: <CashFlowHO /> },
  { path: '/equity-change-report', component: <EquityChange /> },
  { path: '/daybook', component: <DayBookReport /> },
  { path: '/view-list', component: <VoucherList /> },
  { path: '/unauthorized', component: <UnAuthorizationPage /> },
  { path: '/costofsales', component: <CostOfSales /> },
  { path: '/receipt-payment-report', component: <ReceiptPaymentReport /> },
  { path: '/analysis-transaction-report', component: <AnalysisTransactionReport /> },

  //payroll
  { path: '/payroll/:id', component: <Payroll /> },
  { path: '/user-manual', component: <UserManual /> },
  { path: '/payroll-list', component: <PayRollList /> },
  { path: '/opening-payroll-setup', component: <OpeningPayrollVoucher /> },
  { path: '/pay-code-setup', component: <PayCodeSetup /> },



  // Material Purchase Module
  { path: '/material-receive-from-purchase', component: <PurchaseIndex /> },
  { path: '/transaction-edit/:id', component: <EditTransactionPage /> },
  // { path: '/material-requisition-and-issue', component: <MaterialRequisitionAndIssue /> },
  { path: '/material-requisition-and-issue', component: <MaterialRequisitionIndex /> },
  { path: '/transactionissue-edit/:id', component: <EditTransactionIssuePage /> },

  { path: '/material-sales', component: <MaterialSalesIndex /> },
  { path: '/material-sales/:id', component: <EditSalesPage /> },

  { path: '/material-receive-from-production', component: <MaterialReceiveFromProductionIndex /> },
  { path: '/rcvproduction-edit/:id', component: <EditRcvProductionPage /> },

  { path: '/material-transfer', component: <MaterialTransfer /> },
  { path: '/materialtransfer-edit/:id', component: <EditMaterialTransfer /> },

  { path: '/material-return', component: <MaterialReturn /> },
  { path: '/materialreturn-edit/:id', component: <EditMtrlReturn /> },

  { path: '/material-adjustment', component: <MaterialAdjustment /> },
  { path: '/materialadjustment-edit/:id', component: <EditMtrlAdjustment /> },

  { path: '/rcv-for-maintanance', component: <MtrlRcvMaintanceIndex /> },
  { path: '/rcv-for-maintanance/:id', component: <EditMtrlRcvMaintance /> },

  { path: '/issue-for-maintanance', component: <IssueForMaintanceIndex /> },
  { path: '/issue-for-maintanance/:id', component: <EditIssueMaintance /> },



  // Inventory Management
  { path: '/materialourchasereq', component: <MaterialPurchaseReq /> },
  { path: '/inventory-list', component: <InventoryItemList /> },
  { path: '/inventoryiteminput', component: <AddInvenItem /> },
  { path: '/inventoryiteminput/:id', component: <AddInvenItem /> },
  { path: '/group-setup', component: <GroupSetup /> },

  // { path: '/cgi-dashboard', component: <CGIDashboard /> },
  // { path: '/godown/:id', component: <GDIDetails /> },
  // { path: '/cgi-management', component: <CGIManagement /> },

  { path: '/subgroup', component: <Subgroup /> },
  { path: '/store-list', component: <StoreList /> },
  { path: '/uom-setup', component: <UOMSetup /> },
  { path: '/product-category-setup', component: <ProductCategorySetup /> },
  { path: '/view-transaction-list', component: <ViewTransactionList /> },
  { path: '/transaction-value-update', component: <TransactionValueUpdate /> },
  { path: '/transaction-update-pending', component: <TransactionUpdatePending /> },



  // Employee Information Module
  { path: '/employee-information', component: <EmployeeInformation /> },
  { path: '/all-employee-list', component: <AllEmployeeList /> },
  { path: '/department-setup', component: <DepartmentSetup /> },
  { path: '/employee-information-edit/:id', component: <EmployeeInformationEdit /> },
  { path: '/employee-information-edit', component: <EmployeeInformationEdit /> },
  // { path: '/partner-management', component: <GetAllPartner /> },
  { path: '/partner-information-edit/:id', component: <PartnerInformationEdit /> },
  { path: '/employee-payroll', component: <EmployeePayroll /> },
  { path: '/createypayroll', component: <CreatePayRoll /> },
  { path: '/payrolldetails/:id', component: <PayrollDetails /> },
  { path: '/ot-allowance', component: <OvertimeAllowance /> },
  { path: '/createOT', component: <CreateOT /> },
  { path: '/ot-details', component: <OvertimeDetails /> },
  { path: '/ot-edit', component: <OvertimeEdit /> },
  { path: '/festival-bonus', component: <FestivalBonusLists /> },
  { path: '/create-festival-bonus', component: <CreateFestivalBonus /> },
  { path: '/details-festival-bonus', component: <DetailsFestivalBonus /> },
  { path: '/edit-festival-bonus', component: <EditFestivalBonus /> },
  { path: '/boishakhi-vata', component: <BoishakhiVataLists /> },
  { path: '/create-boishakhi-vata', component: <CreateBoishakhiVata /> },
  { path: '/edit-boishakhi-vata', component: <EditBoishakhiVata /> },
  { path: '/details-boishakhi-vata', component: <DetailsBoishakhiVata /> },
  { path: '/recreation-leave-allowance', component: <RecreationLeaveAllowanceLists /> },
  { path: '/create-recreation-leave', component: <CreateRecreationLeaveAllowance /> },
  { path: '/details-recreation-leave', component: <DetailsRecreationLeaveAllowance /> },
  { path: '/edit-recreation-leave', component: <EditRecreationLeaveAllowance /> },
  { path: '/wppf-allowance', component: <WPPFAllowanceLists /> },
  { path: '/create-wppf-allowance', component: <CreateWPPFAllowance /> },
  { path: '/details-wppf-allowance', component: <DetailsWPPFAllowance /> },
  { path: '/edit-wppf-allowance', component: <EditWPPFAllowance /> },
  { path: '/gpf', component: <GPFLists /> },
  { path: '/gpf-create', component: <GPFCreate /> },
  { path: '/gpf-details', component: <GPFDetails /> },
  { path: '/gpf-edit', component: <GPFEdit /> },
  { path: '/gpf-profit-calculation', component: <GpfProfitCalculation /> },
  { path: '/cpf', component: <CPFLists /> },
  { path: '/cpf-create', component: <CPFCreate /> },
  { path: '/cpf-details', component: <CPFDetails /> },
  { path: '/cpf-edit', component: <CPFEdit /> },
  { path: '/employee-loan-opening-interest', component: <EmployeeLoanOpeningInterestLists /> },
  { path: '/employeeLoan-create', component: <EmployeeLoanOpeningInterestCreate /> },
  { path: '/employeeLoan-details', component: <EmployeeLoanOpeningInterestDetails /> },
  { path: '/employeeLoan-edit', component: <EmployeeLoanOpeningInterestEdit /> },
  { path: '/unpost-transaction', component: <UnpostTransaction /> },

  //Employee Report route
  { path: '/Payrollsetupreport', component: <PayrollSetupReport /> },
  { path: '/employee-payroll-report', component: <EmployeePayrollReport /> },
  { path: '/gpf-report', component: <GpfReport /> },
  { path: '/employee-payslip-report', component: <EmployeePayslipReport /> },
  { path: '/employee-salary-register-report', component: <EmployeeSalaryRegisterReport /> },
  { path: '/employee-allowance-report', component: <EmployeeAllowanceReport /> },
  { path: '/salary-bank-statement', component: <SalaryBankStatement /> },
  { path: '/allowance-bank-statement', component: <AllowanceBankStatement /> },


  // Inventory Report Routes
  { path: '/item-ledger-report', component: <ItemLedgerReport /> },
  { path: '/item-current-stock-report', component: <ItemCurrentStockReport /> },
  { path: '/transaction-detail-report', component: <TransactionDetailReport /> },
  { path: '/transaction-listing-report', component: <TransactionListingReport /> },
  { path: '/serial-item-report', component: <InventorySerialReport /> },

  {
    path: "/",
    exact: true,
    component: <Navigate to="/landingPage" />,
  },
]

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login3 /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
  { path: '/login2', component: <Login2 /> },
  // { path: '/unauthorized', component: <UnAuthorizationPage /> },
  { path: '/FileUpload', component: <FileUpload /> },
]

export { authProtectedRoutes, publicRoutes }

