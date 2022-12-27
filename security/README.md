# Security

Chủ đề này mô tả các biện pháp bảo vệ tích hợp của Angular chống lại các lỗ hổng ứng dụng web phổ biến và các cuộc tấn công, chẳng hạn như các cuộc tấn công cross-site scripting(XSS). Nó không bao gồm bảo mật cấp ứng dụng, chẳng hạn như xác thực và ủy quyền.

## Ngăn chặn cross-site scripting (XSS)

[Cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) cho phép kẻ tấn công chèn mã độc vào các trang web. Sau đó, mã có thể đánh cắp dữ liệu đăng nhập và người dùng hoặc thực hiện các hành động mạo danh người dùng. Đây là một trong những cuộc tấn công phổ biến nhất trên web.

Để chặn các cuộc tấn công XSS, bạn phải ngăn chặn mã độc xâm nhập vào Document Object Model (DOM). Ví dụ: nếu những kẻ tấn công có thể lừa bạn chèn thẻ `<script>` vào DOM, thì chúng có thể chạy mã tùy ý trên trang web của bạn. Cuộc tấn công không giới hạn ở thẻ `<script>` - rất nhiều elements và properties khác trong DOM cho phép thực thi các đoạn code, ví dụ, `<img alt="" onerror="...">` và `<a href="javascript:...">`. Nếu dữ liệu được kiểm soát bởi những kẻ tấn công vào DOM, một lỗ hổng bảo mật đã được hình thành.

## Mô hình bảo mật cross-site scripting của Angular

Để chặn những tấn công `XSS` một cách có hệ thống, Angular mặc định sẽ xử lý tất cả những giá trị không đáng tin cậy. Khi một giá trị được chèn vào DOM từ một template, thông qua các property, attribute, style, class binding hay interpolation, Angular sẽ sanitizes(khử độc) và escape những giá trị không đáng tin cậy. Nếu một giá trị đã được sanitized bên ngoài Angular và được coi là an toàn, hãy thông báo giá trị này với Angular bằng cách đánh dấu `value as trusted`.

## Sanitization và security contexts

Sanitization là kiểm tra một giá trị không đáng tin cậy, biến nó thành một giá trị an toàn để chèn vào DOM. Trong nhiều trường hợp, việc khử trùng hoàn toàn không thay đổi giá trị. Việc khử trùng phụ thuộc vào ngữ cảnh: Một giá trị vô hại trong CSS có thể gây nguy hiểm trong một URL.

Angular định nghĩa các ngữ cảnh bảo mật sau:

| SECURITY CONTEXTS | DETAILS                                                                                                                         |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| HTML              | Được sử dụng khi diễn giải một giá trị dưới dạng HTML, chẳng hạn như khi liên kết với `innerHtml`.                              |
| STYLE             | Được sử dụng khi diễn giải một giá trị dưới dạng CSS, chẳng hạn như khi liên kết với `style`.                                   |
| SCRIPT            | Được sử dụng khi diễn giải một giá trị dưới dạng JavaScript, chẳng hạn như khi liên kết với `onclick` hoặc `onload`.            |
| URL               | Được sử dụng khi diễn giải một giá trị dưới dạng URL, chẳng hạn như khi liên kết với `<a href>`.                                |
| RESOURCE_URL      | Được sử dụng khi diễn giải một giá trị dưới dạng URL tài nguyên, chẳng hạn như khi liên kết với `<img src>` hoặc `<video src>`. |

Angular khử trùng các giá trị không đáng tin cậy cho HTML, styles và URLs. Không thể khử trùng các URLs tài nguyên vì chúng chứa mã tùy ý. Ở chế độ phát triển, Angular in cảnh báo bảng điều khiển khi nó phải thay đổi giá trị trong quá trình vệ sinh.

## Sanitization example

```html
<h3>Binding innerHTML</h3>
<p>Bound value:</p>
<p class="e2e-inner-html-interpolated">{{htmlSnippet}}</p>
<p>Result of binding to innerHTML:</p>
<p class="e2e-inner-html-bound" [innerHTML]="htmlSnippet"></p>
```

```typescript
export class AppComponent {
  // Ví dụ,  một giá trị bị một kẻ tấn công kiểm soát từ một URL.
  htmlSnippet = 'Template <script>alert("0wned")</script> <b>Syntax</b>';
}
```

