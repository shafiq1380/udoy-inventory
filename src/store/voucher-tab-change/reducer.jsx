import { VOUCHER_TAB_CHANGE } from './actions';

const initialState = {
    tab: 'tab1'
};

const voucherTabChangeReducer = (state = initialState, action) => {
    // console.log("Reducer", action.payload);
    switch (action.type) {
        case VOUCHER_TAB_CHANGE:
            return {
                ...state,
                tab: action.payload
            };
        default:
            return state;
    }
};

export default voucherTabChangeReducer;