Để tạo một service worker trong Angular 16, bạn có thể làm theo các bước sau:

Cài đặt service worker bằng cách sử dụng npm:

```
npm install --save-dev @angular/service-worker
```

Tạo một file `ngsw-config.json` để cấu hình service worker. Ví dụ:

```json
{
  "index": "index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/manifest.webmanifest",
          "/**/*.css",
          "/**/*.js"
        ]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api",
      "urls": [
        "https://api.example.com/data"
      ],
      "cacheConfig": {
        "strategy": "freshness",
        "maxSize": 100,
        "maxAge": "1d",
        "maxEntries": 10
      }
    }
  ],
  "navigationUrls": [
    "/**"
  ],
  "strategy": "all"
}
```

Thêm mã sau vào file `angular.json` để bao gồm file `ngsw-config.json` trong project:

```json
"projects": {
  "my-app": {
   ...
    "architect": {
      "build": {
       ...
        "options": {
         ...
          "assets": [
            "src/favicon.ico",
            "src/index.html",
            "src/manifest.webmanifest",
            "src/**/*.css",
            "src/**/*.js",
            "src/ngsw-config.json"
          ]
        }
      },
      "serve": {
       ...
        "options": {
         ...
          "assets": [
            "src/favicon.ico",
            "src/index.html",
            "src/manifest.webmanifest",
            "src/**/*.css",
            "src/**/*.js",
            "src/ngsw-config.json"
          ]
        }
      }
    }
  }
}
```

Thêm mã sau vào file `app.module.ts` để bao gồm module `ServiceWorkerModule`:

```typescript
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
```


Thêm mã sau vào file `index.html` để bao gồm script để load service worker:


```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My App</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <app-root></app-root>
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/ngsw-worker.js').then(registration => {
          console.log('Service worker registered:', registration);
        }).catch(error => {
          console.log('Service worker registration failed:', error);
        });
      });
    }
  </script>
</body>
</html>
```

Chạy lệnh `ng build` để build project.

Sau khi build xong sẽ tự động tạo file `ngsw-worker.js`

Kiểm tra bằng cách mở console trong trình duyệt và kiểm tra xem có thông báo "Service worker registered" hay không.

Để tạo một component trong project này ứng dụng service worker để lưu cache data, bạn có thể làm theo các bước sau:

Trong file `about-component.component.ts`, thêm mã sau để lấy dữ liệu từ API và lưu vào cache:

```typescript
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    data: any;
    urlGet = 'https://api.publicapis.org/entries?description=help&Auth=OAuth';

    constructor(private http: HttpClient) { }

    ngOnInit() {
        if ('caches' in window) {
            if (navigator.onLine) {
                console.log('You are connected to the internet');
                // Fetch API
                this.http.get(this.urlGet).subscribe(data => {
                    console.log('Data loaded from API:', data);
                    this.data = data;
                    // Lưu vào cache
                    if ('caches' in window) {
                        caches.open('my-cache').then(cache => {
                            cache.put(this.urlGet, new Response(JSON.stringify(data)));
                        });
                    }
                });
            } else {
                console.log('You are not connected to the internet');
                // Nếu mất internet, bạn có thể lấy dữ liệu từ cache bằng cách sử dụng phương thức caches.match()
                caches.match(this.urlGet).then(response => {
                    if (response) {
                        response.json().then(data => {
                            console.log('Data loaded from cache:', data);
                            this.data = data;
                        });
                    }
                });
            }

        }
    }
}
```

Trong file `my-component.component.html`, hiển thị dữ liệu từ API:

```html
<p>{{ data | json }}</p>
```

Sau khi hoàn thành các bước trên và deploy, bạn có thể kiểm tra website và ngắt kết nối internet để lấy dữ liệu từ cache.

![124124](https://github.com/id1945/ng-service-worker/assets/40824445/aed2eaea-f341-4f30-a1c2-e26670cc1d17)

<img width="500" alt="sw-architecture" src="https://github.com/id1945/ng-service-worker/assets/40824445/86e812e0-ddb5-4751-9043-bdd1f0361c2c">

