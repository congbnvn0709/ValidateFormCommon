import { Component, ElementRef, OnInit, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { PROPERTY_COLUMNS } from 'src/app/modules/survey/property-management/utils/surveys-property-utils';
import { PropertyManagementService } from 'src/app/services/property-management.service';
import { ManageAbstractComponent } from 'src/app/layouts/abstracts/manage.abstract.component';
import { ROUTERS } from 'src/app/shared/constants/router.const';
import { ACTION_KEYS, ACTIVE_STATUS_OPTION, SYSTEM_KEYS, TABLE_KEYS} from 'src/app/shared/constants/system.const';
import { DialogService } from 'src/app/shared/dialogs/dialog.service';
import { ActionColumnModel } from 'src/app/shared/models/commons/action-column.model';
import { ActionResponseModel } from 'src/app/shared/models/commons/action-response.model';
import { PaginationModel } from 'src/app/shared/models/commons/pagination.model';
import { SurveysPropertyManagement } from 'src/app/shared/models/surveys/surveys-property-management.model';
import { differenceInCalendarDays } from 'date-fns';
import * as _ from 'lodash'
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogModel } from 'src/app/shared/models/commons/confirm-dialog.model';
import { SystemUtilsService } from 'src/app/shared/utilities/system.utils.service';
import { ConfigColumnModel } from 'src/app/shared/models/commons/config-column.model';
import { timer } from 'rxjs';

@Component({
  selector: 'vt-property-manage',
  templateUrl: './property-manage.component.html',
  styleUrls: ['./property-manage.component.scss']
})
export class PropertyManageComponent extends ManageAbstractComponent implements OnInit {
  self = this
  dataSource: SurveysPropertyManagement[] = [];
  setOfCheckedId = new Set<number>();
  columnData = PROPERTY_COLUMNS;
  actions: ActionColumnModel[] = [];
  pagination: PaginationModel = new PaginationModel()
  dateFormat:any;
  body:any = {};
  dtProperty:any;
  today = new Date();
  todayAgo = new Date();
  readonly ACTIVE_STATUS_OPTION = ACTIVE_STATUS_OPTION
  dataDetail:any;
  language:any;
  @ViewChild('input', { static: false })
   set input(element: ElementRef<HTMLInputElement>) {
     if(element) {
       element.nativeElement.focus()
     }
  }
  constructor(private fb: FormBuilder,
    injector: Injector,
    private dialogService: DialogService,
    private propertyManagementService: PropertyManagementService,
    private notification: NzNotificationService,
    private translateService: TranslateService,
    private systemUtilsService: SystemUtilsService
    ) {
    super(injector);
    this.form = this.fb.group({
      attCode: [null],
      attName: [null],
      status: [null],
      dateFrom: [new Date(this.todayAgo.setMonth(this.todayAgo.getMonth()-1))],
      dateTo: [this.today]
    });
    this.setValidationAfterCreateForm()
  }
  ngOnInit(): void {
    this.isLoading = true;
    this.initData();
    this.initFormat();
  }

  initFormat(): void {
    this.columnData.map((column: ConfigColumnModel) => {
      if (column.type === TABLE_KEYS.DATE) {
        column.format = this.FORMAT.DATE
      }
    })
  }

  setValidationAfterCreateForm(): void {
    this.form.controls['dateFrom'].setValidators(this.systemUtilsService.validateStartEndDate(this.form.controls['dateTo']))
    this.form.controls['dateTo'].setValidators(this.systemUtilsService.validateStartEndDate(this.form.controls['dateFrom'], false))
  }

