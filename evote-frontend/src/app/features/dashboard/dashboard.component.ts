import { Component, OnInit } from '@angular/core';
import { ElectionService } from '../../core/services/election.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  stats = {
    elections: 0,
    voters: 0,
    votes: 0,
    active: 0
  };

  constructor(private electionService: ElectionService) {}

  ngOnInit(): void {

    this.electionService.getElections().subscribe({

      next: (elections) => {

        this.stats.elections = elections.length;

        elections.forEach(e => {

          this.stats.voters += e.voterCount ?? 0;
          this.stats.votes += e.votesCast ?? 0;

          const now = new Date();

          if (
            new Date(e.startDate) <= now &&
            new Date(e.endDate) >= now
          ) {
            this.stats.active++;
          }

        });

      },

      error: err => console.error(err)

    });

  }

}