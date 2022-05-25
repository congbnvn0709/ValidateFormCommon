import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormArray } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { QUESTION_TYPE } from './survey.const';
import { v4 as uuidv4 } from 'uuid'
import { PropertyManagementModel } from 'src/app/shared/models/surveys/property-management/property-management.model';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { SortDataComponent } from '../dialogs/sort-data/sort-data.component';

@Injectable({
  providedIn: 'root'
})
export class SurveySharedService {
  sectionIdDeletedList: number[] = []
  questionIdDeletedList: number[] = []
  answerIdDeletedList: number[] = []
  answerPointIdDeletedList: number[] = []
  // attributeIdDeletedList: number[] = []

  // Danh sách thuộc tính
  attributeList: PropertyManagementModel[] = []
  attributeListSubject: Subject<PropertyManagementModel[]> = new Subject<PropertyManagementModel[]>()

  currentSection: Subject<number> = new Subject<number>()
  currentQuestion: Subject<number> = new Subject<number>()

  // Chia sẻ danh sách phần, câu hỏi cho mục đích chọn đến phần, câu hỏi tiếp theo
  sectionList: any[] = []
  sectionListSubject: Subject<any> = new Subject<any>()

  // Lắng nghe khi xóa phần, câu hỏi thì bắn ra sự kiện -> cập nhật lại danh sách phần, câu hỏi
  interactWithForm: Subject<boolean> = new Subject<boolean>()

  constructor(
    private fb: FormBuilder,
    private modal: NzModalService
  ) { }

  initForm(isCreateMode: boolean = true): FormGroup {

    const form = this.fb.group({
      surveyFormId: [null],
      surveyFormCode: [null, [Validators.required, Validators.maxLength(200)]],
      surveyFormName: [null, [Validators.required, Validators.maxLength(200)]],
      surveyFormType: [null, [Validators.required]],
      description: [null, [Validators.maxLength(500)]],
      listSection: isCreateMode ? this.fb.array([
        this.initSectionForm(isCreateMode)
      ]) : this.fb.array([]),
      status: [null]
    })

    if (!isCreateMode) {
      form.controls['status'].setValidators([Validators.required])
    }

    return form
  }

  initSectionForm(isAutoAddQuestion: boolean = true): FormGroup {
    let code: string = uuidv4()
    const form = this.fb.group({
      uniqueCode: [code],
      sectionId: [null],
      sectionName: [null, Validators.maxLength(200)],
      sectionOrder: [null],
      description: [null, Validators.maxLength(500)],
      listQuestion: isAutoAddQuestion ? this.fb.array([
        this.initQuestionForm()
      ]) : this.fb.array([]),
      nextSectionId: [null],
      nextSectionOrder: [null],
      surveyFormId: [null],
    })
    return form
  }

  initQuestionForm(isAutoAddAnswer: boolean = true): FormGroup {
    let code: string = uuidv4()
    return this.fb.group({
      uniqueCode: [code],
      questionId: [null],
      questionOrder: [null],
      content: [null, [Validators.required, Validators.maxLength(1000)]],
      listAttributes: this.fb.array([
        // this.initAttributeForm()
      ]),
      type: [QUESTION_TYPE.SINGLE, [Validators.required]],
      listSubQuestion: isAutoAddAnswer ? this.fb.array([
        this.initAnswerForm()
      ]) : this.fb.array([]),
      required: [true]
    })
  }

  /**
   * Use for all: single choise, mutiple choise, feedback question
   **/
  initAnswerForm(): FormGroup {
    const form = this.fb.group({
      choiceId: [null],
      choiceContent: [null, [Validators.maxLength(255)]],
      answerLimitLength: [null, [Validators.maxLength(10)]],
      rangeOrder: [null],
      nextSectionOrder: [null],
      nextQuestionOrder: [null]
    })
    // if (isFeedBack) {
    //   form['controls']['choiceContent'].disable()
    //   form['controls']['answerLimitLength'].setValue(1000)
    // }
    return form
  }


  /**
   * Use for all: single choise, mutiple choise, feedback question
   **/
   initFeedbackForm(): FormGroup {
    const form = this.fb.group({
      feedBackId: [null],
      choiceContent: [{value: null, disabled: true}, [Validators.maxLength(255)]],
      answerLimitLength: [1000, [Validators.maxLength(10)]],
      rangeOrder: [null],
      nextSectionOrder: [null],
      nextQuestionOrder: [null]
    })
    // if (isFeedBack) {
    //   form['controls']['choiceContent'].disable()
    //   form['controls']['answerLimitLength'].setValue(1000)
    // }
    return form
  }

  initPointAnswerForm(): FormGroup {
    const form = this.fb.group({
      rangeId: [null],
      description: [null, [Validators.maxLength(255)]],
      fromPoint: [null, [Validators.maxLength(20)]],
      toPoint: [null, [Validators.maxLength(20)]],
      rangeOrder: [null],
      nextSectionOrder: [null],
      nextQuestionOrder: [null]
    })

    form['controls']['fromPoint'].setValidators(this.validateStartEndDate(form['controls']['toPoint']))
    form['controls']['toPoint'].setValidators(this.validateStartEndDate(form['controls']['fromPoint'], false))

    return form
  }

  initAttributeForm(order: number = 0): FormGroup {

    return this.fb.group({
      attId: [null, [Validators.required]],
      attOrder: [order]
    })
  }

  validateStartEndDate(remnantDate: AbstractControl, isStart: boolean = true): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let remnantValue = remnantDate.value ? +remnantDate.value : 0
      let selfValue = control.value ? +control.value : 0

      if (isStart) {
        if (remnantValue && selfValue >= remnantValue) {
          return { maxTwo: false }
        } else {
          remnantDate.setErrors(null)
        }
      } else {
        if (remnantValue && selfValue <= remnantValue) {
          return { minTwo: false }
        } else {
          remnantDate.setErrors(null)
        }
      }
      return null
    }
  }

  shareFormValue(values: any): void {
    let sectionList = values.listSection.map((section: any, index: number) => {
      let item = {
        value: section.uniqueCode,
        index: index + 1,
        listQuestion: null
      }

      item.listQuestion = section.listQuestion.map((question: any, index: number) => {
        let item = {
          value: question.uniqueCode,
          index: index + 1
        }
        return item
      })

      return item
    })
    // console.log(sectionList)
    this.sectionList = sectionList
    timer(200).subscribe(() => this.sectionListSubject.next(sectionList))
  }

  openSortDataDialog(data: FormArray, type: string): NzModalRef {
    return this.modal.create({
      nzContent: SortDataComponent,
      nzWrapClassName: 'vt-dialog',
      nzMaskClosable: false,
      nzWidth: '800px',
      nzComponentParams: {
        data,
        type
      },
    });
  }
}
