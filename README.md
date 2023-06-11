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

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // Lấy dữ liệu từ API
    const query = {
      description: 'help ',
      Auth: 'OAuth',
    };

    this.http.get('https://api.publicapis.org/entries', { headers: query }).subscribe(data => {
      this.data = data;

      console.log('my-cache', data)

      // Lưu vào cache
      if ('caches' in window) {
        caches.open('my-cache').then(cache => {
          cache.put('https://api.publicapis.org/entries', new Response(JSON.stringify(data)));
        });
      }
    });
  }
}
```

Trong file `my-component.component.html`, hiển thị dữ liệu từ API:

```html
<p>{{ data | json }}</p>
```