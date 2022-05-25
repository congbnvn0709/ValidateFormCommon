import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { ROUTERS } from 'src/app/shared/constants/router.const';
import { MODES } from 'src/app/shared/constants/system.const';
import { BusinessCrudComponent } from './pages/business-crud/business-crud.component';
import { BusinessManagementComponent } from './pages/business-management/business-management.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessManagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create',
    component: BusinessCrudComponent,
    canActivate: [AuthGuard],
    data: {
      activeKey: ROUTERS.BUSINESS_CREATE,
      breadcrumb: 'business.add_new_business',
      title: 'business.add_new_business',
      mode: MODES.CREATE
    }
  },
  {
    path: 'edit/:id',
    component: BusinessCrudComponent,
    canActivate: [AuthGuard],
    data: {
      activeKey: ROUTERS.BUSINESS_EDIT,
      breadcrumb: 'business.edit_business',
      title: 'business.edit_business',
      mode: MODES.EDIT
    }
  },
  {
    path: 'view/:id',
    component: BusinessCrudComponent,
    canActivate: [AuthGuard],
    data: {
      activeKey: ROUTERS.BUSINESS_VIEW,
      breadcrumb: 'business.details_business',
      title: 'business.details_business',
      mode: MODES.VIEW
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
