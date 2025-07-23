import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AppTopbar } from '../../app.topbar';
import { User } from '../../../models/user.model';
import { Dialog } from 'primeng/dialog';
import { InputGroup, InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddon, InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormsModule } from '@angular/forms';
import { Message } from 'primeng/message';
import { AuthService } from '../../../core/auth.service';
import { Button, ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.html',
  imports: [
    CommonModule,
    TableModule,
    AppTopbar,
    Dialog,
    InputGroup,
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    Message,
    InputGroupAddon,
    FormsModule,
    Message,
    Button,
  ],
})
export class UserListComponent {
  users: User[] = [];
  selectedUser: User | null = null;
  displayEditDialog = false;
  totalRecords = 0;
  rows = 10;
  isLoading = false;
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  loadUsersLazy(event: any): void {
    this.isLoading = true;

    const offset = event.first || 0;
    const limit = event.rows || this.rows;
    this.rows = limit;

    this.apiService.get<{ data: User[]; total: number }>('users', { offset, limit }).subscribe({
      next: ({ data, total }) => {
        this.users = data;
        this.totalRecords = total;
      },
      error: (err) => {
        this.errorMessage = err.message;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'admin';
  }

  onEditUser(user: User) {
    if (user.role !== 'user') return;
    this.selectedUser = { ...user };
    this.displayEditDialog = true;
  }

  updateUser() {
    if (!this.selectedUser) return;

    const dto = {
      firstName: this.selectedUser.firstName,
      lastName: this.selectedUser.lastName,
      age: this.selectedUser.age,
    };

    this.isLoading = true;

    this.apiService.put(`users/${this.selectedUser.id}`, dto).subscribe({
      next: () => {
        this.displayEditDialog = false;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.displayEditDialog = false;
        this.isLoading = false;
      },
    });
  }
}
