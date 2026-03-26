import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Stat {
  value: string;
  label: string;
}

@Component({
  selector: 'app-stats-band',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-band.component.html',
  styleUrl: './stats-band.component.scss',
})
export class StatsBandComponent {
  stats: Stat[] = [
    { value: '500+',   label: 'Organisateurs' },
    { value: '12 000', label: 'Votes exprimés' },
    { value: '99.9%',  label: 'Disponibilité'  },
    { value: '< 5min', label: 'Pour démarrer'  },
  ];
}