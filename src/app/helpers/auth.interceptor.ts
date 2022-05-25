import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthUtilsService } from '../shared/utilities/auth.utils.service';
import { HandleRequestService } from './handle-request.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authUtilsService: AuthUtilsService,
    private router: Router,
    // private handleRequestService: HandleRequestService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authUtilsService.getToken()
    const language = this.authUtilsService.getLanguage()

    // let header: Headers = new Headers()
    // header.append('Content-Type', 'application/json')
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
          'Accept-Language': language
        }
      });
    }
    return next.handle(request).pipe(tap(null, (errors: HttpErrorResponse) => {
      if (errors.status === 401 && errors.error.error_description.indexOf('Access token expired') >= -1) {
        this.router.navigate(['/login'])
      }
      // this.handlerError(errors)
      // this.handleRequestService.handleError(errors)
    }))
  }

  // handlerError(errors: HttpErrorResponse): void {
  //   if (errors.error) {
  //     const message = errors.error.message
  //     if (message) {
  //       this.notification.error(this.translateService.instant('common.error'), message)
  //     }
  //   }
  // }
}
