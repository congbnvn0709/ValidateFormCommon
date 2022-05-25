import { AccessDeniedComponent } from './modules/access-denied/access-denied.component';
import { LoginComponent } from './modules/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './modules/not-found/not-found.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { AuthGuard } from './helpers/auth.guard';
import { ROUTERS } from './shared/constants/router.const';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {
      activeKey: ROUTERS.DASHBOARD
    }
  },
  {
    path: ROUTERS.LOGIN,
    component: LoginComponent,
    data: {
      isSinglePage: true
    }
  },
  {
    path: ROUTERS.VOUCHER,
    loadChildren: () => import('./modules/vouchers/vouchers.module').then(s => s.VouchersModule),
    canActivate: [AuthGuard],
    data: {
      activeKey: ROUTERS.VOUCHER,
      breadcrumb: 'common.voucher_management',
      title: 'common.voucher_management'
    }
  },
  {
    path: ROUTERS.SURVEY_MODULE,
    loadChildren: () => import('./modules/survey/survey-routing.module').then(s => s.SurveyRoutingModule),
    data: {
      breadcrumb: 'common.home',
    }
  },
  {
    path: ROUTERS.BUSINESS_TYPE,
    loadChildren: () => import('./modules/business-type-management/business.module').then((s) => s.BusinessModule),
    data: {
      breadcrumb: 'common.business',
    }
  },
  {
    path: ROUTERS.ACCESS_DENIED,
    component: AccessDeniedComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    canLoad: [AuthGuard]
  },
  {
    path: ROUTERS.NOT_FOUND,
    component: NotFoundComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ROUTERS.NOT_FOUND
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
