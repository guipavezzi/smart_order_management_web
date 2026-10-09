import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { OrderService } from '@app/core/services/order.service';
import { Subscription, interval } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '@app/core/services/auth.service';

type SidebarItem = Readonly<{
	label: string;
	path: string;
	icon: string;
}>;

@Component({
	selector: 'app-sidebar',
	imports: [RouterLink, RouterLinkActive],
	templateUrl: './sidebar.html',
	styleUrl: './sidebar.css',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar implements OnInit, OnDestroy {
	@Output() closeSidebar = new EventEmitter<void>();

	protected readonly navigationItems: SidebarItem[] = [
		{ label: 'Painel de Pedidos', path: '/painel-de-pedidos', icon: 'order_approve' },
		{ label: 'HistÃ³rico', path: '/historico', icon: 'history' },
		{ label: 'DashBoard', path: '/dashboard', icon: 'dashboard' },
		{ label: 'CardÃ¡pio', path: '/cardapio', icon: 'menu_book' }
	];

	protected readonly averageTimeLabel = 'Tempo mÃ©dio de hoje';
	protected averageTimeValue = 'Carregando...';
	
	private metricsSub!: Subscription;

	constructor(
		private orderService: OrderService,
		private authService: AuthService,
		private cdr: ChangeDetectorRef
	) {}

	ngOnInit() {
		this.fetchMetrics();
		this.metricsSub = this.orderService.metricsUpdated.subscribe(() => this.fetchMetrics());
	}

	ngOnDestroy() {
		if (this.metricsSub) this.metricsSub.unsubscribe();
	}

	onLinkClick() {
		this.closeSidebar.emit();
	}

	closeShift() {
		Swal.fire({
			title: 'Encerrar Expediente?',
			html: 'Isso vai <strong>agrupar e arquivar</strong> todos os pedidos concluÃ­dos desta noite. O painel analÃ­tico serÃ¡ limpo para o prÃ³ximo dia.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#10b981',
			cancelButtonColor: '#334155',
			confirmButtonText: 'Sim, Encerrar!',
			cancelButtonText: 'Cancelar'
		}).then((result) => {
			if (result.isConfirmed) {
				this.orderService.closeShift().subscribe({
					next: (res) => {
						Swal.fire({
							icon: 'success',
							title: 'Expediente Encerrado!',
							text: `Todos os pedidos foram arquivados na pasta: ${res.message}.`,
							confirmButtonColor: '#10b981'
						});
					},
					error: () => {
						Swal.fire({
							icon: 'error',
							title: 'Erro',
							text: 'NÃ£o foi possÃ­vel encerrar o expediente ou nÃ£o hÃ¡ pedidos para arquivar.',
							confirmButtonColor: '#ef4444'
						});
					}
				});
			}
		});
	}

	private fetchMetrics() {
		this.orderService.getMetrics().subscribe({
			next: (data) => {
				this.averageTimeValue = `${data.averagePreparationTime || 0} min`;
				this.cdr.markForCheck();
			}
		});
	}

	confirmLogout() {
		Swal.fire({
			title: 'Sair do Sistema?',
			text: 'Tem certeza que deseja fazer logout?',
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#ef4444',
			cancelButtonColor: '#334155',
			confirmButtonText: 'Sim, Sair',
			cancelButtonText: 'Cancelar',
			background: '#1e293b',
			color: '#fff'
		}).then((result) => {
			if (result.isConfirmed) {
				this.authService.logout();
			}
		});
	}
}
