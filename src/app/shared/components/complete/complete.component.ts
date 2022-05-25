import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'vt-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss']
})
export class CompleteComponent implements OnInit {

  @Input() subtitle: string = 'common.complete_subtitle'

  constructor() { }

  ngOnInit(): void {
  }

}
