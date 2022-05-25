import { STATE } from './../../../../../shared/constants/system.const';
import { FormArray, Validators } from '@angular/forms';
import { ValidateModel } from './../../../../../shared/models/commons/validate.model';
import { ATTRIBUTE_TYPE, PREVIEW_STEP, QUESTION_TYPE } from './../../utils/survey.const';
import { SurveySectionModel } from './../../../../../shared/models/surveys/servery-management/survey-section.model';
import { SurveyChoiceAnswerModel } from './../../../../../shared/models/surveys/servery-management/survey-choice-answer.model';
import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { CrudAbstractComponent } from 'src/app/layouts/abstracts/crud.abstract.component';
import { SurveyService } from 'src/app/services/surveys/survey.service';
import { CruSurveyModel } from 'src/app/shared/models/surveys/servery-management/survey-cru.model';
import { SurveyQuestionModel } from 'src/app/shared/models/surveys/servery-management/survey-question.model';
import * as _ from 'lodash';
import { SurveyPreviewSharedService } from '../../utils/survey-preview-shared.service';
import { PATTERNS } from 'src/app/shared/constants/pattern.const';
import { ROUTERS } from 'src/app/shared/constants/router.const';
import * as moment from 'moment';

@Component({
  selector: 'vt-survey-preview',
  templateUrl: './survey-preview.component.html',
  styleUrls: ['./survey-preview.component.scss']
})
export class SurveyPreviewComponent extends CrudAbstractComponent implements OnInit, OnDestroy {
  readonly PREVIEW_STEP = PREVIEW_STEP
  readonly ATTRIBUTE_TYPE = ATTRIBUTE_TYPE
  readonly PATTERNS = PATTERNS
  self = this
  surveyInfo!: CruSurveyModel
  sections!: SurveySectionModel[]
  sectionsHaveAttribute!: SurveySectionModel[]
  displayData!: SurveyQuestionModel[] // List question for display on the ui
  prepareDisplayData: SurveyQuestionModel[] = []
  readonly QUESTION_TYPE = QUESTION_TYPE
  sectionLength: number = 0
  currentStep: string = ''
  subtitle: string = ''

  /**
  * Bài toán:
  * - Lần đầu tiên luôn hiện thị các câu hỏi ở phần đầu tiên.
  * - Các câu hỏi ở màn sau phụ thuộc vào câu trả lời của các câu hỏi ở màn trước đó.
  * - Cần:
  *     + Check câu hỏi có required hay không. Khi câu hỏi required thì đã được trả lời hay chưa
  *     + Loại bỏ các câu hỏi khi đã được sử dụng/trả lời
  */

  constructor(
    injector: Injector,
    private surveyService: SurveyService,
    private surveyPreviewSharedService: SurveyPreviewSharedService
  ) {
    super(injector)
    this.activatedRoute.params.subscribe((response: any) => {
      if (response && response.id) {
        this.id = response.id
        this.onLoadData()
      }
    })
  }

  ngOnInit(): void {
    this.initBaseData()
  }

  initBaseData(): void {
    // this.saveApi = 'survey-forms'
    this.cancelPath = `${ROUTERS.SURVEY_MODULE}/${ROUTERS.SURVEY}`
    // this.configCancelButton.label = this.translateService.instant('common.comeback')
  }


  /**
  * Description: Load data
  */
  onLoadData(): void {
    this.surveyService.detail(this.id).subscribe((response: CruSurveyModel) => {
      this.surveyInfo = response
      this.sectionLength = this.surveyInfo.listSection.length
      this.checkQuestionHaveAttribute()
    }, errors => {
      this.notification.error(this.translateService.instant('common.error'), errors.error.message || 'Have error occur')
    })
  }

