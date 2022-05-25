import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NzModalService } from "ng-zorro-antd/modal";

@Injectable({
  providedIn: 'root'
})
export class SurveyPreviewSharedService {

  constructor(
    private fb: FormBuilder,
    private modal: NzModalService
  ) { }

  initPreviewForm(): FormGroup {
    return this.fb.group({
      section: this.fb.array([])
    })
  }

  initSectionForm(): FormGroup {
    return this.fb.group({
      isHaveAttribute: [false],
      label: [null],
      value: [null],
      question: this.fb.array([])
    })
  }
  initQuestionForm(): FormGroup {
    return this.fb.group({
      isHaveAttribute: [false],
      label: [null],
      value: [null],
      attribute: this.fb.array([])
    })
  }
  initAttributeForm(): FormGroup {
    return this.fb.group({
      label: [null],
      value: [null],
      type: [null],
      required: [0],
      content: [null]
    })
  }
}
