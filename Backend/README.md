## Backend - Book Service
### 1️ Cài đặt Node.js và MongoDB
- Cài đặt Nodejs
- Cài đặt MongoDB
- Tại thư mục Backend, thực hiện lệnh npm install
- Tạo file .env thiết lập SECRET_KEY=<key tùy chọn>
- Ngoài ra cũng có thể thiết lập PORT và MONGODB_URI hoặc sử dụng theo file cấu hình config/index.js
### 2 Tạo tài khoản Admin
- Mở terminal ở backend, chạy lệnh npm run dev để khởi tạo server
- Dùng POSTMAN (headers phải có content-type: application/json và body là raw json) và thực hiện phương thức POST http://localhost:3000/nhanvien với nội dung sau:
{
    "hotennv":"Nguyễn Văn A",
    "dienthoai":"0987654321",
    "matkhau":"12345",
    "chucvu":"Quản trị viên"    
} 
- Đã tạo tài khoản admin thành công với số điện thoại và mật khẩu như trên, ta cũng có thể tùy chỉnh số điện thoại (bắt buộc phải đủ 10 số và có số 0 ở đầu) và mật khẩu khác, riêng chucvu phải là "Quản trị viên"
