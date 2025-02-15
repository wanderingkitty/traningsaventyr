import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LoginPageComponent {
  username = '';
  password = '';

  constructor(private router: Router, private http: HttpClient) {}

  async onLogin() {
    try {
      const response = await fetch('http://localhost:1408/api/users/login', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        this.router.navigate(['/character-creation']);
      } else {
        console.error('Login error:', data.message);
      }
    } catch (error) {
      console.error('Request sending error:', error);
    }
  }

  async onSignin() {}
}
