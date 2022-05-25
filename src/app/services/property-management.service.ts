import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationModel } from '../shared/models/commons/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyManagementService {
  readonly SERVER: string = environment.server
constructor(private httpClient: HttpClient) { }

  getSurveyProperty(paging: PaginationModel, params: any): Observable<any> {
    let param = '';
    param += `?page=${paging.pageIndex}&size=${paging.pageSize}&sort=${paging.sortField},${paging.direction}`
    return this.httpClient.post(`${this.SERVER}/survey/api/survey-attributes/search` + param, params)
  }
  postSurveyProperty(body:any){
    return this.httpClient.post(`${this.SERVER}/survey/api/survey-attributes`, body)
  }
  getDetailSurveyProperty(id:any){
    return this.httpClient.get(`${this.SERVER}/survey/api/survey-attributes/`+ id);
  }
  editSurveysProperty(body:any){
    return this.httpClient.put(`${this.SERVER}/survey/api/survey-attributes/`, body)
  }
  deleteSurveysProperty(id:any){
    return this.httpClient.delete(`${this.SERVER}/survey/api/survey-attributes/` + id)
  }
  getTypeData(){
    return this.httpClient.get(`${this.SERVER}/survey/api/survey-attributes/get-data-type`)
  }
}
