import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginationModel } from 'src/app/shared/models/commons/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class SurveyPropertyService {

  readonly SERVER: string = environment.server + '/survey/api'

  constructor(
    private httpClient: HttpClient
  ) { }

  create(params: any): Observable<any> {
    return this.httpClient.post(`${this.SERVER}/survey-attributes`, params)
  }

  detail(id: number): Observable<any> {
    return this.httpClient.get(`${this.SERVER}/survey-attributes/${id}`)
  }

  search(paging: PaginationModel, params: any): Observable<any> {
    return this.httpClient.post(`${this.SERVER}/survey-attributes/search?page=${paging.pageIndex}&size=${paging.pageSize}&sort=${paging.sortField},${paging.direction}`, params)
  }

  delete(ids: number[]): Observable<any> {
    return this.httpClient.put(`${this.SERVER}/survey-attributes`, ids)
  }

  getAll(): Observable<any> {
    return this.httpClient.get(`${this.SERVER}/survey-attributes/get-all-active`)
  }

}
