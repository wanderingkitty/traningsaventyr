import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CharacterService } from '../services/character.service';
import { Workout } from '../models/workout.model';

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

  completedExercises: { [key: string]: boolean } = {};
  completedAchievements: { [key: string]: boolean } = {};

  totalXpGained: number = 0;
  routesCompleted: number = 0;

  notification: { show: boolean; message: string } = {
    show: false,
    message: '',
  };

  workouts: Workout[] = [
    {
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
          name: '🦾 Grip strenght',
          description: 'Improve finger strength',
          progressDescription: 'Achievement progress: +50',
          progress: 0,
          xpReward: 50,
        },
        {
          name: '🧩 Boulder problems',
          description: 'Focus on reading routes, finding solutions',
          progressDescription: 'Achievement progress: +50',
          progress: 0,
          xpReward: 50,
        },
        {
          name: '🧭 Route master',
          description: '',
          progressDescription: 'Achievement progress: +50',
          progress: 0,
          xpReward: 50,
        },
        {
          name: '🔄 Endurance expert',
          progressDescription: 'Achievement progress + 50',
          description: 'Maintain climbing stamina for longer sessions.',
          progress: 0,
          xpReward: 80,
        },
      ],

      progress: {
        routesCompleted: 0,
        totalXpGained: 0,
      },
    },
  ];

  constructor(
    private router: Router,
    private characterService: CharacterService
  ) {}

  ngOnInit() {
    this.workouts[0].exercises.forEach((exercise) => {
      this.completedExercises[exercise.name] = false;
    });

    this.workouts[0].achievements.forEach((achievement) => {
      this.completedAchievements[achievement.name] = false;
    });
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

  // Добавляем метод для выполнения упражнения
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
      const xpAmount = achievement.xpValue || 50;
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
