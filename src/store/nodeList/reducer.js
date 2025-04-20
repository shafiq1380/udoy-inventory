import { GET_NODE_LIST, GET_NODE_LIST_SUCCESS } from "./actionTypes"


const initialState = {
  nodeList: []
}



const NodeListReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NODE_LIST_SUCCESS:
      return {
        ...state,
        nodeList: action.payload
      }
    case GET_NODE_LIST:
      return {
        ...state
      }
    default:
      return state
  }
}

export default NodeListReducer
