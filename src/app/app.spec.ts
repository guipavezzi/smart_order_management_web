import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { mockInterceptor } from './core/interceptors/mock.interceptor';
import { setupMockAutoLogin } from './core/mocks/mock-auth.data';

import { Router } from '@angular/router';

if (typeof window !== 'undefined' && !(window as any).ResizeObserver) {
  (window as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

describe('App', () => {
  beforeEach(async () => {
    setupMockAutoLogin();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([mockInterceptor]))
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the shell and dashboard page through the router', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigate(['']);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('TEMPO 86');
    expect(compiled.textContent).toContain('DashBoard');
  });
});
