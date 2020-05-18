import { Action, handleActions } from 'redux-actions'
import { LOCAL_STORAGE_ACCESS_TOKEN } from '../../constants/state'
import {
  DISPLAY_WARNING_MODAL,
  LOGOUT_CLEAR_STATE,
  RECEIVE_LOGIN,
  REQUEST_LOGIN,
  UPDATE_ACCESS_TOKEN,
} from '../actions/sessionActions'

export interface SessionState {
  isLoggedIn: boolean
  isLoggingIn: boolean
  isLogoutWarningDisplayed: boolean
  accessToken?: string | null
}

const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN)

export const sessionInitialState: SessionState = {
  isLoggedIn: !!accessToken,
  isLoggingIn: false,
  isLogoutWarningDisplayed: false,
  accessToken,
}

const sessionReducer = handleActions<SessionState, any>(
  {
    [REQUEST_LOGIN]: (state: SessionState): SessionState => ({
      ...state,
      isLoggingIn: true,
    }),

    [RECEIVE_LOGIN]: (
      state: SessionState,
      action: Action<string | null>
    ): SessionState => ({
      ...state,
      isLoggedIn: !!action.payload,
      isLoggingIn: false,
      accessToken: action.payload,
    }),

    [LOGOUT_CLEAR_STATE]: (state: SessionState): SessionState => ({
      ...state,
      isLoggedIn: false,
      accessToken: null,
    }),

    [UPDATE_ACCESS_TOKEN]: (
      state: SessionState,
      action: Action<string>
    ): SessionState => ({
      ...state,
      accessToken: action.payload,
    }),

    [DISPLAY_WARNING_MODAL]: (
      state: SessionState,
      action: Action<boolean>
    ): SessionState => ({
      ...state,
      isLogoutWarningDisplayed: action.payload,
    }),
  },

  sessionInitialState
)

export default sessionReducer
