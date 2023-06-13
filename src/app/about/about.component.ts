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
                    caches.open('my-cache').then(cache => {
                        cache.put(this.urlGet, new Response(JSON.stringify(data)));
                    });
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
