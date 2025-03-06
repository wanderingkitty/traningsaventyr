import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CharacterService } from '../services/character.service';
import { Workout } from '../models/workout.model';
import { Character } from 'backend/models/character';

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

  // Данные упражнений для разных классов
  runnerWorkouts: Workout = {
    exercises: [
      {
        name: '🏃‍♂️ Running session',
        description: 'Run for 10-15 minutes at a comfortable pace',
        xpReward: 'XP + 50',
        xpValue: 50,
      },
      {
        name: 'Stretching',
        description: 'Stretch your legs and back',
        xpReward: 'XP + 40',
        xpValue: 40,
      },
      {
        name: 'Interval sprints',
        description: '30 seconds sprint, 1 minute rest (x5)',
        xpReward: 'XP + 60',
        xpValue: 60,
      },
      {
        name: 'Cool down',
        description: 'Walk for 5 minutes to cool down',
        xpReward: 'XP + 30',
        xpValue: 30,
      },
    ],

    achievements: [
      {
        name: '🗾 Distance goals',
        description: 'Reach new horizons',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 50,
        target: 20,
        currentValue: 0,
        unit: 'km',
        completed: false,
      },
      {
        name: '📈 Pace master',
        description: 'Maintain steady speed',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 60,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '⏱️ Interval training',
        description: 'Master speed variation',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 50,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '🏃 Sprint champion',
        description: 'Achieve your best speed record',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 65,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '🌄 Hill conqueror',
        description: 'Master running uphill',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 80,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '🌱 Trail blazer',
        description: 'Explore off-road running paths',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 75,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '🏁 Race finisher',
        description: 'Complete a virtual race',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 90,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '🔄 Consistency champion',
        description: 'Run regularly for a whole week',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 85,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
    ],

    progress: {
      routesCompleted: 0,
      totalXpGained: 0,
    },
  };

  ascenderWorkouts: Workout = {
    exercises: [
      {
        name: '🧗🏼 Climbing session',
        description: 'Focus on basic routes',
        xpReward: 'XP + 50',
        xpValue: 50,
      },
      {
        name: 'Plank',
        description: 'Hold for 30 seconds',
        xpReward: 'XP + 40',
        xpValue: 40,
      },
      {
        name: 'Rest between attempts',
        description: '',
        xpReward: 'XP + 50',
        xpValue: 50,
      },
      {
        name: 'Different wall angles',
        description: '',
        xpReward: 'XP + 50',
        xpValue: 50,
      },
    ],

    achievements: [
      {
        name: '🦾 Grip strength',
        description: 'Master your grip power',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 50,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '🧭 Route master',
        description: 'Conquer different routes',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 60,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '🧩 Problem solver',
        description: 'Find solutions for routes',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 75,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '⏱️ Speed climber',
        description: 'Beat your previous times on familiar routes',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 65,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '🔄 Endurance expert',
        description: 'Maintain climbing stamina for longer sessions',
        progressDescription: 'Achievement progress + 50',
        progress: 0,
        xpReward: 80,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '🧗 Dynamic mover',
        description: 'Master dynamic movements and jumps',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 70,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '🦶 Footwork finesse',
        description: 'Develop precise foot placement techniques',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 55,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '🌊 Flow state',
        description: 'Climb with fluid, continuous movements',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 90,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
    ],

    progress: {
      routesCompleted: 0,
      totalXpGained: 0,
    },
  };

  zenWarriorWorkouts: Workout = {
    exercises: [
      {
        name: '🧘‍♀️ Yoga session',
        description: 'Begin with basic poses',
        xpReward: 'XP + 50',
        xpValue: 50,
      },
      {
        name: 'Breathing exercise',
        description: 'Focus on deep breathing for 2 minutes',
        xpReward: 'XP + 40',
        xpValue: 40,
      },
      {
        name: 'Sun salutation sequence',
        description: 'Complete 5 rounds',
        xpReward: 'XP + 60',
        xpValue: 60,
      },
      {
        name: 'Meditation',
        description: 'Quiet your mind for 5 minutes',
        xpReward: 'XP + 50',
        xpValue: 50,
      },
    ],

    achievements: [
      {
        name: '✨ Perfect form',
        description: 'Focus on alignment',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 60,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '🧘 Mind master',
        description: 'Develop inner calm',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 70,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '🍃 Breath guide',
        description: 'Control your breath',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 55,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '🌈 Flow sequence',
        description: 'Master flowing between poses',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 75,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '🧠 Meditation adept',
        description: 'Achieve deeper meditation states',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 80,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '🌙 Moonlight practice',
        description: 'Complete evening yoga sessions',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 65,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '☀️ Morning ritual',
        description: 'Establish a consistent morning routine',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 70,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
      {
        name: '🔄 Balanced life',
        description: 'Integrate yoga into daily life',
        progressDescription: 'Achievement progress: +50',
        progress: 0,
        xpReward: 90,
        target: 30,
        currentValue: 0,
        unit: 'minutes',
        completed: false,
      },
    ],

    progress: {
      routesCompleted: 0,
      totalXpGained: 0,
    },
  };

  constructor(
    private router: Router,
    private characterService: CharacterService
  ) {}

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
  }

  // Метод для загрузки тренировок в зависимости от класса персонажа
  loadWorkoutsForCharacterClass() {
    if (!this.character) return;

    console.log('Loading workouts for character:', this.character.name);

    switch (this.character.name) {
      case 'Runner':
        this.workouts = [this.runnerWorkouts];
        console.log('Loaded Runner workouts');
        break;
      case 'Ascender':
        this.workouts = [this.ascenderWorkouts];
        console.log('Loaded Ascender workouts');
        break;
      case 'Zen Warrior':
        this.workouts = [this.zenWarriorWorkouts];
        console.log('Loaded Zen Warrior workouts');
        break;
      default:
        // По умолчанию загружаем тренировки для бегуна
        this.workouts = [this.runnerWorkouts];
        console.warn('Unknown character class, defaulting to Runner workouts');
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

  completeExercise(exercise: any) {
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

  completeAchievement(achievement: any) {
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

    // Отмечаем достижение как выполненное в локальном объекте
    this.completedAchievements[achievement.name] = true;

    // Добавляем опыт
    const xpAmount = achievement.xpReward || 50;
    this.totalXpGained += xpAmount;
    this.workouts[0].progress.totalXpGained += xpAmount;
    this.routesCompleted++;
    this.workouts[0].progress.routesCompleted++;

    // Проверяем существует ли персонаж и массив достижений
    if (!this.character) {
      console.error('Character is undefined, cannot update achievements');
      this.showNotification(
        `Achievement: ${achievement.name}! +${xpAmount} XP`
      );
      return;
    }

    // Инициализируем массив достижений, если он не существует
    if (!this.character.achievements) {
      this.character.achievements = [];
    }

    // Обновляем достижение в объекте персонажа
    const characterAchievementIndex = this.character.achievements.findIndex(
      (a: any) => a.name === achievement.name
    );

    if (characterAchievementIndex !== -1) {
      console.log('Updating achievement in character:', achievement.name);
      this.character.achievements[characterAchievementIndex].progress = 100; // Устанавливаем прогресс на 100%
      this.character.achievements[characterAchievementIndex].completed = true; // Отмечаем как выполненное
    } else {
      console.log(
        'Achievement not found in character object:',
        achievement.name
      );

      // Добавляем достижение в список
      this.character.achievements.push({
        ...achievement,
        progress: 100,
        completed: true,
      });
    }

    // Обновляем в localStorage
    localStorage.setItem('selectedCharacter', JSON.stringify(this.character));

    // Также обновляем в сервисе
    this.characterService.saveCharacter(this.character);

    // Показываем уведомление
    this.showNotification(`Achievement: ${achievement.name}! +${xpAmount} XP`);
  }

  showNotification(message: string) {
    this.notification = { show: true, message };

    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
      this.notification = { show: false, message: '' };
    }, 3000);
  }

  completeWorkout() {
    if (this.workouts.length === 0) {
      this.showNotification('No workout loaded!');
      return;
    }

    const hasCompletedExercises = Object.values(this.completedExercises).some(
      (completed) => completed
    );
    const hasCompletedAchievements = Object.values(
      this.completedAchievements
    ).some((completed) => completed);

    if (!hasCompletedExercises && !hasCompletedAchievements) {
      this.showNotification('Complete at least one exercise or achievement!');
      return;
    }

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

    try {
      if (!this.character) {
        this.showNotification('No character loaded!');
        return;
      }

      // Добавляем опыт конкретному персонажу
      const levelInfo = this.characterService.addExperience(this.totalXpGained);

      // Обновляем данные персонажа
      // Обновляем статистику тренировок - ВАЖНО: правильно инициализируем stats
      if (!this.character.stats) {
        this.character.stats = {
          totalWorkouts: 0,
          totalXpGained: 0,
        };
      }

      // Инкрементируем счетчик тренировок и опыта
      const currentWorkouts = this.character.stats.totalWorkouts || 0;
      const currentXpGained = this.character.stats.totalXpGained || 0;

      this.character.stats.totalWorkouts = currentWorkouts + 1;
      this.character.stats.totalXpGained = currentXpGained + this.totalXpGained;

      console.log('Updated character stats:', this.character.stats);

      // Получаем текущий прогресс
      const currentProgress = this.characterService.getCurrentProgress();

      // Обновляем уровень и опыт персонажа
      this.character.level = currentProgress.level;
      this.character.xp = currentProgress.experience;
      this.character.xpToNextLevel = currentProgress.experienceToNextLevel;

      // Инициализируем массив достижений, если он не существует
      if (!this.character.achievements) {
        this.character.achievements = [];
      }

      // Проверяем достижения и обновляем их статус
      Object.keys(this.completedAchievements).forEach((achievementName) => {
        if (this.completedAchievements[achievementName] && this.character) {
          const achievementIndex = this.character.achievements.findIndex(
            (a: any) => a.name === achievementName
          );

          if (achievementIndex !== -1) {
            console.log(`Marking achievement as completed: ${achievementName}`);
            this.character.achievements[achievementIndex].completed = true;
            this.character.achievements[achievementIndex].progress = 100;
          }
        }
      });

      console.log(
        'Saving updated character with achievements and stats:',
        this.character
      );

      // Сохраняем персонажа локально
      this.characterService.saveCharacter(this.character);

      // Важно: используем localStorage для быстрого доступа в других компонентах
      localStorage.setItem('selectedCharacter', JSON.stringify(this.character));

      // Обновляем профиль персонажа в базе данных
      this.characterService
        .updateProfile(this.character.name, this.character)
        .subscribe({
          next: (response) => {
            console.log('Profile updated successfully:', response);
            this.showNotification('Progress saved!');

            // Показываем уведомление о повышении уровня
            if (levelInfo && levelInfo.leveledUp) {
              this.showNotification(
                `Level Up! You are now level ${levelInfo.newLevel}!`
              );
            }

            // Переходим на профиль персонажа
            setTimeout(() => {
              this.router.navigate(['/character-profile']);
            }, 1500);
          },
          error: (error) => {
            console.error('Error updating profile:', error);
            this.showNotification('Error saving progress!');

            // Даже в случае ошибки переходим на профиль персонажа
            setTimeout(() => {
              this.router.navigate(['/character-profile']);
            }, 1500);
          },
        });
    } catch (error) {
      console.error('Error saving workout progress:', error);
      this.showNotification('Error saving progress!');

      this.stopTimer();

      setTimeout(() => {
        this.router.navigate(['/character-profile']);
      }, 1500);
    }
  }
}