  /**
  * Description: Kiểm tra và đánh dấu danh sách section có câu hỏi có chứa thuộc tính
  */
  checkQuestionHaveAttribute(): void {
    let isHaveAttribute = false
    for (const section of this.surveyInfo.listSection) {
      let questions = section.listQuestion.filter((question: SurveyQuestionModel) => {
        if (question.listAttributes.length > 0) {
          question.isHaveAttribute = true
        }
        return question.listAttributes.length > 0
      })
      if (questions.length > 0) {
        isHaveAttribute = true
        section.isHaveAttribute = true
      }
    }

    /**
    * Kiểm tra: Nếu có câu hỏi có tham số thì khởi tạo form cấu hình giá trị cho tham số và hiện thị màn hình cấu hình tham số.
    * Nếu không hiện thị màn hình preview
    */
    if (isHaveAttribute) {
      this.initConfigParamForm()
      this.currentStep = PREVIEW_STEP.CONFIG_ATTRIBUTE
      this.configCancelButton.isDisplay = false
    } else {
      this.refactorAndInitData()
      this.currentStep = PREVIEW_STEP.DISPLAY_QUESTION
      this.configCancelButton.isDisplay = true
    }
  }

  refactorAndInitData(): void {
    this.sections = _.cloneDeep(this.surveyInfo.listSection)
    this.refactorData()
    this.getQuestionOfFirstSection()
  }

  /**
  * Description: Khởi tạo form nhập dữ liệu cho tham số
  */
  initConfigParamForm(): void {
    this.form = this.surveyPreviewSharedService.initPreviewForm()
    for (const section of this.surveyInfo.listSection) {
      let form = this.form.controls['section'] as FormArray
      let sectionNewForm = this.surveyPreviewSharedService.initSectionForm()
      sectionNewForm.patchValue({ isHaveAttribute: section.isHaveAttribute, value: section.sectionId })
      for (const question of section.listQuestion) {
        let questionForm = sectionNewForm.controls['question'] as FormArray
        let questionNewForm = this.surveyPreviewSharedService.initQuestionForm()
        questionNewForm.patchValue({ isHaveAttribute: question.isHaveAttribute, label: question.content, value: question.questionId })
        for (const attribute of question.listAttributes) {
          let attributeForm = questionNewForm.controls['attribute'] as FormArray
          let attributeNewForm = this.surveyPreviewSharedService.initAttributeForm()

          switch (attribute.dataType) {
            case ATTRIBUTE_TYPE.TEXT: {
              attributeNewForm.controls['content'].addValidators(Validators.maxLength(1000))
              break
            }
            case ATTRIBUTE_TYPE.NUMBER: {
              attributeNewForm.controls['content'].addValidators(Validators.maxLength(15))
              break
            }
            case ATTRIBUTE_TYPE.DATE_TIME: {
              attributeNewForm.controls['content'].addValidators(Validators.maxLength(11))
              break
            }
          }
          if (attribute.required === 1) {
            attributeNewForm.controls['content'].addValidators(Validators.required)
          }
          let newValue = {
            label: attribute.attName,
            value: attribute.attId,
            type: attribute.dataType,
            required: attribute.required
          }
          attributeNewForm.patchValue(newValue)
          attributeNewForm.updateValueAndValidity()
          attributeForm.push(attributeNewForm)
        }
        questionForm.push(questionNewForm)
      }
      form.push(sectionNewForm)
    }
  }

  /**
  * Description: Lấy danh sách câu hỏi của phần đầu tiên
  */
  getQuestionOfFirstSection(): void {
    let firstSection = this.sections.splice(0, 1)
    this.refactorRangeQuestion(firstSection[0].listQuestion)
  }

  /**
  * Description: Đối với câu hỏi thang điểm: Lấy ra số sao cần hiện thị lên màn hình dựa vào field 'toPoint'
  */
  refactorRangeQuestion(data: SurveyQuestionModel[]): void {
    data.forEach((question: SurveyQuestionModel) => {
      if (question.type === QUESTION_TYPE.POINT) {
        question.rateValue = question.listSubQuestion[question.listSubQuestion.length - 1].toPoint
      }
    });
    this.displayData = data
  }

  /**
  * Description: Khởi tạo câu trả cho các câu hỏi luôn luôn là null, riêng với loại hỏi được chọn nhiều là một mảng rỗng
  */
  refactorData(): void {
    this.surveyInfo.listSection.map((section: SurveySectionModel) => {
      section.listQuestion = section.listQuestion.map((question: SurveyQuestionModel) => {
        question.answerContent = null

        if (question.type === QUESTION_TYPE.MULTIPLE) {
          question.answerContent = []
          question.listSubQuestion = question.listSubQuestion.map((answer: SurveyChoiceAnswerModel) => {
            answer.isAnswer = false
            return answer
          })
        }
        return question
      })
      return section
    })
  }

