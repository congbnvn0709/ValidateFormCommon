import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[vtAutofocus]'
})
export class AutofocusDirective {

  constructor(
    private el: ElementRef
  ) { }

  ngOnInit() {
    setTimeout(() => {
      let classes: string = this.el.nativeElement.classList.value
      // If element is select DOM
      if (classes.indexOf('ant-select') !== -1) {
        this.el.nativeElement.firstElementChild.firstElementChild.focus()
        return
      }
      this.el.nativeElement.focus()
    }, 10)
  }

}
