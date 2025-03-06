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
      console.log('Loaded character:', this.character);

      // Выбираем правильный набор тренировок в зависимости от класса персонажа
      this.loadWorkoutsForCharacterClass();
    } else {
      console.warn('No character found, redirecting...');
      this.router.navigate(['/character-creation']);
      return;
    }

    if (this.workouts.length > 0) {
      this.workouts[0].exercises.forEach((exercise) => {
        this.completedExercises[exercise.name] = false;
      });

      this.workouts[0].achievements.forEach((achievement) => {
        this.completedAchievements[achievement.name] = false;
      });
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

    if (!this.completedAchievements[achievement.name]) {
      this.completedAchievements[achievement.name] = true;

      // Добавляем опыт
      const xpAmount = achievement.xpReward || 50;
      this.totalXpGained += xpAmount;
      this.workouts[0].progress.totalXpGained += xpAmount;
      this.routesCompleted++;
      this.workouts[0].progress.routesCompleted++;

      this.showNotification(
        `Achievement: ${achievement.name}! +${xpAmount} XP`
      );
    }
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
      this.characterService.addExperience(this.totalXpGained);

      // Также сохраняем статистику тренировок (если есть такой метод)
      // this.characterService.updateWorkoutStats({
      //   workoutsCompleted: 1,
      //   exercisesCompleted: Object.values(this.completedExercises).filter(Boolean).length,
      //   achievementsCompleted: Object.values(this.completedAchievements).filter(Boolean).length,
      //   xpGained: this.totalXpGained
      // });
    } catch (error) {
      console.error('Error saving workout progress:', error);
    }

    this.stopTimer();

    setTimeout(() => {
      this.router.navigate(['/character-profile']);
    }, 1500);
  }
}
