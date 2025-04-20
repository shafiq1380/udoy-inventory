import React, { useEffect, useState } from "react";

import {
    Container,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
} from "reactstrap";
import MaterialTransfer from "./MaterialTransfer";
import SavedMaterialTransfer from "./SavedMaterialTransfer";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { authorization } from "../../../components/Common/Authorization";



const MaterialTransferIndex = () => {

    //meta title
    // document.title = "Material Purchase Requisition | SMART Accounting System";

    const [activeTab, setActiveTab] = useState('tab1')


    const switchTab = (tab) => {
        setActiveTab(tab)
    };


    useEffect(() => {
        authorization(80)
    }, [])

    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="Material Transfer" />
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={activeTab === 'tab1' ? 'active' : ''}
                            onClick={() => switchTab('tab1')}
                        >
                            Material Transfer
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink
                            className={activeTab === 'tab2' ? 'active' : ''}
                            onClick={() => switchTab('tab2')}
                        >
                            Saved Material Transfer
                        </NavLink>
                    </NavItem>
                </Nav>

                <TabContent activeTab={activeTab}>
                    <TabPane tabId="tab1">
                        <MaterialTransfer />
                    </TabPane>

                    <TabPane tabId="tab2">
                        <SavedMaterialTransfer activeTab={activeTab} />
                    </TabPane>
                </TabContent>
            </Container>
        </div>
    )
}

export default MaterialTransferIndex;