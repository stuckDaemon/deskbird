import { Component } from '@angular/core';
import { AppTopbar } from './components/app.topbar';
import { StatsWidget } from './components/dashboard/statswidget';
import { SalesTrendWidget } from './components/dashboard/salestrendwidget';
import { RecentActivityWidget } from './components/dashboard/recentactivitywidget';
import { ProductOverviewWidget } from './components/dashboard/productoverviewwidget';
import { AppFooter } from './components/app.footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {}
