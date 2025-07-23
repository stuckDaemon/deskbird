import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { AppTopbar } from '../../app.topbar';
import { User } from '../../../models/user.model';
import { environment } from '../../../environment';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
  imports: [CommonModule, TableModule, AppTopbar],
})
export class UserListComponent {
  users: User[] = [];
  totalRecords = 0;
  isLoading = false;
  rows = 10;

  constructor(private http: HttpClient) {}

  loadUsersLazy(event: any): void {
    this.isLoading = true;

    const offset = event.first || 0;
    const limit = event.rows || this.rows;
    this.rows = limit;

    this.http
      .get<{
        data: User[];
        total: number;
      }>(`${environment.apiUrl}/users?offset=${offset}&limit=${limit}`)
      .subscribe({
        next: ({ data, total }) => {
          this.users = data;
          this.totalRecords = total;
          this.isLoading = false;
        },
        error: () => {
          this.users = [];
          this.totalRecords = 0;
          this.isLoading = false;
        },
      });
  }
}
