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
    // Nếu mất internet, bạn có thể lấy dữ liệu từ cache bằng cách sử dụng phương thức caches.match()
    if ('caches' in window) {
      caches.match(this.urlGet).then(response => {
        if (response) {
          // Nếu dữ liệu được tìm thấy trong cache, bạn có thể hiển thị nó trên trang. 
          response.json().then(data => {
            console.log('Data loaded from cache:', data);
            this.data = data;
          });
        } else {
          //Nếu không, bạn có thể gửi yêu cầu API để lấy dữ liệu và lưu vào cache. Ví dụ:
          console.log('Data not found in cache');
          // Lấy dữ liệu từ API
          this.http.get(this.urlGet).subscribe(data => {
            this.data = data;
            console.log('Data loaded from API:', data);
            // Lưu vào cache
            if ('caches' in window) {
              caches.open('my-cache').then(cache => {
                cache.put(this.urlGet, new Response(JSON.stringify(data)));
              });
            }
          });
        }
      });
    }
  }
}
