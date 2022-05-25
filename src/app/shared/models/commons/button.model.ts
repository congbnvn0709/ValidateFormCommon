import { NzButtonType } from "ng-zorro-antd/button";

export interface ButtonModel {
  key?: string
  label: string
  icon?: any
  data?: string
  isDisabled?: boolean
  type: NzButtonType
  action?: any
}
