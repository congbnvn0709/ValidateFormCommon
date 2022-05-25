import { TABLE_KEYS } from 'src/app/shared/constants/system.const';
import { ConfigColumnModel } from './../../../../shared/models/commons/config-column.model';

export const PROPERTY_COLUMNS: ConfigColumnModel[] = [
  {
    title: 'survey.survey_property_code_attribute',
    propertyName: 'attCode',
    align: 'left',
    sortKey: 'attCode'
  },
  {
    title: 'survey.survey_property_name_attribute',
    propertyName: 'attName',
    align: 'left',
    sortKey: 'attName'
  },
  {
    title: 'survey.survey_property_description',
    propertyName: 'description',
    align: 'left',
    sortKey: 'description'
  },
  {
    title: 'survey.survey_property_creator',
    propertyName: 'createdBy',
    align: 'left',
    sortKey: 'createdBy',
    width: '130px'
  },
  {
    title: 'survey.survey_property_create_at',
    propertyName: 'createDate',
    type: TABLE_KEYS.DATE,
    align: 'center',
    sortKey: 'createDate',
    width: '130px'
  },
  {
    title: 'survey.survey_property_editor',
    propertyName: 'lastModifiedBy',
    align: 'left',
    sortKey: 'lastModifiedBy',
    width: '130px'
  },
  {
    title: 'survey.survey_property_date_update',
    propertyName: 'lastModifiedDate',
    type: TABLE_KEYS.DATE,
    align: 'center',
    sortKey: 'lastModifiedDate',
    width: '130px'
  },
  {
    title: 'survey.survey_property_status',
    propertyName: 'status',
    align: 'center',
    sortKey: 'status',
    width: '130px'
  }
]
