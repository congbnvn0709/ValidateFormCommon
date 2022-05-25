export interface VoucherManagementModel {
  id: number
  code?: string
  name?: string
  note?: string
  createdDate?: Date
  status?: string | number
  isReuseVoucher?: boolean
  isRequiredReceive?: boolean
  isRequiredScan?: boolean
  isAdditionalVoucher?: boolean
  isSign?: boolean
  isDisplaymentVoucher?: boolean
}
