import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  userDto = {
    UserName: '',
    Email: '',
    Password: '',
    FirstName: '',
    LastName: '',
    Address: '',
    PersonalId: '',
    PhoneNumber: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.userDto).subscribe(
      (response: any) => {
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
