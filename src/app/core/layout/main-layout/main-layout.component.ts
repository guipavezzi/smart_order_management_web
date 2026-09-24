import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgOptimizedImage, CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StatCard } from '@shared/components/shared/components/stat-card/stat-card';
import { Sidebar } from '@app/shared/components/shared/components/sidebar/sidebar';
import { OrderService } from '@app/core/services/order.service';
import { AuthService } from '@app/core/services/auth.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [NgOptimizedImage, RouterOutlet, Sidebar, StatCard, CommonModule],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  metrics: any = {
    inPreparation: 0,
    attention: 0,
    delayed: 0,
    longestWaitTime: '0 min'
  };
  private metricsSub!: Subscription;
  isSidebarOpen: boolean = false;
  companyName: string = 'TEMPO 86';

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.cdr.markForCheck();
  }

  closeSidebar() {
    this.isSidebarOpen = false;
    this.cdr.markForCheck();
  }

  ngOnInit() {
    this.companyName = this.authService.getCompanyName();
    this.fetchMetrics();
    this.metricsSub = this.orderService.metricsUpdated.subscribe(() => this.fetchMetrics());
  }

  ngOnDestroy() {
    if (this.metricsSub) this.metricsSub.unsubscribe();
  }

  private fetchMetrics() {
    this.orderService.getMetrics().subscribe({
      next: data => {
        this.metrics = data;
        this.cdr.markForCheck();
      }
    });
  }
}
