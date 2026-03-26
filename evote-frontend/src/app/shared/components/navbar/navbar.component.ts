import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface NavLink {
  label: string;
  anchor: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isScrolled = false;
  mobileOpen = false;

  navLinks: NavLink[] = [
    { label: 'Fonctionnalités', anchor: '#features'  },
    { label: 'Comment ça marche', anchor: '#how'     },
    { label: 'Sécurité',        anchor: '#security'  },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-navbar')) {
      this.mobileOpen = false;
    }
  }

  onAnchorClick(anchor: string, event: Event): void {
    event.preventDefault();
    const id = anchor.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    this.mobileOpen = false;
  }
}