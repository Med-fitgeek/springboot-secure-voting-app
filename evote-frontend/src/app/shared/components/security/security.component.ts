import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface SecurityFeature {
  title: string;
  desc: string;
}

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss',
})
export class SecurityComponent {
  securityFeatures: SecurityFeature[] = [
    {
      title: 'Token SHA-256 —',
      desc: "Chaque lien de vote est hashé. Le token brut n'est jamais stocké en base.",
    },
    {
      title: 'Usage unique —',
      desc: 'Un token utilisé est immédiatement invalidé. Aucun double vote possible.',
    },
    {
      title: 'Fenêtre temporelle —',
      desc: "Le vote n'est accepté que dans la plage de dates configurée par l'organisateur.",
    },
    {
      title: 'Authentification JWT —',
      desc: "L'espace organisateur est protégé par un système d'authentification robuste.",
    },
  ];
}