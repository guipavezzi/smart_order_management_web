import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { MenuService } from '../../core/services/menu.service';
import { CreateMenuRequest, MenuResponse } from '../../core/models/menu.model';

const TIME_OPTIONS = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

type ModalMode = 'create' | 'edit';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class MenuComponent implements OnInit {
  private menuService = inject(MenuService);
  private cdr = inject(ChangeDetectorRef);

  menus: MenuResponse[] = [];
  isLoading = false;
  isModalOpen = false;
  isSubmitting = false;
  modalMode: ModalMode = 'create';
  editingId: string | null = null;
  errorMessage = '';

  readonly timeOptions = TIME_OPTIONS;

  form: CreateMenuRequest = {
    name: '',
    minPreparationTimeInMinutes: 10,
    maxPreparationTimeInMinutes: 20,
  };

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus(): void {
    this.isLoading = true;
    this.menuService.getMenus().subscribe({
      next: (data) => {
        this.menus = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro de Conexão',
          text: 'Não foi possível carregar o cardápio. Verifique se a API está rodando.',
          confirmButtonColor: '#ef4444',
        });
        this.cdr.markForCheck();
      },
    });
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.editingId = null;
    this.form = { name: '', minPreparationTimeInMinutes: 10, maxPreparationTimeInMinutes: 20 };
    this.errorMessage = '';
    this.isModalOpen = true;
  }

  openEditModal(item: MenuResponse): void {
    this.modalMode = 'edit';
    this.editingId = item.id;
    this.form = {
      name: item.name,
      minPreparationTimeInMinutes: item.minPreparationTimeInMinutes,
      maxPreparationTimeInMinutes: item.maxPreparationTimeInMinutes,
    };
    this.errorMessage = '';
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    if (!this.form.name.trim()) {
      this.errorMessage = 'O nome é obrigatório.';
      return;
    }
    if (this.form.minPreparationTimeInMinutes >= this.form.maxPreparationTimeInMinutes) {
      this.errorMessage = 'O tempo mínimo deve ser menor que o tempo máximo.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    if (this.modalMode === 'create') {
      this.menuService.createMenu(this.form).subscribe({
        next: (created) => {
          this.menus = [...this.menus, created];
          this.isSubmitting = false;
          this.isModalOpen = false;
          this.cdr.markForCheck();
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Item cadastrado no cardápio.',
            timer: 1500,
            showConfirmButton: false,
          });
        },
        error: () => {
          this.errorMessage = 'Erro ao cadastrar o item. Tente novamente.';
          this.isSubmitting = false;
          this.cdr.markForCheck();
        },
      });
    } else {
      this.menuService.updateMenu(this.editingId!, this.form).subscribe({
        next: (updated) => {
          this.menus = this.menus.map((m) => (m.id === updated.id ? updated : m));
          this.isSubmitting = false;
          this.isModalOpen = false;
          this.cdr.markForCheck();
          Swal.fire({
            icon: 'success',
            title: 'Atualizado!',
            text: 'Item do cardápio atualizado com sucesso.',
            timer: 1500,
            showConfirmButton: false,
          });
        },
        error: () => {
          this.errorMessage = 'Erro ao atualizar o item. Tente novamente.';
          this.isSubmitting = false;
          this.cdr.markForCheck();
        },
      });
    }
  }

  confirmDelete(item: MenuResponse): void {
    Swal.fire({
      title: 'Remover item?',
      html: `Deseja remover <strong>${item.name}</strong> do cardápio?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.menuService.deleteMenu(item.id).subscribe({
          next: () => {
            this.menus = this.menus.filter((m) => m.id !== item.id);
            this.cdr.markForCheck();
            Swal.fire({
              icon: 'success',
              title: 'Removido!',
              text: `${item.name} foi removido do cardápio.`,
              timer: 1500,
              showConfirmButton: false,
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao remover',
              text: 'Não foi possível remover o item. Tente novamente.',
              confirmButtonColor: '#ef4444',
            });
          },
        });
      }
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).id === 'modal-backdrop') {
      this.closeModal();
    }
  }
}
