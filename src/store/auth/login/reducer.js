import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  SET_USER_INFORMATION,

} from "./actionTypes"

const initialState = {
  error: "",
  loading: false,
  userInformation: {},

}



const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      }
      break
    case SET_USER_INFORMATION:
      state = {
        ...state,
        loading: true,
        userInformation: action.payload,
      }
      break

    case LOGIN_SUCCESS:
      state = {
        ...state,
        loading: false,
      }
      break
    case LOGOUT_USER:
      state = {
        ...state,
        loading: false,
        userInformation: {}
      }
      break
    case LOGOUT_USER_SUCCESS:
      state = { ...state }
      break


    case API_ERROR:
      state = { ...state, error: action.payload, loading: false }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default login
