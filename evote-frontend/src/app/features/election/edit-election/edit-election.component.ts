import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ElectionService } from '../../../core/services/election.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-election',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-election.component.html',
  styleUrl: './edit-election.component.scss',
})
export class EditElectionComponent implements OnInit {
  electionForm!: FormGroup;
  electionId!: number;
  isLoading = false;
  isLoadingElection = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private electionService: ElectionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.electionId = Number(this.route.snapshot.paramMap.get('id'));

    this.electionForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      options: this.fb.array([]),
    });

    this.loadElection();
  }

  get options(): FormArray {
    return this.electionForm.get('options') as FormArray;
  }

  isInvalid(field: string): boolean {
    const c = this.electionForm.get(field);
    return !!(c && c.invalid && c.touched);
  }

  addOption(label = ''): void {
    this.options.push(this.fb.control(label, Validators.required));
  }

  removeOption(i: number): void {
    if (this.options.length > 2) this.options.removeAt(i);
  }

  // Formate LocalDateTime → datetime-local input value
  private toInputDate(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.substring(0, 16); // "YYYY-MM-DDTHH:MM"
  }

  loadElection(): void {
    this.electionService.getElection(this.electionId).subscribe({
      next: (election) => {
        this.electionForm.patchValue({
          title: election.title,
          description: election.description,
          startDate: this.toInputDate(election.startDate),
          endDate: this.toInputDate(election.endDate),
        });

        election.options.forEach((opt: any) => {
          this.addOption(opt.label ?? opt);
        });

        this.isLoadingElection = false;
      },
      error: () => {
        this.toastr.error('Impossible de charger cette élection.');
        this.router.navigate(['/dashboard/my-elections']);
      },
    });
  }

  onSubmit(): void {
    if (this.electionForm.invalid) {
      this.electionForm.markAllAsTouched();
      this.toastr.warning('Veuillez corriger les erreurs du formulaire.');
      return;
    }

    this.isLoading = true;
    this.electionService
      .updateElection(this.electionId, this.electionForm.value)
      .subscribe({
        next: () => {
          this.toastr.success('Élection mise à jour avec succès.');
          this.router.navigate(['/dashboard/my-elections']);
        },
        error: (err) => {
          this.toastr.error(err?.error?.message ?? 'Erreur lors de la mise à jour.');
          this.isLoading = false;
        },
      });
  }
}