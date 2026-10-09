import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { OrderResponse, Status } from '@app/core/models/order.model';
import { MenuResponse } from '@app/core/models/menu.model';
import { OrderService } from '@app/core/services/order.service';
import { MenuService } from '@app/core/services/menu.service';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

type ModalMode = 'create' | 'edit';

@Component({
  selector: 'app-order-panel',
  templateUrl: './order-panel.component.html',
  styleUrl: './order-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ CommonModule, FormsModule ]
})
export class OrderPanelComponent implements OnInit, OnDestroy {
  orders: OrderResponse[] = [];
  menus: MenuResponse[] = [];
  showModal = false;
  modalMode: ModalMode = 'create';
  editingId: string | null = null;
  newOrder = { table: 1, ordered: '', observation: '' };

  private timerSubscription!: Subscription;
  private alreadyUpdatingStatus = new Set<string>();

  statusLabels: { [key: number]: string } = {
    0: 'Em PreparaÃ§Ã£o',
    1: 'AtenÃ§Ã£o',
    2: 'Atrasado',
    3: 'ConcluÃ­do'
  };

  constructor(
    private orderService: OrderService,
    private menuService: MenuService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadMenus();
    this.loadOrders();
    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateTimers();
    });
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }


  loadMenus(): void {
    this.menuService.getMenus().subscribe({
      next: (data) => {
        this.menus = data;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cdr.markForCheck();
      }
    });
  }

  private getMenuByName(name: string): MenuResponse | undefined {
    return this.menus.find(m => m.name === name);
  }


  loadOrders(): void {
    this.orderService.getOrders(true).subscribe({
      next: (data) => {
        this.orders = data.map(order => ({
          ...order,
          createdAt: this.cleanDate(order.createdAt)
        }));
        this.updateTimers();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar pedidos:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erro de ConexÃ£o',
          text: 'NÃ£o foi possÃ­vel carregar os pedidos. Verifique se a sua API C# estÃ¡ rodando!',
          confirmButtonColor: '#ef4444'
        });
      }
    });
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


  updateTimers(): void {
    const now = new Date().getTime();

    this.orders.forEach(order => {
      if (order.status === Status.Completed) {
        order.displayedTime = 'ConcluÃ­do';
        return;
      }

      const createdAtDate = new Date(order.createdAt).getTime();
      const diffMs = now - createdAtDate;

      if (diffMs > 0) {
        const totalSeconds = Math.floor(diffMs / 1000);
        order.displayedTime = this.formatTime(totalSeconds);

        const menuItem = this.getMenuByName(order.ordered);
        const minSeconds = menuItem ? menuItem.minPreparationTimeInMinutes * 60 : 600;
        const maxSeconds = menuItem ? menuItem.maxPreparationTimeInMinutes * 60 : 1200;

        if (order.status === Status.InPreparation) {
          if (totalSeconds >= maxSeconds) {
            this.autoUpdateStatus(order, Status.Delayed);
          } else if (totalSeconds >= minSeconds) {
            this.autoUpdateStatus(order, Status.Attention);
          }
        } else if (order.status === Status.Attention && totalSeconds >= maxSeconds) {
          this.autoUpdateStatus(order, Status.Delayed);
        }
      } else {
        order.displayedTime = '00:00';
      }
    });

    this.cdr.markForCheck();
  }

  private formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  private autoUpdateStatus(order: OrderResponse, newStatus: Status): void {
    if (this.alreadyUpdatingStatus.has(order.id)) return;
    this.alreadyUpdatingStatus.add(order.id);

    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: () => {
        order.status = newStatus;
        this.alreadyUpdatingStatus.delete(order.id);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao atualizar status do pedido:', err);
        this.alreadyUpdatingStatus.delete(order.id);
      }
    });
  }


  openCreateModal(): void {
    this.modalMode = 'create';
    this.editingId = null;
    this.newOrder = { table: 1, ordered: '', observation: '' };
    this.showModal = true;
    this.cdr.markForCheck();
  }

  openEditModal(order: OrderResponse): void {
    this.modalMode = 'edit';
    this.editingId = order.id;
    this.newOrder = { table: order.table, ordered: order.ordered, observation: order.observation };
    this.showModal = true;
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.showModal = false;
    this.cdr.markForCheck();
  }

  submitOrder(): void {
    if (!this.newOrder.ordered) return;

    Swal.fire({
      title: 'Salvando pedido...',
      text: 'Por favor, aguarde',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    if (this.modalMode === 'create') {
      this.orderService.createOrder(this.newOrder).subscribe({
        next: (orderCreated) => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Pedido cadastrado com sucesso.',
            timer: 1500,
            showConfirmButton: false
          });

          const cleanedOrder = {
            ...orderCreated,
            createdAt: this.cleanDate(orderCreated.createdAt)
          };

          this.orders = [...this.orders, cleanedOrder];
          this.closeModal();
          this.updateTimers();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Erro ao cadastrar pedido:', err);
          Swal.fire({
            icon: 'error',
            title: 'Erro ao cadastrar',
            text: 'NÃ£o foi possÃ­vel salvar o pedido no servidor.',
            confirmButtonColor: '#ef4444'
          });
        }
      });
    } else {
      this.orderService.updateOrder(this.editingId!, { ...this.newOrder, id: this.editingId, status: this.orders.find(o => o.id === this.editingId)?.status || 0 }).subscribe({
        next: (orderUpdated) => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Pedido atualizado com sucesso.',
            timer: 1500,
            showConfirmButton: false
          });

          const cleanedOrder = {
            ...orderUpdated,
            createdAt: this.cleanDate(orderUpdated.createdAt)
          };

          this.orders = this.orders.map(o => o.id === this.editingId ? cleanedOrder : o);
          this.closeModal();
          this.updateTimers();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Erro ao atualizar pedido:', err);
          Swal.fire({
            icon: 'error',
            title: 'Erro ao atualizar',
            text: 'NÃ£o foi possÃ­vel atualizar o pedido no servidor.',
            confirmButtonColor: '#ef4444'
          });
        }
      });
    }
  }


  confirmDelete(order: OrderResponse): void {
    Swal.fire({
      title: 'Remover pedido?',
      html: `Deseja realmente remover o pedido da <strong>Mesa ${order.table}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.deleteOrder(order.id).subscribe({
          next: () => {
            this.orders = this.orders.filter(o => o.id !== order.id);
            this.cdr.markForCheck();
            Swal.fire({
              icon: 'success',
              title: 'Removido!',
              text: 'O pedido foi removido com sucesso.',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao remover',
              text: 'NÃ£o foi possÃ­vel remover o pedido. Tente novamente.',
              confirmButtonColor: '#ef4444',
            });
          }
        });
      }
    });
  }

  completeOrder(order: OrderResponse): void {
    Swal.fire({
      title: 'Finalizar pedido?',
      html: `Deseja marcar o pedido da <strong>Mesa ${order.table}</strong> como concluÃ­do?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sim, finalizar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.updateOrderStatus(order.id, Status.Completed).subscribe({
          next: () => {
            order.status = Status.Completed;
            this.updateTimers();
            this.cdr.markForCheck();
            Swal.fire({
              icon: 'success',
              title: 'Finalizado!',
              text: 'O pedido foi marcado como concluÃ­do.',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao finalizar',
              text: 'NÃ£o foi possÃ­vel finalizar o pedido. Tente novamente.',
              confirmButtonColor: '#ef4444',
            });
          }
        });
      }
    });
  }
}
