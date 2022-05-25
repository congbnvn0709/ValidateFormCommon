import { ROUTERS } from 'src/app/shared/constants/router.const';
import { ACTIVE_STATUS_OPTION, MODES } from 'src/app/shared/constants/system.const';
import { Subscription, timer } from 'rxjs';
import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CrudAbstractComponent } from 'src/app/layouts/abstracts/crud.abstract.component';
import { SurveySharedService } from '../../utils/survey-shared.service';
import { QUESTION_TYPE, SURVEY_TYPE } from '../../utils/survey.const';
import { SurveyService } from 'src/app/services/surveys/survey.service';
import { SurveyPropertyService } from 'src/app/services/surveys/survey-property.service';
import { ValidateModel } from 'src/app/shared/models/commons/validate.model';
import * as _ from 'lodash';
import { PATTERNS } from 'src/app/shared/constants/pattern.const';

@Component({
  selector: 'vt-survey-cru',
  templateUrl: './survey-cru.component.html',
  styleUrls: ['./survey-cru.component.scss']
})
export class SurveyCruComponent extends CrudAbstractComponent implements OnInit, OnDestroy {
  readonly SURVEY_TYPE = SURVEY_TYPE
  readonly STATUS_DATA = ACTIVE_STATUS_OPTION
  readonly PATTERNS = PATTERNS
  self = this
  tempForm: FormGroup = new FormGroup({})

  currentSectionIndex: number = -1
  currentQuestionIndex: number = -1

  currentSectionSubscription: Subscription = new Subscription()
  currentQuestionSubscription: Subscription = new Subscription()
  interactWithFormSubscription: Subscription = new Subscription()

  generating: boolean = false

  constructor(
    private fb: FormBuilder,
    injector: Injector,
    private surveySharedService: SurveySharedService,
    private surveyService: SurveyService,
    private surveyPropertyService: SurveyPropertyService
  ) {
    super(injector)
    this.activatedRoute.params.subscribe((response: any) => {
      if (response && response.id) {
        this.id = response.id
        this.getDetail()
      }
    })
  }

  // get scenarioForm(): FormGroup {
  //   return <FormGroup>this.form.controls['scenario']
  // }
  get sectionsForm(): FormArray | any {
    return <FormArray>this.form.controls['listSection']
  }

  ngOnInit(): void {
    this.initBaseData()
    this.initForm()
    this.listenShareData()
    this.loadData()
  }

  initBaseData(): void {
    this.saveApi = 'survey-forms'
    this.cancelPath = `${ROUTERS.SURVEY_MODULE}/${ROUTERS.SURVEY}`
    this.createCofirmMessage = this.translateService.instant('survey_message.comfirm_save_survey')
    this.createSuccessMessage = this.translateService.instant('message.save_success')
    this.updateCofirmMessage = this.translateService.instant('survey_message.comfirm_update_survey')
    this.updateSuccessMessage = this.translateService.instant('message.save_success')
  }

  initForm(): void {
    this.form = this.surveySharedService.initForm()
    let values = this.form.getRawValue()
    this.surveySharedService.shareFormValue(values)
  }

  listenShareData(): void {
    this.currentSectionSubscription = this.surveySharedService.currentSection.subscribe((index: number) => {
      this.currentSectionIndex = index
    })

    this.currentQuestionSubscription = this.surveySharedService.currentQuestion.subscribe((index: number) => {
      this.currentQuestionIndex = index
    })

    this.interactWithFormSubscription = this.surveySharedService.interactWithForm.subscribe((response: boolean) => {
      this.triggerInteractForm()
    })
  }

  loadData(): void {
    this.surveyPropertyService.getAll().subscribe((response: any) => {
      response = _.orderBy(response, ['attCode'], ['asc'])
      this.surveySharedService.attributeList = response
      this.surveySharedService.attributeListSubject.next(response)
    })
  }

  getDetail() {
    this.surveyService.detail(this.id).subscribe((response: any) => {
      this.fillDataToEdit(response)
    }, errors => {
      this.notification.error(this.translateService.instant('common.error'), errors.error.message || 'Have error occur')
    })
  }

