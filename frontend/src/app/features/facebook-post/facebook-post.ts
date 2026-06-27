import { Component, OnInit } from '@angular/core';
import { Quote } from '../../core/models/quote';
import { FacebookService } from '../../core/services/facebook.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-facebook-post',
  imports: [CommonModule, FormsModule],
  templateUrl: './facebook-post.html',
  styleUrl: './facebook-post.scss'
})
export class FacebookPost implements OnInit {

  @Input() quote!: Quote;

  postText = '';
  caption = '';
  captionLoading = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private facebookService: FacebookService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.postText = this.quote.text;  // pre-fill with quote text
  }

  generateCaption(): void {
    this.captionLoading = true;
    this.facebookService.generateCaption(this.postText, this.quote.topic).subscribe({
      next: (res) => {
        this.caption = res.caption;
        this.captionLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to generate caption.';
        this.captionLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  publish(): void {
    this.loading = true;
    this.errorMessage = '';
    this.facebookService.publishPost({
      quoteId: this.quote.id,
      postText: this.postText,
      caption: this.caption
    }).subscribe({
      next: () => {
        this.successMessage = 'Published to Facebook successfully!';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to publish. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancel(): void {
    this.postText = this.quote.text;
    this.caption = '';
    this.errorMessage = '';
  }
}