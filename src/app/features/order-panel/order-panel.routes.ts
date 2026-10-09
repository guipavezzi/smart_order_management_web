import { Routes } from '@angular/router';

export const orderPanelRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./order-panel.component').then((m) => m.OrderPanelComponent)
  }
];
