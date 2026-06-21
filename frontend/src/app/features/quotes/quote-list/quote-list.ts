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

  filteredQuotes: Quote[] = [];
  filteredHallOfFame: Quote[] = [];

  publishingId: number | null = null;
  searchTerm = '';
  selectedTopic = '';
  topics: string[] = [
    'MOTIVATION',
    'SUCCESS',
    'PRODUCTIVITY',
    'LEADERSHIP',
    'FITNESS',
    'MINDSET',
    'DISCIPLINE',
    'HAPPINESS',
    'GRATITUDE',
    'BUSINESS'
  ];


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
        this.applyFilters(); 
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
        this.applyFilters();
        this.cdr.detectChanges();
      }
    });
  }


  // ---------search---------------
  onSearch(): void {
    this.applyFilters();
  }

  filterByTopic(topic: string): void {
    this.selectedTopic = topic;
    this.applyFilters();
  }

  // private getTopicText(topic: string | string[] | undefined): string {
  //   if (!topic) {
  //     return '';
  //   }
  //   return Array.isArray(topic) ? topic.join(' ') : topic;
  // }

  applyFilters(): void {
     let result = [...this.feed];
     let resutltHallOfFame = [...this.hallOfFame];
   

    // filter by topic chip
    if (this.selectedTopic) {
      result = result.filter(q =>
        q.topic?.toString().toUpperCase() === this.selectedTopic.toUpperCase()
      );
      resutltHallOfFame = resutltHallOfFame.filter(q =>
        q.topic?.toString().toUpperCase() === this.selectedTopic.toUpperCase()
      );
    }

    // filter by search term — searches text and topic
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(q =>
        q.text?.toLowerCase().includes(term) ||
        q.topic?.toString().toLowerCase().includes(term)
      );
      resutltHallOfFame = resutltHallOfFame.filter(q =>
        q.topic?.toString().toLowerCase().includes(term)
      );
      console.log(' term:', this.searchTerm);
    }

    this.filteredQuotes = result;
    this.filteredHallOfFame = resutltHallOfFame;
    // console.log('Filtered Quotes:', this.filteredQuotes);
    console.log('Filtered Hall of Fame:', this.filteredHallOfFame);
    this.cdr.detectChanges();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.selectedTopic = '';
    this.filteredQuotes = [...this.feed];
    this.filteredHallOfFame = [...this.hallOfFame];
    this.cdr.detectChanges();
  }





}

