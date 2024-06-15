import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private langSource = new BehaviorSubject<string>('en');
  lang$ = this.langSource.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { 
    if (isPlatformBrowser(this.platformId)) {
      this.initLanguage();
    }
  }

  private initLanguage() {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.langSource.next(savedLang);
  }

  setLanguage(lang: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lang', lang);
    }
    this.langSource.next(lang);
  }

  getLanguage(): string {
    return this.langSource.getValue();
  }
}