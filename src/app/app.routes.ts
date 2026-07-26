import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'dashboard'
	},
	{
		path: 'painel-de-pedidos',
		loadChildren: () =>
			import('./features/order-panel/order-panel.routes').then(
				(m) => m.orderPanelRoutes
			)
	},
	{
		path: 'historico',
		loadChildren: () => import('./features/history/history.routes').then((m) => m.historyRoutes)
	},
	{
		path: 'dashboard',
		loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes)
	},
	{
		path: 'cardapio',
		loadChildren: () => import('./features/menu/menu.routes').then((m) => m.menuRoutes)
	},
	{
		path: '**',
		redirectTo: 'dashboard'
	}
];
