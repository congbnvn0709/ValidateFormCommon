import { SurveyQuestionModel } from "./survey-question.model"

export interface SurveySectionModel {
  description?: string
  listQuestion: SurveyQuestionModel[]
  nextSectionId?: number //??
  nextSectionOrder?: number //??
  sectionId?: number
  sectionName?: string
  sectionOrder: number
  status?: number
  surveyFormId: number //??

  // Use only FE
  isHaveAttribute?: boolean
}
