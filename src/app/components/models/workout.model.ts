export interface Exercise {
  name: string;
  description: string;
  xpReward: string;
  xpValue?: number; // Числовое значение XP для расчетов
  completed?: boolean;
}

export interface Achievement {
  name: string;
  description: string;
  progress: string;
  xpValue?: number; // Числовое значение XP для расчетов
  completed?: boolean;
}

export interface WorkoutProgress {
  routesCompleted: number;
  totalXpGained: number;
}

export interface Workout {
  exercises: Exercise[];
  achievements: Achievement[];
  progress: WorkoutProgress;
}

// Опционально: интерфейс для статистики тренировок
export interface WorkoutStats {
  workoutsCompleted: number;
  exercisesCompleted: number;
  achievementsCompleted: number;
  xpGained: number;
}
