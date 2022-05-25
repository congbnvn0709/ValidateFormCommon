import { TABLE_KEYS } from './../../../../shared/constants/system.const';
import { ConfigColumnModel } from "src/app/shared/models/commons/config-column.model";

export const SURVEY_COLUMNS: ConfigColumnModel[] = [
  {
    title: 'survey_management.code',
    propertyName: 'surveyFormCode',
    sortKey: 'surveyFormCode',
    width: '120px'
  },
  {
    title: 'survey_management.name',
    propertyName: 'surveyFormName',
    sortKey: 'surveyFormName'
  },
  {
    title: 'common.description',
    propertyName: 'description',
    sortKey: 'description'
  },
  {
    title: 'common.status',
    propertyName: 'status',
    sortKey: 'status',
    align: 'center',
    width: '100px'
  },
  {
    title: 'common.created_user',
    propertyName: 'createdBy',
    sortKey: 'createdBy',
    align: 'left',
    width: '80px'
  },
  {
    title: 'common.created_date',
    propertyName: 'createdDate',
    sortKey: 'createdDate',
    align: 'center',
    width: '100px',
    type: TABLE_KEYS.DATE
  },
  {
    title: 'common.updated_user',
    propertyName: 'lastModifiedBy',
    sortKey: 'lastModifiedBy',
    align: 'left',
    width: '100px'
  },
  {
    title: 'common.updated_date',
    propertyName: 'lastModifiedDate',
    sortKey: 'lastModifiedDate',
    align: 'center',
    width: '100px',
    type: TABLE_KEYS.DATE
  }
]

export const QUESTION_TYPE = {
  SINGLE: 3,
  MULTIPLE: 4,
  POINT: 2,
  FEEDBACK: 1
}

export const SURVEY_TYPE = [
  {
    value: 1,
    label: 'SMS'
  },
  {
    value: 2,
    label: 'WEB'
  }
]

export const PREVIEW_STEP = {
  CONFIG_ATTRIBUTE: 'config_attribute',
  DISPLAY_QUESTION: 'display_question',
  COMPLETE: 'complete'
}

export const ATTRIBUTE_TYPE = {
  TEXT: 'TEXT_TYPE',
  NUMBER: 'NUMBER_TYPE',
  DATE_TIME: 'DATETIME_TYPE'
}
