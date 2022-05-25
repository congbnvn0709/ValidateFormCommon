import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class HandleRequestService {

  constructor(
    private notification: NzNotificationService,
    private translateService: TranslateService
  ) { }

  handleError(errors: HttpErrorResponse): void {
    if (errors.error) {
      const message = errors.error.message
      if (message) {
        this.notification.error(this.translateService.instant('common.error'), message)
      }
    }
  }
}
