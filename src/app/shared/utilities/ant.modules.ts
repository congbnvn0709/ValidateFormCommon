import { NgModule } from '@angular/core';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzResultModule } from 'ng-zorro-antd/result';

export const AntModules = [
    NzLayoutModule,
    NzBreadCrumbModule,
    NzToolTipModule,
    NzCollapseModule,
    NzButtonModule,
    NzIconModule,
    NzMenuModule,
    NzSpaceModule,
    NzDividerModule,
    NzDropDownModule,
    NzFormModule,
    NzCheckboxModule,
    NzDrawerModule,
    NzRadioModule,
    NzInputModule,
    NzModalModule,
    NzAvatarModule,
    NzSpinModule,
    NzSelectModule,
    NzTableModule,
    NzPaginationModule,
    NzPopoverModule,
    NzDatePickerModule,
    NzRateModule,
    NzResultModule
]

@NgModule({
  imports: [
    AntModules
  ],
  exports: [
    AntModules
  ]
})
export class AntModule { }
