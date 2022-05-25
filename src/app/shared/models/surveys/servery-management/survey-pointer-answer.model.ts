export interface SurveyPointAnswerModel {
  description?: string
  fromPoint?: number
  nextQuestionId?: number
  nextQuestionOrder?: number
  nextSectionId?: number
  nextSectionOrder?: number
  questionId?: number
  rangeId?: number
  rangeOrder?: number
  status?: number
  toPoint?: number

  // Use for preview survey
  isAnswer?: boolean
}
