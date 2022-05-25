import { FormBuilder, Validators } from '@angular/forms';
import { Component, Injector, OnInit } from '@angular/core';
import { ACTIVE_STATUS_OPTION } from 'src/app/shared/constants/system.const';
import { CrudAbstractComponent } from 'src/app/layouts/abstracts/crud.abstract.component';

@Component({
  selector: 'vt-voucher-crud',
  templateUrl: './voucher-crud.component.html',
  styleUrls: ['./voucher-crud.component.scss']
})
export class VoucherCrudComponent extends CrudAbstractComponent implements OnInit {
  readonly ACTIVE_STATUS_OPTION = ACTIVE_STATUS_OPTION
  self = this

  constructor(
    private fb: FormBuilder,
    injector: Injector
  ) {
    super(injector)
  }

  ngOnInit(): void {
    this.initForm()
  }

  initForm(): void {
    this.form = this.fb.group({
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      status: [null, [Validators.required]],
      note: [null],
      reuse: [null],
      requiredScan: [null],
      additionalVoucher: [null],
      sign: [null],
      requiredReceive: [null],
    })
  }

}
