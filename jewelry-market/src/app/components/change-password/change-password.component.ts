import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  username: string | null = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.username = localStorage.getItem('username'); // Retrieve the username from local storage
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New password and confirm password do not match';
      return;
    }

    this.authService
      .changePassword(this.currentPassword, this.newPassword)
      .subscribe(
        () => {
          alert('Password changed successfully');
          this.router.navigate(['/edit-profile']);
        },
        (error) => {
          this.errorMessage = 'You entered wrong password';
          console.error('Error:', error); // Log the error to the console
        }
      );
  }

  changeInputType(event: Event) {
    const input = event.target as HTMLInputElement;
    input.type = 'password';
  }
}
