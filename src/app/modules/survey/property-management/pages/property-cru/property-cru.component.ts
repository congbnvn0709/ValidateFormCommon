import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PropertyManagementService } from 'src/app/services/property-management.service';
import { CrudAbstractComponent } from 'src/app/layouts/abstracts/crud.abstract.component';
import { ROUTERS } from 'src/app/shared/constants/router.const';
import { ACTIVE_STATUS_OPTION, SYSTEM_KEYS } from 'src/app/shared/constants/system.const';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'vt-property-cru',
  templateUrl: './property-cru.component.html',
  styleUrls: ['./property-cru.component.scss']
})
export class PropertyCruComponent extends CrudAbstractComponent implements OnInit {
  self = this
  readonly ACTIVE_STATUS_OPTION = ACTIVE_STATUS_OPTION
  typeData:any;
  isAdd: boolean;
  propertyID: string;
  isEdit:any;
  body = {
    "attCode": null,
    "attName": null,
    "dataType": null,
    "description": null,
    "required": null,
    "status": null
  }
  dataDetail:any;
  language:any;
  @ViewChild('input', { static: false })
   set input(element: ElementRef<HTMLInputElement>) {
     if(element) {
       element.nativeElement.focus()
     }
  }
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    injector: Injector,
    private propertyManagementService: PropertyManagementService,
    private message: NzMessageService
    ) {
      super(injector)
      this.propertyID = this.route.snapshot.params['id'];
      this.isAdd = !this.propertyID;
      if(!this.isAdd){
        this.initGetInforAricles(this.propertyID);
        if(this.router.url.indexOf('view') >-1){
          this.isEdit = true;
        }else{
          this.isEdit = false
        }
      }
      this.form = this.fb.group({
        name: [null, Validators.required],
        code: [null, Validators.required],
        type: [null, Validators.required],
        request: ['1', Validators.required],
        status: ['1', Validators.required],
        description: [null],
      });
   }
  ngOnInit(): void {
    this.propertyManagementService.getTypeData().subscribe((dt:any) => {
      if(dt){
        this.typeData = dt.map((item:any) => {
          if(this.language == 'vi'){
            item.currentValueType = item.nameVi
          }else{
            item.currentValueType = item.nameEn
          }
          return item;
        })
      }
    })
  }
  initGetInforAricles(id:any){
    this.propertyManagementService.getDetailSurveyProperty(id).subscribe((dt:any) => {
      if(dt){
        this.dataDetail = dt
        let desc = dt.description;
        if(!dt.description){
          desc = null
        }
        this.form.setValue({
          name: dt.attName,
          code: dt.attCode,
          type: dt.dataType?.toString(),
          request: dt.required?.toString(),
          status: dt.status?.toString(),
          description: desc
        })
      }
    })
  }
  createMessage(type: string): void {
    this.message.create(type,`${type}`);
  }
  override onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
      this.body.attCode = this.form.value.code?.trim().toUpperCase();
      this.body.attName = this.form.value.name?.trim();
      this.body.dataType = this.form.value.type?.trim();
      this.body.required = this.form.value.request;
      this.body.status = this.form.value.status;
      this.body.description = this.form.value.description?.trim();
      let contentMessage = {
        content: this.translateService.instant('survey_message.save_the_configuration')
      }
    if(this.isAdd){
      let modal: NzModalRef = this.dialogService.openDialogConfirm(contentMessage)
      modal.afterClose.subscribe((response: string) => {
        if (response === SYSTEM_KEYS.AGREE) {
          this.propertyManagementService.postSurveyProperty(this.body).subscribe(
            (dt:any) => {
              if(dt) {
                this.notification.success(this.translateService.instant('common.success'), this.translateService.instant('survey_message.create_property_success'))
                this.router.navigate([`${ROUTERS. SURVEY_MODULE}/${ROUTERS.PROPERTY}`]);
              }
            },(err:any) => {
              this.notification.error(this.translateService.instant('common.error'), this.translateService.instant(`${err.error.message}`))
            }
          )
        }
      })
    }else{
      if(this.isEdit == true){
        this.router.navigate([`${ROUTERS. SURVEY_MODULE}/${ROUTERS.PROPERTY}`])
        return;
      }else{
        this.body = {...this.body, ...{attId: this.propertyID}}
        let modal: NzModalRef = this.dialogService.openDialogConfirm(contentMessage)
        modal.afterClose.subscribe((response: string) => {
          if (response === SYSTEM_KEYS.AGREE) {
            this.propertyManagementService.editSurveysProperty(this.body).subscribe(
              (dt:any) => {
                if(dt){
                  this.notification.success(this.translateService.instant('common.success'), this.translateService.instant('survey_message.edit_property_success'))
                  this.router.navigate([`${ROUTERS. SURVEY_MODULE}/${ROUTERS.PROPERTY}`])
                }
              },(err:any) => {
                this.notification.error(this.translateService.instant('common.error'), this.translateService.instant(`${err.error.message}`))
              }
            )
          }
        })
      }
    }
  }
  override onCancel(): void{
    let contentMessage = {
      content: this.translateService.instant('survey_message.do_you_want_cancel')
    }
    let modal: NzModalRef = this.dialogService.openDialogConfirm(contentMessage)
    modal.afterClose.subscribe((response: string) => {
      if (response === SYSTEM_KEYS.AGREE) {
           this.router.navigate([`${ROUTERS. SURVEY_MODULE}/${ROUTERS.PROPERTY}`])
      }
    })
  }
}
