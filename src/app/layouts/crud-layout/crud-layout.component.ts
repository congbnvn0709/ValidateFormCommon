import { Component, Input, OnInit } from '@angular/core';
import { CrudAbstractComponent } from 'src/app/layouts/abstracts/crud.abstract.component';
import { ActivatedRoute } from '@angular/router';
import { RouterDataModel } from 'src/app/shared/models/commons/router-data.model';
import { STATE } from 'src/app/shared/constants/system.const';

@Component({
  selector: 'vt-crud-layout',
  templateUrl: './crud-layout.component.html',
  styleUrls: ['./crud-layout.component.scss']
})
export class CrudLayoutComponent implements OnInit {
  readonly STATE = STATE
  @Input() self?: CrudAbstractComponent
  @Input() classes: string = ''
  routerData!: RouterDataModel

  constructor(
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response: any) => {
      this.routerData = response
    })
  }
}
