/**
 * Ở app component có hàm check ngông ngữ và copy nội dùng của DATE_FORMAT_VI, DATE_FORMAT_EN tương ứng vào DATE_FORMAT
 **/
export const DATE_FORMAT: any = { }


export const DATE_FORMAT_VI: any = {
    DATE: 'dd/MM/yyyy',
    DATE_MOMENT: 'DD/MM/yyyy hh:mm:ss', // format by moment
    DATE_TIME: 'dd/MM/yyyy hh:mm:ss',
    DATE_TIME_REVERT: 'hh:mm:ss dd/MM/yyyy',
    DATE_TIME_REVERT_MOMENT: 'hh:mm:ss DD/MM/yyyy',
    TIME: 'HH:mm:ss'
}

export const DATE_FORMAT_EN: any = {
  DATE: 'MM/dd/yyyy',
  DATE_MOMENT: 'MM/DD/yyyy hh:mm:ss',
  DATE_TIME: 'MM/dd/yyyy hh:mm:ss',
  DATE_TIME_REVERT: 'hh:mm:ss MM/dd/yyyy',
  DATE_TIME_REVERT_MOMENT: 'hh:mm:ss MM/DD/yyyy',
  TIME: 'HH:mm:ss'
}
