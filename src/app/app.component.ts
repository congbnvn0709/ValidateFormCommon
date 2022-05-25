import { DATE_FORMAT, DATE_FORMAT_EN, DATE_FORMAT_VI } from './shared/constants/format.const';
import { TranslateService } from '@ngx-translate/core';
import { ROUTERS } from './shared/constants/router.const';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationStart, NavigationEnd, Router } from '@angular/router';
import { AuthUtilsService } from './shared/utilities/auth.utils.service';
import { LANGUAGES_DATA } from './shared/constants/system.const';
@Component({
  selector: 'vt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly ROUTERS = ROUTERS
  currentLang: any

  isSinglePage: boolean = false
  isCollapsed: boolean = false
  activeKey = ''

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private authUtilsService: AuthUtilsService
  ) {
    this.activatedRoute.url.subscribe((data: any) => {
      this.checkIsSinglePage()
    })
  }

  translateFn = (key: string) => {
    if (!key) return ''
    return this.translate.instant(key)
  };

  ngOnInit(): void {
    this.authUtilsService.checkAuthenticated()
    this.getCurrentLang()
  }

  getCurrentLang(): void {
    let languageValue = this.authUtilsService.language || LANGUAGES_DATA[0].value
    this.currentLang = LANGUAGES_DATA.find(s => s.value === languageValue)

    this.translate.use(this.currentLang.value);
    this.translate.getTranslation(this.currentLang.value);
    this.initFormat(this.currentLang.value)
  }

  checkIsSinglePage(): void {
    this.router.events.subscribe((event: any) => {
      if (event instanceof ActivationStart) {
        this.activeKey = event.snapshot.data['activeKey']
      }
      if (event instanceof NavigationEnd) {
        this.isSinglePage = event.url.indexOf('login') != -1
      }
    });
  }

  /**
  * Description: Init website fomat by language
  */
  initFormat(lang: string): void {
    switch (lang) {
      case LANGUAGES_DATA[0].value: {
        Object.keys(DATE_FORMAT_VI).forEach((key: string) => {
          DATE_FORMAT[key] = DATE_FORMAT_VI[key]
        })
        break;
      }
      case LANGUAGES_DATA[1].value: {
        Object.keys(DATE_FORMAT_EN).forEach((key: string) => {
          DATE_FORMAT[key] = DATE_FORMAT_EN[key]
        })
        break;
      }
    }
  }
}
