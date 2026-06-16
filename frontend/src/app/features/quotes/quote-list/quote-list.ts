import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Quote } from '../../../core/models/quote';
import { QuotesService } from '../../../core/services/quotes.service';
import { CommonModule } from '@angular/common';
import { Spark } from '../../spark/spark';
import { CommunityService } from '../../../core/services/community.service';


@Component({
  selector: 'app-quote-list',
  standalone: true,
  imports: [CommonModule,Spark],
  templateUrl: './quote-list.html',
  styleUrl: './quote-list.scss',
})
export class QuoteList 
  implements OnInit {

  quotes: Quote[] = [];
  feed: Quote[] = [];
  hallOfFame: Quote[] = [];
  loading = false;
  page = 0;
  hasMore = true;

  constructor(
    // private quotesService: QuotesService,
    private communityService: CommunityService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    console.log('AllQuotes loaded');
    //  this.loadQuotes();
    this.loadFeed();
    this.loadHallOfFame();
  }

//   loadQuotes() {

//   console.log('Loading quotes...');

//   this.quotesService
//       .getAll()
//       .subscribe({

//         next: data => {

//           console.log(data);
//           this.quotes = data;
//           this.cdr.detectChanges();
//         },

//         error: err => {
//           console.error(err);
//           this.cdr.detectChanges();
//         }
//       });
// }

 loadFeed(): void {
    this.loading = true;
    this.communityService.getFeed(this.page).subscribe({
      next: (data) => {
        this.feed = [...this.feed, ...data];  // append for pagination
        this.hasMore = data.length === 20;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadMore(): void {
    this.page++;
    this.loadFeed();
  }

  loadHallOfFame(): void {
    this.communityService.getHallOfFame().subscribe({
      next: (data) => {
        this.hallOfFame = data;
        this.cdr.detectChanges();
      }
    });
  }


}

