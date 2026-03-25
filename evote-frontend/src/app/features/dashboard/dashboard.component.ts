import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ElectionService } from '../../core/services/election.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  username = '';
  isLoading = true;

  stats = {
    elections: 0,
    voters: 0,
    votes: 0,
    active: 0,
  };

  constructor(
    private electionService: ElectionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.username = /*this.authService.getUsername() ?? */'Organisateur';
    this.loadStats();
  }

  get participationRate(): number {
    if (this.stats.voters === 0) return 0;
    return Math.round((this.stats.votes / this.stats.voters) * 100);
  }

  private loadStats(): void {
    this.isLoading = true;
    this.electionService.getElections().subscribe({
      next: (elections) => {
        this.stats.elections = elections.length;
        const now = new Date();

        elections.forEach((e) => {
          this.stats.voters += e.voterCount ?? 0;
          this.stats.votes += e.votesCast ?? 0;
          if (new Date(e.startDate) <= now && new Date(e.endDate) >= now) {
            this.stats.active++;
          }
        });

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}