import React, { useEffect, useState } from "react";

import {
    Container,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
} from "reactstrap";
import MaterialSales from "./MaterialSales";
import SavedMaterialPurchaseItems from "./SavedMaterialSales";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { authorization } from "../../../components/Common/Authorization";



const MaterialSalesIndex = () => {

    //meta title
    // document.title = "Material Purchase Requisition | SMART Accounting System";

    const [activeTab, setActiveTab] = useState('tab1')


    const switchTab = (tab) => {
        setActiveTab(tab)
    };


    useEffect(() => {
        authorization(78)
    }, [])


    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem=" Material Sales" />
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={activeTab === 'tab1' ? 'active' : ''}
                            onClick={() => switchTab('tab1')}
                        >
                            Material Sales
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink
                            className={activeTab === 'tab2' ? 'active' : ''}
                            onClick={() => switchTab('tab2')}
                        >
                            Saved  Material Sales
                        </NavLink>
                    </NavItem>
                </Nav>

                <TabContent activeTab={activeTab}>
                    <TabPane tabId="tab1">
                        <MaterialSales />
                    </TabPane>

                    <TabPane tabId="tab2">
                        <SavedMaterialPurchaseItems activeTab={activeTab} />
                    </TabPane>
                </TabContent>
            </Container>
        </div>
    )
}

export default MaterialSalesIndex;