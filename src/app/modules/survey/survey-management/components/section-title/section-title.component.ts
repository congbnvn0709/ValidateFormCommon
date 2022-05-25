import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'vt-section-title',
  templateUrl: './section-title.component.html',
  styleUrls: ['./section-title.component.scss']
})
export class SectionTitleComponent implements OnInit {
  @Input() form!: FormGroup | any

  constructor() { }

  ngOnInit(): void {
  }

}
