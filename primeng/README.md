# PrimeNG

## Giới thiệu về PrimeNG

[PrimeNG](https://www.primefaces.org/primeng/) là một khuôn khổ để xây dựng
các ứng dụng web, có thể so sánh với
Angular Material. PrimeNG rất giống với Angular Material;
nó cung cấp một loạt các thành
phần mà chúng ta có thể sử dụng để xây dựng
các ứng dụng web của mình. Sự khác biệt với
PrimeNG là số lượng lớn các thành phần.
PrimeNG có nhiều thành phần hơn so với Angular Material,
điều này khiến nó trở nên hấp
dẫn hơn đối với phần mềm kinh doanh có nhiều
biểu mẫu dữ liệu.

## Tại sao lại là PrimeNG?

PrimeNG là tập hợp các thành phần giao diện
người dùng phong phú cho Angular. Tất cả các
tiện ích đều là nguồn mở và miễn phí sử dụng
theo Giấy phép MIT. PrimeNG được phát triển
bởi [PrimeTek Informatics](http://www.primetek.com.tr/), một nhà cung cấp có nhiều năm kinh nghiệm trong việc phát triển các giải pháp giao diện người dùng nguồn mở

## Xu hướng

## Khởi tạo ứng dụng chạy PrimeNG

Để tạo một ứng dụng, các bạn cần chạy câu lệnh dưới đây

```bash
ng new primeng
```

PrimeNG khả dụng lúc npm, nếu bạn có một ứng dụng hiện có, hãy chạy lệnh sau để tải xuống dự án của bạn.

```bash
npm install primeng --save
npm install primeicons --save
```

Các thành phần giao diện người dùng được
định cấu hình dưới dạng mô-đun, sau khi
PrimeNG được tải xuống và định cấu hình,
các mô-đun và apis có thể được nhập từ `primeng/{module}`
trong mã ứng dụng của bạn. Tài liệu của từng thành phần nêu rõ đường dẫn nhập.

```typescript
import { AccordionModule } from "primeng/accordion"; //accordion and accordion tab
import { MenuItem } from "primeng/api"; //api
```

Các phụ thuộc css như sau, Prime Icons, chủ đề bạn chọn và cấu trúc css của các thành phần.

Trong tệp angular.json tìm mảng `styles` và thêm vào như sau:

```json
...
"styles": [
    "node_modules/primeicons/primeicons.css",
    "node_modules/primeng/resources/themes/lara-light-blue/theme.css",
    "node_modules/primeng/resources/primeng.min.css",
    ...
]                  //api
```

PrimeNG cung cấp 33 chủ đề miễn phí để lựa chọn.

```
primeng/resources/themes/bootstrap4-light-blue/theme.css
primeng/resources/themes/bootstrap4-light-purple/theme.css
primeng/resources/themes/bootstrap4-dark-blue/theme.css
primeng/resources/themes/bootstrap4-dark-purple/theme.css
primeng/resources/themes/md-light-indigo/theme.css
primeng/resources/themes/md-light-deeppurple/theme.css
primeng/resources/themes/md-dark-indigo/theme.css
primeng/resources/themes/md-dark-deeppurple/theme.css
primeng/resources/themes/mdc-light-indigo/theme.css
primeng/resources/themes/mdc-light-deeppurple/theme.css
primeng/resources/themes/mdc-dark-indigo/theme.css
primeng/resources/themes/mdc-dark-deeppurple/theme.css
primeng/resources/themes/tailwind-light/theme.css
primeng/resources/themes/fluent-light/theme.css
primeng/resources/themes/lara-light-indigo/theme.css
primeng/resources/themes/lara-dark-indigo/theme.css
primeng/resources/themes/lara-light-purple/theme.css
primeng/resources/themes/lara-dark-purple/theme.css
primeng/resources/themes/lara-light-blue/theme.css
primeng/resources/themes/lara-dark-blue/theme.css
primeng/resources/themes/lara-light-teal/theme.css
primeng/resources/themes/lara-dark-teal/theme.css
primeng/resources/themes/saga-blue/theme.css
primeng/resources/themes/saga-green/theme.css
primeng/resources/themes/saga-orange/theme.css
primeng/resources/themes/saga-purple/theme.css
primeng/resources/themes/vela-blue/theme.css
primeng/resources/themes/vela-green/theme.css
primeng/resources/themes/vela-orange/theme.css
primeng/resources/themes/vela-purple/theme.css
primeng/resources/themes/arya-blue/theme.css
primeng/resources/themes/arya-green/theme.css
primeng/resources/themes/arya-orange/theme.css
primeng/resources/themes/arya-purple/theme.css
primeng/resources/themes/nova/theme.css
primeng/resources/themes/nova-alt/theme.css
primeng/resources/themes/nova-accent/theme.css
primeng/resources/themes/luna-amber/theme.css
primeng/resources/themes/luna-blue/theme.css
primeng/resources/themes/luna-green/theme.css
primeng/resources/themes/luna-pink/theme.css
primeng/resources/themes/rhea/theme.css
```

Các thành phần khác nhau sử dụng hoạt ảnh góc để cải thiện trải nghiệm người dùng, bắt đầu với hoạt ảnh Angular 4 có mô-đun riêng, do đó bạn cần nhập [BrowserAnimationsModule] vào ứng dụng của mình. Nếu bạn muốn tắt hoạt ảnh trên toàn cầu, hãy nhập [NoopAnimationsModule] để thay thế.

```bash
npm install @angular/animations --save
```

```typescript
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    //...
  ],
  //...
})
export class YourAppModule {}
```

## DEMO

- [Table](https://www.primefaces.org/primeng/table)

- [Button](https://www.primefaces.org/primeng/button)

- [Dialog](https://www.primefaces.org/primeng/dialog)

- [Animate](https://www.primefaces.org/primeng/animate)

- [Input text](https://www.primefaces.org/primeng/inputtext)

- [Input number](https://www.primefaces.org/primeng/inputnumber)

- [InputTextarea](https://www.primefaces.org/primeng/inputtextarea)

- [Primeflex](https://www.primefaces.org/primeflex/)

- [Toast](https://www.primefaces.org/primeng/toast)

- [Confirm dialog](https://www.primefaces.org/primeng/confirmdialog)

<img width="960" alt="primeng" src="https://user-images.githubusercontent.com/91354582/209677710-4fa5fc9d-a2d1-4549-984e-3d695e3af312.png">

# Link tham khảo

- [Giới thiệu về PrimeNG](https://dontpaniclabs.com/blog/post/2021/06/15/introduction-to-primeng/)
- [Tại sao là PrimeNG?](https://www.primefaces.org/primeng-v8-lts/#/)
- [Xu hướng](https://npmtrends.com/@angular/material-vs-primeng)
- [Setup](https://www.primefaces.org/primeng/setup)
- [Product CRUD](https://www.youtube.com/watch?v=nxb27l6LBEU)
