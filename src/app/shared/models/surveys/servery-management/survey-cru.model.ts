import { SurveySectionModel } from "./survey-section.model"

export interface CruSurveyModel {
  description?: string
  listDeletedChoiceId: any[]
  listDeletedQuestionId: any[]
  listDeletedRangeId: any[]
  listDeletedSectionId: any[]
  listSection: SurveySectionModel[]
  status?: number
  surveyFormCode: string
  surveyFormId?: number
  surveyFormName: string
  surveyFormType: number
}
