import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'vt-show-errors',
  templateUrl: './show-errors.component.html',
  styleUrls: ['./show-errors.component.scss']
})
export class ShowErrorsComponent implements OnInit {

  @Input() control: AbstractControl = new FormControl();
  @Input() controlName: string = '';
  @Input() value: any = null;
  @Input() remnantControlName: string = '';

  constructor() {
  }

  ngOnInit(): void {
  }

  get getFirstKeyError(): string {
    return (this.control && this.control.errors) ? Object.keys(this.control.errors)[0] : '';
  }

}
