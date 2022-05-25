import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGES_DATA, STORAGE_KEYS } from 'src/app/shared/constants/system.const';
import { AuthUtilsService } from 'src/app/shared/utilities/auth.utils.service';

@Component({
  selector: 'vt-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  readonly LANGUAGES_DATA = LANGUAGES_DATA
  isVisible: boolean = false
  currentLang: any

  constructor(
    private router: Router,
    private translate: TranslateService,
    private authUtilsService: AuthUtilsService
  ) { }

  ngOnInit(): void {
    this.getCurrentLang()
  }

  getCurrentLang(): void {
    let languageValue = this.authUtilsService.language || this.LANGUAGES_DATA[0].value
    this.currentLang = this.LANGUAGES_DATA.find(s => s.value === languageValue)
  }

  onSetting() {
    this.isVisible = true
  }

  onChangeLanguage(value?: any) {
    if (value) this.currentLang = value
    // this.translate.setDefaultLang(this.currentLang.value);
    // this.translate.use(this.currentLang.value);
    // this.translate.getTranslation(this.currentLang.value);

    // Update storage
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, this.currentLang.value)
    sessionStorage.setItem(STORAGE_KEYS.LANGUAGE, this.currentLang.value)
    window.location.reload()
  }

  onLogout() {
    this.router.navigate(['/login'])
  }

  onCloseDrawer(): void {
    this.isVisible = false
  }
}
