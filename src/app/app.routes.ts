import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing-page/landing.component';
import { LoginPageComponent } from './components/login/login-page.component';
import { CharacterCreationComponent } from './components/characters/character-creation.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'character-creation', component: CharacterCreationComponent },

  { path: '**', redirectTo: '' },
];
