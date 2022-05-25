# Thông tin dự án Survey

- Sở hữu bởi tập đoàn công nghiệp - viễn thông quân đội (Khối công nghệ thông tin)
- Bắt đầu: 29-03-2022
- Công ty phát triển: Techasians JSC
- Phiên bản Angular: 13.1.2

# Hướng dẫn triển khai hệ thống
1. Môi trường cần thiết: Nodejs, source code.
2. Build project:
- Kiểm tra/Cấu hình lại link server (server của back-end).
  + Mở project bằng IDE hoặc Text Editor bất kỳ.
  + Mở file cấu hình "enviroment.prod.ts" (Path: [thư mục chứa project]\src\enviroment\enviroment.prod.ts)
  + Đổi giá trị của thuộc tính "server" bằng link server mong muốn.
- Mở command pormpt trong thư mục chứa project.
  + Chạy lệnh 'npm install' để cài node_modules (các thư viện cần thiết) cho dự án.
  + Chạy lệnh 'npm run build' để build project.
- Mã code đã build nằm trong: [thư mục chứa project]/dist/survey.
3. Sử dụng mã code đã build để deploy project.

# Thông tin dự án cho developer

Trong thư mục shared có các code dùng chung cho dự án như: commponent, directive, dialog, pipe, const, model...

## Các common component
- PaginationComponent: Hiện thị phân trang cho bảng.
- PrimaryTableComponent: Table - Component hiện thị dữ liệu dưới dạng bảng. Lưu ý: Chỉ sử dụng cho các bảng đơn giản.
- ShowErrorsComponent: Dùng để hiện thị lỗi của form/control (Validation form/control).

## Các common constant
- format.const.ts
- pattern.const.ts
- store.const.ts: Chứa các const dùng cho NgRx - store trong angular (nếu dùng).
- router.const.ts
- system.const.ts: Chứa các const dùng chung cho hệ thống.

# Quy ước trong dự án
## Quản lý source code
- Các nhánh chính:
    + master
    + delivery: nhánh bàn giao
    + develop: nhánh phát triển
- Mỗi một thành viên tham gia phát triển tiến hành tạo ra một nhánh riêng.
- Quy ước đặt tên nhánh: (module-name)_(member-account)_(task-name)
    VD: voucher-management_hungnv_create-voucher

## Quy ước tạo service
- Với mỗi một controller phía back-end tạo một server trên front-end.

## Quy ước cấu hình đa ngôn ngữ
- Với mỗi một module tạo một file ngôn ngữ.
- File common: Chứa các ngôn ngữ chung cho các module của dự án

- Quy ước đặt tên trong file ngôn ngữ (file json)
    + Viết bằng chữ thường
    + Cách nhau giữa các từ bằng dấu gạch dưới (_)
