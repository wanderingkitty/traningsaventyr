// app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing-page/landing.component';
import { LoginPageComponent } from './components/login/login-page.component';
import { CharacterCreationComponent } from './components/characters/character-creation.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AppComponent,
    LandingComponent,
    LoginPageComponent,
    CharacterCreationComponent,
  ],
  providers: [],
})
export class AppModule {}