<img width="170" alt="security" src="https://user-images.githubusercontent.com/91354582/209602587-1fcffb0f-d3ca-4548-ae0f-950cfa569039.png">

Angular nhận ra giá trị là không an toàn và tự động khử trùng nó, loại bỏ phần tử `script` nhưng giữ nội dung an toàn như phần tử `<b>`.

## Sử dụng trực tiếp các API DOM và explicit sanitization calls

Những DOM APIs được tích hợp sẵn trong browser không tự động bảo vệ bạn khỏi những lỗ hổng bảo mật. Ví dụ như, document, các nút có sẵn thông qua ElementRef, và nhiều API bên thứ 3 chứa những method không an toàn. Tránh tương tác trực tiếp với DOM, và thay vào đó sử dụng các Angular template khi có thể.

Đối với những trường hợp không thể tránh khỏi điều này, hãy sử dụng các chức năng khử trùng Angular tích hợp sẵn. Vệ sinh các giá trị không đáng tin cậy với phương pháp `DomSanitizer.sanitize` và `SecurityContext`. Hàm đó cũng chấp nhận các giá trị được đánh dấu là đáng tin cậy bằng cách sử dụng `bypassSecurityTrust` … functions, và không khử trùng chúng, như được mô tả bên dưới.

## Tin tưởng các giá trị an toàn

Đôi khi, ứng dụng của chúng ta thực sự cần include các đoạn mã thực thi, ví dụ hiển thị một `<iframe>` từ các URL, hay xây dựng các URL tiềm ẩn nguy hiểm. Để ngăn chặn việc tự động sanitization trong bất kì những tình huống đó, bạn có thể nói với Angular rằng bạn đã kiểm tra một giá trị, kiểm tra cách nó đã được tạo ra và chắc chắn rằng nó sẽ luôn được an toàn. Nhưng hãy cẩn thận. Nếu bạn tin tưởng một giá trị có thể bị dính độc hại, bạn đang vô tình đẩy ứng dụng của bạn rơi vào một lỗ hổng bảo mật đấy. Nếu như nghi ngờ chúng, hãy tìm kiếm chuyên gia đánh giá chuyên nghiệp.

Để đánh dấu một giá trị là đáng tin cậy, inject `DomSanitizer` và gọi một trong những methods sau đây:

- `bypassSecurityTrustHtml`
- `bypassSecurityTrustScript`
- `bypassSecurityTrustStyle`
- `bypassSecurityTrustUrl`
- `bypassSecurityTrustResourceUrl`

Hãy nhớ rằng, một giá trị an toàn hay không còn tùy thuộc vào ngữ cảnh, vì vậy hãy chọn một ngữ cảnh phù hợp cho mục đích sử dụng giá trị của bạn. Tưởng tượng rằng template dưới đây cần bind một URL vào một `javascript:alert(...)` như sau:

```html
<h4>An untrusted URL:</h4>
<p><a class="e2e-dangerous-url" [href]="dangerousUrl">Click me</a></p>
<h4>A trusted URL:</h4>
<p><a class="e2e-trusted-url" [href]="trustedUrl">Click me</a></p>
```

<img width="337" alt="security2" src="https://user-images.githubusercontent.com/91354582/209602654-a73a5131-0b5c-4b72-96c8-f62654cf91b8.png">

Thông thường, Angular sẽ tự động khử độc các URL, vô hiệu hóa những đoạn mã nguy hiểm, và trong development mode, log những hành động này vào console. Để ngăn chặn điều này, đánh dấu giá trị của URL đó như một URL đáng tin cậy bằng cách sử dụng `bypassSecurityTrustUrl` như sau:

```typescript
constructor(private sanitizer: DomSanitizer) {
  // javascript: URLs sẽ là nguy hiểm nếu như bị kẻ tấn công kiểm soát
  // Angular sẽ khử độc chúng trong data binding, nhưng bạn có thể
  // nói cho Angular rằng bạn tin tưởng chúng:
  this.dangerousUrl = 'javascript:alert("Hi there")';
  this.trustedUrl = sanitizer.bypassSecurityTrustUrl(this.dangerousUrl);
}
```

