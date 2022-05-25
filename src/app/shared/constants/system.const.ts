import { en_US, vi_VN } from "ng-zorro-antd/i18n";

export const SYSTEM_KEYS = {
  AGREE: 'AGREE',
  CANCEL: 'CANCEL',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT'
}

export const ACTION_KEYS = {
  ADD: 'ADD',
  VIEW: 'VIEW',
  EDIT: 'EDIT',
  CLONE: 'CLONE',
  DELETE: 'DELETE',
  PREVIEW: 'PREVIEW'
}

export const LANGUAGES_DATA = [
    {
        value: 'vi',
        i18n: vi_VN,
        name: 'Việt Nam',
        icon: 'vn.png'
    },
    {
        value: 'en',
        i18n: en_US,
        name: 'English',
        icon: 'en.png'
    }
]

export const STORAGE_KEYS = {
    USER_DATA: 'USER_DATA',
    ROLES: 'ROLES',
    TOKEN: 'TOKEN',
    LANGUAGE: 'LANGUAGE'
}

export const ROLES = {
    ADMIN: 'ADMIN',
    MANAGE: 'MANAGE',
    PRODUCT: 'PRODUCT'
}

export const MODES = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  VIEW: 'VIEW',
  CLONE: 'CLONE',
  PREVIEW: 'PREVIEW'
}

export const ACTIVE_STATUS_OPTION = [
  {
    value: 1,
    label: 'common.active'
  },
  {
    value: 0,
    label: 'common.inactive'
  }
]
export const VOUCHER_REUSE_OPTION = [
  {
    value: 1,
    label: 'common.reuse'
  },
  {
    value: 0,
    label: 'common.unreuse'
  }
]
export const RECEIVE_OPTION = [
  {
    value: 1,
    label: 'common.receive'
  },
  {
    value: 0,
    label: 'common.unreceive'
  }
]
export const SCAN_OPTION = [
  {
    value: 1,
    label: 'common.scan'
  },
  {
    value: 0,
    label: 'common.unscan'
  }
]

export const TABLE_KEYS = {
  CHECKBOX: 'checkbox',
  DATE: 'date'
}

export const STATE = {
  UNCOMPLETE: 'uncomplete',
  COMPLETE: 'complete'
}
