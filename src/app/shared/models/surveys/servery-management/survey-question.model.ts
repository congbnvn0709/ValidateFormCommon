import { SurveyChoiceAnswerModel } from './survey-choice-answer.model';
import { SurveyAttributeModel } from './survey-attribute.model';
import { SurveyPointAnswerModel } from './survey-pointer-answer.model';
import { SurveyFeedbackAnswerModel } from './survey-feedback-answer.model';

export interface SurveyQuestionModel {
  content: string
  description?: string
  listAttributes: SurveyAttributeModel[]
  listSubQuestion: SurveyChoiceAnswerModel[] | SurveyPointAnswerModel[] | SurveyFeedbackAnswerModel[] | any
  questionId?: number
  questionOrder: number
  required: number
  sectionId?: number
  type: number

  // Use for preview survey
  answerContent?: any
  isHaveAttribute?: boolean
  rateValue?: number
}
