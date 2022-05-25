import { TOKEN } from './../../shared/constants/store.const';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/users/auth.service';
import { LANGUAGES_DATA, STORAGE_KEYS } from 'src/app/shared/constants/system.const';
import { AuthUtilsService } from 'src/app/shared/utilities/auth.utils.service';

@Component({
  selector: 'vt-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  readonly LANGUAGES_DATA: any = LANGUAGES_DATA
  isLoading: boolean = false
  isHadError: boolean = false
  language:any = LANGUAGES_DATA[0].value;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private authUtilsService: AuthUtilsService
  ) { }

  ngOnInit(): void {
    this.clearStorage()
    this.form = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
    if(localStorage.getItem('LANGUAGE')){
      this.language = localStorage.getItem('LANGUAGE');
    }
  }

  submitForm(): void {
    if (this.form.valid) {
      let fValue = this.form.value
      this.isLoading = true
      this.isHadError = false

      this.authService.authenticate(fValue.userName, fValue.password).subscribe(response => {
        this.authSuccess(response, fValue.remember)
        this.authUtilsService.checkAuthenticated()
        this.router.navigate(['/'])
        this.isLoading = false
      }, errors => {
        this.isLoading = false
        this.isHadError = true
      })
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  authSuccess(token: any, isRememberMe: boolean = false) {
    let roles = ['ADMIN', 'MANAGE', 'PRODUCT']
    if (isRememberMe) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(null))
      localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles))
      localStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(token))
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, this.language)
    } else {
      sessionStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(null))
      sessionStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles))
      sessionStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(token))
      sessionStorage.setItem(STORAGE_KEYS.LANGUAGE, this.language)
    }
  }

  clearStorage(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
    localStorage.removeItem(STORAGE_KEYS.ROLES)
    localStorage.removeItem(STORAGE_KEYS.TOKEN)

    sessionStorage.removeItem(STORAGE_KEYS.USER_DATA)
    sessionStorage.removeItem(STORAGE_KEYS.ROLES)
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN)
    this.authUtilsService.checkAuthenticated()
  }

}
