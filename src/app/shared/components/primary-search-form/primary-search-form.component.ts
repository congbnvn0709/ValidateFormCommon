import { SystemUtilsService } from './../../utilities/system.utils.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'vt-primary-search-form',
  templateUrl: './primary-search-form.component.html',
  styleUrls: ['./primary-search-form.component.scss']
})
export class PrimarySearchFormComponent implements OnInit {
  @Input() formInfo: any = []
  form!: FormGroup


  constructor(
    private fb: FormBuilder,
    private systermUtilsService: SystemUtilsService
  ) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm(): void {
    this.form = this.fb.group({})
    if (this.formInfo && this.formInfo.length > 0 ) {
      for (const controlInfo of this.formInfo) {
        this.checkHasRequired(controlInfo)
        let newControl = this.fb.control(controlInfo.defaultValue, controlInfo.validators)
        this.form.addControl(controlInfo.controlName, newControl)
      }

      for (const controlInfo of this.formInfo) {
        if (controlInfo.secondValidators) {
          this.setValidationAfterCreateForm(controlInfo)
        }
      }
    }
  }

  checkHasRequired(controlInfo: any) {
    if (controlInfo.validators && controlInfo.validators) {
      for (const validator of controlInfo.validators) {
        if (validator.name === 'required') {
          controlInfo.required = true
          break
        }
      }
    }
  }

  setValidationAfterCreateForm(controlInfo: any): void {
    switch (controlInfo.secondValidators.type) {
      case 'blockStartDate': {
        this.form.controls[controlInfo.controlName].setValidators(this.systermUtilsService.validateStartEndDate(this.form.controls[controlInfo.secondValidators.dependendControl]))
        break
      }
      case 'blockEndDate': {
        this.form.controls[controlInfo.controlName].setValidators(this.systermUtilsService.validateStartEndDate(this.form.controls[controlInfo.secondValidators.dependendControl], false))
        break
      }
    }
  }

}