  fillDataToEdit(data: any): void {
    this.form = this.surveySharedService.initForm(false)
    this.form.patchValue(data)
    if (data.listSection) {
      data.listSection.forEach((section: any, sectionIndex: number) => {
        section.uniqueCode = section.sectionId
        let sectionForm = this.surveySharedService.initSectionForm(false)
        sectionForm.patchValue(section)
        this.sectionsForm['controls'].push(sectionForm)

        if (section.listQuestion) {
          section.listQuestion.forEach((question: any, questionIndex: number) => {
            question.uniqueCode = question.questionId
            let questionForm = this.surveySharedService.initQuestionForm(false)
            questionForm.patchValue(question)
            this.sectionsForm.controls[sectionIndex]['controls'].listQuestion.controls.push(questionForm)

            if (question.listAttributes) {
              question.listAttributes.forEach((att: any, index: number) => {
                let attForm = this.surveySharedService.initAttributeForm()
                attForm.patchValue(att)
                this.sectionsForm.controls[sectionIndex]['controls'].listQuestion.controls[questionIndex]['controls'].listAttributes.controls.push(attForm)
              });
            }

            question.listSubQuestion.forEach((answer: any, index: number) => {
              let answerForm: FormGroup = this.fb.group({})
              answer.nextSectionOrder = answer.nextSectionId
              answer.nextQuestionOrder = answer.nextQuestionId
              switch (question.type) {
                case QUESTION_TYPE.SINGLE:
                case QUESTION_TYPE.MULTIPLE: {
                  // let newForm =
                  answerForm = this.surveySharedService.initAnswerForm()
                  break;
                }
                case QUESTION_TYPE.FEEDBACK: {
                  answerForm = this.surveySharedService.initFeedbackForm()
                  break;
                }
                case QUESTION_TYPE.POINT: {
                  answerForm = this.surveySharedService.initPointAnswerForm()
                  break;
                }
              }
              answerForm.patchValue(answer)
              this.sectionsForm.controls[sectionIndex]['controls'].listQuestion.controls[questionIndex]['controls'].listSubQuestion.controls.push(answerForm)
            });
          });
        }
      });
    }

    this.surveySharedService.shareFormValue(data)
  }

  onSurveyTypeChange(value: number): void {
    // if (value === SURVEY_TYPE[0].value) {
    //   this.notification.warning(this.translateService.instant('common.warning'), this.translateService.instant('survey_message.survey_sms'))
    // }
  }

  onAddSection(): void {
    if (this.currentSectionIndex === -1) {
      this.currentSectionIndex = this.sectionsForm.controls.length > 0 ? this.sectionsForm.controls.length - 1 : 0
    }
    this.sectionsForm.controls.splice(this.currentSectionIndex + 1, 0, this.surveySharedService.initSectionForm())

    this.triggerInteractForm()
  }

  onAddQuestion(): void {
    if (this.sectionsForm.controls.length === 0) return
    if (this.currentSectionIndex === -1) {
      this.currentSectionIndex = this.sectionsForm.controls.length > 0 ? this.sectionsForm.controls.length - 1 : 0
    }
    let questionForm = <FormArray>this.sectionsForm.controls[this.currentSectionIndex]['controls'].listQuestion
    let formValue = this.form.getRawValue()
    // Khi là SMS thì số câu hỏi trong một phần chỉ là một
    if (formValue.surveyFormType === SURVEY_TYPE[0].value && questionForm.controls.length === 1) {
      this.notification.info(this.translateService.instant('common.info'), this.translateService.instant('survey_message.survey_sms'))
      return
    }
    if (this.currentQuestionIndex === -1) {
      this.currentQuestionIndex = questionForm.length > 0 ? questionForm.length - 1 : 0
    }

    questionForm.controls.splice(this.currentQuestionIndex + 1, 0, this.surveySharedService.initQuestionForm())
    this.triggerInteractForm()
  }

  triggerInteractForm(): void {
    let values = this.form.getRawValue()
    this.surveySharedService.shareFormValue(values)
    this.form.updateValueAndValidity()
  }

