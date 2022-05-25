import { ROUTERS } from 'src/app/shared/constants/router.const';
import { Router } from '@angular/router';
import { ACTION_KEYS, SYSTEM_KEYS } from './../../../../shared/constants/system.const';
import { VoucherManagementModel } from './../../../../shared/models/vouchers/voucher-management.model';
import { Component, OnInit, Injector } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ACTIVE_STATUS_OPTION, RECEIVE_OPTION, SCAN_OPTION, VOUCHER_REUSE_OPTION } from 'src/app/shared/constants/system.const';
import { PaginationModel } from 'src/app/shared/models/commons/pagination.model';
import { VOUCHER_COLUMNS } from '../../utils/voucher.utils';
import { ActionColumnModel } from 'src/app/shared/models/commons/action-column.model';
import { DialogService } from 'src/app/shared/dialogs/dialog.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ActionResponseModel } from 'src/app/shared/models/commons/action-response.model';
import { ManageAbstractComponent } from 'src/app/layouts/abstracts/manage.abstract.component';

@Component({
  selector: 'vt-voucher-management',
  templateUrl: './voucher-management.component.html',
  styleUrls: ['./voucher-management.component.scss']
})
export class VoucherManagementComponent extends ManageAbstractComponent implements OnInit {
  readonly ACTIVE_STATUS_OPTION = ACTIVE_STATUS_OPTION
  readonly VOUCHER_REUSE_OPTION = VOUCHER_REUSE_OPTION
  readonly RECEIVE_OPTION = RECEIVE_OPTION
  readonly SCAN_OPTION = SCAN_OPTION

  self = this

  // form!: FormGroup;
  controlArray: Array<{ index: number; show: boolean }> = [];

  setOfCheckedId = new Set<number>();
  pagination: PaginationModel = new PaginationModel()
  // isLoading: boolean = false

  columnData = VOUCHER_COLUMNS
  datasource: VoucherManagementModel[] = []

  actions: ActionColumnModel[] = []

  onQueryParamsChange(event: any) {

    // const sortedField = event.sort.find(e => e.value);
    // if (sortedField) {
    //   this.pageAble.sortField = sortedField?.key;
    //   if (sortedField?.value === 'ascend') {
    //     this.pageAble.direction = 'ASC';
    //   } else if (sortedField?.value === 'descend') {
    //     this.pageAble.direction = 'DESC';
    //   }
    // }
    // this.searchingParams.pageNum = event.pageIndex
    // this.searchingParams.pageSize = event.pageSize
    // this.searchingParams.direction = this.pageAble.direction
    // this.searchingParams.sortField = this.pageAble.sortField
    // this.searchScenario()
  }


  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private dialogService: DialogService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    for (let index = 0; index < 57; index++) {
      this.datasource.push({
        id: index,
        code: 'CODE_' + index,
        name: 'Name_' + index,
        note: 'This is the note ' + index,
        createdDate: new Date(),
        status: 'Status',
        isReuseVoucher: true,
        isRequiredReceive: true,
        isRequiredScan: true,
        isAdditionalVoucher: true,
        isSign: false,
        isDisplaymentVoucher: true
      })
    }
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
    this.pagination.total = this.datasource.length
    this.isLoading = true
    setTimeout(() => {
      this.isLoading = false
    }, 1500)
    this.form = this.fb.group({
      code: [null],
      name: [null],
      status: [null],
      reuse: [null],
      requiredReceive: [null],
      requiredScan: [null],
    });
  }

  initData(): void {
    this.listTitle = 'Danh sách chứng từ'
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
        this.viewRecord(event.data)
        break;
      }
      case ACTION_KEYS.EDIT: {
        this.editRecord(event.data)
        break;
      }
      case ACTION_KEYS.DELETE: {
        this.deleteRecord()
        break;
      }

    }
  }

  viewRecord(data: VoucherManagementModel): void {
    this.router.navigate([`${ROUTERS.VOUCHER_VIEW}/${data.id}`])
  }

  editRecord(data: VoucherManagementModel): void {
    this.router.navigate([`${ROUTERS.VOUCHER_EDIT}/${data.id}`])
  }

  deleteRecord(): void {
    let modal: NzModalRef = this.dialogService.openDialogConfirm()
    modal.afterClose.subscribe((response: string) => {
      if (response === SYSTEM_KEYS.AGREE) {
        // Delete record(s)
      }
    })
  }

}
