import { ConfirmDialogsComponent } from './confirm-dialogs/confirm-dialogs.component';
import { Injectable } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ConfirmDialogModel } from '../models/commons/confirm-dialog.model';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private modal: NzModalService) {}

  openDialogConfirm(dialogData: ConfirmDialogModel = {}): NzModalRef {
    return this.modal.create({
      nzContent: ConfirmDialogsComponent,
      nzWrapClassName: 'vt-dialog',
      nzMaskClosable: false,
      nzComponentParams: {
        dialogData
      },
    });
  }
}
