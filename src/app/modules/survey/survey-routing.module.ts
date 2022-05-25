import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTERS } from 'src/app/shared/constants/router.const';

const routes: Routes = [
  {
    path: ROUTERS.SURVEY,
    loadChildren: () => import('./survey-management/survey-management.module').then(m => m.SurveyManagementModule),
    data: {
      breadcrumb: 'survey_management.survey_mng'
    }
  },
  {
    path: ROUTERS.PROPERTY,
    loadChildren: () => import('./property-management/property-management.module').then(m => m.PropertyManagementModule),
    data: {
      breadcrumb: 'survey.attribute_management'
    }
  },
  {
    path: '',
    redirectTo: '/'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyRoutingModule { }
