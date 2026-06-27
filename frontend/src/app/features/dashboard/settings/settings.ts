import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FacebookService } from '../../../core/services/facebook.service';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings implements OnInit {

  facebookConnected = false;
  successMessage = '';
  loading = true;

 constructor(
    private facebookService: FacebookService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  // check if Facebook just connected
  const params = new URLSearchParams(window.location.search);
  if (params.get('facebook') === 'connected') {
    this.successMessage = 'Facebook connected successfully!';
  }

  // always fetch real status from backend
  this.facebookService.getStatus().subscribe({
    next: (res) => {
      this.facebookConnected = res.connected;
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.facebookConnected = false;
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}

  connectFacebook(): void {
  this.facebookService.getConnectUrl().subscribe({
    next: (res) => window.location.href = res.authUrl  // redirect to Facebook
  });
}

disconnectFacebook(): void {
  this.facebookService.disconnect().subscribe({
    next: () => {
      this.facebookConnected = false;
      this.successMessage = '';
      this.cdr.detectChanges();
    }
  });
}
}
