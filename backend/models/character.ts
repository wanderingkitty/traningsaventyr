export interface SpecialAbility {
  name: string;
  unlockedAtLevel?: number; // Опциональное поле
  requiredLevel?: number; // Добавлено новое свойство
  unlocked: boolean;
}

export interface Achievement {
  name: string;
  description: string;
  progress: number;
  completed?: boolean; // Добавлено новое свойство
  xpReward?: number; // Добавлено новое свойство
  current?: number; // Опциональное свойство для отслеживания прогресса
}

export interface Challenge {
  description: string;
  progress: number;
  xpReward?: number; // Добавлено новое свойство
}

export interface CharacterStats {
  totalWorkouts: number;
  totalXpGained: number;
  // Можно добавить другие статистические данные при необходимости
}

export interface Character {
  name: string;
  level: number;
  xp: number;
  avatar: string;
  class?: string; // Опциональное поле
  xpToNextLevel: number;
  stats?: CharacterStats; // Добавлено новое свойство
  achievements: Achievement[];
  challenges: Challenge[];
  specialAbilities: SpecialAbility[];
}

export interface CharacterProfile {
  _id?: string;
  userId: string;
  username?: string;
  selectedCharacterName: string;
  characterData: Character;
  progress?: {
    level: number;
    experience: number;
    experienceToNextLevel: number;
  };
}
