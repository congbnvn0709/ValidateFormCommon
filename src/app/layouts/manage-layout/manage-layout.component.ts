import { Component, Input, OnInit } from '@angular/core';
import { ManageAbstractComponent } from 'src/app/layouts/abstracts/manage.abstract.component';

@Component({
  selector: 'vt-manage-layout',
  templateUrl: './manage-layout.component.html',
  styleUrls: ['./manage-layout.component.scss']
})
export class ManageLayoutComponent implements OnInit {
  @Input() self!: ManageAbstractComponent

  constructor() { }

  ngOnInit(): void {

  }

}
