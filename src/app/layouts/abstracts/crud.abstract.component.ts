import { STATE } from './../../shared/constants/system.const';
import { timer } from 'rxjs';
import { MODES } from 'src/app/shared/constants/system.const';
import { ConfirmDialogModel } from 'src/app/shared/models/commons/confirm-dialog.model';
import { RouterDataModel } from '../../shared/models/commons/router-data.model';
import { ActivationEnd, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import {
  Injector
} from '@angular/core';
import { BaseAbstractComponent } from './base.abstract.component';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DialogService } from '../../shared/dialogs/dialog.service';
import { SYSTEM_KEYS } from '../../shared/constants/system.const';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TranslateService } from '@ngx-translate/core';
import { ValidateModel } from 'src/app/shared/models/commons/validate.model';
import { ConfigButtonModel } from 'src/app/shared/models/commons/config-button.model';

export abstract class CrudAbstractComponent extends BaseAbstractComponent {
  id: number = 0
  activatedRoute!: ActivatedRoute
  dialogService: DialogService
  notification: NzNotificationService
  translateService: TranslateService
  form: FormGroup | any = new FormGroup({})
  isLoading: boolean = false
  routerData!: RouterDataModel
  state: string = STATE.UNCOMPLETE

  configCancelButton: ConfigButtonModel = {
    label: '',
    isDisplay: true
  }

  // Api được gọi đến khi bấm button lưu
  saveApi: string = ''

  // Url dùng để điều hướng khi bấm button Cancel
  cancelPath: string = ''

  createCofirmMessage: string = ''
  createSuccessMessage: string = ''

  updateCofirmMessage: string = ''
  updateSuccessMessage: string = ''

  public constructor(
    injector: Injector
  ) {
    super(injector)
    this.activatedRoute = injector.get(ActivatedRoute)
    this.dialogService = injector.get(DialogService)
    this.notification = injector.get(NzNotificationService)
    this.translateService = injector.get(TranslateService)

    this.router.events.subscribe((event: any) => {
      if (event instanceof ActivationEnd) {
        this.cancelPath = event.snapshot.routeConfig?.path || ''
      }
    });
    this.activatedRoute.data.subscribe((response: any) => {
      this.routerData = response
    })

    this.initAbstractData()
  }

  initAbstractData(): void {
    this.configCancelButton.label = this.translateService.instant('common.cancel')
  }

  public onSubmit(): void {
    const formValid = this.checkValidateForm()
    if (!formValid) return

    let formValue = this.form.getRawValue()
    const validate: ValidateModel = this.checkValidDataBeforeSave(formValue)
    if (!validate.valid) {
      if (typeof validate.message === 'string') {
        this.notification.error(this.translateService.instant('common.error'), validate.message || this.translateService.instant('message.have_error'))
      } else {
        validate.message.forEach((message: string) => {
          this.notification.error(this.translateService.instant('common.error'), message)
        });
      }
      return
    }

    let params = this.prepareDataToSave(formValue)
    this.callApiToSave(params)
  };


  /**
  * Description: Kiểm tra form có hợp lệ hay không
  */
  checkValidateForm(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return false
    }
    return true
  }

  /**
  * Description:  Kiểm tra các giá trị của form... có hợp lệ hay không
  */
  checkValidDataBeforeSave(formValue: any): ValidateModel {
    let validate: ValidateModel = {
      valid: true
    }
    return validate
  }

  prepareDataToSave(formValue: any): any {
    return formValue
  }

  callApiToSave(params: any): void {
    if (!this.saveApi) {
      console.error('Chưa cung cấp api để lưu dữ liệu')
    }

    let dialogParam: ConfirmDialogModel = {
      content: this.routerData.mode === MODES.CREATE ? this.createCofirmMessage : this.updateCofirmMessage
    }
    let modal: NzModalRef = this.dialogService.openDialogConfirm(dialogParam)
    modal.afterClose.subscribe((response: string) => {
      if (response === SYSTEM_KEYS.AGREE) {
        if (this.routerData.mode === this.modes.CREATE) {
          this.save(params)
        } else {
          this.update(params)
        }
      }
    })
  }

  save(params: any): void {
    this.isLoading = true
    this.http.post(`${this.SERVER}/${this.saveApi}`, params).subscribe((res: any) => {
      this.form.reset()
      this.notification.success(this.translateService.instant('common.success'), this.createSuccessMessage || this.translateService.instant('message.save_success'))
      timer(500).subscribe(() => {
        this.router.navigate([`/${this.cancelPath}`])
      })
    }, errors => {
      this.notification.error(this.translateService.instant('common.error'), errors.error.message || errors.error.detail || this.translateService.instant('message.have_error'))
      this.isLoading = false
    })
  }

  update(params: any): void {
    this.isLoading = true
    this.http.put(`${this.SERVER}/${this.saveApi}/${this.id}`, params).subscribe((res: any) => {
      this.form.reset()
      this.notification.success(this.translateService.instant('common.success'), this.updateSuccessMessage || this.translateService.instant('message.save_success'))
      timer(500).subscribe(() => {
        this.router.navigate([`/${this.cancelPath}`])
      })
    }, errors => {
      this.notification.error(this.translateService.instant('common.error'), errors.error.message || errors.error.detail || this.translateService.instant('message.have_error'))
      this.isLoading = false
    })
  }

  onContinue(): void {
    //TODO something...
  }

  onComplete(): void {
    //TODO something...
  }

  onCancel(): void {
    let dialogParam: ConfirmDialogModel = {
      content: this.translateService.instant('message.comfirm_cancel')
    }
    let modal: NzModalRef = this.dialogService.openDialogConfirm(dialogParam)
    modal.afterClose.subscribe((response: string) => {
      if (response === SYSTEM_KEYS.AGREE) {
        this.router.navigate([`/${this.cancelPath}`])
      }
    })
  }
}
