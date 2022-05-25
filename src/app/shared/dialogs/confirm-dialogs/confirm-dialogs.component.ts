import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { SYSTEM_KEYS } from '../../constants/system.const';
import { ConfirmDialogModel } from '../../models/commons/confirm-dialog.model';

@Component({
  selector: 'vt-confirm-dialogs',
  templateUrl: './confirm-dialogs.component.html',
  styleUrls: ['./confirm-dialogs.component.scss'],
})
export class ConfirmDialogsComponent implements OnInit {
  @Input() dialogData: ConfirmDialogModel = {};

  constructor(
    private modal: NzModalRef,
    private translate: TranslateService
    ) {}

  ngOnInit(): void {
    if (!this.dialogData.title) {
      setTimeout(() => {
        this.initTitle()
      }, 0)
    }
    if (!this.dialogData.content) {
      this.initContent()
    }
    if (!this.dialogData.buttons || this.dialogData.buttons.length === 0) {
      this.initButtons()
    }
  }

  initTitle(): void {
    this.dialogData.title = this.translate.instant('common.confirm')
  }
  initContent(): void {
    this.dialogData.content = this.translate.instant('message.confirm')
  }
  initButtons(): void {
    this.dialogData.buttons = [
      {
        label: this.translate.instant('common.cancel'),
        data: SYSTEM_KEYS.CANCEL,
        type: 'default',
      },
      {
        label: this.translate.instant('common.agree'),
        data: SYSTEM_KEYS.AGREE,
        type: 'primary',
      },
    ];
  }

  onTriggerAction(data: any): void {
    this.modal.close(data);
  }
}
