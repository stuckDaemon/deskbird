import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../core/auth.service';
import { LayoutService } from '../service/layout.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div
      class="bg-surface-0 dark:bg-surface-900 p-4 rounded-xl border border-surface-200 dark:border-surface-700 w-full flex justify-between items-center"
    >
      <span class="hidden sm:flex flex-col">
        <span class="text-xl font-light text-surface-700 dark:text-surface-100 leading-none">
          Deskbird
        </span>
        <span class="text-sm font-medium text-primary leading-tight"> Gabriele Bonadiman </span>
      </span>

      <button
        pButton
        type="button"
        icon="pi pi-sign-out"
        class="p-button-rounded p-button-text"
        aria-label="Logout"
        (click)="logout()"
      ></button>
    </div>
  `,
})
export class AppTopbar {
  private layoutService = inject(LayoutService);

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
