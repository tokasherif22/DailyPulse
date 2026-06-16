import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { SparkService } from '../../core/services/spark.service';


@Component({
  selector: 'app-spark-button',
  imports: [CommonModule],
  template: `
    <button
      class="btn-spark"
      [class.btn-spark--active]="sparked"
      (click)="toggle()"
      [disabled]="loading ||disabled">
      <span class="spark-icon">{{ sparked ? '⚡' : '✦' }}</span>
      <span class="spark-count">{{ sparkCount }}</span>
    </button>
  `,
  styles: [`
    .btn-spark {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      padding: 4px 14px;
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-md);
      background: var(--color-background-primary);
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all 0.15s;

      &--active {
        background: #EEEDFE;
        color: #3C3489;
        border-color: #AFA9EC;

        .spark-icon { color: #534AB7; }
      }

      &:hover:not(:disabled):not(&--active) {
        border-color: #AFA9EC;
        background: #F8F7FE;
      }

      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .spark-icon { font-size: 15px; }
    .spark-count { font-weight: 500; }
  `]
})
export class Spark implements OnInit{

 @Input() quoteId!: number;
  @Input() initialCount = 0;
  @Input() initialSparked = false;
  @Input() disabled = false;  

  sparked = false;
  sparkCount = 0;
  loading = false;

  constructor(
    private sparkService: SparkService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sparked = this.initialSparked;
    this.sparkCount = this.initialCount;
  }

  toggle(): void {
    this.loading = true;

    // optimistic update — feels instant
    this.sparked = !this.sparked;
    this.sparkCount += this.sparked ? 1 : -1;
    this.cdr.detectChanges();

    this.sparkService.toggle(this.quoteId).subscribe({
      next: (res) => {
        // confirm with server values
        this.sparked = res.sparked;
        this.sparkCount = res.sparkCount;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        // revert on failure
        this.sparked = !this.sparked;
        this.sparkCount += this.sparked ? 1 : -1;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

}
