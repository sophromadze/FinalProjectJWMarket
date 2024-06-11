import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  user: any = {};
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    this.authService.getUserProfile().subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        this.errorMessage = 'Error loading user data';
      }
    );
  }

  changePassword() {
    this.router.navigate(['/change-password']);
  }

  saveProfile() {
    this.authService.updateUserProfile(this.user).subscribe(
      () => {
        alert('Profile updated successfully');
      },
      (error) => {
        this.errorMessage = 'Error updating profile';
      }
    );
  }
}
