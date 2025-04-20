import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";

import {
    Container,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
} from "reactstrap";

import VoucherEntry from "./VoucherEntry";
import SaveVoucherTab from "./components/SaveVoucherTab";
import UploadVoucher from "./UploadVoucher";
import { useDispatch, useSelector } from "react-redux";
import { tabChange } from "../../store/voucher-tab-change/actions";
import { authorization } from "../../components/Common/Authorization";


const DebitPaymentVoucher = () => {

    //meta title
    // document.title = "Debit Payment Voucher | SMART Accounting System";

    const { tab } = useSelector(state => state.voucherTabChangeReducer)

    const dispatch = useDispatch()



    const switchTab = (tab) => {
        dispatch(tabChange(tab))
    }

    // useEffect(() => {
    //     // dispatch(tabChange('tab1'))
    // }, [])

    //Authorization check
    useEffect(() => {
        authorization(18)
    }, [])

    return (
        <div className="page-content">
            <Container fluid>
                {/* Render Breadcrumb */}

                <div>
                    <Breadcrumbs title="Transaction" breadcrumbItem="Voucher / New Voucher" />
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={tab === 'tab1' ? 'active' : ''}
                                onClick={() => switchTab('tab1')}
                            >
                                Voucher Entry
                            </NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink
                                className={tab === 'tab2' ? 'active' : ''}
                                onClick={() => switchTab('tab2')}
                            >
                                Saved Voucher
                            </NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink
                                className={tab === 'tab3' ? 'active' : ''}
                                onClick={() => switchTab('tab3')}
                            >
                                Upload Voucher
                            </NavLink>
                        </NavItem>

                        {/* <NavItem>
                            <NavLink
                                className={activeTab === 'tab4' ? 'active' : ''}
                                onClick={() => switchTab('tab4')}
                            >
                                Voucher Report
                            </NavLink>
                        </NavItem> */}
                    </Nav>

                    <TabContent activeTab={tab}>

                        {/* code testing */}
                        <TabPane tabId="tab1">
                            <VoucherEntry switchTab={switchTab} />
                        </TabPane>

                        {/* <TabPane tabId="tab1">
                            <VoucherEntry />
                        </TabPane> */}

                        <TabPane tabId="tab2">
                            <SaveVoucherTab />
                        </TabPane>

                        <TabPane tabId="tab3">
                            <UploadVoucher />
                        </TabPane>

                        {/* <TabPane tabId="tab4">
                            <h1>Voucher Report</h1>
                        </TabPane> */}

                    </TabContent>
                </div>

            </Container>
        </div>
    )
}

export default DebitPaymentVoucher