  initData(): void {
    this.listTitle = this.translateService.instant('survey.attribute_management')
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
  tableQueryParamsChange(event: string): void {
    this.loadDatasource()
  }
  loadDatasource(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    let paging = _.cloneDeep(this.pagination)
    // Lưu ý: index bắt đầu từ 0
    paging.pageIndex = paging.pageIndex - 1
    paging.sortField = paging.sortField || 'lastModifiedDate'
    paging.direction = paging.direction || 'DESC'
    this.isLoading = true
    this.propertyManagementService.getSurveyProperty(paging, this.body).subscribe((response: any) => {
      if (response) {
        this.dtProperty = response.content;
        // this.datasource = response.content || []
        this.refactorDataToShow(response.content || [])
        this.pagination.total = response.totalElements
        window.scrollTo(0, 0);
      }
    }, null, () => {
      this.isLoading = false
    })
  }
  refactorDataToShow(data: SurveysPropertyManagement[]): void {
    this.dataSource = data.map((s:any, index) => {
      if (s.status === 1) {
        s.status = this.translateService.instant('survey.active')
      }else if(s.status === 0){
        s.status = this.translateService.instant('survey.inactive')
      }
      // s.stt = index + 1;
      return s
    })
  }
    disableDateTo = (current: Date): boolean => differenceInCalendarDays(current, this.form.value.dateFrom) < 0;
    disableDateFrom = (current: Date): boolean => differenceInCalendarDays(current, this.form.value.dateTo) > 0;
    disableCurrentDate = (current: Date): boolean => differenceInCalendarDays(current, this.today) > 0;
    override onSubmit(): void {
        let dateFrom = this.systemUtilsService.getBeginOrEndDay(this.form.value.dateFrom);
        let dateTo =  this.systemUtilsService.getBeginOrEndDay(this.form.value.dateTo, false);
        this.body = {
          "attCode": this.form.value.attCode?.trim(),
          "attName": this.form.value.attName?.trim(),
          "createDateFrom": dateFrom,
          "createDateTo": dateTo,
          "status": this.form.value.status
        }
        this.loadDatasource();
    }
  onTriggerActionKey(event: ActionResponseModel): void {
    switch (event.actionKey) {
      case ACTION_KEYS.VIEW: {
        this.viewRecord(event.data)
        break;
      }
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
  viewRecord(data: SurveysPropertyManagement): void {
    this.router.navigate([`${ROUTERS. SURVEY_MODULE}/${ROUTERS.PROPERTY}/${ROUTERS.SURVEY_VIEW}/${data.attId}`])
  }
  editRecord(data: SurveysPropertyManagement): void {
    this.router.navigate([`${ROUTERS. SURVEY_MODULE}/${ROUTERS.PROPERTY}/${ROUTERS.SURVEY_EDIT}/${data.attId}`])
  }
  deleteRecord(data: SurveysPropertyManagement): void {
    this.language = localStorage.getItem('LANGUAGE')
    let contentMessage: ConfirmDialogModel = {
      content: this.translateService.instant('survey_message.property_comfirm_delete_survey',{
        code: data.attCode,
        name: data.attName
      })
    }
    let modal: NzModalRef = this.dialogService.openDialogConfirm(contentMessage)
    modal.afterClose.subscribe((response: string) => {
      if (response === SYSTEM_KEYS.AGREE) {
        // Delete record(s)
        let body = {
          "attCode": data.attCode,
          "attName": data.attName,
          "attId": data.attId,
          "dataType": this.dtProperty.filter((items:any) => items.attId == data.attId)[0].dataType,
          "description": data.description,
          "required":this.dtProperty.filter((items:any) => items.attId == data.attId)[0].required,
          "status": -1
        }
        this.propertyManagementService.editSurveysProperty(body).subscribe(dt => {
          this.notification.success(this.translateService.instant('common.success'), this.translateService.instant('survey_message.property_delete_survey_success'))
          this.loadDatasource();
        })
      }
    })
  }
  override onReset(){
    timer(0).subscribe(() => {
      this.form.controls['dateFrom'].setValue(new Date(new Date().setMonth(new Date().getMonth()-1)))
      this.form.controls['dateTo'].setValue(this.today)
    })
  }
  override onCreate(): void {
    this.router.navigate([`${ROUTERS.SURVEY_MODULE}/${ROUTERS.PROPERTY}/${ROUTERS.PROPERTY_CREATE}`])
  }
}
