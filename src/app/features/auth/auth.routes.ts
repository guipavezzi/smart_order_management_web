import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';

export const authRoutes: Routes = [
	{
		path: '',
		component: AuthLayoutComponent,
		children: [
			{ path: 'login', component: LoginComponent },
			{ path: 'register', component: RegisterComponent },
			{ path: '', redirectTo: 'login', pathMatch: 'full' }
		]
	}
];
