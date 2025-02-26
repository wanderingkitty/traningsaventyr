import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CharacterService } from '../services/character.service';

@Component({
  selector: 'app-landing',
  templateUrl: 'landing.component.html',
  styleUrls: ['landing.component.scss'],
  standalone: true,
  imports: [RouterModule],
})
export class LandingComponent implements OnInit {
  // Флаг для отслеживания статуса авторизации
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private characterService: CharacterService
  ) {}

  ngOnInit() {
    // Просто проверяем статус, но НЕ перенаправляем
    const currentUser = this.authService.getCurrentUser();
    this.isLoggedIn = !!currentUser;

    // Выводим информацию для отладки
    console.log(
      'Current user status:',
      this.isLoggedIn ? 'Logged in' : 'Not logged in'
    );
  }

  getStarted() {
    console.log('getStarted clicked');
    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      // Если пользователь авторизован, проверяем наличие профиля
      this.characterService.getUserProfile(currentUser.name).subscribe({
        next: (profile) => {
          console.log('Profile found:', profile);
          if (profile) {
            // Есть профиль - идем на страницу персонажа
            this.router.navigate(['/character-profile']);
          } else {
            // Нет профиля - идем на страницу создания персонажа
            this.router.navigate(['/character-creation']);
          }
        },
        error: (err) => {
          console.error('Error getting profile:', err);
          // В случае ошибки идем на страницу создания персонажа
          this.router.navigate(['/character-creation']);
        },
      });
    } else {
      // Пользователь не авторизован - идем на страницу входа
      this.router.navigate(['/login']);
    }
  }

  learnMore() {
    this.router.navigate(['/about']);
  }
}
