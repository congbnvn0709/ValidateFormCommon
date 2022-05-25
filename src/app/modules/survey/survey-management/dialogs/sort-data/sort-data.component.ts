import { FormArray, FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';

interface DropzoneLayout {
  container: string;
  list: string;
  dndHorizontal: boolean;
}


@Component({
  selector: 'vt-sort-data',
  templateUrl: './sort-data.component.html',
  styleUrls: ['./sort-data.component.scss']
})
export class SortDataComponent implements OnInit {
  @Input() data!: FormArray
  @Input() type!: string
  oldIndex: number = 0;
  formInteract!: FormGroup

  private readonly verticalLayout: DropzoneLayout = {
    container: "row",
    list: "column",
    dndHorizontal: false
  };

  layout: DropzoneLayout = this.verticalLayout;

  constructor(
    private modal: NzModalRef
  ) {

  }

  ngOnInit(): void {
    // console.log(this.data)
  }


  //#region Control drag and drop
  onDragged(item: any, effect: DropEffect, index: number) {
    if (effect === "move") {
      if (index < this.oldIndex) this.oldIndex += 1
      this.data.controls.splice(this.oldIndex, 1)
    }
  }

  onDragStart(index: number): void {
    this.oldIndex = index
    this.formInteract = <FormGroup>this.data.controls[index]
  }

  onDrop(event: DndDropEvent) {
    let index = event.index;
    if (typeof index === "undefined") {
      index = this.data.controls.length;
    }
    if (this.formInteract) {
      this.data.controls.splice(index, 0, this.formInteract)
    }
  }

  //#endregion END - Control drag and drop

  getValue(index: number): any {
    let form = this.data.controls[index] as FormGroup
    let controlName = this.type === 'section' ? 'sectionName' : 'content'
    let value = form.controls[controlName].value
    return value
  }

  onSave(): void {
    this.modal.close(this.data)
  }

  onClose(): void {
    this.modal.close(null)
  }
}
