import { TABLE_KEYS } from 'src/app/shared/constants/system.const';
import { ConfigColumnModel } from './../../../shared/models/commons/config-column.model';
export const VOUCHER_COLUMNS: ConfigColumnModel[] = [
  {
    title: 'Mã chứng từ',
    propertyName: 'code'
  },
  {
    title: 'Tên chứng từ',
    propertyName: 'name'
  },
  {
    title: 'Ghi chú',
    propertyName: 'note'
  },
  {
    title: 'Ngày tạo',
    propertyName: 'createdDate',
    type: TABLE_KEYS.DATE,
    align: 'center'
  },
  {
    title: 'Trạng thái',
    propertyName: 'status'
  },
  {
    title: 'Chứng từ dùng lại',
    propertyName: 'isReuseVoucher'
  },
  {
    title: 'Yêu cầu tiếp nhận',
    propertyName: 'isRequiredReceive',
    align: 'center'
  },
  {
    title: 'Yêu cầu scan',
    propertyName: 'isRequiredScan',
    align: 'center'
  },
  {
    title: 'Chứng từ bổ sung',
    propertyName: 'isAdditionalVoucher',
    type: TABLE_KEYS.CHECKBOX,
    isSort: false,
    align: 'center'
  },
  {
    title: 'Chữ ký số',
    propertyName: 'isSign',
    type: TABLE_KEYS.CHECKBOX,
    isSort: false,
    align: 'center'
  },
  {
    title: 'Chứng từ thay thế',
    propertyName: 'isDisplaymentVoucher'
  }
]
