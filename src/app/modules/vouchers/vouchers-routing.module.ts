import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { ROUTERS } from 'src/app/shared/constants/router.const';
import { MODES } from 'src/app/shared/constants/system.const';
import { VoucherCrudComponent } from './pages/voucher-crud/voucher-crud.component';
import { VoucherManagementComponent } from './pages/voucher-management/voucher-management.component';

const routes: Routes = [
  {
    path: '',
    component: VoucherManagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create',
    component: VoucherCrudComponent,
    canActivate: [AuthGuard],
    data: {
      activeKey: ROUTERS.VOUCHER,
      breadcrumb: 'common.voucher_create',
      title: 'common.voucher_create',
      mode: MODES.CREATE
    }
  },
  {
    path: 'edit/:id',
    component: VoucherCrudComponent,
    canActivate: [AuthGuard],
    data: {
      activeKey: ROUTERS.VOUCHER,
      breadcrumb: 'common.voucher_edit',
      title: 'common.voucher_edit',
      mode: MODES.EDIT
    }
  },
  {
    path: 'view/:id',
    component: VoucherCrudComponent,
    canActivate: [AuthGuard],
    data: {
      activeKey: ROUTERS.VOUCHER,
      breadcrumb: 'common.voucher_view',
      title: 'common.voucher_view',
      mode: MODES.VIEW
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VouchersRoutingModule { }
