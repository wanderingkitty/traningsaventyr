import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Character, CharacterProfile } from 'backend/models/character';
import { CharacterService } from '../services/character.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'character-creation-page',
  templateUrl: './character-creation.component.html',
  styleUrls: ['./character-creation.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CharacterCreationComponent implements OnInit {
  constructor(
    private router: Router,
    private characterService: CharacterService,
    private authService: AuthService
  ) {}

  characters: Character[] = [
    {
      name: 'Ascender',
      level: 1,
      xp: 0,
      xpToNextLevel: 1000,
      avatar: '/assets/ascender-img.jpg',
      class: 'Climber',
      stats: {
        totalWorkouts: 0,
        totalXpGained: 0,
      },
      achievements: [
        {
          name: '🦾 Grip strength',
          description: 'Master your grip power.',
          progress: 0,
          xpReward: 50,
          completed: false,
        },
        {
          name: '🧭 Route master',
          description: 'Conquer different routes.',
          progress: 0,
          xpReward: 60,
          completed: false,
        },
        {
          name: '🧩 Problem solver',
          description: 'Find solutions for routes.',
          progress: 0,
          xpReward: 75,
          completed: false,
        },
        {
          name: '⏱️ Speed climber',
          description: 'Beat your previous times on familiar routes.',
          progress: 0,
          xpReward: 65,
          completed: false,
        },
        {
          name: '🔄 Endurance expert',
          description: 'Maintain climbing stamina for longer sessions.',
          progress: 0,
          xpReward: 80,
          completed: false,
        },
        {
          name: '🧗 Dynamic mover',
          description: 'Master dynamic movements and jumps.',
          progress: 0,
          xpReward: 70,
          completed: false,
        },
        {
          name: '🦶 Footwork finesse',
          description: 'Develop precise foot placement techniques.',
          progress: 0,
          xpReward: 55,
          completed: false,
        },
        {
          name: '🌊 Flow state',
          description: 'Climb with fluid, continuous movements.',
          progress: 0,
          xpReward: 90,
          completed: false,
        },
      ],
      challenges: [
        {
          description: 'Complete 5 climbing sessions',
          progress: 0,
          xpReward: 100,
        },

        {
          description: 'Reach a height of 10 meters',
          progress: 0,
          xpReward: 120,
        },

        {
          description: 'Complete a challenging route without falling',
          progress: 0,
          xpReward: 150,
        },
        {
          description: 'Train climbing 3 days in a row',
          progress: 0,
          xpReward: 130,
        },
      ],
      specialAbilities: [
        {
          name: '🏔 Peak power',
          unlockedAtLevel: 5,
          requiredLevel: 5,
          unlocked: false,
        },
        {
          name: '🪨 Rock master',
          unlockedAtLevel: 10,
          requiredLevel: 10,
          unlocked: false,
        },
        {
          name: '🕷️ Spider grip',
          unlockedAtLevel: 15,
          requiredLevel: 15,
          unlocked: false,
        },
      ],
    },
    {
      name: 'Runner',
      level: 1,
      xp: 0,
      xpToNextLevel: 1000,
      avatar: '/assets/running-avatar.jpg',
      class: 'Runner',
      stats: {
        totalWorkouts: 0,
        totalXpGained: 0,
      },
      achievements: [
        {
          name: '🗾 Distance goals',
          description: 'Reach new horizons.',
          progress: 0,
          xpReward: 50,
          completed: false,
        },
        {
          name: '📈 Pace master',
          description: 'Maintain steady speed.',
          progress: 0,
          xpReward: 60,
          completed: false,
        },
        {
          name: '⏱️ Interval training',
          description: 'Master speed variation.',
          progress: 0,
          xpReward: 70,
          completed: false,
        },
      ],
      challenges: [
        {
          description: 'Run 3 different routes',
          progress: 0,
          xpReward: 80,
        },
      ],
      specialAbilities: [
        {
          name: '⚡ Speed burst',
          unlockedAtLevel: 5,
          requiredLevel: 5,
          unlocked: false,
        },
        {
          name: '🔋 Marathon mind',
          unlockedAtLevel: 10,
          requiredLevel: 10,
          unlocked: false,
        },
        {
          name: '💨 Recovery master',
          unlockedAtLevel: 10,
          requiredLevel: 10,
          unlocked: false,
        },
      ],
    },
    {
      name: 'Zen Warrior',
      level: 1,
      xp: 0,
      xpToNextLevel: 1000,
      avatar: '/assets/yoga-avatar.jpg',
      class: 'Yogi',
      stats: {
        totalWorkouts: 0,
        totalXpGained: 0,
      },
      achievements: [
        {
          name: '✨ Perfect form',
          description: 'Focus on alignment.',
          progress: 0,
          xpReward: 60,
          completed: false,
        },
        {
          name: '🧘 Mind master',
          description: 'Develop inner calm.',
          progress: 0,
          xpReward: 70,
          completed: false,
        },
        {
          name: '🍃 Breath guide',
          description: 'Control your breath.',
          progress: 0,
          xpReward: 55,
          completed: false,
        },
      ],
      challenges: [
        {
          description: 'Hold a pose for 1 min',
          progress: 0,
          xpReward: 70,
        },
      ],
      specialAbilities: [
        {
          name: '☯️ Balance sage',
          unlockedAtLevel: 5,
          requiredLevel: 5,
          unlocked: false,
        },
        {
          name: '🌸 Inner peace',
          unlockedAtLevel: 10,
          requiredLevel: 10,
          unlocked: false,
        },
        {
          name: '🌊 Breath guide',
          unlockedAtLevel: 10,
          requiredLevel: 10,
          unlocked: false,
        },
      ],
    },
  ];

  selectedCharacter: Character = this.characters[0];
  loading = true;
  existingProfile: CharacterProfile | null = null;

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.log('User not logged in, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }
    this.loadExistingProfile();
  }

  loadExistingProfile() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;
    this.loading = true;

    this.characterService.getUserProfile(currentUser.name).subscribe({
      next: (profile) => {
        console.log('Existing profile loaded:', profile);

        if (profile) {
          this.existingProfile = profile;
          if (profile.selectedCharacterName) {
            this.preSelectCharacter(profile.selectedCharacterName);
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.loading = false;
      },
    });
  }

  preSelectCharacter(characterName: string) {
    const foundCharacter = this.characters.find(
      (c) => c.name === characterName
    );
    if (foundCharacter) {
      this.selectedCharacter = foundCharacter;
    }
  }

  selectCharacter(character: Character) {
    this.selectedCharacter = character;
  }

  continue() {
    console.log('Navigating with character:', this.selectedCharacter);

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('User not logged in');
      this.router.navigate(['/login']);
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'selectedCharacter',
        JSON.stringify(this.selectedCharacter)
      );
    }

    if (this.existingProfile) {
      // Обновляем существующий профиль
      this.characterService
        .updateProfile(
          this.existingProfile._id as string,
          this.selectedCharacter
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/character-profile'], {
              state: { character: this.selectedCharacter },
            });
          },
          error: (error) => {
            console.error('Error updating profile:', error);
          },
        });
    } else {
      // Создаем новый профиль
      this.characterService.createProfile(this.selectedCharacter).subscribe({
        next: () => {
          this.router.navigate(['/character-profile'], {
            state: { character: this.selectedCharacter },
          });
        },
        error: (error) => {
          console.error('Error creating profile:', error);
        },
      });
    }
  }
}
