import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'backend/models/user';

@Component({
  selector: 'app-character-profile',
  templateUrl: './character-profile.component.html',
  styleUrls: ['./character-profile.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CharacterProfileComponent {
  character: any;
  user: User | undefined;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.character = navigation?.extras?.state?.['character'];

    console.log('Received Character:', this.character);

    if (!this.character) {
      console.warn('No character found, redirecting...');
      this.router.navigate(['/character-creation']);
    }
  }

  goBack() {
    this.router.navigate(['/character-creation']);
  }

  onLogout() {
    this.router.navigate(['/login']);
  }
}
