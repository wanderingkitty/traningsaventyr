export interface Workout {
  exercises: {
    name: string;
    description: string;
    xpReward: string;
  }[];

  achievements: {
    name: string;
    description: string;
    progress: string;
  }[];

  progress: {
    routesCompleted: number;
    totalXpGained: number;
  };
}
