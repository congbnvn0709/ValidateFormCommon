import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationModel } from 'src/app/shared/models/commons/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  readonly SERVER: string = environment.server + '/survey/api'

  constructor(
    private httpClient: HttpClient
  ) { }

  create(params: any): Observable<any> {
    return this.httpClient.post(`${this.SERVER}/survey-forms`, params)
  }

  detail(id: number): Observable<any> {
    return this.httpClient.get(`${this.SERVER}/survey-forms/${id}`)
  }

  search(paging: PaginationModel, params: any): Observable<any> {
    return this.httpClient.post(`${this.SERVER}/survey-forms/search?page=${paging.pageIndex}&size=${paging.pageSize}&sort=${paging.sortField},${paging.direction}`, params)
  }

  delete(ids: number[]): Observable<any> {
    return this.httpClient.put(`${this.SERVER}/survey-forms`, ids)
  }

}
