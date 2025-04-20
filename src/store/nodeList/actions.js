import { GET_NODE_LIST, GET_NODE_LIST_SUCCESS } from "./actionTypes"


export const getNodeList = (data) => {
  return {
    type: GET_NODE_LIST,
    payload: data
  }
}
export const getNodeListSuccess = (data) => {
  return {
    type: GET_NODE_LIST_SUCCESS,
    payload: data
  }
}