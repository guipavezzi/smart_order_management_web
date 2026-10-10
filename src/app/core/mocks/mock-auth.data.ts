import { AuthResponse, UserProfile } from '../models/auth.model';
import { environment } from '../../../environments/environment';

export const MOCK_USER_PROFILE: UserProfile = {
  userId: 'usr-dev-999',
  companyId: 'comp-dev-001',
  role: 'Admin',
  email: 'admin.dev@smartorder.com'
};

export const MOCK_AUTH_RESPONSE: AuthResponse = {
  accessToken: 'mock-dev-jwt-token-access-2026',
  refreshToken: 'mock-dev-jwt-token-refresh-2026',
  companyName: 'TEMPO 86 (Dev Mode)'
};

/**
 * Inicializa auto-login para modo de desenvolvimento sem API.
 * Se o usuário tiver deslogado explicitamente nesta sessão, respeita para permitir testar a tela de login.
 */
export function setupMockAutoLogin(): void {
  if (typeof window === 'undefined') return;

  if (environment.mockApi && environment.mockAutoLogin) {
    const isExplicitlyLoggedOut = sessionStorage.getItem('dev_logged_out') === 'true';
    const hasToken = !!localStorage.getItem('jwt_token');

    if (!hasToken && !isExplicitlyLoggedOut) {
      localStorage.setItem('jwt_token', MOCK_AUTH_RESPONSE.accessToken);
      localStorage.setItem('refresh_token', MOCK_AUTH_RESPONSE.refreshToken);
      localStorage.setItem('company_name', MOCK_AUTH_RESPONSE.companyName || 'TEMPO 86');
      console.log('%c[MOCK AUTH] Auto-login ativo! Sessão iniciada como Admin Dev.', 'color: #3b82f6; font-weight: bold;');
    }
  }
}
