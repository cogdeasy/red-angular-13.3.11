import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

export interface LanguageOption {
  code: string;
  label: string;
  currencySymbol: string;
  currencyCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  readonly languages: LanguageOption[] = [
    { code: 'en', label: 'English', currencySymbol: '£', currencyCode: 'GBP' },
    { code: 'hi', label: 'हिन्दी', currencySymbol: '₹', currencyCode: 'INR' }
  ];

  private currentLangSubject = new BehaviorSubject<string>('en');
  currentLang$ = this.currentLangSubject.asObservable();

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    const savedLang = localStorage.getItem('hsbc-lang') || 'en';
    this.setLanguage(savedLang);
  }

  setLanguage(langCode: string): void {
    const supported = this.languages.find(l => l.code === langCode);
    const validLang = supported ? langCode : 'en';
    this.translate.use(validLang);
    this.currentLangSubject.next(validLang);
    localStorage.setItem('hsbc-lang', validLang);
    document.documentElement.lang = validLang;
  }

  get currentLang(): string {
    return this.currentLangSubject.value;
  }

  get currentLanguage(): LanguageOption {
    return this.languages.find(l => l.code === this.currentLang) || this.languages[0];
  }

  get currencySymbol(): string {
    return this.currentLanguage.currencySymbol;
  }

  formatCurrency(value: number): string {
    if (value === null || value === undefined) return '-';
    const symbol = this.currencySymbol;
    if (this.currentLang === 'hi') {
      return symbol + this.formatIndianNumber(value);
    }
    return symbol + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  private formatIndianNumber(value: number): string {
    const isNegative = value < 0;
    const fixed = Math.abs(value).toFixed(2);
    const parts = fixed.split('.');
    const intPart = parts[0];
    const decPart = parts[1];

    let result: string;
    if (intPart.length <= 3) {
      result = intPart + '.' + decPart;
    } else {
      const lastThree = intPart.slice(-3);
      const remaining = intPart.slice(0, -3);
      const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
      result = formatted + ',' + lastThree + '.' + decPart;
    }
    return (isNegative ? '-' : '') + result;
  }
}
