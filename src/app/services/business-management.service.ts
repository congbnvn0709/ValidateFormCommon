import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaginationModel } from '../shared/models/commons/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessManagementService {
  readonly SERVER: string = environment.server
constructor(private httpClient: HttpClient) { }
  searchBusiness(paging: PaginationModel, params: any): Observable<any> {
    // let param = '';
    // param += `?page=${paging.pageIndex}&size=${paging.pageSize}&sort=${paging.sortField},${paging.direction}`
    return this.httpClient.post(`${this.SERVER}/survey/api/survey-businesses/search`, params)
  }
  createBusiness(body:any){
    return this.httpClient.post(`${this.SERVER}/survey/api/survey-businesses`,body)
  }
  deleteBusiness(id:any): Observable<any>{
    return this.httpClient.put(`${this.SERVER}/survey/api/survey-businesses`, id)
  }
  detailBusiness(id:any){
    return this.httpClient.get(`${this.SERVER}/survey/api/survey-businesses/` + id)
  }
  editBusiness(body:any){
    return this.httpClient.put(`${this.SERVER}/survey/api/survey-businesses/update`, body)
  }
  activeSurveyAttr(){
    return this.httpClient.get(`${this.SERVER}/survey/api/survey-attributes/get-all-active`)
  }
  activeSurveyForm(){
    return this.httpClient.get(`${this.SERVER}/survey/api/survey-forms/get-all-active`)
  }
}