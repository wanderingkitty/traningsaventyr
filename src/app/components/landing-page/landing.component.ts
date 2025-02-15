// landing.component.ts
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: 'landing.component.html',
  styleUrls: ['landing.component.scss'],
  standalone: true,
  imports: [RouterModule],
})
export class LandingComponent {
  constructor(private router: Router) {}

  getStarted() {
    console.log('getStarted clicked');
    this.router.navigate(['/login']);
  }

  learnMore() {
    this.router.navigate(['/about']);
  }
}
