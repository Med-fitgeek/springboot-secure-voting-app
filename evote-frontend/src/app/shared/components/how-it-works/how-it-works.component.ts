import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Step {
  emoji: string;
  title: string;
  desc: string;
  details: string[];
}

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss',
})
export class HowItWorksComponent {
  steps: Step[] = [
    {
      emoji: '⚙️',
      title: 'Créez votre élection',
      desc: 'Renseignez le titre, la description, les dates et les candidats ou options de vote.',
      details: [
        'Formulaire simple et guidé',
        'Minimum 2 options requises',
        'Dates de début et fin configurables',
      ],
    },
    {
      emoji: '👥',
      title: 'Invitez vos électeurs',
      desc: "Ajoutez manuellement vos électeurs ou importez une liste CSV. Les invitations sont envoyées instantanément.",
      details: [
        'Import CSV drag & drop',
        'Validation des emails automatique',
        'Liens uniques générés par électeur',
      ],
    },
    {
      emoji: '📈',
      title: 'Consultez les résultats',
      desc: 'À la clôture, accédez aux résultats détaillés avec graphiques et taux de participation.',
      details: [
        'Graphique donut interactif',
        'Classement des options',
        'Taux de participation affiché',
      ],
    },
  ];
}