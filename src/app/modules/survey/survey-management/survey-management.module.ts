import { SectionQuestionFeedbackComponent } from './components/section-question-feedback/section-question-feedback.component';
import { SectionQuestionPointComponent } from './components/section-question-point/section-question-point.component';
import { SectionQuestionChoiceComponent } from './components/section-question-choice/section-question-choice.component';
import { SectionQuestionComponent } from './components/section-question/section-question.component';
import { SectionTitleComponent } from './components/section-title/section-title.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyManagementRoutingModule } from './survey-management-routing.module';
import { SurveyManageComponent } from './pages/survey-manage/survey-manage.component';
import { SurveyCruComponent } from './pages/survey-cru/survey-cru.component';
import { SurveyDetailComponent } from './pages/survey-detail/survey-detail.component';
import { AntModule } from 'src/app/shared/utilities/ant.modules';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SectionComponent } from './components/section/section.component';
import { DndModule } from 'ngx-drag-drop';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SortDataComponent } from './dialogs/sort-data/sort-data.component';
import { SurveyPreviewComponent } from './pages/survey-preview/survey-preview.component';

@NgModule({
  declarations: [
    SurveyManageComponent,
    SurveyCruComponent,
    SurveyDetailComponent,
    SectionComponent,
    SectionTitleComponent,
    SectionQuestionComponent,
    SectionQuestionChoiceComponent,
    SectionQuestionPointComponent,
    SectionQuestionFeedbackComponent,
    SortDataComponent,
    SurveyPreviewComponent
  ],
  imports: [
    CommonModule,
    SurveyManagementRoutingModule,
    AntModule,
    TranslateModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DndModule,
    NgxTrimDirectiveModule
  ],
  providers: [
    NzNotificationService
  ]
})
export class SurveyManagementModule { }
