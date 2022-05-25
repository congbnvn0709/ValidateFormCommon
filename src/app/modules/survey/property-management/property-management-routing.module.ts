import { MODES } from './../../../shared/constants/system.const';
import { PropertyCruComponent } from './pages/property-cru/property-cru.component';
import { ROUTERS } from 'src/app/shared/constants/router.const';
import { PropertyManageComponent } from './pages/property-manage/property-manage.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PropertyManageComponent,
    canActivate: [AuthGuard],
    data: {
      activeKey: ROUTERS.PROPERTY,
      breadcrumb: 'survey.attribute_management',
      title: 'survey.attribute_management'
    }
  },
  {
    path: ROUTERS.PROPERTY_CREATE,
    component: PropertyCruComponent,
    canActivate: [AuthGuard],
    data: {
      activeKey: ROUTERS.SURVEY_MODULE,
      breadcrumb: 'survey.create_new_attribute',
      title: 'survey.create_new_attribute',
      mode: MODES.CREATE
    }
  },
  {
    path: `${ROUTERS.PROPERTY_EDIT}/:id`,
    component: PropertyCruComponent,
    canActivate: [AuthGuard],
    data: {
      activeKey: ROUTERS.SURVEY_MODULE,
      breadcrumb: 'survey.edit_attributes',
      title: 'survey.edit_attributes',
      mode: MODES.EDIT
    }
  },
  {
    path: `${ROUTERS.PROPERTY_VIEW}/:id`,
    component: PropertyCruComponent,
    canActivate: [AuthGuard],
    data: {
      activeKey: ROUTERS.SURVEY_MODULE,
      breadcrumb: 'survey.attribute_details',
      title: 'survey.attribute_details',
      mode: MODES.VIEW
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyManagementRoutingModule { }
