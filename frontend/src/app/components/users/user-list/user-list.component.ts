import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../models/user.model';
import { environment } from '../../../environment';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
  imports: [TableModule],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  totalRecords = 0;
  isLoading = true;
  error: string | null = null;
  rows = 10;
  first = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.http.get<User[]>(`${environment.apiUrl}/users`).subscribe({
      next: (data) => {
        this.users = data;
        this.totalRecords = data.length; // backend pagination later
        this.isLoading = false;
      },
      error: () => {
        this.error = 'You are not authorized to view this data.';
        this.isLoading = false;
      },
    });
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }
}
