export interface SpecialAbility {
  name: string;
  unlockedAtLevel: number;
  unlocked: boolean;
}

export interface Character {
  name: string;
  level: number;
  xp: number;
  avatar: string;
  achievements: {
    name: string;
    description: string;
    progress: number;
  }[];
  challenges: {
    description: string;
    progress: number;
    unlocks: string;
  }[];
  specialAbilities: SpecialAbility[];
}
