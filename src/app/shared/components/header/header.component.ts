import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService, Notification } from '../../services/notification.service';
import { LanguageService, LanguageOption } from '../../services/language.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  currentUser: User | null = null;
  notifications: Notification[] = [];
  unreadCount = 0;
  showNotifications = false;
  languages: LanguageOption[];
  currentLang: string;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    public languageService: LanguageService
  ) {
    this.languages = this.languageService.languages;
    this.currentLang = this.languageService.currentLang;
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      this.unreadCount = this.notificationService.unreadCount;
    });

    this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleNotificationsPanel(): void {
    this.showNotifications = !this.showNotifications;
  }

  markAllRead(): void {
    this.notificationService.markAllAsRead();
  }

  switchLanguage(langCode: string): void {
    this.languageService.setLanguage(langCode);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'notifications';
    }
  }
}
