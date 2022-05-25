import { DATE_FORMAT_VI } from './../../constants/format.const';
import { ConfigColumnModel } from './../../models/commons/config-column.model';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { PaginationModel } from '../../models/commons/pagination.model';
import { TABLE_KEYS } from '../../constants/system.const';
import { ActionResponseModel } from '../../models/commons/action-response.model';
import * as _ from 'lodash'

interface DataItem {
  name: string
  chinese: number
  math: number
  english: number
}

@Component({
  selector: 'vt-primary-table',
  templateUrl: './primary-table.component.html',
  styleUrls: ['./primary-table.component.scss']
})
export class PrimaryTableComponent implements OnInit, OnChanges {
  /**
  * @Input checkboxKey: Là một unikey (Id, code), dùng để xác định xem có hiện thị cột checkbox không (không truyền có nghĩa là không hiện), đồng thời cũng là key để xử lý checkbox.
  * @Input columnData: Danh sách các cột của bảng
  * @Input datasource: Dữ liệu của bảng
  * @Input pagination: Thông tin phân trang
  * @Input actions: Danh sách các action. Nếu không truyền sẽ không hiện thị cột action
  * @Output actionKey: Trả ra actionKey trong actions, cho biết đang bấm vào hành động nào
  **/

  @Input() checkboxKey: string = ''
  @Input() columnData: ConfigColumnModel[] = []
  @Input() datasource: any[] = []
  @Input() pagination: PaginationModel = new PaginationModel()
  @Output() paginationChange: EventEmitter<PaginationModel> = new EventEmitter()
  @Output() tableQueryParamsChange: EventEmitter<string> = new EventEmitter()
  @Input() actions: any = []
  @Output() actionKey: EventEmitter<ActionResponseModel> = new EventEmitter()
  @Input() setOfCheckedId = new Set<number>();
  @Input() isLoading: boolean = false
  readonly TABLE_KEYS: any = TABLE_KEYS
  readonly DATE_FORMAT: any = DATE_FORMAT_VI

  isCheckedAll = false;
  indeterminate = false;
  // listOfCurrentPageData: any[] = [];
  isTableScrollY: string | any = null

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datasource'] && changes['datasource'].currentValue) {
      this.isInitTableScroll()
    }
    if (changes['pagination'] && changes['pagination'].currentValue) {

    }
  }

  ngOnInit(): void {

  }

  /**
  * Description: Init table scroll property
  */
  isInitTableScroll(): void {
    if (this.datasource.length > 10) this.isTableScrollY = '467px'
  }

  onQueryParamsChange(event: any) {
    if (event.sort && event.sort.length) {
      let sortColumn = event.sort.find((s: any) => s.key && s.value)
      if (sortColumn) {
        this.pagination.sortField = sortColumn.key

        if (sortColumn.value === 'ascend') {
          this.pagination.direction = 'ASC'
        } else {
          this.pagination.direction = 'DESC'
        }
      } else {
        this.pagination.sortField = null
        this.pagination.direction = null
      }
      // event.sort.forEach((sort: any) => {
      //   if (sort.key && sort.value) {
      //     this.pagination.sortField = sort.key

      //     if (sort.value === 'ascend') {
      //       this.pagination.direction = 'ASC'
      //     } else {
      //       this.pagination.direction = 'DESC'
      //     }
      //   }
      // });
    }
    this.tableQueryParamsChange.emit()
  }

  onAllChecked(checked: boolean): void {
    this.datasource.forEach((data) => this.updateCheckedSet(data[this.checkboxKey], checked));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.datasource;
    this.isCheckedAll = listOfEnabledData.every((data) => this.setOfCheckedId.has(data[this.checkboxKey]));
    this.indeterminate = listOfEnabledData.some((data) => this.setOfCheckedId.has(data[this.checkboxKey])) && !this.isCheckedAll;
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onTriggerAction(actionKey: string, data: any): void {
    this.actionKey.emit({ actionKey: actionKey, data: data })
  }

}
