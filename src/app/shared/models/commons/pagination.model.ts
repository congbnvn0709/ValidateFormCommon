export class PaginationModel {
  total: number;
  pageSize: number;
  pageIndex: number;
  sortField: any;
  direction: any;

  // Khi bấm sort trên bảng sẽ trả list các cột
  sort: any[] = []

  constructor(pageIndex: number = 1, pageSize: number = 10, total: number = 0, direction: string = 'DESC') {
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.total = total;
    this.direction = direction;
  }
}
