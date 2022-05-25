import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AntModule } from 'src/app/shared/utilities/ant.modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { BusinessManagementComponent } from './pages/business-management/business-management.component';
import { BusinessCrudComponent } from './pages/business-crud/business-crud.component';
import { BusinessRoutingModule } from './business-routing.module';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

@NgModule({
  declarations: [
    BusinessManagementComponent,
    BusinessCrudComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AntModule,
    SharedModule,
    TranslateModule,
    BusinessRoutingModule,
    NgxTrimDirectiveModule,
    NzInputNumberModule
  ],
  providers: [
    NzNotificationService
  ]
})
export class BusinessModule { }
