import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '@app/core/services/order.service';
import Swal from 'sweetalert2';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, NgApexchartsModule]
})
export class DashboardComponent implements OnInit {
  analytics: any = null;
  isLoading = false;

  public efficiencyChartOptions: any;
  public peakHoursChartOptions: any;

  public topDishesList: {name: string, count: number}[] = [];

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    
    this.orderService.getAnalytics().subscribe({
      next: (data) => {
        this.analytics = data;
        
        if (data.topDishes) {
          this.topDishesList = Object.keys(data.topDishes).map(k => ({
            name: k,
            count: data.topDishes[k]
          }));
        }

        this.setupCharts(data);
        
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível carregar os dados analíticos do dashboard.',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  private setupCharts(data: any) {
    const efficiency = data.efficiencyRate || 0;
    const delayed = 100 - efficiency;

    this.efficiencyChartOptions = {
      series: [efficiency, delayed],
      chart: {
        type: 'donut',
        height: 300,
        fontFamily: 'inherit'
      },
      labels: ['No Prazo', 'Atrasado'],
      colors: ['#22c55e', '#ef4444'],
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              name: {
                show: true,
              },
              value: {
                show: true,
                formatter: (val: any) => val + "%"
              },
              total: {
                show: true,
                showAlways: true,
                label: 'Eficiência',
                formatter: () => efficiency + "%"
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'bottom'
      }
    };

    const hours = Object.keys(data.peakHours || {});
    const counts = Object.values(data.peakHours || {});

    this.peakHoursChartOptions = {
      series: [
        {
          name: 'Pedidos',
          data: counts
        }
      ],
      chart: {
        height: 300,
        type: 'area',
        fontFamily: 'inherit',
        toolbar: { show: false }
      },
      colors: ['#3b82f6'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.05,
          stops: [0, 90, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      xaxis: {
        categories: hours,
        labels: {
          style: {
            colors: '#64748b'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#64748b'
          }
        }
      },
      grid: {
        borderColor: '#f1f5f9',
        strokeDashArray: 4
      }
    };
  }
}
