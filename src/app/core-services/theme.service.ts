import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  
  private themeSource = new BehaviorSubject<string>('light-theme');
  theme$ = this.themeSource.asObservable();
  private darkModeMediaQuery: MediaQueryList;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.initTheme();
    }
  }

  private initTheme() {
    const savedTheme = localStorage.getItem('currentTheme');
    const darkModeOn = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // console.log(`Saved theme: ${savedTheme}, Dark mode preference: ${darkModeOn}`);
  
    this.themeSource.next(savedTheme || (darkModeOn ? 'dark-theme' : 'light-theme'));
    document.body.classList.add(this.themeSource.value);
  
    this.darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.darkModeMediaQuery.addEventListener('change', this.handleThemeChange.bind(this));
  }
  
  private handleThemeChange(event: MediaQueryListEvent) {
    const newTheme = event.matches ? 'dark-theme' : 'light-theme';
    this.setTheme(newTheme);
  }
  
  public setTheme(newTheme: string) {
    document.body.classList.replace(this.themeSource.value, newTheme);
    this.themeSource.next(newTheme);
    localStorage.setItem('currentTheme', newTheme);
  }
  
  public toggleTheme() {
    const newTheme = this.themeSource.value === 'light-theme' ? 'dark-theme' : 'light-theme';
    this.setTheme(newTheme);
  }
  
  public get currentTheme(): string {
    return this.themeSource.value;
  }
  
}
