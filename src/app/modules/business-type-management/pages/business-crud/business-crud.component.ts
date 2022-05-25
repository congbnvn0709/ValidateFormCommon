import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { timer } from 'rxjs';
import { CrudAbstractComponent } from 'src/app/layouts/abstracts/crud.abstract.component';
import { BusinessManagementService } from 'src/app/services/business-management.service';
import { ROUTERS } from 'src/app/shared/constants/router.const';
import { ACTION_KEYS, SYSTEM_KEYS, TABLE_KEYS } from 'src/app/shared/constants/system.const';
import { ActionColumnModel } from 'src/app/shared/models/commons/action-column.model';
import { ActionResponseModel } from 'src/app/shared/models/commons/action-response.model';
import { ConfigColumnModel } from 'src/app/shared/models/commons/config-column.model';
import { ConfirmDialogModel } from 'src/app/shared/models/commons/confirm-dialog.model';
import { PaginationModel } from 'src/app/shared/models/commons/pagination.model';
import { ListAttributeManagement } from 'src/app/shared/models/surveys/business-management/business-type-management.model';
import { LIST_ATTRIBUTE } from '../../utils/business.utils';

@Component({
  selector: 'vt-business-crud',
  templateUrl: './business-crud.component.html',
  styleUrls: ['./business-crud.component.scss']
})
export class BusinessCrudComponent extends CrudAbstractComponent implements OnInit {
  self = this;
  businessID:string;
  isAdd:boolean;
  isEdit:any;
  setOfCheckedId = new Set<number>();
  columnData = LIST_ATTRIBUTE;
  dataSource: ListAttributeManagement[] = [];
  actions: ActionColumnModel[] = [];
  pagination: PaginationModel = new PaginationModel();
  paging = _.cloneDeep(this.pagination);
  params = {};
  lengthPageAttr:any;
  @ViewChild('input', { static: false })
   set input(element: ElementRef<HTMLInputElement>) {
     if(element) {
       element.nativeElement.focus()
     }
  }
  listScenario:any = [];
  listAttribute:any = [];
  panels = [
    {
      active: true,
      name: this.translateService.instant('business.list_attribute_business'),
      disabled: false
    }
  ];
  checkAttrDuplicate:any = [];
  dataAttr:any = [];
  isVisible = false;
  isFormAtt: any = [];
  isCheckFilterEdit:any = [];
  isCheckFilterCreate:any = [];
  dtAllListAttr:any = [];
  idEditAttr:any = undefined;
  isEditAttr: boolean = true;
  checkDataAtt:any; // value data edit attribute
  addAttForm: FormGroup;

