import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequestDto, RegisterRequestDto, UserProfile, RefreshTokenRequestDto } from '../models/auth.model';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private readonly API_URL = `${environment.apiUrl}/user`;

	private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
	public currentUser$ = this.currentUserSubject.asObservable();

	private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
	public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

	private sessionMonitorSub: Subscription | null = null;
	private isAlertingSession = false;

	constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) {
		if (this.hasToken()) {
			setTimeout(() => {
				this.loadUserProfile().subscribe({
					error: () => this.handleSessionInvalidated()
				});
			});
			this.startSessionMonitor();
		}

		if (typeof window !== 'undefined') {
			window.addEventListener('focus', () => this.checkSessionOnActivity());
			document.addEventListener('visibilitychange', () => {
				if (!document.hidden) {
					this.checkSessionOnActivity();
				}
			});
		}
	}

	public get currentUserValue(): UserProfile | null {
		return this.currentUserSubject.value;
	}

	public get isAuthenticated(): boolean {
		return this.isAuthenticatedSubject.value;
	}

	public getCompanyName(): string {
		return localStorage.getItem('company_name') || 'TEMPO 86';
	}

	login(request: LoginRequestDto): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(`${this.API_URL}/login`, request).pipe(
			tap(response => {
				this.setTokens(response);
				this.isAuthenticatedSubject.next(true);
				this.startSessionMonitor();
				this.loadUserProfile().subscribe();
			})
		);
	}

	registerSaas(request: RegisterRequestDto): Observable<any> {
		return this.http.post(`${environment.apiUrl}/Company/register-saas`, request);
	}

	refreshToken(): Observable<AuthResponse> {
		const token = this.getToken();
		const refreshToken = localStorage.getItem('refresh_token');

		if (!token || !refreshToken) {
			this.logout();
			throw new Error('No tokens available');
		}

		const request: RefreshTokenRequestDto = { accessToken: token, refreshToken };

		return this.http.post<AuthResponse>(`${environment.apiUrl}/user/refresh-token`, request).pipe(
			tap(response => {
				this.setTokens(response);
			})
		);
	}

	loadUserProfile(): Observable<UserProfile> {
		return this.http.get<UserProfile>(`${this.API_URL}/me`).pipe(
			tap(user => this.currentUserSubject.next(user))
		);
	}

	private checkSessionOnActivity() {
		if (this.hasToken()) {
			this.loadUserProfile().subscribe({
				error: () => this.handleSessionInvalidated()
			});
		}
	}

	private startSessionMonitor() {
		this.stopSessionMonitor();
		this.ngZone.runOutsideAngular(() => {
			this.sessionMonitorSub = interval(15000).subscribe(() => {
				if (this.hasToken()) {
					this.loadUserProfile().subscribe({
						error: () => {
							this.ngZone.run(() => this.handleSessionInvalidated());
						}
					});
				}
			});
		});
	}

	private stopSessionMonitor() {
		if (this.sessionMonitorSub) {
			this.sessionMonitorSub.unsubscribe();
			this.sessionMonitorSub = null;
		}
	}

	public handleSessionInvalidated() {
		if (this.isAlertingSession) return;
		this.isAlertingSession = true;

		this.logout();

		Swal.fire({
			icon: 'warning',
			title: 'Sessão Encerrada',
			text: 'Sua conta foi conectada em outro dispositivo.',
			confirmButtonColor: '#6366f1'
		}).finally(() => {
			this.isAlertingSession = false;
		});
	}

	logout() {
		this.stopSessionMonitor();
		this.removeTokens();
		this.currentUserSubject.next(null);
		this.isAuthenticatedSubject.next(false);
		this.router.navigate(['/auth/login']);
	}

	getToken(): string | null {
		return localStorage.getItem('jwt_token');
	}

	private setTokens(response: AuthResponse) {
		localStorage.setItem('jwt_token', response.accessToken);
		localStorage.setItem('refresh_token', response.refreshToken);
		if (response.companyName) {
			localStorage.setItem('company_name', response.companyName);
		}
	}

	private removeTokens() {
		localStorage.removeItem('jwt_token');
		localStorage.removeItem('refresh_token');
		localStorage.removeItem('company_name');
	}

	private hasToken(): boolean {
		return !!this.getToken();
	}
}