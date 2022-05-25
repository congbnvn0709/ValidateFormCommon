import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'vt-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnChanges {
  /**
   * Lưu ý: Total phải lớn hơn 0 thì pagination mới hiện thị
   */
  @Input() pageIndex: number = 1
  @Output() pageIndexChange: EventEmitter<number> = new EventEmitter()
  @Input() pageSize: number = 10
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter()
  @Input() total: number = 0
  @Input() pageSizeOptions: number[] = [10, 20, 30, 50, 100]

  fromRecord: number = 1
  toRecord: number = 10

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageIndex']?.currentValue || changes['pageSize']?.currentValue) {
      this.calculatorNumberShowRecord()
    }
    if (changes['total'] && changes['total'].currentValue) {
      this.calculatorNumberShowRecord()
    }
  }

  ngOnInit(): void {}

  onPageIndexChange(event: any): void {
    this.pageIndexChange.emit(event)
    this.calculatorNumberShowRecord()
  }

  onPageSizeChange(event: any): void {
    this.pageSizeChange.emit(event)
    this.calculatorNumberShowRecord()
  }

  calculatorNumberShowRecord(): void {
    // console.log(this.total)
    this.fromRecord = (this.pageIndex - 1) * this.pageSize + 1

    let lastRecord = this.pageIndex * this.pageSize
    if (lastRecord > this.total) {
      this.toRecord = lastRecord - (lastRecord - this.total)
    } else {
      this.toRecord = lastRecord
    }
  }
}
