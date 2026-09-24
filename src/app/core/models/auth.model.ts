export interface LoginRequestDto {
	email?: string;
	password?: string;
}

export interface RegisterRequestDto {
	name?: string;
	email?: string;
	password?: string;
	companyName?: string;
}

export interface RefreshTokenRequestDto {
	accessToken: string;
	refreshToken: string;
}

export interface AuthResponse {
	accessToken: string;
	refreshToken: string;
	companyName?: string;
}

export interface UserProfile {
	userId: string;
	companyId: string;
	role: string;
	email: string;
}
