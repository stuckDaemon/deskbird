import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = 'admin@example.com';
  password = 'password123';
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = 'Invalid email or password.';
      },
    });
  }
}
