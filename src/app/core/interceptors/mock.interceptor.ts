import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MOCK_AUTH_RESPONSE, MOCK_USER_PROFILE } from '../mocks/mock-auth.data';
import {
  getMockMenus,
  createMockMenu,
  updateMockMenu,
  deleteMockMenu
} from '../mocks/mock-menu.data';
import {
  getMockOrders,
  createMockOrder,
  updateMockOrderStatus,
  updateMockOrder,
  deleteMockOrder,
  closeMockShift,
  getMockMetrics,
  getMockAnalytics
} from '../mocks/mock-order.data';

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  // Se o mock não estiver ativado no environment, segue o fluxo normal para a API real
  if (!environment.mockApi) {
    return next(req);
  }

  const url = req.url;
  const method = req.method;
  const delayMs = environment.mockDelayMs ?? 200;

  const mockResponse = (body: any, status = 200) => {
    console.log(
      `%c[MOCK API] ${status} ${method} -> ${url}`,
      'color: #10b981; font-weight: bold; background: #064e3b15; padding: 2px 6px; border-radius: 4px;',
      body
    );
    return of(new HttpResponse({ status, body })).pipe(delay(delayMs));
  };

  // --- AUTH & USUÁRIO ---
  if (url.includes('/user/login') && method === 'POST') {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('dev_logged_out');
    }
    return mockResponse(MOCK_AUTH_RESPONSE);
  }

  if (url.includes('/user/me') && method === 'GET') {
    return mockResponse(MOCK_USER_PROFILE);
  }

  if (url.includes('/user/refresh-token') && method === 'POST') {
    return mockResponse(MOCK_AUTH_RESPONSE);
  }

  if (url.includes('/Company/register-saas') && method === 'POST') {
    return mockResponse({ success: true, message: 'Empresa cadastrada com sucesso no Mock!' });
  }

  // --- PEDIDOS (ORDER) ---
  if (url.includes('/order/metrics') && method === 'GET') {
    return mockResponse(getMockMetrics());
  }

  if (url.includes('/order/analytics') && method === 'GET') {
    return mockResponse(getMockAnalytics());
  }

  if (url.includes('/order/close-shift') && method === 'POST') {
    return mockResponse(closeMockShift());
  }

  // PATCH /order/:id/status
  if (/\/order\/[^\/]+\/status/.test(url) && method === 'PATCH') {
    const parts = url.split('/order/')[1].split('/status')[0];
    const result = updateMockOrderStatus(parts, req.body as any);
    return mockResponse(result);
  }

  // PUT ou DELETE /order/:id
  const orderIdMatch = url.match(/\/order\/([^\/\?]+)$/);
  if (orderIdMatch) {
    const id = orderIdMatch[1];
    if (method === 'PUT') {
      return mockResponse(updateMockOrder(id, req.body as any));
    }
    if (method === 'DELETE') {
      return mockResponse(deleteMockOrder(id));
    }
  }

  // GET ou POST /order (coleção)
  if (url.endsWith('/order') || url.includes('/order?')) {
    if (method === 'GET') {
      const activeOnly = req.params.get('activeOnly') === 'true';
      const completedOnly = req.params.get('completedOnly') === 'true';
      const includeArchived = req.params.get('includeArchived') === 'true';
      return mockResponse(getMockOrders(activeOnly, completedOnly, includeArchived));
    }
    if (method === 'POST') {
      return mockResponse(createMockOrder(req.body as any), 201);
    }
  }

  // --- CARDÁPIO (MENU) ---
  // PUT ou DELETE /menu/:id
  const menuIdMatch = url.match(/\/menu\/([^\/\?]+)$/);
  if (menuIdMatch) {
    const id = menuIdMatch[1];
    if (method === 'PUT') {
      return mockResponse(updateMockMenu(id, req.body as any));
    }
    if (method === 'DELETE') {
      return mockResponse(deleteMockMenu(id));
    }
  }

  // GET ou POST /menu (coleção)
  if (url.endsWith('/menu') || url.includes('/menu?')) {
    if (method === 'GET') {
      return mockResponse(getMockMenus());
    }
    if (method === 'POST') {
      return mockResponse(createMockMenu(req.body as any), 201);
    }
  }

  // Caso seja outra requisição não mapeada, repassa adiante
  return next(req);
};
