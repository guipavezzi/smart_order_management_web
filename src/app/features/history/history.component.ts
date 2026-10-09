import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderResponse } from '@app/core/models/order.model';
import { OrderService } from '@app/core/services/order.service';
import Swal from 'sweetalert2';

interface ShiftGroup {
  name: string;
  orders: OrderResponse[];
  isOpen: boolean;
}

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class HistoryComponent implements OnInit {
  groupedOrders: ShiftGroup[] = [];
  isLoading = false;
  hasAnyOrders = false;

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    
    this.orderService.getOrders(false, true, true).subscribe({
      next: (data) => {
        this.hasAnyOrders = data.length > 0;
        this.groupOrdersByShift(data);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'NÃ£o foi possÃ­vel carregar o histÃ³rico de pedidos.',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  toggleGroup(group: ShiftGroup): void {
    group.isOpen = !group.isOpen;
  }

  private groupOrdersByShift(data: OrderResponse[]): void {
    const map = new Map<string, OrderResponse[]>();

    data.forEach(order => {
      const cleanedDate = this.cleanDate(order.createdAt);
      const updatedOrder = { ...order, createdAt: cleanedDate };
      const shiftName = order.shiftReference || 'Expediente Atual (Em andamento)';

      if (!map.has(shiftName)) {
        map.set(shiftName, []);
      }
      map.get(shiftName)!.push(updatedOrder);
    });

    this.groupedOrders = Array.from(map.entries()).map(([name, orders]) => ({
      name,
      orders,
      isOpen: false
    }));
  }

  private cleanDate(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('.');
    if (parts.length > 1) {
      const fraction = parts[1].replace('Z', '');
      const milliseconds = fraction.substring(0, 3);
      return `${parts[0]}.${milliseconds}Z`;
    }
    return dateStr.endsWith('Z') ? dateStr : dateStr + 'Z';
  }
}
