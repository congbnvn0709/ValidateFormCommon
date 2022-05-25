import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl, FormGroup } from '@angular/forms';

@Directive({
  selector: '[vtAutofocusInvalidField]'
})
export class AutofocusInvalidFieldDirective {

  constructor(
    private el: ElementRef,
    // private controls: NgControl,
    // private form: FormGroup
  ) { }

  @HostListener('ngSubmit', ['$event'])
  onSubmit(event: Event): void {
    try {
      const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid')
      /**
       * If form have field invalid
       * Finding the first field invalid and auto focus on it
       **/
      if (invalidElements.length > 0) {

        let classes: string = invalidElements[1].classList.value
        if (classes.indexOf('ant-select') !== -1) {
          invalidElements[1].firstElementChild.firstElementChild.firstElementChild
            ? invalidElements[1].firstElementChild.firstElementChild.firstElementChild.focus()
            : invalidElements[1].firstElementChild.children[1].firstElementChild.focus()
          return
        }

        if (classes.indexOf('ant-picker') !== -1) {
          invalidElements[1].firstElementChild.firstElementChild.focus()
          return
        }

        invalidElements[1].focus()
      }
    } catch (errors) {
      event.preventDefault()
    }
  }

}