  override checkValidateForm(): boolean {

    /**
     * Hostfix: Gặp lỗi check validate khi một form group chứa một form array -> check không đúng -> check từng control
     **/
    let formInvalid = false
    for (const controlName of Object.keys(this.form.controls)) {
      if (controlName !== 'listSection') {
        if (this.form.controls[controlName].invalid) {
          formInvalid = true
          break
        }
      }
    }
    if (formInvalid) {
      this.form.markAllAsTouched()
      return false
    }

    let result = true
    let sections = this.form.controls['listSection'] as FormArray
    sections.controls.forEach((section: FormGroup | any) => {
      for (const sectionControlName of Object.keys(section.controls)) {
        if (sectionControlName !== 'listQuestion') {
          if (section.controls[sectionControlName].invalid) {
            section.markAllAsTouched()
            result = false
            console.log(sectionControlName + ': invalid')
          }
        }
      }
      let questions = section.controls.listQuestion as FormArray
      questions.controls.forEach((question: FormGroup | any) => {
        for (const questionControlName of Object.keys(question.controls)) {
          if (questionControlName !== 'listAttributes' && questionControlName !== 'listSubQuestion') {
            if (question.controls[questionControlName].invalid) {
              question.markAllAsTouched()
              result = false
              console.log(questionControlName + ': invalid')
            }
          }
        }
        let attributeForm = question.controls.listAttributes as FormArray
        attributeForm.controls.forEach((attribute: FormGroup | any) => {
          if (attribute.invalid) {
            attribute.markAllAsTouched()
            result = false
          }
        })

        let answers = question.controls.listSubQuestion as FormArray
        answers.controls.forEach((answer: FormGroup | any) => {
          if (answer.invalid) {
            answer.markAllAsTouched()
            result = false
          }
        })
      })
    });
    return result
  }

  override checkValidDataBeforeSave(formValue: any): ValidateModel {
    let result: ValidateModel = {
      valid: true
    }
    if (formValue.listSection) {
      for (const [index, section] of formValue.listSection.entries()) {
        let questionIndex = 0
        if (section.listQuestion) {
          result = this.validateCountNumberQuestion(formValue, section.listQuestion, index)
          if (!result.valid) break

          for (const question of section.listQuestion) {
            result = this.validateAttribute(question, index, questionIndex)
            if (!result.valid) break
            result = this.validateRangeOfPoint(question, index, questionIndex)
            if (!result.valid) break
            questionIndex++
          }
          if (!result.valid) break
        }
      }
    }
    return result
  }

  /**
 * Validate thuộc tính của câu hỏi
 **/
  validateAttribute(question: any, sectionIndex: number, questionIndex: number): ValidateModel {
    let result: ValidateModel = {
      valid: true
    }

    // Validate tham số
    let pattern = new RegExp(/{\d+}+/gm)
    if (question.content) {
      let params = question.content.match(pattern)

      if (params && params.length) {
        params = params.map((p: string) => {
          const number = new RegExp(/\d+/g)
          let rs: number[] | any = p.match(number)
          return +rs[0]
        })
      }

      if (!params) params = []

      // Kiểm tra các thuộc tính bị trùng
      for (const pr of params) {
        let checkExit = params.filter((s: number) => s === pr)
        if (checkExit.length > 1) {
          result.valid = false
          result.message = this.translateService.instant('survey_message.duplicate_attribute', {
            attribute: `{${pr}}`
          })
          return result
        }
      }

      // Kiểm tra các thuộc tính đã được cấu hình chưa
      let paramNotConfig = params.filter((s: number) => {
        return !(_.some(question.listAttributes, ['attOrder', s]))
      })

      if (paramNotConfig.length > 0) {
        paramNotConfig = paramNotConfig.map((s: number) => `{${s}}`)
        result.valid = false
        result.message = this.translateService.instant('survey_message.not_config_attribute', {
          section: sectionIndex + 1,
          question: questionIndex + 1,
          value: paramNotConfig.join(', ')
        })
      }

      // Kiểm tra các thuộc tính đã cấu hình đã được sử dụng hay chưa
      let paramNotUse = question.listAttributes.filter((s: any) => {
        return !(params.includes(s.attOrder))
      })

      if (paramNotUse.length > 0) {
        paramNotUse = paramNotUse.map((s: any) => `{${s.attOrder}}`)
        result.valid = false
        result.message = this.translateService.instant('survey_message.attribute_not_use', {
          section: sectionIndex + 1,
          question: questionIndex + 1,
          value: paramNotUse.join(', ')
        })
      }

    }
    return result
  }

