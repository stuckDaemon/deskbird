import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';

  login() {
    console.log('Login attempted', this.email, this.password);
  }
}
