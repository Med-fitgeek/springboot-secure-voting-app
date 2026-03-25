import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent implements OnInit {
  username = '';
  userInitial = '';
  userMenuOpen = false;
  mobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const name = /*this.authService.getUsername() ?? */'Utilisateur';
    this.username = name;
    this.userInitial = name.charAt(0).toUpperCase();
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
    if (this.userMenuOpen) this.mobileMenuOpen = false;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) this.userMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Ferme le dropdown si clic en dehors
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-pill') && !target.closest('.user-dropdown')) {
      this.userMenuOpen = false;
    }
  }
}