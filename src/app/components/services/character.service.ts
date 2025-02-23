import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Character } from 'backend/models/character';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private apiUrl = 'http://localhost:1408/api/profiles';

  constructor(private http: HttpClient, private authService: AuthService) {}

  createProfile(character: Character) {
    const currentUser = this.authService.getCurrentUser();

    const profileData = {
      userId: currentUser?.userId,
      username: currentUser?.name,
      selectedCharacterName: character.name,
      characterData: character,
    };

    console.log('Creating profile with data:', profileData);
    return this.http.post(this.apiUrl, profileData);
  }
}
