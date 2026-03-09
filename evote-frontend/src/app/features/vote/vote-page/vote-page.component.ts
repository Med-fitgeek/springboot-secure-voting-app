import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval } from 'rxjs';
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

  timeRemaining = '';
  votingClosed = false;

  constructor(
    private route: ActivatedRoute,
    private electionService: ElectionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

    this.token = this.route.snapshot.paramMap.get('token')!;

    this.electionService.getElectionForVote(this.token).subscribe({

      next: (data) => {

        this.election = data;
        this.startCountdown();

      },

      error: () => {
        this.toastr.error('Invalid or expired voting link');
      }

    });

  }

  startCountdown() {

    interval(1000).subscribe(() => {

      const end = new Date(this.election.endDate).getTime();
      const now = new Date().getTime();

      const diff = end - now;

      if (diff <= 0) {

        this.timeRemaining = 'Voting closed';
        this.votingClosed = true;
        return;

      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      this.timeRemaining = `${hours}h ${minutes}m ${seconds}s`;

    });

  }

  submitVote() {

    if (!this.selectedOptionId) {

      this.toastr.warning('Please select an option');
      return;

    }

    const request = {
      token: this.token,
      optionId: this.selectedOptionId
    };

    this.electionService.vote(request).subscribe({

      next: () => {

        this.toastr.success('Vote recorded successfully');
        this.votingClosed = true;

      },

      error: () => {

        this.toastr.error('Unable to submit vote');

      }

    });

  }

}