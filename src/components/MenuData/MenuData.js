const menuData = [
    {
        id: 101,
        menuHeader: 'Dashboard',
        subMenu: [
            {
                id: 1,
                title: 'Default',
                // path: '/dashboard'
            },
            // {
            //     id: 2,
            //     title: 'Sass',
            //     path: '/dashboard-saas'
            // },
            // {
            //     id: 3,
            //     title: 'Crypto',
            //     path: '/dashboard-crypto'
            // },
            // {
            //     id: 4,
            //     title: 'Blog',
            //     path: '/blog'
            // },
        ]
    },
    {
        id: 102,
        menuHeader: 'Setup',
        subMenu: [
            {
                subList: [5, 6, 7, 8],
                title: 'Organization',
                nestedSubmenu: [
                    {
                        id: 5,
                        title: 'Enterprise Setup',
                        tooltip: 'Group of Company',
                        url: '/enterpr-Setup'
                    },
                    {
                        id: 6,
                        title: 'Division Setup',
                        tooltip: 'Company/ Sister Concern',
                        url: '/division-setup'
                    },
                    {
                        id: 7,
                        title: 'Legal Entity Setup',
                        tooltip: 'Location / Branch',
                        url: '/entity-setup'
                    },
                    {
                        id: 8,
                        title: 'Business Unit Setup',
                        tooltip: 'Sales/Finance/Marketing/Cost Center Etc.',
                        url: '/business-unit-setup'
                    },
                ]
            },
            {
                id: 9,
                title: 'Chart of Accounts Setup',
                tooltip: 'Chart of Accounts',
                path: '/coa-setup'
            },
            {
                id: 51,
                title: 'Chart of Accounts Mapping',
                tooltip: 'Chart of Accounts Mapping',
                path: '/COAMap'
            },
            {
                id: 56,
                title: 'Coa Analysis Import',
                tooltip: 'Coa Analysis Import',
                path: '/coa-analysis-import'
            },
            {
                id: 10,
                title: 'Voucher Type Setup',
                path: '/voucher-type-setup'
            },
            {
                id: 50,
                title: 'Voucher Permission',
                path: '/voucher-permission',
            },
            {
                subList: [11, 12],
                title: 'Bank & Branch',
                nestedSubmenu: [
                    {
                        id: 11,
                        title: 'Bank Information Setup',
                        url: '/bank-information-setup'
                    },
                    {
                        id: 12,
                        title: 'Branch Information Setup',
                        url: '/branch-information-setup'
                    },
                ]
            },
            {
                id: 13,
                title: 'Cheque Information Setup',
            },
            {
                id: 14,
                title: 'Analysis Setup',
                path: '/analysis-type-setup'
            },
            {
                subList: [15, 16, 17],
                title: 'Partner Management',
                nestedSubmenu: [
                    {
                        id: 15,
                        title: 'Contract Type Setup',
                        url: '/partner-type'
                    },
                    {
                        id: 16,
                        title: 'Partner Account Setup',
                        url: '/partner-account'
                    },
                    // {
                    //     id: 17,
                    //     title: 'Partner Sub Account',
                    //     url: '/partner-subcontract'
                    // },
                ]
            },
        ]
    },
    {
        id: 103,
        menuHeader: 'Transaction',
        subMenu: [
            {
                subList: [18, 19, 20, 21, 52, 111],
                title: 'Voucher',
                nestedSubmenu: [
                    {
                        id: 18,
                        title: 'Voucher Entry',
                        url: '/debit-payment-voucher'
                    },
                    {
                        id: 19,
                        title: 'Reverse Voucher',
                        url: '/reverse-voucher'
                    },
                    {
                        id: 20,
                        title: 'Revise Voucher',
                        url: '/revise-voucher'
                    },
                    {
                        id: 21,
                        title: 'Voucher From Business',
                        url: '/voucher-from-business'
                    },
                    {
                        id: 111,
                        title: 'Unpost Voucher',
                        url: '/unpost-voucher'
                    },


                ]
            },
            {
                subList: [22, 23, 24],
                title: 'Cheque Management',
                nestedSubmenu: [
                    {
                        id: 22,
                        title: 'Cheque Receipt'
                    },
                    {
                        id: 23,
                        title: 'Cheque Payment'
                    },
                    {
                        id: 24,
                        title: 'Cheque Reconcillation'
                    },
                ]
            },
            {
                id: 25,
                title: 'Budgets Entry',

            },
        ]
    },
    {
        id: 104,
        menuHeader: 'Reports',
        subMenu: [
            {
                id: 27,
                title: 'Daybook',
                path: '/daybook'
            },
            {
                id: 28,
                title: 'Voucher Report',
                path: '/voucherprint'
            },
            {
                id: 52,
                title: 'Voucher Details',
                path: '/view-voucher'
            },
            {
                id: 53,
                title: 'Voucher List',
                path: '/view-list'
            },
            {
                id: 29,
                title: 'General Ledger',
                path: '/general-ledger'
            },
            {
                id: 30,
                title: 'Sub Ledger',
                path: '/sub-ledger'
            },
            {
                id: 31,
                title: 'PDC Statement',
            },
            {
                id: 32,
                title: 'Receipts & Payments Statement',
            },
            {
                id: 33,
                title: 'Cash & Bank Closing Position',
            },
            {
                id: 34,
                title: 'Daily Collection Statement',
            },
            {
                id: 35,
                title: 'Trial Balance',
                path: '/trial-balance'
            },
            {
                id: 57,
                title: 'Sub Trial Balance',
                path: '/sub-trial-balance'
            },
            {
                id: 36,
                title: 'Income Statement',
                path: '/income-statement'
            },
            {
                id: 66,
                title: 'Income Statement(HO)',
                path: '/income-statement-ho'
            },
            {
                id: 58,
                title: 'Cost Of Sales Report',
                path: '/costofsales'
            },
            {
                id: 59,
                title: 'Receipt Payment Report',
                path: '/receipt-payment-report'
            },
            {
                id: 37,
                title: 'Expense Statement',
            },
            {
                id: 38,
                title: 'Profit & Loss',
            },
            {
                id: 39,
                title: 'Balance Sheet',
                path: '/balancesheet'
            },
            {
                id: 67,
                title: 'Balance Sheet(HO)',
                path: '/balancesheet-ho'
            },
            {
                id: 40,
                title: 'Ratio Analysis',
            },
            {
                id: 41,
                title: 'Cash flow Direct',
                path: '/cash-flow-direct'
            },
            {
                id: 72,
                title: 'Cash flow Indirect',
                path: '/cash-flow-indirect'
            },
            {
                id: 73,
                title: 'Cash flow(HO)',
                path: '/cash-flow-ho'
            },
            {
                id: 42,
                title: 'AR Aging',
            },
            {
                id: 43,
                title: 'AP Aging',
            },
            {
                id: 44,
                title: 'Statement of retained earnings',
            },
            {
                id: 45,
                title: 'Budgets Variance Report',
            },
            {
                id: 55,
                title: 'Equity Change Report',
                path: '/equity-change-report'
            },

            {
                id: 113,
                title: 'Analysis Transaction Report',
                path: '/analysis-transaction-report'
            },

        ]
    },
    {
        id: 105,
        menuHeader: 'Configuration',
        subMenu: [
            {
                subList: [46, 47, 48],
                title: 'User Management',
                nestedSubmenu: [
                    {
                        id: 46,
                        title: 'User List',
                        url: '/user-list'
                    },
                    {
                        id: 47,
                        title: 'Node Setup',
                        url: '/Usr-Node-Setup'
                    },
                    {
                        id: 48,
                        title: 'User Role Setup',
                        url: '/user-role-setup'
                    },
                    {
                        id: 54,
                        title: 'User Login History',
                        url: '/usrloginhistory'
                    },

                ]
            },
            {
                id: 49,
                title: 'Period Setup',
                path: '/period-setup',

            },


        ]
    },
]

export default menuData;