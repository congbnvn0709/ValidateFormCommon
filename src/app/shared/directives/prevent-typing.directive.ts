import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[vtPreventTyping]',
})
export class PreventTypingDirective {
  @Input('vtPreventTyping') pattern: RegExp | any = '';

  constructor() {}

  @HostListener('keypress', ['$event'])
  onKeypress(event: any): void {
    if (this.pattern) {
      if (
        [8, 9, 13, 27].indexOf(event.keyCode) !== -1 ||
        // Ctrl + A
        (event.keyCode === 65 && (event.ctrlKey || event.metaKey)) ||
        // Ctrl + C
        (event.keyCode === 67 && (event.ctrlKey || event.metaKey)) ||
        // Ctrl + V
        (event.keyCode === 86 && (event.ctrlKey || event.metaKey)) ||
        // Ctrl + X
        (event.keyCode === 88 && (event.ctrlKey || event.metaKey))
      ) {
        return;
      }
    }

    if (this.pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: any): void {
    // || window['clipboardData']
    const data = event.clipboardData.getData('Text');
    for (const char of data) {
      if (this.pattern.test(char)) {
        event.preventDefault();
      }
    }
  }
}
