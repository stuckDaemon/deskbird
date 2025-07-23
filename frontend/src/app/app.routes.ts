import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { UserListComponent } from './components/users/user-list/user-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UserListComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
