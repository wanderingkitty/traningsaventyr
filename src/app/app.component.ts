// app/app.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LandingComponent } from './components/landing-page/landing.component';

@Component({
  selector: 'app-root',
  template: '<app-landing></app-landing>',
  standalone: true,
  imports: [RouterModule, LandingComponent],
})
export class AppComponent {}
