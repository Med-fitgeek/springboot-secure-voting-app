import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  emoji: string;
  title: string;
  desc: string;
  bg: string;
  color: string;
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss',
})
export class FeaturesComponent {
  features: Feature[] = [
    {
      emoji: '🗳️',
      title: 'Création en quelques clics',
      desc: 'Configurez votre élection, définissez les options et fixez les dates en moins de 5 minutes.',
      bg: 'var(--color-primary-light)',
      color: 'var(--color-primary)',
    },
    {
      emoji: '📧',
      title: 'Invitation automatique',
      desc: "Importez votre liste d'électeurs via CSV ou saisie manuelle. Les liens de vote sont envoyés automatiquement par email.",
      bg: 'var(--color-info-light)',
      color: 'var(--color-info)',
    },
    {
      emoji: '🔐',
      title: 'Tokens uniques sécurisés',
      desc: "Chaque électeur reçoit un lien unique hashé en SHA-256. Un vote par personne, garanti.",
      bg: '#F3F0FF',
      color: '#6D28D9',
    },
    {
      emoji: '📊',
      title: 'Résultats en temps réel',
      desc: 'Suivez la participation et consultez les résultats avec graphiques interactifs dès la clôture.',
      bg: 'var(--color-success-light)',
      color: 'var(--color-success)',
    },
    {
      emoji: '📄',
      title: 'Import CSV facile',
      desc: 'Glissez-déposez votre fichier CSV. eVote détecte les doublons et valide les emails automatiquement.',
      bg: 'var(--color-warning-light)',
      color: 'var(--color-warning)',
    },
    {
      emoji: '🌐',
      title: 'Accessible partout',
      desc: "Les électeurs votent depuis n'importe quel appareil. Aucun compte requis, juste un clic sur leur lien.",
      bg: 'var(--color-danger-light)',
      color: 'var(--color-danger)',
    },
  ];
}