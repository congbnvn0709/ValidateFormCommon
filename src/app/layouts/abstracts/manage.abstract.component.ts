import {
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseAbstractComponent } from './base.abstract.component';

export abstract class ManageAbstractComponent extends BaseAbstractComponent {
  listTitle: string | any = ''

  form: FormGroup = new FormGroup({})
  isLoading: boolean = false

  onSubmit(): void {

  }
  onReset(): void {

  }
  onCreate(): void{
    
  }
}
