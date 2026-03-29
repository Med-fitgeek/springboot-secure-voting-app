import { Component, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  get passwordStrengthClass(): string {
    const pwd = this.registerForm.get('password')?.value ?? '';
    if (pwd.length === 0) return '';
    if (pwd.length < 6) return 'weak';
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    const score = [pwd.length >= 8, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (score <= 1) return 'weak';
    if (score === 2) return 'fair';
    if (score === 3) return 'good';
    return 'strong';
  }

  get passwordStrengthLabel(): string {
    const map: Record<string, string> = {
      weak: 'Faible',
      fair: 'Moyen',
      good: 'Bon',
      strong: 'Excellent',
    };
    return map[this.passwordStrengthClass] ?? '';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (token: string) => {
        this.authService.saveToken(token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage =
          err?.error?.message ?? "Une erreur est survenue lors de l'inscription.";
      },
    });
  }
}