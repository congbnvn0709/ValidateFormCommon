import { LANGUAGE } from './shared/constants/store.const';
import { NZ_DATE_LOCALE, vi_VN } from 'ng-zorro-antd/i18n';
import { DialogService } from './shared/dialogs/dialog.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import vi from '@angular/common/locales/en';
import { enUS, vi as vi_fns } from 'date-fns/locale'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoginComponent } from './modules/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';

import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { AuthInterceptor } from './helpers/auth.interceptor';
import { AccessDeniedComponent } from './modules/access-denied/access-denied.component';
import { StoreModule } from '@ngrx/store';
import { userReducer } from './shared/stores/user-stores/user.reducer';
import { AntModule } from './shared/utilities/ant.modules';
import { DialogsModule } from './shared/dialogs/dialogs.module';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SharedModule } from './shared/shared.module';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { LANGUAGES_DATA } from './shared/constants/system.const';

registerLocaleData(vi);
registerLocaleData(en);

let language: string = localStorage.getItem('LANGUAGE') || sessionStorage.getItem('LANGUAGE') || LANGUAGES_DATA[0].value;

function getCurrenLangOfDatePicker(): any {
  let result: any = enUS
  switch (language) {
    case 'vi': {
      result = vi_fns
      break;
    }
    case 'en': {
      result = enUS
      break;
    }
  }
  return result
}

function getCurrentLanguageOfAnt(): any {
  let result: any = en_US
  switch (language) {
    case 'vi': {
      result = vi_VN
      break;
    }
    case 'en': {
      result = en_US
      break;
    }
  }
  return result
}


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NotFoundComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AccessDeniedComponent
  ],
  exports: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({
      userStore: userReducer
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: language
    }),
    AntModule,
    DialogsModule,
    NgxTrimDirectiveModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: NZ_I18N, useValue: getCurrentLanguageOfAnt() },
    { provide: NZ_DATE_LOCALE, useValue: getCurrenLangOfDatePicker() },
    DialogService,
    NzModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
//en_US
