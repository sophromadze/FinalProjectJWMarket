import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://localhost:7146/api/users'; // Ensure this matches your backend URL

  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  private usernameSubject = new BehaviorSubject<string | null>(
    this.getUsername()
  );
  private balanceSubject = new BehaviorSubject<number>(0); // New subject for balance
  private roleSubject = new BehaviorSubject<string | null>(this.getUserRole()); // New subject for role

  isLoggedIn$ = this.loggedInSubject.asObservable();
  username$ = this.usernameSubject.asObservable();
  balance$ = this.balanceSubject.asObservable();
  role$ = this.roleSubject.asObservable(); // New observable for role

  private logoutTimer: Subscription | null = null; // Timer for automatic logout

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http
      .post<{
        token: string;
        refreshToken: string;
        username: string;
        role: string;
      }>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('username', response.username);
          localStorage.setItem('role', response.role); // Store role
          // Store the expiration time of the refresh token
          const refreshTokenExpiration = new Date();
          refreshTokenExpiration.setMinutes(
            refreshTokenExpiration.getMinutes() + 1
          );
          localStorage.setItem(
            'refreshTokenExpiresAt',
            refreshTokenExpiration.toISOString()
          );
          this.loggedInSubject.next(true);
          this.usernameSubject.next(response.username);
          this.roleSubject.next(response.role); // Update role subject
          this.loadUserProfile(); // Load user profile on login
          this.scheduleTokenRefresh(); // Schedule automatic token refresh
        })
      );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('role'); // Remove role
    localStorage.removeItem('refreshTokenExpiresAt');
    this.loggedInSubject.next(false);
    this.usernameSubject.next(null);
    this.roleSubject.next(null); // Reset role
    this.balanceSubject.next(0); // Reset balance on logout
    this.clearLogoutTimer(); // Clear automatic logout timer
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getUserRole(): string | null {
    return localStorage.getItem('role'); // Retrieve role
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/username/${localStorage.getItem('username')}`
    );
  }

  loadUserProfile() {
    this.getUserProfile().subscribe((user) => {
      if (user) {
        this.balanceSubject.next(user.balance); // Update balance
      }
    });
  }

  updateUserProfile(user: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${user.id}`, user);
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  private scheduleTokenRefresh() {
    this.clearLogoutTimer(); // Clear any existing timer
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      const tokenExpirationDate = new Date(
        localStorage.getItem('refreshTokenExpiresAt') || ''
      );
      const timeUntilExpiration =
        tokenExpirationDate.getTime() - new Date().getTime();
      this.logoutTimer = new Subscription();
      const timer = setTimeout(() => {
        this.refreshToken();
      }, timeUntilExpiration);
      this.logoutTimer.add({ unsubscribe: () => clearTimeout(timer) });
    }
  }

  private refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const username = localStorage.getItem('username');
    if (refreshToken && username) {
      this.http
        .post<{ token: string; refreshToken: string }>(
          `${this.baseUrl}/refresh-token`,
          { refreshToken, username }
        )
        .pipe(
          tap((response) => {
            localStorage.setItem('token', response.token);
            localStorage.setItem('refreshToken', response.refreshToken);
            // Update the refresh token expiration time
            const refreshTokenExpiration = new Date();
            refreshTokenExpiration.setMinutes(
              refreshTokenExpiration.getMinutes() + 1
            );
            localStorage.setItem(
              'refreshTokenExpiresAt',
              refreshTokenExpiration.toISOString()
            );
            this.scheduleTokenRefresh();
          }),
          catchError(() => {
            this.logout();
            return [];
          })
        )
        .subscribe();
    } else {
      this.logout();
    }
  }

  private clearLogoutTimer() {
    if (this.logoutTimer) {
      this.logoutTimer.unsubscribe();
      this.logoutTimer = null;
    }
  }
}
