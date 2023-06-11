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
    this.http.get('https://api.publicapis.org/entries?description=help&Auth=OAuth').subscribe(data => {
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
