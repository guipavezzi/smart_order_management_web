import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
	const authService = inject(AuthService);
	const router = inject(Router);

	if (!authService.isAuthenticated) {
		return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
	}

	return authService.loadUserProfile().pipe(
		map(() => true),
		catchError(() => {
			authService.handleSessionInvalidated();
			return of(false);
		})
	);
};