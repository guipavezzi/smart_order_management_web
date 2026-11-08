import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly darkModeSubject = new BehaviorSubject(false);
  readonly darkMode$ = this.darkModeSubject.asObservable();

  get isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  initialize(): boolean {
    const savedTheme = localStorage.getItem('smart-order-theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    this.apply(isDark);
    return isDark;
  }

  toggle(): boolean {
    const isDark = !this.isDarkMode;
    localStorage.setItem('smart-order-theme', isDark ? 'dark' : 'light');
    this.apply(isDark);
    return isDark;
  }

  private apply(isDark: boolean): void {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    this.darkModeSubject.next(isDark);
  }
}
