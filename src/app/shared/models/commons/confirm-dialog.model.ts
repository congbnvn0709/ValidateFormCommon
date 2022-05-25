import { ButtonModel } from "./button.model";

export interface ConfirmDialogModel {
  title?: string;
  content?: string;
  buttons?: ButtonModel[];
}
