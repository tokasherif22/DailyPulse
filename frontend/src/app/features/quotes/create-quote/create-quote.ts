// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-create-quote',
//   imports: [CommonModule],
//   templateUrl: './create-quote.html',
//   styleUrl: './create-quote.scss',
// })
// export class CreateQuote {

//   topics = [
//     'MOTIVATION',

//   'SUCCESS',

//   'PRODUCTIVITY',

//   'LEADERSHIP',

//   'FITNESS',

//   'MINDSET',
//    'DISCIPLINE',

//     'HAPPINESS',

//     'GRATITUDE',

//     'BUSINESS'  ];
// }

import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuotesService } from '../../../core/services/quotes.service';
import pa from '@angular/common/locales/extra/pa';

interface QuoteForm {
  topic: string;
  text: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  isAIGenerated?: boolean;
}

@Component({
  selector: 'app-create-quote',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-quote.html',
  styleUrl: './create-quote.scss'
})
export class CreateQuote {


    topics :string[] =  [
    'MOTIVATION',

  'SUCCESS',

  'PRODUCTIVITY',

  'LEADERSHIP',

  'FITNESS',

  'MINDSET',
   'DISCIPLINE',

    'HAPPINESS',

    'GRATITUDE',

    'BUSINESS'  ];

    quote: QuoteForm = {
    topic: '',
    text: '',
    status: 'DRAFT',
    isAIGenerated: false
  };

  loading = false;
  aiLoading = false;
  errorMessage = '';
  successMessage = '';
 
  scheduledAt: Date | null = null;
  showSchedulePopup = false;
  scheduleDate: string = '';
  scheduleTime: string = '';
  scheduleError: string = '';
  todayDate: string = new Date().toISOString().split('T')[0];

  constructor(
    private quoteService: QuotesService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // --- schedule popup ---

  openSchedulePopup(): void {
    this.scheduleError = '';
    if (this.scheduledAt) {
      // pre-fill if already scheduled
      this.scheduleDate = this.scheduledAt.toISOString().split('T')[0];
      this.scheduleTime = this.scheduledAt.toTimeString().slice(0, 5);
    }
    this.showSchedulePopup = true;
  }

  closeSchedulePopup(): void {
    this.showSchedulePopup = false;
  }

  closeOnOverlay(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('popup-overlay')) {
      this.closeSchedulePopup();
    }
  }

  confirmSchedule(): void {
    if (!this.scheduleDate || !this.scheduleTime) return;

    const scheduled = new Date(`${this.scheduleDate}T${this.scheduleTime}`);

    if (scheduled <= new Date()) {
      this.scheduleError = 'Please pick a future date and time.';
      this.cdr.detectChanges();
      return;
    }

    this.scheduledAt = scheduled;
    this.showSchedulePopup = false;
    this.cdr.detectChanges();
  }

  clearSchedule(): void {
    this.scheduledAt = null;
    this.scheduleDate = '';
    this.scheduleTime = '';
  }

 
  getSchedulePreview(): string {
    if (!this.scheduleDate || !this.scheduleTime) return '';
    const d = new Date(`${this.scheduleDate}T${this.scheduleTime}`);
    return d.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    }) + ' at ' + d.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true
    });
  }


  publish(): void {
    if (!this.quote.topic || !this.quote.text ) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    // this.quote.status = 'PUBLISHED';
    this.quote.status = this.scheduledAt ? 'SCHEDULED' : 'PUBLISHED';
    console.log("quote:" + JSON.stringify(this.quote));

    const payload = {
      ...this.quote,
      scheduledAt: this.scheduledAt?.toISOString() ?? null
    };
    console.log("payload: " + JSON.stringify(payload));
    this.quoteService.create(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to save quote. Please try again.';
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  saveDraft(): void {
    if (!this.quote.topic || !this.quote.text ) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.quote.status = 'DRAFT';

    this.quoteService.create(this.quote).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to save quote. Please try again.';
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  reset(): void {
    this.quote = {
       topic: '',
        text: '' ,
        status: 'DRAFT',
        isAIGenerated: false 
      };
    this.errorMessage = '';
  }

  generateByAI(): void {
    if (!this.quote.topic) {
      this.errorMessage = 'Please select a topic to generate a quote.';
      return;
    }

    this.aiLoading = true;
    this.errorMessage = '';
    
    this.quoteService.generateAIQuote(this.quote.topic).subscribe({
      next: (response) => {
        this.quote.isAIGenerated = true;
        this.aiLoading = false;
        console.log("generatedText:" + response.generatedText);;
        this.quote.text = response.generatedText; 
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.aiLoading = false;
        this.errorMessage = 'AI Failed to generate quote. Please try again.';
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  regenerateByAI(): void {
    if (!this.quote.topic) {
      this.errorMessage = 'Please select a topic to generate a quote.';
      return;
    }

    this.aiLoading = true;
    this.errorMessage = '';
    
    this.quoteService.regenerateAIQuote(this.quote.topic, this.quote.text).subscribe({
      next: (response) => {
        this.quote.isAIGenerated = true;
        this.aiLoading = false;
        console.log("generatedText:" + response.generatedText);;
        this.quote.text = response.generatedText; 
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.aiLoading = false;
        this.errorMessage = 'AI Failed to generate quote. Please try again.';
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }
}