  /**
  * Description: Xử lý với loại câu hỏi được chọn nhiều. Các đáp án được chọn sẽ được lưu dưới dạng mạng
  */
  onMutilQuestionChanged(event: boolean, id: number, index: number): void {
    if (!this.displayData[index].answerContent) {
      this.displayData[index].answerContent = []
    }
    if (event) {
      this.displayData[index].answerContent.push(id)
    } else {
      this.displayData[index].answerContent = this.displayData[index].answerContent.filter((s: number) => s !== id)
    }
  }

  /**
  * Description: Clear user answer
  */
  onClearAnswer(): void {
    this.displayData.forEach((question: SurveyQuestionModel) => {
      question.answerContent = null
      if (question.type === QUESTION_TYPE.MULTIPLE) {
        question.answerContent = []
        question.listSubQuestion.forEach((answer: SurveyChoiceAnswerModel) => {
          answer.isAnswer = false
        });
      }
    });
  }

  override onContinue(): void {
    switch (this.currentStep) {
      case PREVIEW_STEP.CONFIG_ATTRIBUTE: {
        this.checkConfigAttribute()
        break;
      }
      case PREVIEW_STEP.DISPLAY_QUESTION: {
        this.nextQuestions()
        break;
      }
      case PREVIEW_STEP.COMPLETE: {
        console.log('Completed')
        break;
      }
    }
  }

  override onComplete(): void {
    // this.onCancel()
    this.router.navigate([`/${this.cancelPath}`])
  }

  // override onCancel(): void {
  //   this.router.navigate([`/${this.cancelPath}`])
  // }

  checkConfigAttribute(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    this.fillAttributeDataOnQuestionContent()
    this.refactorAndInitData()
    this.configCancelButton.isDisplay = true
    this.currentStep = PREVIEW_STEP.DISPLAY_QUESTION
  }

  /**
  * Description: Điền dữ liệu của thuộc tính vào nội dung câu hỏi
  */
  fillAttributeDataOnQuestionContent(): void {
    let formValue = this.form.getRawValue()
    this.surveyInfo.listSection.forEach((section: SurveySectionModel, sectionIndex: number) => {
      if (section.isHaveAttribute) {
        section.listQuestion.forEach((question: SurveyQuestionModel, questionIndex: number) => {
          if (question.isHaveAttribute) {
            let attributeValue = formValue.section[sectionIndex].question[questionIndex].attribute
            let pattern = new RegExp(/{\d+}+/gm)
            let params: string[] | any = question.content.match(pattern)
            params.forEach((element: string, index: number) => {
              if (attributeValue[index].content) {
                if (attributeValue[index].type === ATTRIBUTE_TYPE.DATE_TIME) {
                  let dateFormated = moment(attributeValue[index].content).format(this.FORMAT.DATE_TIME_REVERT_MOMENT)
                  question.content = question.content.replace(element, dateFormated)
                } else {
                  question.content = question.content.replace(element, attributeValue[index].content)
                }
              }
            });
          }
        });
      }
    })
  }

  nextQuestions(): void {
    let checkValid = this.validateRequireQuestion()
    if (!checkValid.valid) {
      this.notification.error(this.translateService.instant('common.error'), checkValid.message)
      return
    }

    this.findNextQuestions()
    if (this.displayData.length === 0) {
      this.currentStep = PREVIEW_STEP.COMPLETE
      this.state = STATE.COMPLETE
      this.configCancelButton.isDisplay = false
      this.subtitle = this.translateService.instant('survey_management.survey_success_subtitle')
    }
  }

  validateRequireQuestion(): ValidateModel {
    let result: ValidateModel = {
      valid: true
    }
    let index = 0
    for (const question of this.displayData) {
      if (question.required) {
        switch (question.type) {
          case QUESTION_TYPE.SINGLE:
          case QUESTION_TYPE.POINT:
          case QUESTION_TYPE.FEEDBACK: {
            if (!question.answerContent) {
              result.valid = false
              result.message = this.translateService.instant('survey_message.question_is_unanswer', { number: index + 1 })
            }
            break
          }
          case QUESTION_TYPE.MULTIPLE: {
            if (!question.answerContent || question.answerContent.length === 0) {
              result.valid = false
              result.message = this.translateService.instant('survey_message.question_is_unanswer', { number: index + 1 })
            }
            break
          }
        }
      }
      if (!result.valid) break
      index++
    }
    return result
  }

