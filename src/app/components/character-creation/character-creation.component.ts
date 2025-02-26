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
export class CharacterCreationComponent {
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
      avatar: '/assets/ascender-img.jpg',
      achievements: [
        {
          name: '🦾 Grip Strength',
          description: 'Master your grip power.',
          progress: 0,
        },
        {
          name: '🧭 Route Master',
          description: 'Conquer different routes.',
          progress: 0,
        },
        {
          name: '🧩 Problem Solver',
          description: 'Find solutions for routes.',
          progress: 0,
        },
      ],
      challenges: [
        {
          description: 'Complete 5 climbing sessions',
          progress: 0,
          unlocks: '🏔 Peak Power',
        },
      ],
      specialAbilities: [
        { name: '🏔 Peak Power', unlockedAtLevel: 5, unlocked: false },
        { name: '🪨 Rock Master', unlockedAtLevel: 10, unlocked: false },
        { name: '🕸️ Spider grip', unlockedAtLevel: 15, unlocked: false },
      ],
    },
    {
      name: 'Runner',
      level: 1,
      xp: 0,
      avatar: '/assets/running-avatar.jpg',
      achievements: [
        {
          name: '🗾 Distance Goals',
          description: 'Reach new horizons.',
          progress: 0,
        },
        {
          name: '📈 Pace Master',
          description: 'Maintain steady speed.',
          progress: 0,
        },
        {
          name: '⏱️ Interval Training',
          description: 'Master speed variation.',
          progress: 0,
        },
      ],
      challenges: [
        {
          description: 'Run 3 different routes',
          progress: 0,
          unlocks: '⚡ Speed Burst',
        },
      ],
      specialAbilities: [
        { name: '⚡ Speed Burst', unlockedAtLevel: 5, unlocked: false },
        { name: '🔋 Marathon Mind', unlockedAtLevel: 10, unlocked: false },
        { name: '💨 Recovery master', unlockedAtLevel: 10, unlocked: false },
      ],
    },
    {
      name: 'Zen Warrior',
      level: 1,
      xp: 0,
      avatar: '/assets/yoga-avatar.jpg',
      achievements: [
        {
          name: '✨ Perfect Form',
          description: 'Focus on alignment.',
          progress: 0,
        },
        {
          name: '🧘 Mind Master',
          description: 'Develop inner calm.',
          progress: 0,
        },
        {
          name: '🍃 Breath Guide',
          description: 'Control your breath.',
          progress: 0,
        },
      ],
      challenges: [
        {
          description: 'Hold a pose for 1 min',
          progress: 0,
          unlocks: '☯️ Balance Sage',
        },
      ],
      specialAbilities: [
        { name: '☯️ Balance Sage', unlockedAtLevel: 5, unlocked: false },
        { name: '🌸 Inner Peace', unlockedAtLevel: 10, unlocked: false },
        { name: '🌊 Breath guide', unlockedAtLevel: 10, unlocked: false },
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
