import { TABLE_KEYS } from 'src/app/shared/constants/system.const';
import { ConfigColumnModel } from './../../../shared/models/commons/config-column.model';

export const BUSINESS_TYPE: ConfigColumnModel[] = [
  {
    title: 'business.businessID',
    propertyName: 'businessId',
    align: 'right',
    sortKey: 'business_id',
    width: '120px'
  },
  {
    title: 'business.business_type',
    propertyName: 'businessType',
    align: 'left',
    sortKey: 'business_type',
    width: '150px'
  },
  {
    title: 'business.business_code',
    propertyName: 'businessCode',
    align: 'left',
    sortKey: 'business_code',
    width: '120px'
  },
  {
    title: 'business.business_name',
    propertyName: 'businessName',
    align: 'left',
    sortKey: 'business_name'
  },
  {
    title: 'common.scenario',
    propertyName: 'scenario',
    align: 'left',
    sortKey: 'survey_form_code',
    width: '120px'
  },
  {
    title: 'business.business_frequency',
    propertyName: 'frequencyInDay',
    align: 'left',
    sortKey: 'frequency_in_day',
    width: '170px'
  },
  {
    title: 'common.status',
    propertyName: 'status',
    align: 'center',
    sortKey: 'status',
    width: '130px'
  },
  {
    title: 'common.created_user',
    propertyName: 'createdBy',
    align: 'left',
    sortKey: 'created_by',
    width: '130px'
  },
  {
    title: 'common.created_date',
    propertyName: 'createdDate',
    align: 'center',
    type: TABLE_KEYS.DATE,
    sortKey: 'created_date',
    width: '130px'
  },
  {
    title: 'common.updated_user',
    propertyName: 'lastModifiedBy',
    align: 'left',
    sortKey: 'last_modified_by',
    width: '130px'
  },
  {
    title: 'common.updated_date',
    propertyName: 'lastModifiedDate',
    align: 'center',
    type: TABLE_KEYS.DATE,
    sortKey: 'last_modified_date',
    width: '130px'
  },
]
export const LIST_ATTRIBUTE: ConfigColumnModel[] = [
  {
    title: 'survey.survey_property_code_attribute',
    propertyName: 'attCode',
    align: 'left',
    isSort: false
  },
  {
    title: 'survey.survey_property_id_attribute',
    propertyName: 'attId',
    align: 'right',
    isSort: false
  },
  {
    title: 'survey.survey_property_name_attribute',
    propertyName: 'attName',
    align: 'left',
    isSort: false
  },
  {
    title: 'business.attribute_value',
    propertyName: 'attValue',
    align: 'left',
    isSort: false
  }
]