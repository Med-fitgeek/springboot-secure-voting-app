import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ElectionService } from '../../../core/services/election.service';

@Component({
  selector: 'app-edit-election',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-election.component.html',
  styleUrl: './edit-election.component.scss'
})
export class EditElectionComponent implements OnInit {

  electionForm!: FormGroup;
  electionId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private electionService: ElectionService
  ) {}

  ngOnInit(): void {

    this.electionId = Number(this.route.snapshot.paramMap.get('id'));

    this.electionForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      options: this.fb.array([])
    });

    this.loadElection();
  }

  get options(): FormArray {
    return this.electionForm.get('options') as FormArray;
  }

  addOption(label: string = '') {
    this.options.push(this.fb.control(label, Validators.required));
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  loadElection() {

    this.electionService.getElection(this.electionId).subscribe({

      next: (election) => {

        this.electionForm.patchValue({
          title: election.title,
          description: election.description,
          startDate: election.startDate,
          endDate: election.endDate
        });

        election.options.forEach((opt: string) => {
          this.addOption(opt);
        });

      }

    });

  }

  onSubmit() {

    if (this.electionForm.invalid) return;

    this.electionService.updateElection(
      this.electionId,
      this.electionForm.value
    ).subscribe({

      next: () => {
        alert('Election updated');
        this.router.navigate(['/dashboard/my-elections']);
      }

    });

  }

}