import { TranslateService } from '@ngx-translate/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { SurveySharedService } from '../../utils/survey-shared.service';
import { v4 as uuidv4 } from 'uuid';
import { Subscription, timer } from 'rxjs';
import * as _ from 'lodash'
import { ConfirmDialogModel } from 'src/app/shared/models/commons/confirm-dialog.model';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DialogService } from 'src/app/shared/dialogs/dialog.service';
import { SYSTEM_KEYS } from 'src/app/shared/constants/system.const';
@Component({
  selector: 'vt-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit, OnChanges, OnDestroy {
  @Input() form!: FormGroup | any
  sectionUniqueCode: string = ''

  currentSectionIndex: number = -1
  currentSectionSubscription: Subscription = new Subscription()


  sectionData: any[] = []
  sectionDataSubscription: Subscription = new Subscription()
  interactWithFormSubscription: Subscription = new Subscription()

  constructor(
    private surveySharedService: SurveySharedService,
    private dialogService: DialogService,
    private translateService: TranslateService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['form'] && changes['form'].currentValue) {
    //   this.sectionUniqueCode = this.form.controls.uniqueCode.value
    // }
  }

  get sectionsForm(): FormArray | any {
    return <FormArray>this.form.controls['listSection']
  }

  ngOnInit(): void {
    this.surveySharedService.currentSection.subscribe(index => {
      this.currentSectionIndex
    })
    this.listenShareData()
  }

  listenShareData(): void {
    this.currentSectionSubscription = this.surveySharedService.currentSection.subscribe(index => {
      this.currentSectionIndex = index
    })

    if (this.surveySharedService.sectionList) {
      this.sectionDataSubscription = this.surveySharedService.sectionListSubject.subscribe((response: any) => {
        if (response) {
          let _response = _.cloneDeep(response)
          this.sectionData = _response.map((s: any) => {
            s.value = s.index
            s.listQuestion = []
            return s
          })
        }
        // this.sectionAndQuestionInfo = response
      })
    }

    this.interactWithFormSubscription = this.surveySharedService.interactWithForm.subscribe((response: boolean) => {
      // - Chỉ chạy sau khi sectionListSubject chạy xong (có danh sách phần, câu hỏi mới nhất)
      // - kiểm tra lại dữ liệu có còn đúng không
      timer(200).subscribe(() => {
        this.checkValueIsExist()
      })
    })
  }

  /**
   * Kiểm tra phần đã bị xóa chưa. Nếu đã bị xóa thì sẽ clear dữ liệu mà phần đang refer tới
   **/
  checkValueIsExist(): void {
    const formValue = this.sectionsForm.getRawValue()
    formValue.forEach((section: any, index: number) => {
      if (section.nextSectionOrder) {
        // Check phần
        let sectionItem = this.sectionData.find((s: any) => s.value === section.nextSectionOrder)
        if (!sectionItem) {
          this.sectionsForm.controls[index].controls.nextSectionOrder.setValue(null)
        }
      }
    });
  }

  sectionList(index: number): any {
    // let uniqueCode = this.sectionsForm.controls[index]['controls'].uniqueCode.value
    if (this.sectionData) {
      let result = this.sectionData.filter((s: any, idx: number) => index !== idx)
      return result
    }
    return []
  }



  // onChenSection(): void {
  //   this.sectionsForm.push(this.surveySharedService.initSectionForm())
  // }

  /**
  * index: index of section form array
  */
  // onAddQeustion(index: number): void {
  //   let sectionForm = <FormGroup>this.sectionsForm.controls[index]
  //   let questionFormArray = <FormArray>sectionForm.controls['questions']
  //   questionFormArray.push(this.surveySharedService.initQuestionForm())

  //   this.surveySharedService.sectionList.push({
  //     value: uuidv4(),
  //     label: ''
  //   })
  //   this.surveySharedService.sectionListSubject.next(this.surveySharedService.sectionList)
  // }

  onSectionClick(index: number): void {
    if (index !== this.currentSectionIndex) {
      this.surveySharedService.currentQuestion.next(-1)
    }
    this.surveySharedService.currentSection.next(index)
  }

  onSortSection(): void {
    let questions = _.cloneDeep(this.form.controls['listSection'] as FormArray)
    let modal: NzModalRef = this.surveySharedService.openSortDataDialog(questions, 'section')
    modal.afterClose.subscribe((response: FormArray | any) => {
      if (response) {
        this.form.controls['listSection'] = response
      }
    })
  }

  onRemoveSection(index: number): void {
    let dialogParam: ConfirmDialogModel = {
      content: this.translateService.instant('survey_message.comfirm_delete_section')
    }
    let modal: NzModalRef = this.dialogService.openDialogConfirm(dialogParam)
    modal.afterClose.subscribe((response: string) => {
      if (response === SYSTEM_KEYS.AGREE) {
        let sectionDeletedValue = this.sectionsForm.controls[index].value
        if (sectionDeletedValue.sectionId) {
          this.surveySharedService.sectionIdDeletedList.push(sectionDeletedValue.sectionId)
        }
        this.sectionsForm.removeAt(index)
        this.surveySharedService.interactWithForm.next(true)
      }
    })
  }

  ngOnDestroy(): void {
    this.currentSectionSubscription.unsubscribe()
    this.sectionDataSubscription.unsubscribe()
    this.interactWithFormSubscription.unsubscribe()
  }
}