  /**
  * Description: Tìm các câu hỏi tiếp theo dựa vào câu trả lời của các câu hỏi đang hiện thị
  */
  findNextQuestions(): void {
    this.displayData.forEach((question: SurveyQuestionModel) => {
      switch (question.type) {
        case QUESTION_TYPE.SINGLE: {
          if (question.answerContent) {
            for (const answer of question.listSubQuestion) {
              if (answer.choiceId === question.answerContent) {
                this.getReferInfoOfAnswer(question.sectionId || 0, answer)
                break
              }
            }
          }
          break
        }
        case QUESTION_TYPE.MULTIPLE: {
          if (question.answerContent && question.answerContent.length > 0) {
            question.answerContent.sort()
            let questionIdBiggest = question.answerContent[question.answerContent.length - 1]
            for (const answer of question.listSubQuestion) {
              if (answer.choiceId === questionIdBiggest) {
                this.getReferInfoOfAnswer(question.sectionId || 0, answer)
                break
              }
            }
          }
          break
        }
        case QUESTION_TYPE.POINT: {
          if (question.answerContent) {
            for (const answer of question.listSubQuestion) {
              if (answer.fromPoint <= question.answerContent && question.answerContent <= answer.toPoint) {
                this.getReferInfoOfAnswer(question.sectionId || 0, answer)
                break
              }
            }
          }
          break
        }
        case QUESTION_TYPE.FEEDBACK: {
          this.getReferInfoOfAnswer(question.sectionId || 0, question.listSubQuestion[0])
          break
        }
      }
    });
    // console.log(this.prepareDisplayData)
    let data = _.cloneDeep(this.prepareDisplayData)
    this.prepareDisplayData = []
    this.refactorRangeQuestion(data)
  }

  getReferInfoOfAnswer(sectionId: number, answer: SurveyChoiceAnswerModel): void {
    if (answer.nextSectionId && answer.nextQuestionId) {
      this.findReferQuestion(answer.nextSectionId, answer.nextQuestionId)
    } else {
      if (answer.nextSectionId) {
        this.findReferSection(answer.nextSectionId)
      } else {

        let _sectionId = this.findReferSectionOfSection(sectionId)
        this.findReferSection(_sectionId)
      }
    }
  }

  /**
  * Description: Tìm các câu hỏi tiếp theo dựa vào thông tin "chuyển tới phần và câu hỏi" của câu trả lời
  */
  findReferQuestion(sectionId: number, questionId: number): void {
    let section = this.sections.find((section: SurveySectionModel) => section.sectionId === sectionId)
    if (section) {
      let questionIndex = -1
      for (const [index, question] of section.listQuestion.entries()) {
        if (question.questionId === questionId) {
          questionIndex = index
          break
        }
      }
      if (questionIndex > -1) {
        let question = section.listQuestion.splice(questionIndex, 1)
        if (question) this.prepareDisplayData.push(question[0])
      }
    }
  }

  /**
  * Description: Tìm các câu hỏi tiếp theo dựa vào thông tin "chuyển tới phần" của câu trả lời
  */
  findReferSection(sectionId: number): void {
    let sectionIndex = -1
    for (const [index, section] of this.sections.entries()) {
      if (section.sectionId === sectionId) {
        sectionIndex = index
      }
    }
    if (sectionIndex > -1) {
      let section: SurveySectionModel[] = this.sections.splice(sectionIndex, 1)
      this.prepareDisplayData.push(...section[0].listQuestion)
    }
  }

  /**
  * Description: Trong case phần chuyển tới phần. Lấy ra Id của 'phần được refer tới' dựa vào Id của phần
  */
  findReferSectionOfSection(sectionId: number): number {
    let section = this.surveyInfo.listSection.find((s: SurveySectionModel) => s.sectionId === sectionId)
    if (section) return section.nextSectionId as number
    return 0
  }

  ngOnDestroy(): void {

  }
}
