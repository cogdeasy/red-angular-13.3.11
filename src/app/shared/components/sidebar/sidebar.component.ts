import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

interface NavItem {
  icon: string;
  labelKey: string;
  route: string;
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isCollapsed = false;

  navItems: NavItem[] = [
    { icon: 'dashboard', labelKey: 'SIDEBAR.DASHBOARD', route: '/dashboard' },
    { icon: 'description', labelKey: 'SIDEBAR.MY_LOANS', route: '/loan-status' },
    { icon: 'add_circle_outline', labelKey: 'SIDEBAR.APPLY_FOR_LOAN', route: '/loan-application' },
    { icon: 'calculate', labelKey: 'SIDEBAR.LOAN_CALCULATOR', route: '/loan-calculator' },
    { icon: 'person', labelKey: 'SIDEBAR.MY_PROFILE', route: '/profile' }
  ];

  constructor(public router: Router) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
