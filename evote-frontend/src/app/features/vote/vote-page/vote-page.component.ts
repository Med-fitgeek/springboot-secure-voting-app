import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElectionService } from '../../../core/services/election.service';

@Component({
  selector: 'app-vote-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vote-page.component.html',
  styleUrl: './vote-page.component.scss'
})
export class VotePageComponent implements OnInit {

  token!: string;
  election: any;
  selectedOptionId!: number;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private electionService: ElectionService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token')!;

    this.electionService.getElectionForVote(this.token).subscribe({
      next: (data) => this.election = data,
      error: () => this.errorMessage = 'Invalid or expired voting link.'
    });
  }

  submitVote() {

    if (!this.selectedOptionId) {
      this.errorMessage = 'Please select an option.';
      return;
    }

    const request = {
      token: this.token,
      optionId: this.selectedOptionId
    };

    this.electionService.vote(request).subscribe({
      next: () => {
        this.successMessage = 'Your vote has been recorded successfully!';
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Unable to submit vote.';
      }
    });

  }

}