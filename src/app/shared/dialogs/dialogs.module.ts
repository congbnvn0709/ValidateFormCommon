import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogsComponent } from './confirm-dialogs/confirm-dialogs.component';
import { UploadDialogsComponent } from './upload-dialogs/upload-dialogs.component';
import { AntModule } from '../utilities/ant.modules';

// import { NzSpaceModule } from 'ng-zorro-antd/space';

export const components = [
  ConfirmDialogsComponent,
  UploadDialogsComponent
]

@NgModule({
  declarations: [
    components
  ],
  exports: [
    components
  ],
  imports: [
    CommonModule,
    AntModule
    // NzSpaceModule
  ]
})
export class DialogsModule { }
