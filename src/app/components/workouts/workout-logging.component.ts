import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CharacterService } from '../services/character.service';
import { Achievement, Character, Workout } from 'backend/models/character';
import {
  ascenderWorkouts,
  runnerWorkouts,
  zenWarriorWorkouts,
} from './workout-data';

@Component({
  selector: 'workout-page',
  templateUrl: './workout-logging.component.html',
  styleUrls: ['./workout-logging.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class WorkoutComponent implements OnInit {
  isRunning: boolean = false;
  private timer: any;
  currentTime: number = 0;
  character?: Character;

  completedExercises: { [key: string]: boolean } = {};
  completedAchievements: { [key: string]: boolean } = {};

  totalXpGained: number = 0;
  routesCompleted: number = 0;

  notification: { show: boolean; message: string } = {
    show: false,
    message: '',
  };

  workouts: Workout[] = [];
  runnerWorkouts = runnerWorkouts;
  ascenderWorkouts = ascenderWorkouts;
  zenWarriorWorkouts = zenWarriorWorkouts;

  constructor(
    private router: Router,
    private characterService: CharacterService
  ) {}

  // Обновленный метод ngOnInit с проверкой соответствия достижений классу
  ngOnInit() {
    // Загружаем выбранного персонажа из localStorage
    const savedCharacter = localStorage.getItem('selectedCharacter');
    if (savedCharacter) {
      this.character = JSON.parse(savedCharacter);
      console.log('Loaded character in workout component:', this.character);

      // Инициализируем достижения, если их нет
      if (this.character && !this.character.achievements) {
        this.character.achievements = [];
        console.warn(
          'No achievements found for character, initializing empty array'
        );
      }

      // Инициализируем статистику, если её нет
      if (this.character && !this.character.stats) {
        this.character.stats = {
          totalWorkouts: 0,
          totalXpGained: 0,
        };
        console.warn(
          'No stats found for character, initializing default values'
        );
      }

      // Выбираем правильный набор тренировок в зависимости от класса персонажа
      this.loadWorkoutsForCharacterClass();
    } else {
      console.warn('No character found, redirecting...');
      this.router.navigate(['/character-creation']);
      return;
    }

    if (this.workouts.length > 0) {
      // Инициализируем completedExercises
      this.workouts[0].exercises.forEach((exercise) => {
        this.completedExercises[exercise.name] = false;
      });

      // ВАЖНОЕ ИЗМЕНЕНИЕ: Перед инициализацией completedAchievements
      // фильтруем достижения персонажа, чтобы убедиться, что все они
      // принадлежат текущему классу
      this.filterAchievementsByCurrentClass();

      // Инициализируем completedAchievements и синхронизируем с персонажем
      this.workouts[0].achievements.forEach((achievement) => {
        // По умолчанию устанавливаем, что достижение не выполнено
        this.completedAchievements[achievement.name] = false;

        // Проверяем, есть ли такое достижение у персонажа и выполнено ли оно
        if (this.character && this.character.achievements) {
          const characterAchievement = this.character.achievements.find(
            (a: any) => a.name === achievement.name
          );

          if (characterAchievement) {
            // Если достижение уже есть у персонажа, используем его статус
            this.completedAchievements[achievement.name] =
              characterAchievement.completed || false;

            // Если достижение уже выполнено, отмечаем это
            if (characterAchievement.completed) {
              console.log(`Achievement ${achievement.name} already completed`);
            }
          } else {
            // Если достижения нет у персонажа, добавляем его
            if (this.character.achievements) {
              this.character.achievements.push({
                ...achievement,
                progress: 0,
                completed: false,
              });
            }
          }
        }
      });

      // Сохраняем персонажа после инициализации достижений
      if (this.character) {
        console.log(
          'Saving character after achievement initialization:',
          this.character
        );
        this.characterService.saveCharacter(this.character);
        localStorage.setItem(
          'selectedCharacter',
          JSON.stringify(this.character)
        );
      }

      console.log(
        'Initialized achievements state:',
        this.completedAchievements
      );
    } else {
      console.warn('No workouts loaded');
    }
    setTimeout(() => {
      this.debugAchievements();
    }, 1000);
  }

  loadWorkoutsForCharacterClass() {
    if (!this.character) return;

    const className = this.character.name;
    console.log('Загрузка тренировок для персонажа:', className);

    let selectedWorkout;
    switch (className) {
      case 'Runner':
        selectedWorkout = this.runnerWorkouts;
        break;
      case 'Ascender':
        selectedWorkout = this.ascenderWorkouts;
        break;
      case 'Zen Warrior':
        selectedWorkout = this.zenWarriorWorkouts;
        break;
      default:
        selectedWorkout = this.runnerWorkouts;
        console.warn(
          'Неизвестный класс персонажа, используем тренировки Runner по умолчанию'
        );
    }

    this.workouts = [selectedWorkout];

    console.log(`Загружены тренировки для ${className}`);
    console.log(
      `Количество достижений: ${selectedWorkout.achievements.length}`
    );
    console.log(
      `Имена достижений: ${selectedWorkout.achievements
        .map((a) => a.name)
        .join(', ')}`
    );

    // Фильтрация достижений
    this.filterAchievementsByCurrentClass();

    // Включаем отладку только в dev режиме
    if (process.env['NODE_ENV'] !== 'production') {
      setTimeout(() => this.debugAchievements(), 500);
    }
  }

  startTimer() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.timer = setInterval(() => {
        this.currentTime++;
      }, 1000);
    }
  }

  pauseTimer() {
    this.isRunning = false;
    clearInterval(this.timer);
  }

  stopTimer() {
    this.isRunning = false;
    clearInterval(this.timer);
    this.currentTime = 0;
  }

  formatTime(seconds: number): string {
    return new Date(seconds * 1000).toISOString().slice(11, 19);
  }

  private saveCharacterData() {
    if (!this.character) return;

    localStorage.setItem('selectedCharacter', JSON.stringify(this.character));
    this.characterService.saveCharacter(this.character);
  }

  showNotification(message: string) {
    this.notification = { show: true, message };

    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
      this.notification = { show: false, message: '' };
    }, 3000);
  }

  completeExercise(exercise: any, event: MouseEvent) {
    if (event) {
      event.preventDefault();
    }

    if (!this.isRunning) {
      this.showNotification('Start the timer first!');
      return;
    }

    if (!this.completedExercises[exercise.name]) {
      this.completedExercises[exercise.name] = true;

      const xpAmount =
        exercise.xpValue ||
        parseInt(exercise.xpReward?.replace('XP + ', '')) ||
        0;
      this.totalXpGained += xpAmount;
      this.workouts[0].progress.totalXpGained += xpAmount;

      this.showNotification(`Completed: ${exercise.name}! +${xpAmount} XP`);
    }
  }

  // Оптимизированный метод completeWorkout
  completeWorkout() {
    // Валидация входных данных
    if (!this.validateWorkoutCompletion()) return;

    try {
      if (!this.character) {
        this.showNotification('No character loaded!');
        return;
      }

      // Обработка бонуса за все упражнения
      this.processAllExercisesCompletionBonus();

      // Обновление статистики персонажа
      this.updateCharacterStats();

      // Обновление достижений персонажа
      this.updateCompletedAchievements();

      // Сохранение данных и отправка на сервер
      this.saveAndNavigate();
    } catch (error) {
      console.error('Error saving workout progress:', error);
      this.showNotification('Error saving progress!');
      this.stopTimer();
      setTimeout(() => this.router.navigate(['/character-profile']), 1500);
    }
  }

  // Вспомогательные методы для completeWorkout

  private validateWorkoutCompletion(): boolean {
    if (this.workouts.length === 0) {
      this.showNotification('No workout loaded!');
      return false;
    }

    const hasCompletedExercises = Object.values(this.completedExercises).some(
      (completed) => completed
    );
    const hasCompletedAchievements = Object.values(
      this.completedAchievements
    ).some((completed) => completed);

    if (!hasCompletedExercises && !hasCompletedAchievements) {
      this.showNotification('Complete at least one exercise or achievement!');
      return false;
    }

    return true;
  }

  private processAllExercisesCompletionBonus() {
    const allExercisesCompleted = Object.values(this.completedExercises).every(
      (completed) => completed
    );
    if (allExercisesCompleted) {
      const bonusXP = Math.round(this.totalXpGained * 0.25);
      this.totalXpGained += bonusXP;
      this.workouts[0].progress.totalXpGained += bonusXP;
      this.showNotification(
        `Bonus for completing all exercises: +${bonusXP} XP!`
      );
    }
  }

  private updateCharacterStats() {
    if (!this.character) return;

    // Добавляем опыт персонажу
    const levelInfo = this.characterService.addExperience(this.totalXpGained);

    // Инициализируем stats, если необходимо
    if (!this.character.stats) {
      this.character.stats = { totalWorkouts: 0, totalXpGained: 0 };
    }

    // Обновляем счетчики
    const currentWorkouts = this.character.stats.totalWorkouts || 0;
    const currentXpGained = this.character.stats.totalXpGained || 0;
    this.character.stats.totalWorkouts = currentWorkouts + 1;
    this.character.stats.totalXpGained = currentXpGained + this.totalXpGained;

    // Синхронизируем данные о прогрессе
    const currentProgress = this.characterService.getCurrentProgress();
    this.character.level = currentProgress.level;
    this.character.xp = currentProgress.experience;
    this.character.xpToNextLevel = currentProgress.experienceToNextLevel;

    return levelInfo;
  }

  private updateCompletedAchievements() {
    if (!this.character || !this.character.achievements) return;

    // Создаем глубокую копию массива
    const achievementsCopy = JSON.parse(
      JSON.stringify(this.character.achievements)
    );

    // Обновляем достижения
    Object.keys(this.completedAchievements).forEach((achievementName) => {
      if (!this.completedAchievements[achievementName]) return;

      const achievementIndex = achievementsCopy.findIndex(
        (a: { name: string }) => a.name === achievementName
      );

      if (achievementIndex !== -1) {
        // Обновляем существующее достижение
        achievementsCopy[achievementIndex].completed = true;
        achievementsCopy[achievementIndex].progress = 100;
      } else {
        // Добавляем новое достижение из тренировки
        const workoutAchievement = this.workouts[0].achievements.find(
          (a) => a.name === achievementName
        );

        if (workoutAchievement) {
          achievementsCopy.push({
            ...workoutAchievement,
            progress: 100,
            completed: true,
          });
        }
      }
    });

    // Присваиваем обновленный массив
    this.character.achievements = achievementsCopy;
  }

  private saveAndNavigate() {
    if (!this.character) return;

    // Сохраняем персонажа локально
    this.saveCharacterData();

    // Обновляем профиль в базе данных
    const levelInfo = this.updateCharacterStats();

    this.characterService
      .updateProfile(this.character.name, this.character)
      .subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);
          this.showNotification('Progress saved!');

          // Уведомление о повышении уровня
          if (levelInfo?.leveledUp) {
            this.showNotification(
              `Level Up! You are now level ${levelInfo.newLevel}!`
            );
          }

          // Переход на страницу профиля
          setTimeout(() => this.router.navigate(['/character-profile']), 1500);
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.showNotification('Error saving progress!');
          setTimeout(() => this.router.navigate(['/character-profile']), 1500);
        },
      });
  }

  completeAchievement(achievement: Achievement, event: MouseEvent) {
    if (event) event.preventDefault();

    // Проверки перед выполнением
    if (!this.isRunning) {
      this.showNotification('Start the timer first!');
      return;
    }

    if (this.completedAchievements[achievement.name]) {
      this.showNotification(
        `Achievement ${achievement.name} already completed!`
      );
      return;
    }

    if (!this.character) {
      console.error('Character is undefined, cannot update achievements');
      return;
    }

    // Отмечаем достижение как выполненное
    this.completedAchievements[achievement.name] = true;

    // Обновляем счетчики
    const xpAmount = achievement.xpReward || 50;
    this.totalXpGained += xpAmount;
    this.workouts[0].progress.totalXpGained += xpAmount;
    this.routesCompleted++;
    this.workouts[0].progress.routesCompleted++;

    // Обновляем достижение в объекте персонажа
    this.updateCharacterAchievement(achievement);

    // Сохраняем и показываем уведомление
    this.saveCharacterData();
    this.showNotification(`Achievement: ${achievement.name}! +${xpAmount} XP`);
  }

  private updateCharacterAchievement(achievement: Achievement) {
    if (!this.character) return;

    // Инициализируем массив достижений, если он не существует
    if (!this.character.achievements) {
      this.character.achievements = [];
    }

    const characterAchievementIndex = this.character.achievements.findIndex(
      (a) => a.name === achievement.name
    );

    if (characterAchievementIndex !== -1) {
      // Обновляем существующее достижение
      this.character.achievements[characterAchievementIndex].progress = 100;
      this.character.achievements[characterAchievementIndex].completed = true;

      if (achievement.currentValue !== undefined) {
        this.character.achievements[characterAchievementIndex].currentValue =
          achievement.currentValue;
        this.character.achievements[characterAchievementIndex].current =
          achievement.currentValue;
      }
    } else {
      // Добавляем новое достижение
      this.character.achievements.push({
        ...achievement,
        progress: 100,
        completed: true,
      });
    }
  }

  /**
   * Проверяет, принадлежит ли достижение текущему классу персонажа
   */
  isAchievementForCurrentClass(achievementName: string): boolean {
    if (!this.character) return false;

    // Получаем достижения текущей тренировки
    const currentClassAchievements = this.workouts[0]?.achievements || [];

    // Проверяем, есть ли достижение с таким именем в текущем классе
    return currentClassAchievements.some((a) => a.name === achievementName);
  }

  filterAchievementsByCurrentClass() {
    if (!this.character?.achievements || !this.workouts?.length) return;

    const currentClassAchievementNames = this.workouts[0].achievements.map(
      (a) => a.name
    );
    const originalCount = this.character.achievements.length;

    // Фильтруем достижения
    this.character.achievements = this.character.achievements.filter(
      (achievement) => currentClassAchievementNames.includes(achievement.name)
    );

    const removedCount = originalCount - this.character.achievements.length;
    if (removedCount > 0) {
      console.log(
        `Удалено ${removedCount} достижений, не принадлежащих классу ${this.character.name}`
      );

      // Сохраняем обновленные данные
      localStorage.setItem('selectedCharacter', JSON.stringify(this.character));
      this.characterService.saveCharacter(this.character);
    }
  }

  debugAchievements() {
    if (!this.character || !this.workouts || this.workouts.length === 0) {
      console.error('Данные для отладки не готовы');
      return;
    }

    console.log(
      `[Отладка] Персонаж: ${this.character.name}, достижений: ${
        this.character.achievements?.length || 0
      }`
    );

    // Проверяем соответствие достижений текущему классу
    if (this.character.achievements && this.character.achievements.length > 0) {
      const currentClassAchievementNames = this.workouts[0].achievements.map(
        (a) => a.name
      );
      const invalidAchievements = this.character.achievements.filter(
        (a) => !currentClassAchievementNames.includes(a.name)
      );

      if (invalidAchievements.length > 0) {
        console.warn(
          'Найдены достижения, не принадлежащие текущему классу:',
          invalidAchievements.map((a) => a.name).join(', ')
        );
      }
    }

    // Проверяем статус выполнения
    const completedAchievementsCount =
      this.character.achievements?.filter((a) => a.completed).length || 0;
    console.log(
      `[Отладка] Выполнено достижений: ${completedAchievementsCount}`
    );
  }
}
