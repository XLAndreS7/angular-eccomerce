import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  error = '';
  isAdmin = false;
  loading = false;

  constructor(private _auth: AuthService, private _router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    if (!this.email || !this.password) {
      this.error = 'Make sure to fill everything ;)';
    } else {
      this._auth
        .login({
          email: this.email,
          password: this.password,
          isAdmin: this.isAdmin,
        })
        .subscribe(
          (res) => {
            this.loading = false;
            if (this._auth.getUser()?.isAdmin) {
              this._router.navigate(['/admin/dashboard']);
            } else {
              this._router.navigate(['/']);
            }
          },
          (err) => {
            console.log(err);
            this.error = err.error.message;
            this.loading = false;
          }
        );
    }
  }

  canSubmit(): boolean {
    return this.email.length > 0 && this.password.length > 0;
  }
}