Nếu bạn cần convert user input thành các giá trị tin cậy, sử dụng một controller method. Template dưới đây cho phép user nhập một Youtube video ID và load video tương ứng trong một thẻ `<iframe>`. Thuộc tính `<iframe src>` là một resource URL security context, bởi vì một nguồn không đáng tin cậy có thể bất hợp pháp trong file download mà người dùng không nghi ngờ có thể được thực thi. Do vậy, gọi một method trong controller để xây dựng một video URL đáng tin cậy, mà Angular cho phép binding vào `<iframe src>`:

```html
<h4>Resource URL:</h4>
<p>Showing: {{dangerousVideoUrl}}</p>
<p>Trusted:</p>
<iframe
  class="e2e-iframe-trusted-src"
  width="640"
  height="390"
  [src]="videoUrl"
></iframe>
<p>Untrusted:</p>
<iframe
  class="e2e-iframe-untrusted-src"
  width="640"
  height="390"
  [src]="dangerousVideoUrl"
></iframe>
```

```typescript
updateVideoUrl(id: string) {
  // Appending an ID to a YouTube URL is safe.
  // Always make sure to construct SafeValue objects as
  // close as possible to the input data so
  // that it's easier to check if the value is safe.
  this.dangerousVideoUrl = 'https://www.youtube.com/embed/' + id;
  this.videoUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(this.dangerousVideoUrl);
}
```

## Content security policy

