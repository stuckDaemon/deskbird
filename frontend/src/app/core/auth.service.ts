import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../environment';

interface LoginResponse {
  access_token: string;
}

interface DecodedToken {
  sub: string;
  role: 'admin' | 'user';
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.TOKEN_KEY, response.access_token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp > now;
    } catch (_) {
      return false;
    }
  }

  getUserRole(): 'admin' | 'user' | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.role;
    } catch (_) {
      return null;
    }
  }
}
