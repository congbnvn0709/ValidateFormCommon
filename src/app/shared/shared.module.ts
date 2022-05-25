import { PaginationComponent } from './components/pagination/pagination.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UppercaseDirective } from './directives/uppercase.directive';
import { AutofocusDirective } from './directives/autofocus.directive';
import { AutofocusInvalidFieldDirective } from './directives/autofocus-invalid-field.directive';
import { CurrentTimeDirective } from './directives/current-time.directive';
import { PreventTypingDirective } from './directives/prevent-typing.directive';
import { ShowErrorsComponent } from './components/show-errors/show-errors.component';
import { TranslateModule } from '@ngx-translate/core';
import { PrimaryTableComponent } from './components/primary-table/primary-table.component';
import { AntModule } from './utilities/ant.modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckAuthorizesDirective } from './directives/check-authorizes.directive';
import { PrimarySearchFormComponent } from './components/primary-search-form/primary-search-form.component';
import { BaseLayoutComponent } from '../layouts/base-layout/base-layout.component';
import { CrudLayoutComponent } from '../layouts/crud-layout/crud-layout.component';
import { ManageLayoutComponent } from '../layouts/manage-layout/manage-layout.component';
import { RouterModule } from '@angular/router';
import { CompleteComponent } from './components/complete/complete.component';

const COMPONENTS = [
  PaginationComponent,
  ShowErrorsComponent,
  PrimaryTableComponent,
  UppercaseDirective,
  AutofocusDirective,
  AutofocusInvalidFieldDirective,
  CurrentTimeDirective,
  PreventTypingDirective,
  CheckAuthorizesDirective,
  PrimarySearchFormComponent,
  CrudLayoutComponent,
  BaseLayoutComponent,
  ManageLayoutComponent,
  CompleteComponent
]

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ],
  imports: [
    AntModule,
    RouterModule,
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
