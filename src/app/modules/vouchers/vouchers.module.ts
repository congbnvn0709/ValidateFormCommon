import { CrudLayoutComponent } from './../../layouts/crud-layout/crud-layout.component';
import { BaseLayoutComponent } from './../../layouts/base-layout/base-layout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VouchersRoutingModule } from './vouchers-routing.module';
import { VoucherManagementComponent } from './pages/voucher-management/voucher-management.component';
import { VoucherCrudComponent } from './pages/voucher-crud/voucher-crud.component';
import { AntModule } from 'src/app/shared/utilities/ant.modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ManageLayoutComponent } from 'src/app/layouts/manage-layout/manage-layout.component';


@NgModule({
  declarations: [
    VoucherManagementComponent,
    VoucherCrudComponent,
    // CrudLayoutComponent,
    // BaseLayoutComponent,
    // ManageLayoutComponent,
  ],
  imports: [
    CommonModule,
    VouchersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AntModule,
    SharedModule,
    TranslateModule
  ]
})
export class VouchersModule { }
