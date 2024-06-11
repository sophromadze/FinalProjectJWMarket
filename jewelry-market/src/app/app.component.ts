import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  username: string | null = null;
  balance: number = 0;
  role: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.authService.loadUserProfile(); // Load user profile when logged in
      } else {
        this.balance = 0; // Reset balance when logged out
      }
    });

    this.authService.username$.subscribe((username) => {
      this.username = username;
    });

    this.authService.balance$.subscribe((balance) => {
      this.balance = balance;
    });

    this.authService.role$.subscribe((role) => {
      this.role = role;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToAdminPanel(): void {
    this.router.navigate(['/admin-panel']);
  }
}
