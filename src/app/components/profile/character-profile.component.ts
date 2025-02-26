import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CharacterService } from '../services/character.service';

@Component({
  selector: 'app-character-profile',
  templateUrl: './character-profile.component.html',
  styleUrls: ['./character-profile.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CharacterProfileComponent implements OnInit {
  character: any;
  user$;

  constructor(
    private router: Router,
    private authService: AuthService,
    private characterService: CharacterService
  ) {
    this.user$ = this.authService.currentUser$;

    // Получаем персонажа из состояния навигации
    const navigation = this.router.getCurrentNavigation();
    this.character = navigation?.extras?.state?.['character'];

    console.log('Initial character:', this.character);

    // Если персонажа нет в состоянии, пробуем загрузить из localStorage
    if (!this.character && typeof window !== 'undefined') {
      const savedCharacter = localStorage.getItem('selectedCharacter');
      if (savedCharacter) {
        this.character = JSON.parse(savedCharacter);
        console.log('Loaded character from localStorage:', this.character);
      } else {
        console.warn('No character found, redirecting...');
        this.router.navigate(['/character-creation']);
      }
    } else if (this.character && typeof window !== 'undefined') {
      // Сохраняем персонажа в localStorage для будущего использования
      localStorage.setItem('selectedCharacter', JSON.stringify(this.character));
    }
  }

  ngOnInit() {
    console.log('Component initialized');
    // Здесь можно получить обновленную информацию о прогрессе с сервера
    this.updateAchievementProgress();
  }

  // Метод для обновления прогресса достижений
  updateAchievementProgress() {
    // Для примера добавим некоторый прогресс
    // В реальности эти данные должны приходить с сервера
    if (this.character && this.character.achievements) {
      const currentUser = this.authService.getCurrentUser();

      if (currentUser && currentUser.userId) {
        // Здесь можно сделать запрос к серверу для получения актуального прогресса
        // this.characterService.getAchievementProgress(currentUser.userId).subscribe(
        //   progress => {
        //     // Обновляем прогресс достижений
        //     this.applyProgressData(progress);
        //   }
        // );

        // Пока нет реального API, просто обновим прогресс для демонстрации
        this.character.achievements.forEach(
          (achievement: any, index: number) => {
            // Генерируем случайный прогресс для демонстрации
            // В реальности здесь должны быть данные с сервера
            const demoProgress = Math.min(
              achievement.progress + Math.floor(Math.random() * 20),
              100
            );
            achievement.progress = demoProgress;

            // Если прогресс достиг 100%, отмечаем как выполненное
            achievement.completed = demoProgress >= 100;
          }
        );
      }
    }
  }

  // Метод, который будет применять данные о прогрессе из серверного ответа
  applyProgressData(progressData: any) {
    if (!progressData || !this.character?.achievements) return;

    this.character.achievements.forEach((achievement: any) => {
      const achievementProgress = progressData[achievement.name];
      if (achievementProgress) {
        achievement.progress = achievementProgress.progress;
        achievement.current = achievementProgress.current;
        achievement.completed = achievementProgress.completed;
      }
    });
  }

  goBack() {
    this.router.navigate(['/character-creation']);
  }

  onLogout() {
    this.authService.logout();
  }

  startWorkout() {
    // Сохраняем выбранного персонажа перед переходом на страницу тренировки
    if (this.character && typeof window !== 'undefined') {
      localStorage.setItem('selectedCharacter', JSON.stringify(this.character));
    }
    this.router.navigate(['/workout-page']);
  }
}
