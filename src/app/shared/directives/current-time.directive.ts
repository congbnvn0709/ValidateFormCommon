import { DATE_FORMAT_VI } from './../constants/format.const';
import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import * as moment from 'moment';

@Directive({
  selector: '[vtCurrentTime]',
})
export class CurrentTimeDirective {
  constructor(private el: ElementRef, private controls: NgControl) {}

  /**
   * Đối với date picker (chỉ chọn ngày tháng không chọn thời gian)
   * -> chỉ lấy giá trị của thời gian trong lần đầu tiên pick,
   * trong case cập nhập thì lấy time khi tạo.
   * Mong muốn và mục đính: Mỗi lần pick thì lấy thời gian tại thời điểm pick
   **/
  @HostListener('ngModelChange')
  onChange() {
    let value = this.controls.value;
    if (value) {
      value = moment(value).format(DATE_FORMAT_VI.DATE);
      let currentTime = moment(new Date()).format(DATE_FORMAT_VI.TIME);
      let lastValue = new Date(value + ' ' + currentTime);
      if (lastValue.toString() !== 'Invalid Date') {
        this.controls.control?.setValue(lastValue, {
          emitViewToModelChange: false,
        });
        this.controls.control?.updateValueAndValidity()
      }
    }
  }
}
