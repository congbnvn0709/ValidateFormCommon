import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subscription, timer } from 'rxjs';
import { SYSTEM_KEYS } from 'src/app/shared/constants/system.const';
import { DialogService } from 'src/app/shared/dialogs/dialog.service';
import { ConfirmDialogModel } from 'src/app/shared/models/commons/confirm-dialog.model';
import { PropertyManagementModel } from 'src/app/shared/models/surveys/property-management/property-management.model';
import { SurveySharedService } from '../../utils/survey-shared.service';
import { QUESTION_TYPE } from '../../utils/survey.const';
import * as _ from 'lodash'
export interface QuestionType {
  value: number,
  label: string
}
@Component({
  selector: 'vt-section-question',
  templateUrl: './section-question.component.html',
  styleUrls: ['./section-question.component.scss']
})
export class SectionQuestionComponent implements OnInit, OnChanges, OnDestroy {
  @Input() form!: FormGroup | any
  @Input() sectionIndex: number = 0
  sectionUniqueCode: string = ''
  readonly QUESTION_TYPE = QUESTION_TYPE
  formInteract!: FormGroup

  currentSectionIndex: number = -1
  currentSectionSubscription: Subscription = new Subscription()

  currentQuestionIndex: number = -1
  currentQuestionSubscription: Subscription = new Subscription()

  attributeList: PropertyManagementModel[] = []
  attributeListSubscription: Subscription = new Subscription()

  questionType: QuestionType[] = [
    {
      value: QUESTION_TYPE.SINGLE,
      label: 'survey_management.single_question'
    },
    {
      value: QUESTION_TYPE.MULTIPLE,
      label: 'survey_management.multiple_question'
    },
    {
      value: QUESTION_TYPE.POINT,
      label: 'survey_management.range_question'
    },
    {
      value: QUESTION_TYPE.FEEDBACK,
      label: 'survey_management.feedback_question'
    }
  ]

  get questionForm(): FormArray {
    return this.form.controls['listQuestion']
  }

  constructor(
    private surveySharedService: SurveySharedService,
    private dialogService: DialogService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form'] && changes['form'].currentValue) {
      this.sectionUniqueCode = this.form.controls.uniqueCode.value
    }
  }

  ngOnInit(): void {
    this.listenShareData()
    this.attributeList = this.surveySharedService.attributeList
  }

  listenShareData(): void {
    this.currentSectionSubscription = this.surveySharedService.currentSection.subscribe(index => {
      this.currentSectionIndex = index
    })
    this.currentQuestionSubscription = this.surveySharedService.currentQuestion.subscribe(index => {
      this.currentQuestionIndex = index
    })

    this.attributeListSubscription = this.surveySharedService.attributeListSubject.subscribe((response: PropertyManagementModel[]) => {
      this.attributeList = response
    })
  }

  onQuestionTypeChange(questionType: number, index: number): void {
    let answerForm = <FormArray>this.form.controls.listQuestion['controls'][index]['controls']['listSubQuestion']
    while (answerForm.length > 0) {
      answerForm.removeAt(0)
    }
    switch (questionType) {
      case QUESTION_TYPE.SINGLE:
      case QUESTION_TYPE.MULTIPLE: {
        answerForm.push(this.surveySharedService.initAnswerForm())
        break;
      }
      case QUESTION_TYPE.FEEDBACK: {
        answerForm.push(this.surveySharedService.initFeedbackForm())
        break;
      }
      case QUESTION_TYPE.POINT: {
        answerForm.push(this.surveySharedService.initPointAnswerForm())
        break;
      }
    }
  }

  onClickQuestion(index: number): void {
    timer(10).subscribe(() => {
      this.surveySharedService.currentQuestion.next(index)
    })
  }

  onRemoveQuestion(index: number): void {
    let dialogParam: ConfirmDialogModel = {
      content: 'Bạn có chắc chắn muốn xóa câu hỏi này không?'
    }
    let modal: NzModalRef = this.dialogService.openDialogConfirm(dialogParam)
    modal.afterClose.subscribe((response: string) => {
      if (response === SYSTEM_KEYS.AGREE) {

        let questionDeletedValue = this.form.controls['listQuestion'].controls[index].value
        if (questionDeletedValue.questionId) {
          this.surveySharedService.questionIdDeletedList.push(questionDeletedValue.questionId)
        }
        this.form.controls['listQuestion'].removeAt(index)
        this.surveySharedService.interactWithForm.next(true)
      }
    })
  }

  onSortQuestion(index: number): void {
    let questions = _.cloneDeep(this.form.controls['listQuestion'] as FormArray)
    let modal: NzModalRef = this.surveySharedService.openSortDataDialog(questions, 'question')
    modal.afterClose.subscribe((response: FormArray | any) => {
      if (response) {
        this.form.controls['listQuestion'] = response
      }
    })
  }

  onAddProperty(index: number): void {
    let attValue = this.form.controls['listQuestion'].controls[index].controls.listAttributes.getRawValue()
    let lastOrder = -1
    if (attValue.length > 0) {
      lastOrder =attValue[attValue.length - 1].attOrder
    }
    this.form.controls['listQuestion'].controls[index].controls.listAttributes.controls.push(this.surveySharedService.initAttributeForm(lastOrder + 1))
  }

  onRemoveProperty(index: number, idx: number): void {
    // let propertyDeletedValue = this.form.controls['listQuestion'].controls[index].controls.listAttributes.controls[index].value
    // if (propertyDeletedValue.attId) {
    //   this.surveySharedService.attributeIdDeletedList.push(propertyDeletedValue.attId)
    // }
    this.form.controls['listQuestion'].controls[index].controls.listAttributes.removeAt(idx)
  }

  ngOnDestroy(): void {
    this.currentQuestionSubscription.unsubscribe()
    this.currentSectionSubscription.unsubscribe()
    this.attributeListSubscription.unsubscribe()
  }
}
