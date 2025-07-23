import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { mapTo, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { clearToken, clearUser, getToken, getUser, setToken, setUser } from './utils/session.util';
import { DecodedToken, LoginResponse } from './auth.interface';
import { ApiService } from '../service/api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}
  login(email: string, password: string): Observable<void> {
    return this.apiService.post<LoginResponse>('auth/login', { email, password }).pipe(
      tap((res) => {
        const token = res.access_token;
        setToken(token);

        const decoded = jwtDecode<DecodedToken>(token);
        setUser({ id: decoded.sub, role: decoded.role });
      }),
      mapTo(void 0)
    );
  }

  logout(): void {
    clearToken();
    clearUser();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return getToken();
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
    const user = getUser();
    return user?.role ?? null;
  }
}
