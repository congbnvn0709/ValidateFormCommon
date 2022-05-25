import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertyManagementRoutingModule } from './property-management-routing.module';
import { PropertyManageComponent } from './pages/property-manage/property-manage.component';
import { PropertyCruComponent } from './pages/property-cru/property-cru.component';
import { PropertyDetailComponent } from './pages/property-detail/property-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AntModule } from 'src/app/shared/utilities/ant.modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@NgModule({
  declarations: [
    PropertyManageComponent,
    PropertyCruComponent,
    PropertyDetailComponent
  ],
  imports: [
    CommonModule,
    PropertyManagementRoutingModule,
    TranslateModule,
    SharedModule,
    AntModule,
    FormsModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzInputNumberModule,
    NzMessageModule,
    NgxTrimDirectiveModule,
  ],
  providers: [
    NzNotificationService
  ]
})
export class PropertyManagementModule { }
