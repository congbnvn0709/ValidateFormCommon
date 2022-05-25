import { ConfigColumnModel } from './../../../../../shared/models/commons/config-column.model';
import { timer } from 'rxjs';
import { differenceInCalendarDays } from 'date-fns';
import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SurveyService } from 'src/app/services/surveys/survey.service';
import { ManageAbstractComponent } from 'src/app/layouts/abstracts/manage.abstract.component';
import { ROUTERS } from 'src/app/shared/constants/router.const';
import { ACTION_KEYS, ACTIVE_STATUS_OPTION, RECEIVE_OPTION, SCAN_OPTION, SYSTEM_KEYS, TABLE_KEYS, VOUCHER_REUSE_OPTION } from 'src/app/shared/constants/system.const';
import { DialogService } from 'src/app/shared/dialogs/dialog.service';
import { ActionColumnModel } from 'src/app/shared/models/commons/action-column.model';
import { ActionResponseModel } from 'src/app/shared/models/commons/action-response.model';
import { ConfirmDialogModel } from 'src/app/shared/models/commons/confirm-dialog.model';
import { PaginationModel } from 'src/app/shared/models/commons/pagination.model';
import { SurveyManagementModel } from 'src/app/shared/models/surveys/servery-management/survey-management.model';
import { SURVEY_COLUMNS } from '../../utils/survey.const';
import * as _ from 'lodash'
import { TranslateService } from '@ngx-translate/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SystemUtilsService } from 'src/app/shared/utilities/system.utils.service';
import * as moment from 'moment';

@Component({
  selector: 'vt-survey-manage',
  templateUrl: './survey-manage.component.html',
  styleUrls: ['./survey-manage.component.scss']
})
export class SurveyManageComponent extends ManageAbstractComponent implements OnInit {
  readonly ACTIVE_STATUS_OPTION = ACTIVE_STATUS_OPTION
  readonly VOUCHER_REUSE_OPTION = VOUCHER_REUSE_OPTION
  readonly RECEIVE_OPTION = RECEIVE_OPTION
  readonly SCAN_OPTION = SCAN_OPTION
  // readonly DATE_FORMAT = DATE_FORMAT

  // format!: FormatModel

  self = this
  controlArray: Array<{ index: number; show: boolean }> = [];
  setOfCheckedId = new Set<number>();
  pagination: PaginationModel = new PaginationModel()

  columnData = SURVEY_COLUMNS
  datasource: SurveyManagementModel[] = []

  actions: ActionColumnModel[] = []

  fromDateDefault: Date = new Date()
  toDateDefault: Date = new Date()

  // dateFormat: string = DATE_FORMAT.DATE

  constructor(
    private fb: FormBuilder,
    injector: Injector,
    private dialogService: DialogService,
    private surveyService: SurveyService,
    private translateService: TranslateService,
    private notification: NzNotificationService,
    private systemUtilsService: SystemUtilsService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initData()
    this.initFormat()
    // this.getFormatData()
  }

  // getFormatData(): void {
  //   this.utilsService.getFormatData().subscribe((data: FormatModel) => {
  //     this.format = data
  //     this.setDateFormatForTable()
  //   })
  // }

  // setDateFormatForTable(): void {
  //   this.columnData.map((column: ConfigColumnModel) => {
  //     if (column.type === TABLE_KEYS.DATE) {
  //       column.format = this.format.date
  //     }
  //   })
  // }

  initFormat(): void {
    this.columnData.map((column: ConfigColumnModel) => {
      if (column.type === TABLE_KEYS.DATE) {
        column.format = this.FORMAT.DATE
      }
    })
  }

