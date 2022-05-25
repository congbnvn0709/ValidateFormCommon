import { createAction, props } from "@ngrx/store"
import * as USER_STORE_CONST from './../../constants/store.const'

export const authenticatedAction = createAction(USER_STORE_CONST.IS_AUTHENTICATE, props<{ payload: boolean }>())
export const userAction = createAction(USER_STORE_CONST.USER_DATA, props<{ payload: any }>())
export const tokenAction = createAction(USER_STORE_CONST.TOKEN, props<{ payload: string }>())
export const languageAction = createAction(USER_STORE_CONST.LANGUAGE, props<{ payload: string }>())
export const rolesAction = createAction(USER_STORE_CONST.ROLES, props<{ payload: string[] }>())
