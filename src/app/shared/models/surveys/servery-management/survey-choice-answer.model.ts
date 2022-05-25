export interface SurveyChoiceAnswerModel {
  choiceContent?: string
  choiceId?: number
  choiceOrder?: number
  nextQuestionId?: number
  nextQuestionOrder?: number
  nextSectionId?: number
  nextSectionOrder?: number
  questionId?: number
  status?: number

  // Use for preview survey
  isAnswer?: boolean
}


