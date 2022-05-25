import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterDataModel } from 'src/app/shared/models/commons/router-data.model';

@Component({
  selector: 'vt-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss']
})
export class BaseLayoutComponent implements OnInit {

  isLoading: boolean = false
  routerData!: RouterDataModel

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response: any) => {
      this.routerData = response
    })
  }

}
