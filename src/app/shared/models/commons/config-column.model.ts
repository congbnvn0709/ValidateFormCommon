/**
 * *** title: Tên hiện thị của cột
 *
 * *** propertyName: Tên thuộc tính trong đối tượng cần hiện thị lên bảng
 *
 * *** type: dùng để xác định kiểu hiện thị dữ liệu
 * - Mặc định: chữ
 * - Xem thêm hoặc cấu hình thêm trong constant TABLE_KEYS (nằm trong file system.const.ts)
 *
 * *** format: Định dạng ngày tháng
 *
 * *** align: căn lề
 * - Mặc định: Căn trái
 * - Rule căn lề:
 *  + Chữ căn trái
 *  + Số căn phải
 *  + Nội dung bằng nhau thì căn giữa (bao gồm cả số)
 *
 * *** isSort: có sắp xếp không
 * - Mặc định: có
 *
 * *** sortKey: Key truyền cho BE dùng để sắp xếp
 *
 * *** elementClass: Thêm class cho element nếu cần
 **/
export interface ConfigColumnModel {
  title: string
  propertyName: string
  type?: string
  format?: string
  align?: any // left | right | center | null
  isSort?: boolean
  sortKey?: string
  elementClass?: string
  width?: any
}
