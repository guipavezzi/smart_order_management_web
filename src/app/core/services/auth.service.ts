import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequestDto, RegisterRequestDto, UserProfile, RefreshTokenRequestDto } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private readonly API_URL = `${environment.apiUrl}/user`;

	private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
	public currentUser$ = this.currentUserSubject.asObservable();

	private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
	public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

	constructor(private http: HttpClient, private router: Router) {
		if (this.hasToken()) {
			setTimeout(() => {
				this.loadUserProfile().subscribe({
					error: () => this.logout() // If token is invalid/expired, logout
				});
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

	logout() {
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
