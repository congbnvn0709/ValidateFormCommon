export interface SurveyFeedbackAnswerModel {
  answerLimitLength?: number
  feedBackId?: number
  nextQuestionId?: number
  nextQuestionOrder?: number
  nextSectionId?: number
  nextSectionOrder?: number
  questionId?: number
  status?: number

  // Use for preview survey
  isAnswer?: boolean
}
