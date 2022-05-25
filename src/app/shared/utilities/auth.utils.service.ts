import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Injectable, OnDestroy } from '@angular/core';
import { STORAGE_KEYS } from '../constants/system.const';
import * as userAction from '../stores/user-stores/user.action'
import jwt_decode from "jwt-decode";
import { interval, Subscription, timeInterval } from 'rxjs';
import { SafeSubscriber } from 'rxjs/internal/Subscriber';

@Injectable({
  providedIn: 'root'
})
export class AuthUtilsService implements OnDestroy {
  userData: any = null
  isAuthenticated: boolean = false
  token: any
  roles: string[] = []
  language: string = ''
  clearInterval: Subscription = new Subscription()

  constructor(
    private store: Store,
    private router: Router
  ) { }

  checkAuthenticated(): void {
    let storageData = localStorage.getItem(STORAGE_KEYS.USER_DATA) || sessionStorage.getItem(STORAGE_KEYS.USER_DATA) || null
    let tokenInfo = localStorage.getItem(STORAGE_KEYS.TOKEN) || sessionStorage.getItem(STORAGE_KEYS.TOKEN)
    let roles: any = localStorage.getItem(STORAGE_KEYS.ROLES) || sessionStorage.getItem(STORAGE_KEYS.ROLES)
    this.language = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || sessionStorage.getItem(STORAGE_KEYS.LANGUAGE) || ''
    if (storageData) {
      this.userData = JSON.parse(storageData)
    }
    if (tokenInfo) {
      this.token = JSON.parse(tokenInfo)
      this.checkIsExpired()
      this.clearInterval = interval(15000).subscribe(() => {
        this.checkIsExpired()
      })
      this.isAuthenticated = true
    } else {
      this.router.navigateByUrl('/login')
    }
    if (roles) {
      this.roles = JSON.parse(roles)
    }

    // Store dữ liệu, tạm thời không dùng đến
    this.store.dispatch(userAction.authenticatedAction({
      payload: this.isAuthenticated
    }))
    this.store.dispatch(userAction.userAction({
      payload: this.userData
    }))
    this.store.dispatch(userAction.tokenAction({
      payload: this.token
    }))
    this.store.dispatch(userAction.languageAction({
      payload: this.language
    }))
    this.store.dispatch(userAction.rolesAction({
      payload: this.roles
    }))
  }

  /**
  * Description: Check token is expired or not
  */
  checkIsExpired(): void {
    let decoded: any = jwt_decode(this.token.access_token);
    let newTime = Math.floor(Date.now()/1000)
    if (decoded.exp <= newTime) {
      this.router.navigateByUrl('/login')
    }
  }

  getToken(): string {
    let tokenInfo: any = localStorage.getItem(STORAGE_KEYS.TOKEN) || sessionStorage.getItem(STORAGE_KEYS.TOKEN)
    if (tokenInfo) {
      tokenInfo = JSON.parse(tokenInfo)
      return tokenInfo.access_token
    }
     return ''
  }

  getLanguage(): string {
    let lang: string = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || sessionStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'vi'
     return lang
  }

  checkUserHaveAnyRole(roles: string[]): boolean {
    let result = this.roles.some((authority: string) => roles.includes(authority));
    return result
  }

  ngOnDestroy(): void {
    this.clearInterval.unsubscribe()
  }
}
