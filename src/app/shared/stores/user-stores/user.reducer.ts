import { UserStateModel } from '../../models/stores/user-state.model';
import * as USER_STORE_CONST from './../../constants/store.const'
import { ActionModel } from '../../models/stores/action.model';

const initAppState: UserStateModel = {
    isAuthenticated: false,
    userData: null,
    token: '',
    language: '',
    roles: []
}

export function userReducer(state: UserStateModel = initAppState, action: ActionModel) {
    switch (action.type) {
        case USER_STORE_CONST.IS_AUTHENTICATE: {
            // state.isAuthenticated = action.payload.isAuthenticated
            let isAuthenticated = action.payload
            return {...state, isAuthenticated}
            break
        }
        case USER_STORE_CONST.USER_DATA: {
            let userData = action.payload
            return {...state, userData}
            break
        }
        case USER_STORE_CONST.TOKEN: {
            let token = action.payload
            return {...state, token}
            break
        }
        case USER_STORE_CONST.LANGUAGE: {
            let language = action.payload
            return {...state, language}
            break
        }
        case USER_STORE_CONST.ROLES: {
            let roles = action.payload
            return {...state, roles}
            break
        }
        default:
            return state;
    }
}
