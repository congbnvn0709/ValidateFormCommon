import { LANGUAGES_DATA, MODES } from '../../shared/constants/system.const';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  Injector
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthUtilsService } from 'src/app/shared/utilities/auth.utils.service';
import { DATE_FORMAT, DATE_FORMAT_EN, DATE_FORMAT_VI } from 'src/app/shared/constants/format.const';

export abstract class BaseAbstractComponent {
  protected router: Router
  protected http: HttpClient
  protected authUtilsService: AuthUtilsService

  readonly SERVER: string = environment.server + '/survey/api'
  readonly modes = MODES

  FORMAT: any = DATE_FORMAT

  public constructor(
    protected injector: Injector
  ) {
    this.router = injector.get(Router)
    this.http = injector.get(HttpClient)
    this.authUtilsService = injector.get(AuthUtilsService)
  }

}
