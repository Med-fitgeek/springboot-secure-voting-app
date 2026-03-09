import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ElectionService } from '../../../core/services/election.service';

@Component({
  selector: 'app-create-election',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-election.component.html',
  styleUrl: './create-election.component.scss'
})
export class CreateElectionComponent {

  electionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private electionService: ElectionService,
    private router: Router
  ) {

    this.electionForm = this.fb.group({

      title: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],

      options: this.fb.array([
        this.fb.control('', Validators.required)
      ]),

      voters: this.fb.array([])

    });

  }

  get options(): FormArray {
    return this.electionForm.get('options') as FormArray;
  }

  get voters(): FormArray {
    return this.electionForm.get('voters') as FormArray;
  }

  addOption() {
    this.options.push(this.fb.control('', Validators.required));
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  addVoter() {

    const voterGroup = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.voters.push(voterGroup);

  }

  removeVoter(index: number) {
    this.voters.removeAt(index);
  }

  onSubmit() {

    if (this.electionForm.invalid) return;

    this.electionService.createElection(this.electionForm.value)
      .subscribe({

        next: () => {
          alert('Election created successfully');
          this.router.navigate(['/dashboard/my-elections']);
        },

        error: err => console.error(err)

      });

  }

}