  constructor(private route: ActivatedRoute,
    injector: Injector,
    private businessManagementService: BusinessManagementService,
    private fb: FormBuilder,
    ) { 
      super(injector)
      this.businessID = this.route.snapshot.params['id'];
      this.isAdd = !this.businessID;
      this.getListScenario();
      this.getListAttribute();
      if(!this.isAdd){
        this.initGetInforAricles(this.businessID);
        if(this.router.url.indexOf(ROUTERS.BUSINESS_VIEW) >-1){
          this.isEdit = true;
        }else{
          this.isEdit = false;
        }
      }
      this.form = this.fb.group({
        business_type: [null, Validators.required],
        scenario: [null, Validators.required],
        business_code: [null, Validators.required],
        business_name: [null, Validators.required],
        business_frequency: [null, Validators.required],
        status: ['1', Validators.required],
      });
      this.addAttForm = this.fb.group({
        attList: this.fb.array([]) 
      })
  }
  ngOnInit() {
    this.initData();
    this.initFormat();
  }
  initData(): void {
    this.actions = [
      {
        icon: 'edit',
        tooltip: 'common.edit',
        type: 'link',
        actionKey: ACTION_KEYS.EDIT
      },
      {
        icon: 'delete',
        tooltip: 'common.delete',
        type: 'link',
        actionKey: ACTION_KEYS.DELETE
      }
    ]
  }
  initFormat(): void {
    this.columnData.map((column: ConfigColumnModel) => {
      if (column.type === TABLE_KEYS.DATE) {
        column.format = this.FORMAT.DATE;
      }
    })
  }
  getListScenario(){
    this.paging.pageIndex = this.paging.pageIndex - 1
    this.paging.sortField = this.paging.sortField || 'lastModifiedDate'
    this.paging.direction = this.paging.direction || 'DESC'
    this.businessManagementService.activeSurveyForm().subscribe((res:any) => {
      this.listScenario = res.sort((a:any,b:any) => a.surveyFormCode.localeCompare(b.surveyFormCode));
    })
  }
  getListAttribute(){
    this.paging.pageIndex = this.paging.pageIndex - 1
    this.paging.sortField = this.paging.sortField || 'lastModifiedDate'
    this.paging.direction = this.paging.direction || 'DESC'
    this.isLoading = true
    this.businessManagementService.activeSurveyAttr().subscribe((res:any) => {
        if (res) {
        this.listAttribute = res.sort((a:any,b:any) => a.attCode.localeCompare(b.attCode));
        this.checkAttrDuplicate = res.sort((a:any,b:any) => a.attCode.localeCompare(b.attCode));
      }
    }, null, () => {
        this.isLoading = false;
      });
  }
  showModalAttribute(): void {
    this.onAddAnswer();
    this.isVisible = true;
  }
  changeCustomer(even:any, index:number){
    let attr = this.listAttribute.find((item:any) => item.attId == even);
    let attGroup = this.attListValue.controls[index] as FormGroup;
    attGroup.controls['attValue'].patchValue(null);
    attGroup.controls['typeAtt'].patchValue(attr?.dataType);
    this.funtionFilterAttr();
  }
  onAddAnswer(){
    this.isFormAtt = this.attListValue.controls;
    this.attListValue.push(this.newSkill());
    this.funtionFilterAttr();
  }
  newSkill(): FormGroup {
    return this.fb.group({
      attId: [null, Validators.required],
      attValue: [null, Validators.required],
      typeAtt: 'TEXT_TYPE'
    })
  }
  get attListValue() : FormArray {
    return (this.addAttForm.get("attList") as FormArray);
  }
  initGetInforAricles(id:any){
    this.businessManagementService.detailBusiness(id).subscribe((res:any) => {
      this.dataAttr = res.surveyAttributeList;
      this.form.setValue({
        business_type: res.businessType,
        scenario: res.surveyFormId,
        business_code: res.businessCode.toUpperCase(),
        business_name: res.businessName,
        business_frequency: res.frequencyInDay,
        status: res.status?.toString(),
      })
      for(let item of  res.surveyAttributeList){
        let date:any;
        let checkDate:any = new Date(item.attValue);
        if(checkDate == 'Invalid Date'){
          date = item.attValue;
        }else{
          let num:any = Number(item.attValue).toString();
          if( num == 'NaN'){
              date = moment(item.attValue).format(this.FORMAT.DATE_MOMENT);
          }else{
              date = item.attValue;
          }
        }
        let attr = this.listAttribute?.find((att:any) => att.attId == item.attId)
        let add2:any = [
          {
              "businessDetailId": item.businessDetailId,
              "attCode": attr?.attCode,
              "attId": item.attId,
              "attName": attr?.attName,
              "attValue": date,
              "status": item.status,
          }
        ]     
        this.checkAttrDuplicate = this.checkAttrDuplicate.filter((elm:any) => elm.attId != item.attId)
        this.lengthPageAttr  = [...add2, ...this.lengthPageAttr];
        this.dtAllListAttr  = [...add2, ...this.dtAllListAttr];
      }
      this.dataSource = res.surveyAttributeList;
      this.lengthPageAttr = this.dtAllListAttr.slice(0, 10);
      this.pagination.total = this.dataSource.length;
    })
  }
  tableQueryParamsChange(event: string): void {
    let paging = _.cloneDeep(this.pagination);
    if(paging.pageIndex == 1){
      this.lengthPageAttr = this.dtAllListAttr.slice(0, paging.pageSize);
    }else{
      if(this.dtAllListAttr.length <= 10){
        this.lengthPageAttr = this.dtAllListAttr.slice(0, this.dtAllListAttr.length);
      }else{
        this.lengthPageAttr = this.dtAllListAttr.slice(paging.pageSize*paging.pageIndex - paging.pageSize, paging.pageSize* paging.pageIndex);
      }
    }
    for(let item of this.lengthPageAttr ){
        let checkDate:any = new Date(item.attValue);
        if(checkDate == 'Invalid Date'){
          item.attValue = item.attValue;
        }else{
          let num:any = Number(item.attValue).toString();
          if( num == 'NaN'){
              item.attValue = moment(item.attValue).format(this.FORMAT.DATE_MOMENT);
          }else{
              item.attValue = item.attValue;
          }
        }
    }
  }
  onTriggerActionKey(event: ActionResponseModel): void {
    switch (event.actionKey) {
      case ACTION_KEYS.EDIT: {
        this.editRecord(event.data)
        break;
      }
      case ACTION_KEYS.DELETE: {
        this.deleteRecord(event.data)
        break;
      }
    }
  }
  editRecord(data: ListAttributeManagement): void {
    if(this.isEdit && !this.isAdd){
      return;
    }
    this.onAddAnswer();
    let attr = this.listAttribute.find((item:any) => item.attId == data.attId);
    let valueDate:any = this.dataSource.find((item:any) => item?.businessDetailId == data?.businessDetailId);
    timer(100).subscribe(() => {
      let attGroup = this.attListValue.controls[0] as FormGroup;
      attGroup.controls['attId'].patchValue(data.attId);
      attGroup.controls['attValue'].patchValue(valueDate.attValue);
      attGroup.controls['typeAtt'].patchValue(attr.dataType);
    })
    if(!this.isEdit && !this.isAdd){
      if(data.businessDetailId){
        this.idEditAttr = data.businessDetailId;
      }
    }else if(this.isAdd){
        this.lengthPageAttr = this.dtAllListAttr.slice(0, 10);
        this.pagination.total = this.dtAllListAttr.length;
    }
    this.checkAttrDuplicate.push(attr);
    this.checkDataAtt = data;
    this.isEditAttr = false;
    this.isVisible = true;
  }
  deleteRecord(data: ListAttributeManagement): void {
    if(this.isEdit && !this.isAdd){
      return
    }
    if(!this.isEdit && !this.isAdd){
      this.dataSource.forEach((item:any) => {
        if(item.businessDetailId ){
          if(item.businessDetailId == data.businessDetailId){
            item.status = -1;
          }
        }else{
          if(item.attCode == data.attCode &&  item.attId == data.attId && item.attName == data.attName && item.attValue == data.attValue){
            this.dataSource = this.dataSource.filter(elm => elm !== item);
          }
        }
      })
    }
     if(this.isAdd){
      this.dataSource = this.dataSource.filter((item:any) => item.attId != data.attId);
    }
      this.dtAllListAttr = this.dtAllListAttr.filter((elm:any) => elm.attId !== data.attId);
      this.lengthPageAttr = this.dtAllListAttr.slice(0, 10);
      this.pagination.total = this.dtAllListAttr.length;
  }
  deleteListAttr(){
    let contentMessage: ConfirmDialogModel = {
      content: this.translateService.instant('business.business_confirm_delete_attr')
    }
    let modal: NzModalRef = this.dialogService.openDialogConfirm(contentMessage)
    modal.afterClose.subscribe((response: string) => {
      if (response === SYSTEM_KEYS.AGREE) {
        let dataPickKey = [...this.setOfCheckedId];
        if(!this.isEdit && !this.isAdd){
          dataPickKey.forEach((elm:any) => {  
            this.dataSource.forEach((item:any) => {
              if(item.attId == elm && item.businessDetailId != 'null'){
                item.status = -1;
              }else if(item.attId == elm && item.businessDetailId == null){
                this.dataSource = this.dataSource.filter((items:any) => items.attId != elm);
              }
            })
            this.dtAllListAttr = this.dtAllListAttr.filter((items:any) => items.attId !== elm);
          });
          this.handleNextPage();
        }else if(this.isAdd){
          dataPickKey.forEach((elm:any) => {
            this.dataSource = this.dataSource.filter((item:any) => item.attId != elm);
            this.dtAllListAttr = this.dtAllListAttr.filter((item:any) => item.attId != elm);
          });
          this.handleNextPage();
        }
        this.pagination.total = this.dtAllListAttr.length;
        this.checkAttrDuplicate = this.listAttribute;
        for(let item of this.lengthPageAttr){
          this.checkAttrDuplicate = this.checkAttrDuplicate.filter((elm:any) => elm.attId != item.attId);
        }
        this.setOfCheckedId = new Set<number>();
      }
    })
  }
  handleNextPage(){
    let paging = _.cloneDeep(this.pagination);
    let i = 0;
    let j = 10
    if(paging.pageIndex == 1){
      this.lengthPageAttr = this.dtAllListAttr.slice(i,j);
    }else{
      if(j > this.dtAllListAttr.length){
        this.lengthPageAttr = this.dtAllListAttr.slice(i, this.dtAllListAttr.length);
      }else{
        i = i + paging.pageIndex*10 - 10;
        j = j*paging.pageIndex;
        this.lengthPageAttr = this.dtAllListAttr.slice(i,j)
      }
    }
  }
    handleCancel(): void {
      this.attListValue.controls = [];
      this.isVisible = false;
      this.isEditAttr = true;
    }
    handleOk(): void {
    if (this.addAttForm.controls['attList'].invalid) {
      this.addAttForm.markAllAsTouched();
      return
    }
    let findDataSourch:any = undefined;
    if(this.idEditAttr){
      findDataSourch = this.dataSource.find(item => item.businessDetailId == this.idEditAttr);
    }
    for(let item of this.addAttForm.value.attList){
      let attr = this.listAttribute.find((att:any) => att.attId == item.attId);
      let add:any = [
        {
            "businessDetailId": null,
            "attCode": attr?.attCode,
            "attId": item.attId,
            "attName": attr?.attName,
            "status": 1,
        }
      ]
      let attrVal:any;
      if(item.typeAtt == 'DATETIME_TYPE'){
          attrVal = moment(item.attValue).toISOString()
      }else{
        attrVal = item.attValue;
      }
      if(findDataSourch){
        this.dataSource.forEach((elm:any) => {
          if(elm.businessDetailId == this.idEditAttr){
            elm.attValue = attrVal;
            elm.attId = attr?.attId;
            elm.attCode = attr?.attCode;
            elm.attName = attr?.attName
          }
        })
        this.lengthPageAttr.forEach((elm:any) => {
          if(elm.businessDetailId == this.idEditAttr){
            elm.attValue = attrVal;
            elm.attId = attr?.attId;
            elm.attCode = attr?.attCode;
            elm.attName = attr?.attName
          }
        })
      }else{
        this.dataSource = this.dataSource.filter(item => item !== this.checkDataAtt);
        this.lengthPageAttr = this.lengthPageAttr.filter((item:any) => item !== this.checkDataAtt);
        this.dataSource = this.dataSource.filter(item => item !== this.checkDataAtt);
        this.dataSource = [{...add[0], 'attValue' : attrVal}, ...this.dataSource];
        let checkDate:any = new Date(attrVal);
        if(checkDate == 'Invalid Date'){
          add = {...add[0], 'attValue' : attrVal};
        }else{
          let num:any = Number(attrVal).toString();
          if( num == 'NaN'){
            add = {...add[0], 'attValue' : moment(attrVal).format(this.FORMAT.DATE_MOMENT)};
          }else{
            add = {...add[0], 'attValue' : attrVal};
          }
        }
        this.lengthPageAttr = [add, ...this.lengthPageAttr];
        this.dtAllListAttr = [add, ...this.dtAllListAttr];
      }
      this.lengthPageAttr = this.dtAllListAttr.slice(0, 10);
      this.pagination.total = this.dtAllListAttr.length;
    }
    this.attListValue.controls = [];
    this.isVisible = false;
    this.isEditAttr = true;
    this.idEditAttr = undefined;
    this.checkDataAtt = undefined;
  }
  numberOnly(event:any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
   onRemove(index:any, item:any){
    this.attListValue.removeAt(index);
    this.funtionFilterAttr();
  }
  funtionFilterAttr(){
    this.checkAttrDuplicate = this.listAttribute;
    for(let item of this.dtAllListAttr){
      this.checkAttrDuplicate = this.checkAttrDuplicate.filter((elm:any) => elm.attId != item.attId);
    }
    for(let item of this.attListValue.value){
      this.checkAttrDuplicate = this.checkAttrDuplicate.filter((elm:any) => elm.attId !== item.attId);
      this.checkAttrDuplicate =  this.checkAttrDuplicate.sort((a:any,b:any) => a.attCode.localeCompare(b.attCode));
    }
  }
  override onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    let controls = this.form.value;
    let body:any = {
      "businessId": null,
      "businessCode": controls.business_code?.toUpperCase(),
      "businessType": controls.business_type,
      "businessName": controls.business_name,
      "surveyFormId": controls.scenario,
      "frequencyInDay": controls.business_frequency,
      "surveyAttributeList": this.dataSource,
      "status": controls.status
    }
    if(this.isAdd){
      let contentMessage: ConfirmDialogModel = {
        content: this.translateService.instant('business.business_save_confirm')
      }
      let modal: NzModalRef = this.dialogService.openDialogConfirm(contentMessage)
      modal.afterClose.subscribe((response: any) => {
        if (response === SYSTEM_KEYS.AGREE) {
          for(let item of this.dataSource){
            delete item.attName;
            delete item.attCode;
          }
          this.businessManagementService.createBusiness(body).subscribe((res:any) => {
            this.router.navigate([`${ROUTERS.BUSINESS_TYPE}/${ROUTERS.BUSINESS_EDIT}/${res.businessId}`])
            this.notification.success(this.translateService.instant('common.success'), this.translateService.instant('business.business_save_success'));
          },(err:any) => {
            this.notification.error(this.translateService.instant('common.error'), this.translateService.instant(`${err.error.message}`))
          });
        }
      })
    }else {
      if(this.isEdit == true){
        this.router.navigate([`${ROUTERS.BUSINESS_TYPE}`]);
        return;
      }else{
        body.businessId = this.businessID;
        let contentMessage: ConfirmDialogModel = {
          content: this.translateService.instant('business.business_save_confirm')
        }
        let modal: NzModalRef = this.dialogService.openDialogConfirm(contentMessage)
        modal.afterClose.subscribe((response: string) => {
          if (response === SYSTEM_KEYS.AGREE) {
            for(let item of this.dataSource){
              delete item.attName;
              delete item.attCode;
            }
            this.businessManagementService.editBusiness(body).subscribe((res:any) => {
              this.dataSource = res.surveyAttributeList;
              this.notification.success(this.translateService.instant('common.success'), this.translateService.instant('business.business_save_success'));
            },(err:any) => {
              this.notification.error(this.translateService.instant('common.error'), this.translateService.instant(`${err.error.message}`))
            });
          }
        })
      }
    }
  }
}
