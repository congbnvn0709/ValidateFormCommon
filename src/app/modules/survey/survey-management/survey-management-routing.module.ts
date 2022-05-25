import { MODES } from './../../../shared/constants/system.const';
import { SurveyDetailComponent } from './pages/survey-detail/survey-detail.component';
import { ROUTERS } from 'src/app/shared/constants/router.const';
import { SurveyCruComponent } from './pages/survey-cru/survey-cru.component';
import { SurveyManageComponent } from './pages/survey-manage/survey-manage.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/auth.guard';
import { SurveyPreviewComponent } from './pages/survey-preview/survey-preview.component';

const routes: Routes = [
  {
    path: '',
    component: SurveyManageComponent,
    canActivate: [AuthGuard],
    data: {
      activeKey: ROUTERS.SURVEY,
      breadcrumb: 'survey_management.survey_mng',
      title: 'survey_management.survey_mng'
    }
  },
  {
    path: ROUTERS.SURVEY_CREATE,
    component: SurveyCruComponent,
    canActivate: [AuthGuard],
    data: {
      activeKey: ROUTERS.SURVEY_MODULE,
      breadcrumb: 'survey_management.create_survey',
      title: 'survey_management.create_survey',
      mode: MODES.CREATE
    }
  },
  {
    path: `${ROUTERS.SURVEY_EDIT}/:id`,
    component: SurveyCruComponent,
    canActivate: [AuthGuard],
    data: {
      activeKey: ROUTERS.SURVEY_MODULE,
      breadcrumb: 'survey_management.edit_survey',
      title: 'survey_management.edit_survey',
      mode: MODES.EDIT
    }
  },
  {
    path: `${ROUTERS.SURVEY_VIEW}/:id`,
    component: SurveyDetailComponent,
    canActivate: [AuthGuard],
    data: {
      activeKey: ROUTERS.SURVEY_MODULE,
      breadcrumb: 'survey_management.survey_detail',
      title: 'survey_management.survey_detail',
      mode: MODES.VIEW
    }
  },
  {
    path: `${ROUTERS.SURVEY_PREVIEW}/:id`,
    component: SurveyPreviewComponent,
    canActivate: [AuthGuard],
    data: {
      activeKey: ROUTERS.SURVEY_MODULE,
      breadcrumb: 'survey_management.survey_preview',
      title: 'survey_management.survey_preview',
      mode: MODES.PREVIEW
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyManagementRoutingModule { }
