import React, { useEffect, useState } from "react";

import {
    Container,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
} from "reactstrap";
import MaterialReturn from "./MaterialReturn";
import SavedMaterialReturn from "./SavedMaterialReturn";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { authorization } from "../../../components/Common/Authorization";



const MaterialReturnIndex = () => {

    //meta title
    // document.title = "Material Purchase Requisition | SMART Accounting System";

    const [activeTab, setActiveTab] = useState('tab1')


    const switchTab = (tab) => {
        setActiveTab(tab)
    };

    useEffect(() => {
        authorization(81)
    }, [])


    return (
        <div className="page-content">
            <Container fluid>
                <Breadcrumbs title="Transaction" breadcrumbItem="Material Return" />
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={activeTab === 'tab1' ? 'active' : ''}
                            onClick={() => switchTab('tab1')}
                        >
                            Material Return
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink
                            className={activeTab === 'tab2' ? 'active' : ''}
                            onClick={() => switchTab('tab2')}
                        >
                            Saved Material Return
                        </NavLink>
                    </NavItem>
                </Nav>

                <TabContent activeTab={activeTab}>
                    <TabPane tabId="tab1">
                        <MaterialReturn />
                    </TabPane>

                    <TabPane tabId="tab2">
                        <SavedMaterialReturn activeTab={activeTab} />
                    </TabPane>
                </TabContent>
            </Container>
        </div>
    )
}

export default MaterialReturnIndex;