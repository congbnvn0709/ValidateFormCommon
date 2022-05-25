import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SystemUtilsService {

  constructor() { }

  /**
   * Description: Validate Ngày bắt đầu phải nhỏ hơn Ngày kết thúc
   **/
  validateStartEndDate(remnantDate: AbstractControl, isStart: boolean = true, checkType: number = 1): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let remnantValue = remnantDate.value
      let selfValue = control.value

      if (!selfValue) {
        if (remnantValue) {
          remnantDate.setErrors(null)
          return null
        }
      } else {
        if (!remnantValue) return null
      }

      if (typeof (remnantValue) === 'string') remnantValue = new Date(remnantValue)
      if (typeof (selfValue) === 'string') selfValue = new Date(selfValue)

      if (checkType === 1) {
        remnantValue.setHours(0, 0, 0, 0)
        selfValue.setHours(0, 0, 0, 0)
      }
      if (checkType === 2) {
        remnantValue.setSeconds(0)
        selfValue.setSeconds(0)
      }

      if (isStart) {
        if (selfValue.getTime() > remnantValue.getTime()) {
          return { maxTwo: false }
        } else {
          remnantDate.setErrors(null)
        }
      } else {
        if (selfValue.getTime() < remnantValue.getTime()) {
          return { minTwo: false }
        } else {
          remnantDate.setErrors(null)
        }
      }
      return null
    }
  }

  /**
  * Description: Validate Ngày bắt đầu phải nhỏ hơn Ngày kết thúc
  * checkType:
  *   + 1 - compare day, month, year;
  *   + 2 - compare day, month, year, hour, minute;
  *   + 3 - compare day, month, year, hour, minute, second
  */
  validateStartEndTime(remnantDate: AbstractControl, isStart: boolean = true, checkType: number = 1): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let remnantValue = remnantDate.value
      let selfValue = control.value

      if (!selfValue) {
        if (remnantValue) {
          remnantDate.setErrors(null)
          return null
        }
      } else {
        if (!remnantValue) return null
      }

      if (typeof (remnantValue) === 'string') remnantValue = new Date(remnantValue)
      if (typeof (selfValue) === 'string') selfValue = new Date(selfValue)

      // Mong muốn ở đây là so sánh giờ phút giây nhưng trong case update thì ngày tháng đang khác nhau, cần phải chuyển về cùng một ngày
      let remnantHours = remnantValue.getHours()
      let remnantMinutes = remnantValue.getMinutes()
      let remnantSeconds = remnantValue.getSeconds()

      let selfHours = selfValue.getHours()
      let selfMinutes = selfValue.getMinutes()
      let selfSeconds = selfValue.getSeconds()
      if (checkType === 2) {
        remnantSeconds = 0
        selfSeconds = 0
      }

      remnantValue = new Date(`01/01/2020 ${remnantHours}:${remnantMinutes}:${remnantSeconds}`)
      selfValue = new Date(`01/01/2020 ${selfHours}:${selfMinutes}:${selfSeconds}`)

      if (isStart) {
        if (selfValue.getTime() > remnantValue.getTime()) {
          return { pattern: false }
        } else {
          remnantDate.setErrors(null)
        }
      } else {
        if (selfValue.getTime() < remnantValue.getTime()) {
          return { pattern: false }
        } else {
          remnantDate.setErrors(null)
        }
      }
      return null
    }
  }

  /**
  * Description: Validate Thời gian bắt đầu phải nhở hơn Thời gian kết thúc
  * - checkType
  *   + 1 - compare hour, minute, second;
  *   + 2 - compare hour, minute
  */
  validateMinMaxValue(remnantDate: AbstractControl, isStart: boolean = true, checkType: number = 1): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let remnantValue = remnantDate.value
      let selfValue = control.value

      if (!selfValue) {
        if (remnantValue) {
          remnantDate.setErrors(null)
          return null
        }
      } else {
        if (!remnantValue) return null
      }

      if (typeof (remnantValue) === 'string') remnantValue = +remnantValue
      if (typeof (selfValue) === 'string') selfValue = +selfValue

      if (isStart) {
        if (selfValue > remnantValue) {
          return { pattern: false }
        } else {
          remnantDate.setErrors(null)
        }
      } else {
        if (selfValue < remnantValue) {
          return { pattern: false }
        } else {
          remnantDate.setErrors(null)
        }
      }
      return null
    }
  }

  /**
   * Description: Transfer a day to begin day or end day
   * @Input value: The day that need to transfer
   * @Input isBegin: By default will return the begin day if want to transfer to end day then pass "false"
   * @Output The day is transfered
   **/
  getBeginOrEndDay(value: string | Date, isBegin: boolean = true): string {
    if (!value) return ''
    if (isBegin) {
      return moment(value).startOf('day').toISOString()
    } else {
      return moment(value).endOf('day').toISOString()
    }
  }

  /**
  * Description: ...
  * @Input ...
  * @Output ...
  */
  sort(data: any[], name: string, type: string = 'asc'): any {
    return data.sort((x: any, y: any) => x[name] && y[name] ? x[name].localeCompare(y[name], undefined, {
      numeric: true
    }) : x[name] ? -1 : y[name] ? 1 : 0)
  }
}