  /**
  * Description: Validate loại kịch bản SMS, một phần chỉ có một câu hỏi
  */
  validateCountNumberQuestion(formValue: any, question: any, sectionIndex: number): ValidateModel {
    let result: ValidateModel = {
      valid: true
    }

    // Khi là SMS thì số câu hỏi trong một phần chỉ là một
    if (formValue.surveyFormType === SURVEY_TYPE[0].value && question.length > 1) {
      result.valid = false
      result.message = this.translateService.instant('survey_message.survey_sms_2', {
        section: sectionIndex + 1
      })
    }
    return result
  }

  /**
   * Validate câu trả lời là loại thang điểm
   **/
  validateRangeOfPoint(question: any, sectionIndex: number, questionIndex: number): ValidateModel {
    let result: ValidateModel = {
      valid: true
    }

    // Validate câu trả lời: thang điểm
    if (question.listSubQuestion) {
      let lastToPoint = 0
      if (question.type === QUESTION_TYPE.POINT) {
        question.listSubQuestion.map((answer: any, index: number) => {
          // switch (question.type) {
          //   case QUESTION_TYPE.POINT: {
          answer.rangeOrder = index + 1

          // Validate thang điểm
          let fromPoint = answer.fromPoint ? +answer.fromPoint : 0
          let toPoint = answer.toPoint ? +answer.toPoint : 0
          if (index === 0 && (fromPoint && fromPoint !== 1)) {
            result.valid = false
            result.message = this.translateService.instant('survey_message.validate_range_point_3', {
              section: sectionIndex + 1,
              question: questionIndex + 1
            })
          }
          if (index > 0) {
            if (fromPoint <= lastToPoint) {
              result.valid = false
              result.message = this.translateService.instant('survey_message.validate_range_point_1', {
                section: sectionIndex + 1,
                question: questionIndex + 1
              })
            }
            if ((fromPoint - lastToPoint) > 1) {
              result.valid = false
              result.message = this.translateService.instant('survey_message.validate_range_point_2', {
                section: sectionIndex + 1,
                question: questionIndex + 1
              })
            }
          }
          lastToPoint = toPoint
          // break
          // }
          //   }
        })
      }
    }
    return result
  }

  override prepareDataToSave() {
    let formValue = this.form.getRawValue()
    if (formValue.listSection) {
      formValue.listDeletedSectionId = this.surveySharedService.sectionIdDeletedList
      formValue.listDeletedQuestionId = this.surveySharedService.questionIdDeletedList
      formValue.listDeletedChoiceId = this.surveySharedService.answerIdDeletedList
      formValue.listDeletedRangeId = this.surveySharedService.answerPointIdDeletedList
      // formValue.listDeletedAttId = this.surveySharedService.attributeIdDeletedList
      formValue.listSection = formValue.listSection.map((section: any, sectionIndex: number) => {
        section.sectionOrder = sectionIndex + 1

        if (section.listQuestion) {
          section.listQuestion = section.listQuestion.map((question: any, questionIndex: number) => {
            question.questionOrder = questionIndex + 1
            if (question.listSubQuestion) {
              question.listSubQuestion.map((answer: any, index: number) => {

                switch (question.type) {
                  case QUESTION_TYPE.SINGLE:
                  case QUESTION_TYPE.MULTIPLE: {
                    answer.choiceOrder = index + 1
                    break
                  }
                  case QUESTION_TYPE.FEEDBACK: {
                    // Với loại câu hỏi là Góp ý, cần xóa thuộc tính choiceContent
                    // back-end mới convert về đúng luồng
                    delete answer.choiceContent
                    break
                  }
                  case QUESTION_TYPE.POINT: {
                    answer.rangeOrder = index + 1
                    break
                  }
                }

                if (answer.nextSectionOrder) {
                  formValue.listSection.forEach((_section: any, _sectionIndex: number) => {
                    if (_section.uniqueCode === answer.nextSectionOrder) {
                      answer.nextSectionOrder = _sectionIndex + 1

                      if (answer.nextQuestionOrder) {
                        _section.listQuestion.forEach((_question: any, _questionIndex: number) => {
                          if (_question.uniqueCode === answer.nextQuestionOrder) {
                            answer.nextQuestionOrder = _questionIndex + 1
                          }
                        });
                      }
                    }
                  });
                }
              })
            }
            return question
          })
        }
        return section
      })
    }
    return formValue
  }

  ngOnDestroy(): void {
    this.currentSectionSubscription.unsubscribe()
    this.currentQuestionSubscription.unsubscribe()
    this.interactWithFormSubscription.unsubscribe()
  }
}
