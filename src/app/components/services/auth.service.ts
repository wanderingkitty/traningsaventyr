import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:1408/api/users';
  public currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    if (typeof window !== 'undefined') {
      this.loadUserFromStorage();
    }
  }

  private loadUserFromStorage() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  async login(username: string, password: string) {
    try {
      const response = await fetch(`${this.apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userData = { name: username };
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(userData));
        }
        this.currentUserSubject.next(userData);
        this.router.navigate(['/character-creation']);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  async signup(username: string, password: string) {
    try {
      const response = await fetch(`${this.apiUrl}/signup`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ name: username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const userData = { name: username };
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(userData));
        }
        this.currentUserSubject.next(userData);
        this.router.navigate(['/character-creation']);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  logout() {
    const savedCharacter = localStorage.getItem('selectedCharacter');
    const savedUser = localStorage.getItem('user');

    if (typeof window !== 'undefined') {
      // Очищаем токен и текущего пользователя
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Устанавливаем флаг для автоматического перехода
      localStorage.setItem('autoNavigate', 'true');
    }

    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);

    // Если у нас есть данные о персонаже и пользователе,
    // сохраняем их для будущего использования
    if (savedCharacter && savedUser) {
      const userData = JSON.parse(savedUser);

      // Сохраняем привязку персонажа к пользователю в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`character_${userData.name}`, savedCharacter);
      }
    }
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }
}
