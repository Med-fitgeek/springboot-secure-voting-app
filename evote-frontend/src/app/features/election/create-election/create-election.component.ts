import { Component } from '@angular/core';
import {
  FormBuilder, FormGroup, FormArray,
  Validators, ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ElectionService } from '../../../core/services/election.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-election',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-election.component.html',
  styleUrl: './create-election.component.scss',
})
export class CreateElectionComponent {
  electionForm: FormGroup;
  isLoading = false;
  voterTab: 'manual' | 'csv' = 'manual';
  isDragging = false;

  constructor(
    private fb: FormBuilder,
    private electionService: ElectionService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.electionForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
      ]),
      voters: this.fb.array([]),
    });
  }

  get options(): FormArray {
    return this.electionForm.get('options') as FormArray;
  }

  get voters(): FormArray {
    return this.electionForm.get('voters') as FormArray;
  }

  isInvalid(field: string): boolean {
    const c = this.electionForm.get(field);
    return !!(c && c.invalid && c.touched);
  }

  // ── Options ───────────────────────────────────────
  addOption(): void {
    this.options.push(this.fb.control('', Validators.required));
  }

  removeOption(i: number): void {
    if (this.options.length > 2) this.options.removeAt(i);
  }

  // ── Voters manuels ────────────────────────────────
  addVoter(): void {
    this.voters.push(this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    }));
  }

  removeVoter(i: number): void {
    this.voters.removeAt(i);
  }

  // ── CSV drag & drop ───────────────────────────────
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.processCsvFile(file);
  }

  uploadCsv(event: any): void {
    const file = event.target.files[0];
    if (file) this.processCsvFile(file);
  }

  private processCsvFile(file: File): void {
    this.electionService.uploadVoters(file).subscribe({
      next: (votersList: any[]) => {
        // Vide les voters précédents
        while (this.voters.length) this.voters.removeAt(0);
        votersList.forEach((v) => {
          this.voters.push(this.fb.group({
            name: [v.name],
            email: [v.email],
          }));
        });
        this.toastr.success(`${votersList.length} électeurs importés depuis le CSV.`);
      },
      error: () => this.toastr.error('Erreur lors de l\'import CSV.'),
    });
  }

  // ── Submit ────────────────────────────────────────
  onSubmit(): void {
    if (this.electionForm.invalid) {
      this.electionForm.markAllAsTouched();
      this.toastr.warning('Veuillez remplir tous les champs requis.');
      return;
    }

    if (this.voters.length === 0) {
      this.toastr.warning('Ajoutez au moins un électeur.');
      return;
    }

    this.isLoading = true;
    this.electionService.createElection(this.electionForm.value).subscribe({
      next: () => {
        this.toastr.success('Élection créée ! Les électeurs ont été notifiés par email.');
        this.router.navigate(['/dashboard/my-elections']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'Erreur lors de la création.');
        this.isLoading = false;
      },
    });
  }
}