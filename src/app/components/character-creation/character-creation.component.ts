import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Character } from 'backend/models/character';
import { CharacterProfileComponent } from '../profile/character-profile.component';

@Component({
  selector: 'character-creation-page',
  templateUrl: './character-creation.component.html',
  styleUrls: ['./character-creation.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CharacterCreationComponent {
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
          unlocks: 'Peak Power',
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
          name: 'Distance Goals',
          description: 'Reach new horizons.',
          progress: 0,
        },
        {
          name: 'Pace Master',
          description: 'Maintain steady speed.',
          progress: 0,
        },
        {
          name: 'Interval Training',
          description: 'Master speed variation.',
          progress: 0,
        },
      ],
      challenges: [
        {
          description: 'Run 3 different routes',
          progress: 0,
          unlocks: 'Speed Burst',
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
          name: 'Perfect Form',
          description: 'Focus on alignment.',
          progress: 0,
        },
        {
          name: 'Mind Master',
          description: 'Develop inner calm.',
          progress: 0,
        },
        {
          name: 'Breath Guide',
          description: 'Control your breath.',
          progress: 0,
        },
      ],
      challenges: [
        {
          description: 'Hold a pose for 1 min',
          progress: 0,
          unlocks: 'Balance Sage',
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

  constructor(private router: Router) {}

  selectCharacter(character: Character) {
    this.selectedCharacter = character;
  }

  continue() {
    console.log('Navigating with character:', this.selectedCharacter);
    this.router.navigate(['/character-profile'], {
      state: { character: this.selectedCharacter },
    });
  }
}
