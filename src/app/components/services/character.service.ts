import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Character, CharacterProfile } from 'backend/models/character';

import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';

interface CharacterProgress {
  level: number;
  experience: number;
  experienceToNextLevel: number;
}

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private apiUrl = 'http://localhost:1408/api/profiles';
  private baseXpRequirement = 1000; // Базовое требование XP для перехода с 1 на 2 уровень

  private characterProgressSubject = new BehaviorSubject<CharacterProgress>({
    level: 1,
    experience: 0,
    experienceToNextLevel: this.baseXpRequirement,
  });

  characterProgress$ = this.characterProgressSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadCharacterProgress();
  }

  // Новый метод для получения профиля пользователя по имени
  getUserProfile(username: string): Observable<CharacterProfile | null> {
    if (!username) {
      console.error('Username is required to get profile');
      return of(null);
    }

    return this.http.get<CharacterProfile>(`${this.apiUrl}/${username}`).pipe(
      tap((profile) => {
        if (profile && profile.progress) {
          // Если профиль найден, обновляем прогресс персонажа
          this.characterProgressSubject.next(profile.progress);

          // Также сохраняем в localStorage
          if (typeof window !== 'undefined' && profile.userId) {
            localStorage.setItem(
              `character_progress_${profile.userId}`,
              JSON.stringify(profile.progress)
            );
          }
        }
      }),
      catchError((error: any) => {
        console.error('Error fetching profile:', error);
        return of(null);
      })
    );
  }

  // Метод для создания профиля
  createProfile(character: Character) {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      console.error('No logged in user found');
      return of({ error: 'No user logged in' });
    }

    // Проверяем, есть ли аватар, если нет, устанавливаем по умолчанию
    if (!character.avatar) {
      character.avatar = this.getDefaultAvatarForClass(character.name);
    }

    const profileData = {
      userId: currentUser.userId || currentUser.name,
      username: currentUser.name,
      selectedCharacterName: character.name,
      characterData: character,
      progress: this.characterProgressSubject.value,
    };

    console.log('Creating profile with data:', profileData);
    return this.http.post(this.apiUrl, profileData);
  }

  // Новый метод для обновления профиля
  updateProfile(profileId: string, character: Character) {
    // Проверяем, есть ли аватар, если нет, устанавливаем по умолчанию
    if (!character.avatar) {
      character.avatar = this.getDefaultAvatarForClass(character.name);
    }

    return this.http.patch(`${this.apiUrl}/${profileId}`, {
      selectedCharacterName: character.name,
      characterData: character,
      progress: this.characterProgressSubject.value,
      updatedAt: new Date(),
    });
  }

  // Методы для работы с уровнями и опытом персонажа
  private loadCharacterProgress() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Пытаемся загрузить прогресс из localStorage по userId
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem(
        `character_progress_${currentUser.userId || currentUser.name}`
      );
      if (savedProgress) {
        try {
          this.characterProgressSubject.next(JSON.parse(savedProgress));
        } catch (error) {
          console.error('Error parsing saved progress:', error);
        }
      }
    }
  }

  private saveCharacterProgress(progress: CharacterProgress) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Сохраняем в localStorage, если доступно
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        `character_progress_${currentUser.userId || currentUser.name}`,
        JSON.stringify(progress)
      );
    }

    this.characterProgressSubject.next(progress);

    // Отправляем обновленный прогресс на сервер
    this.updateUserProgress(currentUser.userId || currentUser.name, progress);
  }

  // Новый метод для отправки прогресса на сервер
  private updateUserProgress(userId: string, progress: CharacterProgress) {
    // Отправляем запрос только если есть userId
    if (!userId) return;

    this.http
      .patch(`${this.apiUrl}/progress/${userId}`, { progress })
      .pipe(
        catchError((error) => {
          console.error('Error updating progress on server:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  // Рассчитываем XP для следующего уровня
  private calculateXpForNextLevel(level: number): number {
    // Формула: база XP * 1.5^(уровень-1)
    return Math.round(this.baseXpRequirement * Math.pow(1.5, level - 1));
  }

  // Добавляем опыт и обрабатываем повышение уровня
  addExperience(amount: number) {
    const currentProgress = this.characterProgressSubject.value;
    let { level, experience } = currentProgress;

    // Добавляем XP
    experience += amount;

    // Проверяем на повышение уровня
    let experienceToNextLevel = this.calculateXpForNextLevel(level);
    let leveledUp = false;

    // Обрабатываем множественные повышения уровня, если получено много XP
    while (experience >= experienceToNextLevel) {
      level++;
      experience -= experienceToNextLevel;
      experienceToNextLevel = this.calculateXpForNextLevel(level);
      leveledUp = true;
    }

    // Сохраняем обновленный прогресс
    const newProgress = { level, experience, experienceToNextLevel };
    this.saveCharacterProgress(newProgress);

    return { leveledUp, newLevel: level };
  }

  // Получаем текущий уровень персонажа
  getCurrentLevel(): number {
    return this.characterProgressSubject.value.level;
  }

  // Получаем текущий прогресс персонажа
  getCurrentProgress(): CharacterProgress {
    return this.characterProgressSubject.value;
  }

  // Получаем информацию о текущем опыте и опыте, необходимом для следующего уровня
  getExperienceInfo(): { current: number; needed: number; percentage: number } {
    const { experience, experienceToNextLevel } =
      this.characterProgressSubject.value;
    const percentage = Math.round((experience / experienceToNextLevel) * 100);
    return { current: experience, needed: experienceToNextLevel, percentage };
  }

  // Вспомогательный метод для получения аватара по умолчанию
  private getDefaultAvatarForClass(className: string): string {
    switch (className.toLowerCase()) {
      case 'ascender':
        return '/assets/ascender-img.jpg';
      case 'runner':
        return '/assets/running-avatar.jpg';
      case 'zen warrior':
        return '/assets/yoga-avatar.jpg';
      default:
        return '/assets/default-avatar.png';
    }
  }
}
