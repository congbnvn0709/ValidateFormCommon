import { ChangeDetectorRef, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ManageAbstractComponent } from 'src/app/layouts/abstracts/manage.abstract.component';
import { BusinessManagementService } from 'src/app/services/business-management.service';
import { ROUTERS } from 'src/app/shared/constants/router.const';
import { ACTION_KEYS, SYSTEM_KEYS, TABLE_KEYS } from 'src/app/shared/constants/system.const';
import { DialogService } from 'src/app/shared/dialogs/dialog.service';
import { ActionColumnModel } from 'src/app/shared/models/commons/action-column.model';
import { ActionResponseModel } from 'src/app/shared/models/commons/action-response.model';
import { ConfigColumnModel } from 'src/app/shared/models/commons/config-column.model';
import { ConfirmDialogModel } from 'src/app/shared/models/commons/confirm-dialog.model';
import { PaginationModel } from 'src/app/shared/models/commons/pagination.model';
import { BusinessManagement } from 'src/app/shared/models/surveys/business-management/business-type-management.model';
import { BUSINESS_TYPE } from '../../utils/business.utils';

@Component({
  selector: 'vt-business-management',
  templateUrl: './business-management.component.html',
  styleUrls: ['./business-management.component.scss']
})
export class BusinessManagementComponent extends ManageAbstractComponent implements OnInit {
  self = this;
  setOfCheckedId = new Set<number>();
  columnData = BUSINESS_TYPE;
  dataSource: BusinessManagement[] = [];
  actions: ActionColumnModel[] = [];
  pagination: PaginationModel = new PaginationModel()
  @ViewChild('input', { static: false })
   set input(element: ElementRef<HTMLInputElement>) {
     if(element) {
       element.nativeElement.focus()
     }
  }
  body:any = {
    "businessId": null,
    "businessCode": null,
    "businessName": null,
    "businessType": null,
    "surveyFormSearch": null,
    "frequencyInDay": null,
    "pageNum": null,
    "pageSize": null,
    "sortField": null,
    "direction": null
  };
  listScenario:any = [];
  constructor(injector: Injector,
    private translateService: TranslateService,
    private businessManagementService: BusinessManagementService,
    private dialogService: DialogService,
    private notification: NzNotificationService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {
    super(injector);
    this.form = this.fb.group({
      id_business_type: [null],
      business_code: [null],
      business_name: [null],
      business_type: [null],
      business_frequency: [null],
      business_list_scenario: [null]
    });
   }
  ngOnInit() {
    this.initData(); 
    this.getListScenario();
    this.initFormat();
  }
  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
 }  
  initFormat(): void {
    this.columnData.map((column: ConfigColumnModel) => {
      if (column.type === TABLE_KEYS.DATE) {
        column.format = this.FORMAT.DATE
      }
    })
  }
  getListScenario(){
    let paging = _.cloneDeep(this.pagination)
    let params = {}
    paging.pageIndex = paging.pageIndex - 1
    paging.sortField = paging.sortField || 'lastModifiedDate'
    paging.direction = paging.direction || 'DESC'
    this.businessManagementService.activeSurveyForm().subscribe((res:any) => {
      this.listScenario = res.sort((a:any,b:any) => a.surveyFormCode.localeCompare(b.surveyFormCode));
    })
  }
  override onSubmit(): void {
    let controls = this.form.value
    this.body.businessId = controls.id_business_type
    this.body.businessCode = controls.business_code
    this.body.businessName = controls.business_name;
    this.body.businessType = controls.business_type;
    this.body.surveyFormSearch = controls.business_list_scenario;
    this.body.frequencyInDay = controls.business_frequency;
    this.loadDatasource();
  }
  override onCreate(): void {
    window.open(`${ROUTERS.BUSINESS_HASHTAG}${ROUTERS.BUSINESS_TYPE}/${ROUTERS.BUSINESS_CREATE}`, "_blank");
  }
  numberOnly(event:any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  initData(): void {
    this.listTitle = this.translateService.instant('business.list_type_business')
    this.actions = [
      {
        icon: 'file',
        tooltip: 'common.view',
        type: 'link',
        actionKey: ACTION_KEYS.VIEW
      },
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
  loadDatasource(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return
    }
    let paging = _.cloneDeep(this.pagination);
    // Lưu ý: index bắt đầu từ 0
    paging.pageIndex = paging.pageIndex - 1
    paging.sortField = paging.sortField || null
    paging.direction = paging.direction || null

    this.body.pageNum =  paging.pageIndex
    this.body.pageSize = paging.pageSize
    this.body.sortField =  paging.sortField
    this.body.direction = paging.direction
    this.isLoading = true
    this.businessManagementService.searchBusiness(paging, this.body).subscribe((response: any) => {
      if (response) {
        this.refactorDataToShow(response.data || [])
        this.pagination.total = response.total
        window.scrollTo(0, 0);
      }
    }, null, () => {
      this.isLoading = false;
    })
  }
  refactorDataToShow(data: BusinessManagement[]): void {
    this.dataSource = data.map((s:any, index) => {
      if (s.status === 1) {
        s.status = this.translateService.instant('survey.active')
      }else if(s.status === 0){
        s.status = this.translateService.instant('survey.inactive')
      }
      s.scenario = `${s.surveyFormDTO?.surveyFormCode}_${s.surveyFormDTO?.surveyFormName}`
      return s
    })
  }
  tableQueryParamsChange(event: string): void {
    this.loadDatasource();
  }
  viewRecord(data: BusinessManagement): void {
    this.router.navigate([`${ROUTERS.BUSINESS_TYPE}/${ROUTERS.BUSINESS_VIEW}/${data.businessId}`])
  }
  editRecord(data: BusinessManagement): void {
    // alert('edit')
    window.open(`${ROUTERS.BUSINESS_HASHTAG}${ROUTERS.BUSINESS_TYPE}/${ROUTERS.BUSINESS_EDIT}/${data.businessId}`, "_blank");
  }
  deleteRecord(data: BusinessManagement): void {
    let contentMessage: ConfirmDialogModel = {
      content: this.translateService.instant('business.business_confirm_delete',{
        businessType: data.businessType,
      })
    }
    let modal: NzModalRef = this.dialogService.openDialogConfirm(contentMessage)
    modal.afterClose.subscribe((response: string) => {
      // let id = [data.businessId]
      if (response === SYSTEM_KEYS.AGREE) {
        this.businessManagementService.deleteBusiness([data.businessId]).subscribe((dt:any) => {
          this.notification.success(this.translateService.instant('common.success'), this.translateService.instant('business.business_delete_success'))
          this.loadDatasource();
        }, (errors) => {
          console.log(errors)
        })
      }
    })
  }
  onTriggerActionKey(event: ActionResponseModel): void {
    switch (event.actionKey) {
      case ACTION_KEYS.VIEW: {
        this.viewRecord(event.data);
        break;
      }
      case ACTION_KEYS.EDIT: {
        this.editRecord(event.data);
        break;
      }
      case ACTION_KEYS.DELETE: {
        this.deleteRecord(event.data);
        break;
      }
    }
  }
  
}
