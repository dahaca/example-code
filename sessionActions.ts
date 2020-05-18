import { navigate } from '@reach/router'
import { AnyAction } from 'redux'
import { createAction } from 'redux-actions'
import { ThunkDispatch } from 'redux-thunk'
import { UserApi } from '../../api/UserApi'
import { ACCESS_TOKEN_HEADER } from '../../constants/http'
import {
  AGREED_LEGAL_DISCLAIMER,
  LOCAL_STORAGE_ACCESS_TOKEN,
} from '../../constants/state'
import { SessionState } from '../reducers/sessionReducer'

export const REQUEST_LOGIN = 'REQUEST_LOGIN'
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN'
export const LOGOUT_CLEAR_STATE = 'LOGOUT_CLEAR_STATE'
export const UPDATE_ACCESS_TOKEN = 'UPDATE_ACCESS_TOKEN'
export const DISPLAY_WARNING_MODAL = 'DISPLAY_WARNING_MODAL'

export const requestLogin = createAction(REQUEST_LOGIN)
export const receiveLogin = createAction<string | null>(RECEIVE_LOGIN)
export const logoutClearState = createAction(LOGOUT_CLEAR_STATE)
export const updateAccessTokenAction = createAction<string>(UPDATE_ACCESS_TOKEN)
export const displayWarningModal = createAction<boolean>(DISPLAY_WARNING_MODAL)

export const login = (username: string, password: string) => async (
  dispatch: ThunkDispatch<SessionState, void, AnyAction>
) => {
  dispatch(requestLogin())
  try {
    const response = await UserApi.userLogin({
      username,
      password,
    })

    const accessToken = response.headers[ACCESS_TOKEN_HEADER]

    dispatch(updateAccessToken(accessToken))
    dispatch(receiveLogin(accessToken))
  } catch (e) {
    dispatch(receiveLogin(null))
    throw e
  }
}

export const logout = () => (
  dispatch: ThunkDispatch<SessionState, void, AnyAction>
) => {
  localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN)
  localStorage.removeItem(AGREED_LEGAL_DISCLAIMER)
  dispatch(logoutClearState())
  navigate('/')
}

export const forceLogout = () => (
  dispatch: ThunkDispatch<SessionState, void, AnyAction>
) => {
  localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN)
  localStorage.removeItem(AGREED_LEGAL_DISCLAIMER)
  dispatch(logoutClearState())
}

export const updateAccessToken = (accessToken: string) => (
  dispatch: ThunkDispatch<SessionState, void, AnyAction>
) => {
  localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, accessToken)
  dispatch(updateAccessTokenAction(accessToken))
}
