import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);
	const token = authService.getToken();

	if (req.url.includes('/login') || req.url.includes('/register') || req.url.includes('/refresh-token')) {
		return next(req);
	}

	let clonedRequest = req;
	if (token) {
		clonedRequest = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`
			}
		});
	}

	return next(clonedRequest).pipe(
		catchError((error: HttpErrorResponse) => {
			if (error.status === 401 && !req.url.includes('/login')) {
				return authService.refreshToken().pipe(
					switchMap((response) => {
						const newReq = req.clone({
							setHeaders: {
								Authorization: `Bearer ${response.accessToken}`
							}
						});
						return next(newReq);
					}),
					catchError((refreshError) => {
						authService.handleSessionInvalidated();
						return throwError(() => refreshError);
					})
				);
			}
			return throwError(() => error);
		})
	);
};