import { PATTERNS } from './../../../../../shared/constants/pattern.const';
import { MODES } from './../../../../../shared/constants/system.const';
import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { RouterDataModel } from 'src/app/shared/models/commons/router-data.model';
import { ShortObjectModel } from 'src/app/shared/models/commons/short-object.model';
import { SurveySharedService } from '../../utils/survey-shared.service';

@Component({
  selector: 'vt-section-question-feedback',
  templateUrl: './section-question-feedback.component.html',
  styleUrls: ['./section-question-feedback.component.scss']
})
export class SectionQuestionFeedbackComponent implements OnInit, OnChanges, OnDestroy {
  @Input() form!: FormGroup | any
  @Input() sectionUniqueCode: string = ''
  @Input() questionIndex: number = 0
  readonly PATTERNS = PATTERNS
  routerData!: RouterDataModel
  questionUniqueCode: string = ''
  sectionList: ShortObjectModel[] = []
  questionList: any[] = []

  sectionData: any = null
  sectionDataSubscription: Subscription = new Subscription()
  interactWithFormSubscription: Subscription = new Subscription()

  get answerForm(): FormArray | any {
    return <FormArray>this.form.controls.listSubQuestion
  }

  constructor(
    private surveySharedService: SurveySharedService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.data.subscribe((response: any) => {
      this.routerData = response
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form'] && changes['form'].currentValue) {
      this.questionUniqueCode = this.form.controls.uniqueCode.value
    }
  }

  ngOnInit(): void {
    this.listenShareData()
  }


  fillData(): void {
    let formValue = this.answerForm.value
    if (formValue) {
      formValue.forEach((answer: any, index: number) => {
        if (answer.nextSectionOrder) {
          this.onSectionChange(answer.nextSectionOrder, index, false)
        } else {
          this.questionList[index] = []
        }
      });
    }
  }

  listenShareData(): void {
    this.sectionData = this.surveySharedService.sectionList

    // Tr?????ng h???p s???p x???p l???i c??u h???i, fill l???i ????ng d??? li???u c???a ti???p t???c t???i ph???n, c??u
    if (this.sectionData && this.sectionData.length) {
      this.fillData()
    }
    if (!this.surveySharedService.sectionListSubject) return
    this.sectionDataSubscription = this.surveySharedService.sectionListSubject.subscribe((response: any) => {
      this.sectionData = response//response.filter((s: any) => s.value !== this.sectionUniqueCode)
      if (this.routerData.mode === MODES.EDIT) {
        this.fillData()
      }
    })

    this.interactWithFormSubscription = this.surveySharedService.interactWithForm.subscribe((response: boolean) => {
      // Ch??? ch???y sau khi sectionListSubject ch???y xong (c?? danh s??ch ph???n, c??u h???i m???i nh???t)
      // m???i fill l???i d??? li???u c???a ph???n, c??u h???i l??n ui
      timer(200).subscribe(() => {
        this.fillData()
        this.checkValueIsExist()
      })
    })
  }

  /**
   * Ki???m tra ph???n, c??u h???i ???? b??? x??a ch??a. N???u ???? b??? x??a th?? s??? clear d??? li???u c???a c??u tr??? l???i ??ang refer t???i
   **/
  checkValueIsExist(): void {
    const formValue = this.answerForm.value
    formValue.forEach((answer: any, index: number) => {
      if (answer.nextSectionOrder) {
        // Check ph???n
        let section = this.sectionData.find((s: any) => s.value === answer.nextSectionOrder)
        if (!section) {
          this.form.controls.listSubQuestion.controls[index].controls.nextSectionOrder.setValue(null)
        } else {
          // Check c??u h???i, ch??? check khi ph???n c?? gi?? tr???
          if (answer.nextQuestionOrder) {
            let question = section.listQuestion.find((s: any) => s.value === answer.nextQuestionOrder)
            if (!question) {
              this.form.controls.listSubQuestion.controls[index].controls.nextQuestionOrder.setValue(null)
            }
          }
        }
      }
    });
  }

  onRemove(index: number): void {
    const formValue = this.answerForm.controls[index].value
    if (formValue.choiceId) {
      this.surveySharedService.answerIdDeletedList.push(formValue.choiceId)
    }
    this.answerForm.removeAt(index)
  }

  onAddAnswer(): void {
    this.answerForm.push(this.surveySharedService.initFeedbackForm())
  }

  onSectionChange(value: string, index: number, isResetQuestionValue: boolean = true): void {
    this.questionList[index] = []
    // Trong tr?????ng h???p fill d??? li???u khi s???a th?? kh??ng c???n reset d??? li???u
    if (isResetQuestionValue) {
      this.answerForm.controls[index]['controls'].nextQuestionOrder.setValue(null)
    }
    let section = this.sectionData.find((s: any) => s.value === value)
    if (section && section.listQuestion) {
      this.questionList[index] = section.listQuestion//section.listQuestion.filter((s: any) => s.value !== this.questionUniqueCode)
    }
  }

  ngOnDestroy(): void {
    this.sectionDataSubscription.unsubscribe()
    this.interactWithFormSubscription.unsubscribe()
  }
}
