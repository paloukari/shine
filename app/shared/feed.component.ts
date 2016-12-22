import { Component, Input } from '@angular/core';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';

export class FeedService {
   private feeds = [
      'http://rss.in.gr/feed/news/science'
   ];

   getUserFeeds() {
      return this.feeds;
   }
}

@Component({
   selector: 'feed',
   template: `
		<div class="feed">
	      <ul class="feed">
	        <li class="feed" *ngFor="let entry of data?.entries">
	          <a class="feed" href="{{entry.link}}">
	            {{entry.title}}
	          </a>
	        </li>
	      </ul>
	    </div>
	`
})
export class FeedComponent {
   @Input() url: string;
   data: string;
   constructor(private http: Http) {
   }

   ngOnInit() {
      this.http.get('http://demos.angular-craft.com/rss_service.php?url=' + this.url)
         .map(res => res.json())
         .subscribe(res => {
            this.data = res.responseData.feed;
            console.log(res);
         });
   }
}

@Component({
   selector: 'dashboard',
   template: `
		<div *ngFor="let feed of feeds">
			<feed [url]="feed"></feed>
		</div>
	`,
})
export class DashboardComponent {
   feeds: string[];
   constructor(private feedService: FeedService) {
      this.feeds = feedService.getUserFeeds();
   }
}
