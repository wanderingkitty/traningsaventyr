import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing-page/landing.component';
import { LoginPageComponent } from './components/login/login-page.component';
import { CharacterCreationComponent } from './components/character-creation/character-creation.component';
import { CharacterProfileComponent } from './components/profile/character-profile.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'character-creation', component: CharacterCreationComponent },
  { path: 'character-profile', component: CharacterProfileComponent },

  { path: '**', redirectTo: '' },
];