  initData(): void {
    this.listTitle = 'survey_management.survey_list'
    this.actions = [

      {
        icon: 'file',
        tooltip: 'common.view',
        type: 'link',
        actionKey: ACTION_KEYS.VIEW
      }, {
        icon: 'eye',
        tooltip: 'common.preview',
        type: 'link',
        actionKey: ACTION_KEYS.PREVIEW
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
    this.form = this.fb.group({
      surveyFormCode: [null],
      surveyFormName: [null],
      status: [null],
      surveyFormType: [null],
      createdDateFrom: [null],
      createdDateTo: [null]
    });
    this.setValidationAfterCreateForm()

    this.fromDateDefault = moment(new Date()).subtract(1, 'months').toDate()
    this.setDefaultValue()
  }

  setValidationAfterCreateForm(): void {
    this.form.controls['createdDateFrom'].setValidators([this.systemUtilsService.validateStartEndDate(this.form.controls['createdDateTo']), Validators.required])
    this.form.controls['createdDateTo'].setValidators(this.systemUtilsService.validateStartEndDate(this.form.controls['createdDateFrom'], false))
  }

  get formValue(): any {
    return this.form.value
  }

  disableFromDate = (current: Date): boolean => differenceInCalendarDays(current, this.form.value.createdDateFrom) > 0;
  disableToDate = (current: Date): boolean => differenceInCalendarDays(current, this.form.value.createdDateTo) < 0;
  disableCurrentDate = (current: Date): boolean => differenceInCalendarDays(current, new Date()) > 0;

  setDefaultValue(): void {
    this.form.controls['createdDateFrom'].setValue(this.fromDateDefault)
    this.form.controls['createdDateTo'].setValue(this.toDateDefault)
  }

  override onReset(): void {
    timer(0).subscribe(() => {
      this.setDefaultValue()
    })
  }

  loadDatasource(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    let params = this.formValue;
    let paging = _.cloneDeep(this.pagination)

    // Lưu ý: index bắt đầu từ 0
    paging.pageIndex = paging.pageIndex - 1
    paging.sortField = paging.sortField || 'lastModifiedDate'
    paging.direction = paging.direction || 'DESC'
    params.createdDateFrom = this.systemUtilsService.getBeginOrEndDay(params.createdDateFrom)
    params.createdDateTo = this.systemUtilsService.getBeginOrEndDay(params.createdDateTo, false)

    this.isLoading = true
    this.surveyService.search(paging, params).subscribe((response: any) => {
      this.isLoading = false;
      if (response) {
        this.refactorDataToShow(response.content || []);
        this.pagination.total = response.totalElements;
      }
    }, (errors: any) => {
      this.isLoading = false;
      this.notification.error(this.translateService.instant('common.error'), errors.message || 'Have error occur');
    })
  }

  override onSubmit(): void {
    this.loadDatasource();
  }

  refactorDataToShow(data: SurveyManagementModel[]): void {
    this.datasource = data.map(s => {
      if (s.status === 1) {
        s.status = this.translateService.instant('common.active');
      } else {
        s.status = this.translateService.instant('common.inactive');
      }
      return s;
    })
  }

  tableQueryParamsChange(event: string): void {
    this.loadDatasource();
  }

  onExportExcel(): void {
    // TODO something...
  }

  /**
  * Description: Dữ liệu trả về khi bấm vào các action của table
  */
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
      case ACTION_KEYS.PREVIEW: {
        this.preview(event.data);
        break;
      }

    }
  }

  viewRecord(data: SurveyManagementModel): void {
    this.router.navigate([`${ROUTERS.SURVEY_MODULE}/${ROUTERS.SURVEY}/${ROUTERS.SURVEY_VIEW}/${data.surveyFormId}`]);
  }

  editRecord(data: SurveyManagementModel): void {
    this.router.navigate([`${ROUTERS.SURVEY_MODULE}/${ROUTERS.SURVEY}/${ROUTERS.SURVEY_EDIT}/${data.surveyFormId}`]);
  }

  deleteRecord(data: SurveyManagementModel): void {
    let popupConfirm: ConfirmDialogModel = {
      content: this.translateService.instant('survey_message.comfirm_delete_survey', {
        code: data.surveyFormCode,
        name: data.surveyFormName
      })
    }
    let modal: NzModalRef = this.dialogService.openDialogConfirm(popupConfirm);
    modal.afterClose.subscribe((response: string) => {
      if (response === SYSTEM_KEYS.AGREE) {
        this.surveyService.delete([data.surveyFormId]).subscribe((response: any) => {
          this.notification.success(this.translateService.instant('common.success'), this.translateService.instant('survey_message.delete_survey_success'));
          this.loadDatasource();
        }, (errors) => {
          console.log(errors);
        })
      }
    })
  }

  preview(data: SurveyManagementModel): void {
    this.router.navigate([`${ROUTERS.SURVEY_MODULE}/${ROUTERS.SURVEY}/${ROUTERS.SURVEY_PREVIEW}/${data.surveyFormId}`]);
  }

  override onCreate(): void {
    this.router.navigate([`${ROUTERS.SURVEY_MODULE}/${ROUTERS.SURVEY}/${ROUTERS.SURVEY_CREATE}`]);
  }

}
