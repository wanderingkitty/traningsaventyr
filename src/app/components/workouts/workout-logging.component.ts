// login-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Workout } from '../models/workout.model';

@Component({
  selector: 'workout-page',
  templateUrl: './workout-logging.component.html',
  styleUrls: ['./workout-logging.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class WorkoutComponent {
  isRunning: boolean = false;
  private timer: any;
  currentTime: number = 0;
  constructor(private router: Router) {}

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

  onComplete() {
    this.router.navigate(['/character-profile']);
  }

  completeWorkout() {
    this.stopTimer();
    this.onComplete();
  }

  workouts: Workout[] = [
    {
      exercises: [
        {
          name: '🧗🏼 Climbing session',
          description: 'Focus on basic routes',
          xpReward: 'XP + 50',
        },
        {
          name: 'Plank',
          description: 'Hold for 30 seconds',
          xpReward: 'XP + 40',
        },
        {
          name: 'Rest between attempts',
          description: '',
          xpReward: 'XP + 50',
        },
        {
          name: 'Different wall angles',
          description: '',
          xpReward: 'XP + 50',
        },
      ],

      achievements: [
        {
          name: '🦾 Hang board exercises',
          description: 'Imrove finger strenght',
          progress: ' Achievement progress: +50',
        },
        {
          name: '🧩 Boulder problems',
          description: 'Focus on reading routes, finding solutions',
          progress: ' Achievement progress: +50',
        },
        {
          name: '🧭 Complete new routes',
          description: '',
          progress: ' Achievement progress: +50',
        },
      ],

      progress: {
        routesCompleted: 0,
        totalXpGained: 0,
      },
    },
  ];
}
