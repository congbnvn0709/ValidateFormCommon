import { PATTERNS } from './../../../../../shared/constants/pattern.const';
import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { MODES } from 'src/app/shared/constants/system.const';
import { RouterDataModel } from 'src/app/shared/models/commons/router-data.model';
import { ShortObjectModel } from 'src/app/shared/models/commons/short-object.model';
import { SurveySharedService } from '../../utils/survey-shared.service';

@Component({
  selector: 'vt-section-question-point',
  templateUrl: './section-question-point.component.html',
  styleUrls: ['./section-question-point.component.scss']
})
export class SectionQuestionPointComponent implements OnInit, OnChanges, OnDestroy {
  @Input() form!: FormGroup | any
  @Input() sectionUniqueCode: string = ''
  @Input() questionIndex: number = 0
  readonly PATTERNS = PATTERNS
  routerData!: RouterDataModel
  questionUniqueCode: string = ''
  pointValue: ShortObjectModel[] = []

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
    this.pointValue = this.generatePointValue()
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

    // Trường hợp sắp xếp lại câu hỏi, fill lại đúng dữ liệu của tiếp tục tới phần, câu
    if (this.sectionData && this.sectionData.length) {
      this.fillData()
    }
    if (!this.surveySharedService.sectionListSubject) return
    this.sectionDataSubscription = this.surveySharedService.sectionListSubject.subscribe((response: any) => {
      this.sectionData = response //response.filter((s: any) => s.value !== this.sectionUniqueCode)
      if (this.routerData.mode === MODES.EDIT) {
        this.fillData()
      }
    })

    this.interactWithFormSubscription = this.surveySharedService.interactWithForm.subscribe((response: boolean) => {
      // Chỉ chạy sau khi sectionListSubject chạy xong (có danh sách phần, câu hỏi mới nhất)
      // mới fill lại dữ liệu của phần, câu hỏi lên ui
      timer(200).subscribe(() => {
        this.fillData()
        this.checkValueIsExist()
      })
    })
  }

  /**
   * Kiểm tra phần, câu hỏi đã bị xóa chưa. Nếu đã bị xóa thì sẽ clear dữ liệu của câu trả lời đang refer tới
   **/
  checkValueIsExist(): void {
    const formValue = this.answerForm.value
    formValue.forEach((answer: any, index: number) => {
      if (answer.nextSectionOrder) {
        // Check phần
        let section = this.sectionData.find((s: any) => s.value === answer.nextSectionOrder)
        if (!section) {
          this.form.controls.listSubQuestion.controls[index].controls.nextSectionOrder.setValue(null)
        } else {
          // Check câu hỏi, chỉ check khi phần có giá trị
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
    if (formValue.rangeId) {
      this.surveySharedService.answerPointIdDeletedList.push(formValue.rangeId)
    }
    this.answerForm.removeAt(index)
  }

  onAddAnswer(): void {
    this.answerForm.push(this.surveySharedService.initPointAnswerForm())
  }

  generatePointValue(): ShortObjectModel[] {
    let result = []
    for (let index = 0; index < 10; index++) {
      index + 1
      result.push({
        value: index + 1,
        label: index + 1
      })
    }
    return result
  }

  onSectionChange(value: string, index: number, isResetQuestionValue: boolean = true): void {
    this.questionList[index] = []

    // Trong trường hợp fill dữ liệu khi sửa thì không cần reset dữ liệu
    if (isResetQuestionValue) {
      this.answerForm.controls[index]['controls'].nextQuestionOrder.setValue(null)
    }
    let section = this.sectionData.find((s: any) => s.value === value)
    if (section && section.listQuestion) {
      this.questionList[index] = section.listQuestion//section.listQuestion.filter((s: any) => s.value !== this.questionUniqueCode)
    }
  }

  onFromPointChange(value: any, index: number): void {
    // let toValue = this.form.controls.listSubQuestion.controls[index].controls.toPoint.value
    // if (value) {
    //   this.form.controls.listSubQuestion.controls[index].controls.toPoint.setValue(toValue, { emitViewToModelChange: false })
    //   this.form.controls.listSubQuestion.controls[index].controls.toPoint.addValidators(Validators.required)
    // } else {
    //   this.form.controls.listSubQuestion.controls[index].controls.toPoint.setValue(toValue, { emitViewToModelChange: false })
    //   this.form.controls.listSubQuestion.controls[index].controls.toPoint.removeValidators(Validators.required)
    // }
    // this.form.updateValueAndValidity()
  }

  onToPointChange(value: any, index: number): void {
    // let fromValue = this.form.controls.listSubQuestion.controls[index].controls.fromPoint.value
    // if (value) {
    //   this.form.controls.listSubQuestion.controls[index].controls.fromPoint.setValue(fromValue, { emitViewToModelChange: false })
    //   this.form.controls.listSubQuestion.controls[index].controls.fromPoint.addValidators(Validators.required)
    // } else {
    //   this.form.controls.listSubQuestion.controls[index].controls.fromPoint.setValue(fromValue, { emitViewToModelChange: false })
    //   this.form.controls.listSubQuestion.controls[index].controls.fromPoint.removeValidators(Validators.required)
    // }
    // this.form.updateValueAndValidity()
  }

  ngOnDestroy(): void {
    this.sectionDataSubscription.unsubscribe()
    this.interactWithFormSubscription.unsubscribe()
  }
}

