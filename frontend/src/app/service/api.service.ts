import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: Record<string, any>): Observable<T> {
    return this.http
      .get<T>(this.resolve(endpoint), {
        params: new HttpParams({ fromObject: params || {} }),
      })
      .pipe(catchError(this.handleError));
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(this.resolve(endpoint), body).pipe(catchError(this.handleError));
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(this.resolve(endpoint), body).pipe(catchError(this.handleError));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.resolve(endpoint)).pipe(catchError(this.handleError));
  }

  private resolve(endpoint: string): string {
    return `${this.baseUrl}/${endpoint}`;
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'Unexpected error. Please try again.';

    if (error.status === 401) message = 'Unauthorized. Please login.';
    else if (error.status === 404) message = 'Resource not found.';
    else if (error.status === 0) message = 'Network error. Please check your connection.';
    else if (error.error?.message) message = error.error.message;

    return throwError(() => new Error(message));
  }
}
