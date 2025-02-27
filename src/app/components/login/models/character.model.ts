export interface Character {
  // Существующие поля
  name: string;
  class: string;
  // Добавляем поля для системы прогресса
  level?: number;
  experience?: number;
  experienceToNextLevel?: number;
  // Дополнительная статистика тренировок
  workoutStats?: {
    totalWorkouts: number;
    totalExercisesCompleted: number;
    totalAchievementsCompleted: number;
    totalXpGained: number;
  };
}

export interface CharacterProfile {
  userId: string;
  username: string;
  selectedCharacterName: string;
  characterData: Character;
  progress: {
    level: number;
    experience: number;
    experienceToNextLevel: number;
  };
}

export interface Achievement {
  name: string;
  description: string;
  progress: number; // Текущий прогресс (0-100%)
  target?: number; // Целевое значение (например, 5 тренировок)
  current?: number; // Текущее значение (например, 3 тренировки)
  completed?: boolean; // Завершено ли достижение
  xpReward?: number; // Сколько XP дается за выполнение
}