`Content Security Policy (CSP)` là một kỹ thuật phòng thủ sâu để ngăn chặn XSS. Để cho phép CSP, cấu hình web server của bạn trả về một HTTP header `Content-Security-Policy`. Để tìm hiểu kĩ hơn về CSP, bạn có thể đọc bài viết sau đây (Giới thiệu về Content Security Policy)[https://web.dev/csp/].

Chính sách tối thiểu cần thiết cho Angular hoàn toàn mới là:

```
default-src 'self'; style-src 'self' 'unsafe-inline';
```

| SECTIONS                            | DETAILS                                                                                                                                                                                                                  |
| :---------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default-src 'self';`               | Cho phép trang tải tất cả các tài nguyên cần thiết từ cùng một nguồn gốc.                                                                                                                                                |
| `style-src 'self' 'unsafe-inline';` | Cho phép trang tải các kiểu chung từ cùng một nguồn gốc (`'self'`) và cho phép các thành phần tải các styles của chúng (`'unsafe-inline'`- xem [`angular/angular#6361`](https://github.com/angular/angular/issues/6361)) |

Bản thân góc chỉ yêu cầu các cài đặt này hoạt động chính xác. Khi dự án của bạn phát triển, bạn có thể cần mở rộng cài đặt CSP của mình để phù hợp với các tính năng bổ sung dành riêng cho ứng dụng của bạn.

## Thực thi các loại đáng tin cậy

Bạn nên sử dụng
**Trusted Types**
như một cách giúp bảo mật các ứng dụng của bạn khỏi các cuộc tấn công cross-site scripting. Trusted Types là một tính năng [web platform](https://en.wikipedia.org/wiki/Web_platform)
có thể giúp bạn ngăn chặn các cuộc tấn công cross-site scripting bằng cách thực thi các phương pháp mã hóa an toàn hơn. Các loại đáng tin cậy cũng có thể giúp đơn giản hóa việc kiểm tra mã ứng dụng.

```
Trusted Types có thể chưa có sẵn trong tất cả các trình duyệt mục tiêu ứng dụng của bạn. Trong trường hợp ứng dụng hỗ trợ loại đáng tin cậy của bạn chạy trong trình duyệt không hỗ trợ các loại đáng tin cậy, các tính năng của ứng dụng được bảo tồn. Ứng dụng của bạn được bảo vệ chống lại XSS bằng cách sử dụng DomSanitizer của Angular. Xem caniuse.com/trusted-types để biết hỗ trợ trình duyệt hiện tại.
```

Để thực thi Trusted Types cho ứng dụng của bạn, bạn phải định cấu hình máy chủ web của ứng dụng để phát ra các tiêu đề HTTP bằng một trong các chính sách Angular sau:

| POLICIES                | DETAILS                                                                                                                                                                                                                                                                                                                                      |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `angular`               | Chính sách này được sử dụng trong mã được xem xét bảo mật là nội bộ đối với Angular và được yêu cầu để Angular hoạt động khi các loại đáng tin cậy được thực thi. Bất kỳ giá trị mẫu nội tuyến hoặc nội dung được vệ sinh bởi Angular đều được coi là an toàn bằng chính sách này.                                                           |
| `angular#unsafe-bypass` | Chính sách này được sử dụng cho các ứng dụng sử dụng bất kỳ phương pháp nào trong [DomSanitizer](https://angular.io/api/platform-browser/DomSanitizer) của Angular, vượt qua bảo mật, chẳng hạn như `bypassSecurityTrustHtml`. Bất kỳ ứng dụng nào sử dụng các phương pháp này phải cho phép chính sách này.                                 |
| `angular#unsafe-jit`    | Chính sách này được sử dụng bởi [Just-In-Time (JIT) compiler](https://angular.io/api/core/Compiler). Bạn phải kích hoạt chính sách này nếu ứng dụng của bạn tương tác trực tiếp với trình biên dịch JIT hoặc đang chạy ở chế độ JIT bằng [platform browser dynamic](https://angular.io/api/platform-browser-dynamic/platformBrowserDynamic). |
| `angular#bundler`       | Chính sách này được sử dụng bởi Angular Cli Bundler khi tạo các lazy chunk files.                                                                                                                                                                                                                                                            |

Bạn nên định cấu hình tiêu đề HTTP cho Loại đáng tin cậy ở các vị trí sau:

- Cơ sở hạ tầng phục vụ sản xuất
- Angular CLI (`ng serve`), sử dụng thuộc tính `headers` trong tệp `angular.json`, để phát triển cục bộ và thử nghiệm từ đầu đến cuối
- Karma (`ng test`), sử dụng thuộc tính `customHeaders` trong tệp `karma.config.js`, để kiểm tra đơn vị

## Sử dụng trình biên dịch mẫu AOT

Trình biên dịch mẫu AOT ngăn chặn toàn bộ lớp lỗ hổng được gọi là chèn mẫu và cải thiện đáng kể hiệu suất ứng dụng. Trình biên dịch mẫu AOT là trình biên dịch mặc định được sử dụng bởi các ứng dụng Angular CLI và bạn nên sử dụng nó trong tất cả các triển khai sản xuất.

Một giải pháp thay thế cho trình biên dịch AOT là trình biên dịch JIT biên dịch các mẫu thành mã mẫu có thể thực thi được trong trình duyệt khi chạy. Angular tin tưởng mã mẫu, do đó, tạo các mẫu động và biên dịch chúng, đặc biệt là các mẫu chứa dữ liệu người dùng, phá vỡ các biện pháp bảo vệ tích hợp sẵn của Angular. Đây là một mô hình chống bảo mật. Để biết thông tin về cách tạo biểu mẫu động theo cách an toàn, hãy xem hướng dẫn [Dynamic Forms](https://angular.io/guide/dynamic-form).

## Lớp bảo vệ XSS phía server

HTML được xây dựng trên phía server là những lỗ hổng dễ bị tấn công. Inject template code vào trong ứng dụng Angular giống như việc inject các đoạn mã code có thể thực thi vào trong ứng dụng: nó cho phép những kẻ tấn công chiếm toàn bộ quyền kiểm soát ứng dụng. Để ngăn chặn điều này, sử dụng ngôn ngữ template sẽ tự động escape những giá trị khỏi sự tấn công của XSS trên phía server. Không tạo ra Angular template trên phía server sử dụng một ngôn ngữ template; việc này mang lại một nguy cơ cao xảy ra một lỗ hổng bảo mật từ việc inject vào các template.

## Những lỗ hổng bảo mật ở tầng HTTP

Angular đã tích hợp sẵn những công cụ giúp ngăn chặn 2 lỗ hổng bảo mật phổ biến trên HTTP, đó là `cross-site request forgery (CSRF hay XSRF)` và `cross-site script inclusion (XSSI)`. Cả hai trong số đó đều phải được ngăn chặn chủ yếu ở server side, tuy nhiên Angular cung cấp những hỗ trợ giúp cho việc tích hợp nó ở client side một cách dễ dàng hơn.

### Cross-site request forgery (CSRF hay XSRF)

Trong một `cross-site request forgery`, kẻ tấn công đánh lừa người dùng vào một trang web khác (ví dụ `evil.com`) với những mã code độc hại, bí mật gửi những request độc hại đến web server của ứng dụng (ví dụ 1 trang web ngân hàng nào đó `example-bank.com`).

Giả sử người dùng đã đăng nhập thành công vào trang web của ngân hàng `example-bank.com`. Sau đó người dùng mở 1 email và click vào đường dẫn đến `evil.com`, mở một tab mới.

Trang web `evil.com` ngay lập tức gửi một request độc hại tới `example-bank.com`. Có thể đó là một request chuyển tiền từ tài khoản người dùng đến tài khoản của kẻ tấn công. Trình duyệt sẽ tự động gửi những cookies từ `example-bank.com` (bao gồm cookie cho việc xác thực) kèm theo những request đó.

Nếu như server của `example-bank.com` thiếu những sự bảo vệ từ XSRF, nó sẽ không thể phân biệt được một request hợp pháp từ ứng dụng với một yêu cầu giả mạo từ `evil.com`.

Để ngăn chặn điều này, ứng dụng phải đảm bảo rằng request của người dùng bắt nguồn từ chính ứng dụng đó chứ không phải từ một trang web khác. Server và client phải hợp tác với nhau để ngăn chặn những tấn công.

Trong những kĩ thuật chống XSRF phổ biến, server của ứng dụng gửi một token xác thực được tạo ngẫu nhiên trong một cookie. Phía client sẽ đọc cookie đó và thêm một custom request header với token đó trong những request sau đó. Server sẽ so sánh giá trị cookie gửi đi với cookie nhận được trong request header và sẽ từ chối những request nếu như nó thiếu cookie hoặc cookie không đúng.

Kĩ thuật này hiệu quả bởi vì tất cả các trình duyệt đều implement _same origin policy_. Chỉ những trang web mà cookies được thiết lập mới có thể đọc được những cookies đó từ trang web đó và thiết lập một custom header trong request tới trang web đó. Nó có nghĩa là chỉ ứng dụng của bạn mới có thể đọc được những cookie token này và set custom header. Những mã code độc hại trên `evil.com` thì không thể làm điều đó.

Thư viện `HttpClient` của Angular đã tích hợp sẵn hỗ trợ cho phía client một nửa của kĩ thuật này. Bạn có thể đọc kĩ hơn ở đây [HttpClient](https://angular.io/guide/http#security-xsrf-protection).

Để biết thông tin về CSRF tại Open Web Application Security Project (OWASP), xem [Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf) và [Cross-Site Request Forgery (CSRF) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html). Bài báo của Đại học [Stanford Robust Defenses for Cross-Site Request Forgery](https://seclab.stanford.edu/websec/csrf/csrf.pdf) là một nguồn chi tiết phong phú. Xem thêm [Bài nói chuyện của Dave Smith về XSRF tại AngularConnect 2016](https://www.youtube.com/watch?v=9inczw6qtpY&ab_channel=AngularConnect).

### Cross-site script inclusion (XSSI)

`Cross-site script inclusion` được biết đến như một lỗ hổng về JSON, nó có thể cho phép trang web của kẻ tấn công đọc được dữ liệu từ một JSON API. Những cuộc tấn công này được thực hiện trên những trình duyệt cũ hơn bằng cách override native Javascript object constructor, sau đó include một API URL sử dụng một thẻ `<script>`.

Tấn công kiểu này chỉ thành công nếu JSON trả về được thực thi như Javascript. Server có thể ngăn ngừa tấn công kiểu này bằng cách thêm tiền tố cho những JSON response để làm cho chúng không thể thực thi được, theo quy ước, sử dụng string `")]}',\n"`.

Thư viện `HttpClient` của Angular nhận biết những quy ước này và tự động strip những string `")]}',\n"` từ tất cả những response trước khi phân tích thêm chúng.

Để biết thêm thông tin, hãy xem phần XSSI của tài liệu này [Google web security blog post](https://security.googleblog.com/2011/05/website-security-for-webmasters.html).

## Kiểm tra các ứng dụng Angular

Các ứng dụng Angular phải tuân theo các nguyên tắc bảo mật giống như các ứng dụng web thông thường và phải được kiểm tra như vậy. Các API dành riêng cho Angular cần được kiểm tra trong đánh giá bảo mật, chẳng hạn như các phương pháp [bypassSecurityTrust](https://angular.io/guide/security#bypass-security-apis), được đánh dấu trong tài liệu là nhạy cảm về bảo mật.

# Link tham khảo

- [Security - Angular](https://angular.io/guide/security)
- [Security in Angular - Viblo](https://viblo.asia/p/security-in-angular-Qbq5QWamZD8)
