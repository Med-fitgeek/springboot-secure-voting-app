import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElectionService } from '../../../core/services/election.service';
import { ToastrService } from 'ngx-toastr';

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
    private electionService: ElectionService,
    private toastr: ToastrService

  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token')!;

    this.electionService.getElectionForVote(this.token).subscribe({
      next: (data) => this.election = data,
      error: () => this.toastr.error('Invalid or expired voting link.')
    });
  }

  submitVote() {

    if (!this.selectedOptionId) {
      this.toastr.error('Please select an option.');
      return;
    }

    const request = {
      token: this.token,
      optionId: this.selectedOptionId
    };

    this.electionService.vote(request).subscribe({
      next: () => {
        this.toastr.success('Your vote has been recorded');
        this.errorMessage = '';
      },
      error: () => {
        this.toastr.error('Unable to submit vote');
      }
    });

  }

}