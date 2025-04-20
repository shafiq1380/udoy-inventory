import React, { useEffect, useState } from "react";

import {
    Container,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
} from "reactstrap";
import MaterialReceiveFromProduction from "./MaterialReceiveFromProduction";
import SavedMaterialReceiveFromProduction from "./SavedMaterialReceiveFromProduction";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { authorization } from "../../../components/Common/Authorization";



const MaterialReceiveFromProductionIndex = () => {

    //meta title
    // document.title = "Material Purchase Requisition | SMART Accounting System";

    const [activeTab, setActiveTab] = useState('tab1')


    const switchTab = (tab) => {
        setActiveTab(tab)
    };

    useEffect(() => {
        authorization(79)
    }, [])


    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="Material Receive From Production" />
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={activeTab === 'tab1' ? 'active' : ''}
                            onClick={() => switchTab('tab1')}
                        >
                            Material Receive From Production
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink
                            className={activeTab === 'tab2' ? 'active' : ''}
                            onClick={() => switchTab('tab2')}
                        >
                            Saved Material Receive From Production
                        </NavLink>
                    </NavItem>
                </Nav>

                <TabContent activeTab={activeTab}>
                    <TabPane tabId="tab1">
                        <MaterialReceiveFromProduction />
                    </TabPane>

                    <TabPane tabId="tab2">
                        <SavedMaterialReceiveFromProduction activeTab={activeTab} />
                    </TabPane>
                </TabContent>
            </Container>
        </div>
    )
}

export default MaterialReceiveFromProductionIndex;