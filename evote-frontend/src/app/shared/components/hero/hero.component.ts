import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {

  proofAvatars = [
    { initial: 'A', color: '#7B63E0' },
    { initial: 'B', color: '#22C55E' },
    { initial: 'C', color: '#F59E0B' },
    { initial: 'D', color: '#3B82F6' },
  ];

  mockOptions = [
    { label: 'Candidature Alpha', pct: 62, alt: false },
    { label: 'Candidature Beta',  pct: 38, alt: true  },
  ];

  onScrollHow(event: Event): void {
    event.preventDefault();
    const el = document.getElementById('how');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}