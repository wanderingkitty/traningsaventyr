// character-profile.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'backend/models/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'character-profile',
  templateUrl: './character-profile.component.html',
  styleUrls: ['./character-profile.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CharacterProfileComponent implements OnInit {
  character: any;
  user$;

  constructor(private router: Router, private authService: AuthService) {
    this.user$ = this.authService.currentUser$;

    const navigation = this.router.getCurrentNavigation();
    this.character = navigation?.extras?.state?.['character'];

    console.log('Initial character:', this.character);
    console.log(
      'Current user from service:',
      this.authService.getCurrentUser()
    );

    if (!this.character) {
      console.warn('No character found, redirecting...');
      this.router.navigate(['/character-creation']);
    }
  }

  ngOnInit() {
    console.log('Component initialized');
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      console.log('Saved user in localStorage:', savedUser);

      if (savedUser && !this.authService.getCurrentUser()) {
        const userData = JSON.parse(savedUser);
        console.log('Loading user from localStorage:', userData);
        this.authService.currentUserSubject.next(userData);
      }
    }
  }

  goBack() {
    this.router.navigate(['/character-creation']);
  }

  onLogout() {
    this.authService.logout();
  }

  startWorkout() {
    this.router.navigate(['/workout-page']);
  }
}
