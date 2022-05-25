import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly SERVER: string = environment.server

  constructor(
    private http: HttpClient
  ) { }

  authenticate(username: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.SERVER}/oauth/token?grant_type=password&username=${username}&password=${password}`, null, {
        headers: {
          Authorization: 'Basic ' + btoa("demo-client:123456a@")
        }
      }
    );
  }
}
